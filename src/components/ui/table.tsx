interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export function Table({ children, className = '' }: TableProps) {
  return (
    <div className="w-full overflow-auto">
      <table className={`w-full text-sm text-left ${className}`}>
        {children}
      </table>
    </div>
  );
}

Table.Header = function TableHeader({ children }: { children: React.ReactNode }) {
  return <thead className="text-xs text-gray-700 uppercase bg-gray-50">{children}</thead>;
};

Table.Body = function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
};

Table.Row = function TableRow({ children }: { children: React.ReactNode }) {
  return <tr className="bg-white border-b hover:bg-gray-50">{children}</tr>;
};

Table.Head = function TableHead({ children }: { children: React.ReactNode }) {
  return <th scope="col" className="px-6 py-3">{children}</th>;
};

Table.Cell = function TableCell({ children }: { children: React.ReactNode }) {
  return <td className="px-6 py-4">{children}</td>;
}; 