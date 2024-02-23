import React, { FC } from 'react';

interface TableHeadProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const TableHead: FC<TableHeadProps> = ({ children, style }) => {
  style = { ...style, borderBottom: '1px solid rgba(0,0,0,0.3)' };
  return (
    <th className="text-left" style={style}>
      {children}
    </th>
  );
};
