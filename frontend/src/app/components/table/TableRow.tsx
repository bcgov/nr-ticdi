import React, { FC } from "react";

interface TableRowProps {
  children: React.ReactNode;
  key?: React.Key;
  dataState?: string;
}

export const TableRow: FC<TableRowProps> = ({ children, ...rest }) => {
  return <tr {...rest}>{children}</tr>;
};
