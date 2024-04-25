import React, { FC } from 'react';

interface TableHeaderProps {
  children: React.ReactNode;
}

export const TableHeader: FC<TableHeaderProps> = React.memo(({ children }) => {
  return <thead className="text-left">{children}</thead>;
});
