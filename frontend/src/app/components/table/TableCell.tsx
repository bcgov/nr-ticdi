import React, { FC } from "react";

interface TableCellProps {
  children: React.ReactNode;
  colSpan?: number;
  className?: string;
}

export const TableCell: FC<TableCellProps> = ({
  children,
  colSpan,
  className,
}) => {
  return (
    <td
      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${className}`}
      colSpan={colSpan}
    >
      {children}
    </td>
  );
};
