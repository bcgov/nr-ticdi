import React, { FC } from "react";

interface TableBodyProps {
  children: React.ReactNode;
}

export const TableBody: FC<TableBodyProps> = ({ children }) => {
  return (
    <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
  );
};
