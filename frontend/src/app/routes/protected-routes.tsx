import { FC } from 'react';
import { Navigate } from 'react-router-dom';
import UserService from '../service/user-service';

export const ProtectedRoute: FC<{ requiredRoles: string[]; children: any }> = ({ requiredRoles, children }) => {
  if (!UserService.hasRole(requiredRoles)) return <Navigate to="/not-authorized" />;

  return <>{children}</>;
};
