import React, { FC } from 'react';

interface TableHeadProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void; // Add this line
}

export const TableHead: FC<TableHeadProps> = React.memo(({ children, style, onClick }) => {
  style = { ...style, borderBottom: '1px solid rgba(0,0,0,0.3)' };
  return (
    <th className="text-left" style={style} onClick={onClick}>
      {children}
    </th>
  );
});
