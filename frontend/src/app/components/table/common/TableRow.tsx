import React, { FC } from 'react';

interface TableRowProps {
  children: React.ReactNode;
  key?: React.Key;
}

export const TableRow: FC<TableRowProps> = ({ children, ...rest }) => {
  return <tr {...rest}>{children}</tr>;
};
