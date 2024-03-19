import { FC, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { DocType, GroupMax, Provision, ProvisionUpload, Variable, VariableUpload } from '../../../../types/types';
import { addVariable, removeVariable, updateProvision, updateVariable } from '../../../../common/manage-templates';
import EditProvisionModalForm from './forms/EditProvisionModalForm';
import AddVariableModalForm from './forms/AddVariableModalForm';
import EditVariableModalForm from './forms/EditVariableModalForm';
import RemoveVariableModalForm from './forms/RemoveVariableModalForm';

type EditProvisionModalProps = {
  provision: Provision | undefined;
  variables: Variable[] | undefined;
  documentTypes: DocType[] | undefined;
  groupMaxArray: GroupMax[] | undefined;
  show: boolean;
  onHide: () => void;
  updateProvisionHandler: (provision: ProvisionUpload, provisionId: number) => void;
  refreshTables: () => void;
};

const EditProvisionModal: FC<EditProvisionModalProps> = ({
  provision,
  variables,
  documentTypes,
  groupMaxArray,
  show,
  onHide,
  refreshTables,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [currentVariable, setCurrentVariable] = useState<Variable>();

  const [displayEditProvision, setDisplayEditProvision] = useState(true);
  const [displayEditVariable, setDisplayEditVariable] = useState(false);
  const [displayRemoveVariable, setDisplayRemoveVariable] = useState(false);
  const [displayAddVariable, setDisplayAddVariable] = useState(false);

  const handleDisplayAddVariable = () => {
    setDisplayEditProvision(false);
    setDisplayRemoveVariable(false);
    setDisplayEditVariable(false);
    setDisplayAddVariable(true);
  };

  const handleDisplayEditVariable = (variableId: number) => {
    if (variables) setCurrentVariable(variables.find((v) => v.id === variableId));
    setDisplayEditProvision(false);
    setDisplayAddVariable(false);
    setDisplayRemoveVariable(false);
    setDisplayEditVariable(true);
  };

  const handleDisplayRemoveVariable = (variableId: number) => {
    if (variables) setCurrentVariable(variables.find((v) => v.id === variableId));
    setDisplayEditProvision(false);
    setDisplayAddVariable(false);
    setDisplayEditVariable(false);
    setDisplayRemoveVariable(true);
  };

  const returnToEditProvision = () => {
    setDisplayAddVariable(false);
    setDisplayEditVariable(false);
    setDisplayRemoveVariable(false);
    setDisplayEditProvision(true);
  };

  const handleAddVariable = async (variable_name: string, variable_value: string, help_text: string) => {
    try {
      setLoading(true);
      if (provision) {
        const variableUpload: VariableUpload = {
          variable_name,
          variable_value,
          help_text,
          provision_id: provision.id,
        };
        await addVariable(variableUpload);
        refreshTables();
        returnToEditProvision();
      }
    } catch (err) {
      console.log('Error adding variable');
      console.log(err);
      setError('Error adding variable');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProvision = async (provisionUpload: ProvisionUpload, id: number) => {
    try {
      setLoading(true);
      await updateProvision({ ...provisionUpload, id });
      onHide();
      refreshTables();
    } catch (err) {
      console.log('Error updating provision');
      console.log(err);
      setError('Error updating provision');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVariable = async (variableUpload: VariableUpload, id: number) => {
    try {
      setLoading(true);
      await updateVariable({ ...variableUpload, id });
      refreshTables();
      returnToEditProvision();
    } catch (err) {
      console.log('Error updating variable');
      console.log(err);
      setError('Error updating variable');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveVariable = async (variableId: number) => {
    try {
      setLoading(true);
      await removeVariable(variableId);
      refreshTables();
      returnToEditProvision();
    } catch (err) {
      console.log('Error removing variable');
      console.log(err);
      setError('Error removing variable');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      {displayEditProvision && (
        <>
          <EditProvisionModalForm
            provision={provision}
            variables={variables}
            documentTypes={documentTypes}
            groupMaxArray={groupMaxArray}
            loading={loading}
            updateProvisionHandler={handleUpdateProvision}
            onHide={onHide}
            onDisplayAdd={handleDisplayAddVariable}
            onDisplayEdit={handleDisplayEditVariable}
            onDisplayRemove={handleDisplayRemoveVariable}
          />
        </>
      )}
      {displayAddVariable && (
        <AddVariableModalForm
          loading={loading}
          onHide={onHide}
          onBack={returnToEditProvision}
          onSave={handleAddVariable}
        />
      )}
      {displayEditVariable && (
        <EditVariableModalForm
          variable={currentVariable}
          loading={loading}
          onHide={onHide}
          onBack={returnToEditProvision}
          onSave={handleUpdateVariable}
        />
      )}
      {displayRemoveVariable && (
        <RemoveVariableModalForm
          variable={currentVariable}
          loading={loading}
          onHide={onHide}
          onBack={returnToEditProvision}
          onRemove={handleRemoveVariable}
        />
      )}
      {showError && <div className="alert alert-danger">{error}</div>}
    </Modal>
  );
};
export default EditProvisionModal;
