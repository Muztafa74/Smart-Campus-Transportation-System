export function EmptyTableRow({ colSpan, message = 'No records found.' }) {
  return (
    <tr>
      <td colSpan={colSpan}>
        <div className="table-empty muted">{message}</div>
      </td>
    </tr>
  );
}
