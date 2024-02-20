import React, { FC } from "react";

interface TableProps {
  children: React.ReactNode;
}

export const Table: FC<TableProps> = ({ children }) => {
  return <table className="min-w-full">{children}</table>;
};
