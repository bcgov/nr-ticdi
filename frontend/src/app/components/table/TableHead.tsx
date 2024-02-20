import React, { FC } from "react";

interface TableHeadProps {
  children: React.ReactNode;
}

export const TableHead: FC<TableHeadProps> = ({ children }) => {
  return (
    <th className="text-left font-medium text-gray-500 uppercase tracking-wider py-3 px-6">
      {children}
    </th>
  );
};
