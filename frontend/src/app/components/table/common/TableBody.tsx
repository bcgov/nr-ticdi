import React, { FC } from 'react';

interface TableBodyProps {
  children: React.ReactNode;
}

export const TableBody: FC<TableBodyProps> = React.memo(({ children }) => {
  return <tbody className="">{children}</tbody>;
});
