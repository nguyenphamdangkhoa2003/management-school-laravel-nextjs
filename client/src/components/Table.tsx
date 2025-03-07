
const Table = ({
  columns,
  renderRow,
  data,
}: {
  columns: { header: string; accessor: string; className?: string }[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
}) => {
  return (
    <table className="w-full mt-4">
      <thead>
        <tr className="text-left text-gray-500 text-sm">
          {columns.map((col) => (
            <th key={col.accessor} className={col.className}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.isArray(data) && data.length > 0 ? (
          data.map((item) => renderRow(item))
        ) : (
          <tr>
            <td colSpan={columns.length} className="text-center py-4">
              Không có dữ liệu
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default Table;
