import { FC } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import UserService from '../../service/user-service';
import Roles from '../../roles';

const NotAuthorizedPage: FC = () => {
  const navigate = useNavigate();
  const isAdmin = UserService.hasRole([Roles.TICDI_ADMIN]);

  const goBack = () => {
    isAdmin ? navigate(`/system-admin`) : navigate(`/`);
  };

  return (
    <>
      <div className="h1">Not Authorized</div>
      <hr />
      <div className="mb-3">You do not have the required roles to view this page.</div>
      <Button
        variant="primary"
        onClick={() => {
          goBack();
        }}
      >
        Return
      </Button>
    </>
  );
};

export default NotAuthorizedPage;
