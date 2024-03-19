import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface ManagementOption {
  id: string;
  label: string;
}

const managementOptions: ManagementOption[] = [
  { id: 'administrators', label: 'Manage Administrators' },
  { id: 'documentTypes', label: 'Manage Document Types' },
  { id: 'templates', label: 'Manage Templates' },
  { id: 'provisions', label: 'Manage Provisions' },
];

const SystemAdministration: React.FC = () => {
  const navigate = useNavigate();

  const handleGoClick = (optionId: string) => {
    switch (optionId) {
      case 'administrators':
        navigate(`/manage-admins`);
        break;
      case 'documentTypes':
        navigate(`/manage-doc-types`);
        break;
      case 'templates':
        navigate(`/manage-templates`);
        break;
      case 'provisions':
        navigate(`/manage-provisions`);
        break;
      default:
        break;
    }
  };

  return (
    <div style={{ width: 'auto', margin: 'auto' }}>
      <h1>System Administration</h1>
      <hr />
      {managementOptions.map((option) => (
        <div
          key={option.id}
          style={{ width: '600px', display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}
        >
          <span style={{ fontWeight: 'bold', marginLeft: '30px' }}>{option.label}</span>
          <Button variant="success" onClick={() => handleGoClick(option.id)} style={{ width: '100px' }}>
            Go
          </Button>
        </div>
      ))}
    </div>
  );
};

export default SystemAdministration;
