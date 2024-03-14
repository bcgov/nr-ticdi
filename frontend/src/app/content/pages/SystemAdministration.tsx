import React from 'react';
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
                console.log('Go to Manage Administrators');
                navigate(`/system-admin`);
                break;
            case 'documentTypes':
                console.log('Go to Manage Document Types');
                break;
            case 'templates':
                console.log('Go to Manage Templates');
                navigate(`/manage-templates-select`);
                break;
            case 'provisions':
                console.log('Go to Manage Provisions');
                break;
            default:
                console.log('Unknown option');
                break;
        }
    };

    return (
        <div style={{ width: 'auto', margin: 'auto' }}>
            <h1 >System Administration</h1>
            <hr />
            {managementOptions.map((option) => (
                <div key={option.id} style={{ width: '600px', display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 'bold', marginLeft: '30px' }}>{option.label}</span>
                    <button onClick={() => handleGoClick(option.id)}
                        style={{
                            backgroundColor: '#95f204',
                            cursor: 'pointer',
                            border: '1px solid black',
                            justifyContent: 'center',
                            borderRadius: '8px',
                            padding: '5px 40px',
                            fontSize: '1rem',
                        }}
                    >Go</button>
                </div>
            ))}
        </div>
    );
};

export default SystemAdministration;
