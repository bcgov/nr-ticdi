import { FC } from 'react';

interface TableCellProps {
  children: any;
  colSpan?: number;
  className?: string;
  style?: React.CSSProperties;
}
export const TableCell: FC<TableCellProps> = ({ children, colSpan, className, style }) => {
  return (
    <td className={`text-sm ${className ? className : ''}`} colSpan={colSpan} style={style}>
      {children}
    </td>
  );
};
