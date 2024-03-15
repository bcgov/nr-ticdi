import { FC } from 'react';

interface TableCellProps {
  children: any;
  colSpan?: number;
  className?: string;
  style?: React.CSSProperties;
}
export const TableCell: FC<TableCellProps> = ({ children, colSpan, className, style }) => {
  const defaultStyle: React.CSSProperties = {
    paddingTop: '10px',
    paddingRight: '10px',
  };

  return (
    <td className={`${className ? className : ''}`} colSpan={colSpan} style={{ ...defaultStyle, ...style }}>
      {children}
    </td>
  );
};
