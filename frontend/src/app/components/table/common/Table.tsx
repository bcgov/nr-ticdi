import React, { FC } from 'react';

interface TableProps {
  children: React.ReactNode;
}

export const Table: FC<TableProps> = React.memo(({ children }) => {
  return (
    <table className="" style={{ tableLayout: 'fixed', width: '100%' }}>
      {children}
    </table>
  );
});
