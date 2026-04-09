import argparse
import os
import subprocess
import sys
import time

import requests


def parse_args():
    parser = argparse.ArgumentParser(description="Backend -> car-system bridge client")
    parser.add_argument("--car-id", default=os.getenv("CAR_ID", "1"), help="Car ID used in backend endpoint")
    parser.add_argument(
        "--backend-url",
        default=os.getenv("BACKEND_URL", "http://localhost:3000"),
        help="Backend base URL (example: http://localhost:3000)",
    )
    parser.add_argument(
        "--car-system-path",
        default=os.getenv("CAR_SYSTEM_PATH", os.path.join(os.path.dirname(__file__), "car-system.py")),
        help="Path to existing car-system.py file",
    )
    parser.add_argument("--interval", type=int, default=5, help="Polling interval in seconds")
    return parser.parse_args()


def start_car_system(car_system_path):
    print(f"Starting car system: {car_system_path}")
    return subprocess.Popen(
        [sys.executable, car_system_path],
        stdin=subprocess.PIPE,
        text=True,
    )


def fetch_next_trip(base_url, car_id, timeout_sec=10):
    url = f"{base_url.rstrip('/')}/api/car/{car_id}/next-trip"
    response = requests.get(url, timeout=timeout_sec)
    response.raise_for_status()
    return response.json()


def build_command(trip_json):
    source = trip_json.get("source")
    destination = trip_json.get("destination")
    source_num = int(source)
    destination_num = int(destination)
    return f"[{source_num}, {destination_num}]"


def main():
    args = parse_args()
    car_process = start_car_system(args.car_system_path)

    try:
        while True:
            print("Car checking for trip...")

            if car_process.poll() is not None:
                print("Car system process stopped. Restarting...")
                car_process = start_car_system(args.car_system_path)

            try:
                trip = fetch_next_trip(args.backend_url, args.car_id)
            except requests.RequestException as exc:
                print(f"Backend request failed: {exc}")
                time.sleep(args.interval)
                continue
            except ValueError as exc:
                print(f"Invalid backend JSON response: {exc}")
                time.sleep(args.interval)
                continue

            if trip is None or trip == {}:
                print("No trip available")
                time.sleep(args.interval)
                continue

            try:
                command = build_command(trip)
            except (TypeError, ValueError, KeyError) as exc:
                print(f"Invalid trip payload from backend: {exc} | payload={trip}")
                time.sleep(args.interval)
                continue

            print(f"Sending command: {command}")
            try:
                if not car_process.stdin:
                    raise RuntimeError("Car system stdin is not available")
                car_process.stdin.write(command + "\n")
                car_process.stdin.flush()
            except Exception as exc:
                print(f"Failed to send command to car system: {exc}")

            time.sleep(args.interval)
    except KeyboardInterrupt:
        print("Stopping car client...")
    finally:
        try:
            if car_process.stdin:
                car_process.stdin.close()
        except Exception:
            pass
        if car_process.poll() is None:
            car_process.terminate()
            try:
                car_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                car_process.kill()


if __name__ == "__main__":
    main()

