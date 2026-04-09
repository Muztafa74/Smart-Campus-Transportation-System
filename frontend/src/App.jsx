import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { AdminRoute } from './routes/AdminRoute';
import { AdminCars } from './pages/admin/AdminCars';
import { AdminGates } from './pages/admin/AdminGates';
import { AdminPaths } from './pages/admin/AdminPaths';
import { AdminTrips } from './pages/admin/AdminTrips';
import { AdminUsers } from './pages/admin/AdminUsers';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { MyTrips } from './pages/MyTrips';
import { Register } from './pages/Register';
import { RequestTrip } from './pages/RequestTrip';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/request-trip" element={<RequestTrip />} />
              <Route path="/my-trips" element={<MyTrips />} />
              <Route element={<AdminRoute />}>
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/trips" element={<AdminTrips />} />
                <Route path="/admin/cars" element={<AdminCars />} />
                <Route path="/admin/gates" element={<AdminGates />} />
                <Route path="/admin/paths" element={<AdminPaths />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
