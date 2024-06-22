import { FC, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Provision, ProvisionUpload, Variable, VariableUpload } from '../../../types/types';
import { addVariable, removeVariable, updateProvision, updateVariable } from '../../../common/manage-provisions';
import EditProvisionModalForm from './forms/EditProvisionModalForm';
import AddVariableModalForm from './forms/AddVariableModalForm';
import EditVariableModalForm from './forms/EditVariableModalForm';
import RemoveVariableModalForm from './forms/RemoveVariableModalForm';

type EditProvisionModalProps = {
  provision: Provision | undefined;
  variables: Variable[] | undefined;
  show: boolean;
  onHide: () => void;
  updateProvisionHandler: (provision: ProvisionUpload, provisionId: number) => void;
  refreshTables: () => void;
};

const EditProvisionModal: FC<EditProvisionModalProps> = ({ provision, variables, show, onHide, refreshTables }) => {
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
    setShowError(false);
  };

  const handleDisplayEditVariable = (variableId: number) => {
    if (variables) setCurrentVariable(variables.find((v) => v.id === variableId));
    setDisplayEditProvision(false);
    setDisplayAddVariable(false);
    setDisplayRemoveVariable(false);
    setDisplayEditVariable(true);
    setShowError(false);
  };

  const handleDisplayRemoveVariable = (variableId: number) => {
    if (variables) setCurrentVariable(variables.find((v) => v.id === variableId));
    setDisplayEditProvision(false);
    setDisplayAddVariable(false);
    setDisplayEditVariable(false);
    setDisplayRemoveVariable(true);
    setShowError(false);
  };

  const returnToEditProvision = () => {
    setDisplayAddVariable(false);
    setDisplayEditVariable(false);
    setDisplayRemoveVariable(false);
    setDisplayEditProvision(true);
    setShowError(false);
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
        setShowError(false);
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
      handleOnHide();
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

  const handleOnHide = () => {
    // Reset the state of the modal when it is closed
    onHide();
    setDisplayAddVariable(false);
    setDisplayEditVariable(false);
    setDisplayRemoveVariable(false);
    setDisplayEditProvision(true);
    setShowError(false);
  };

  return (
    <Modal show={show} onHide={handleOnHide} size="lg">
      {displayEditProvision && (
        <>
          <EditProvisionModalForm
            provision={provision}
            variables={variables}
            loading={loading}
            updateProvisionHandler={handleUpdateProvision}
            onHide={handleOnHide}
            onDisplayAdd={handleDisplayAddVariable}
            onDisplayEdit={handleDisplayEditVariable}
            onDisplayRemove={handleDisplayRemoveVariable}
          />
        </>
      )}
      {displayAddVariable && (
        <AddVariableModalForm
          loading={loading}
          onHide={handleOnHide}
          onBack={returnToEditProvision}
          onSave={handleAddVariable}
        />
      )}
      {displayEditVariable && (
        <EditVariableModalForm
          variable={currentVariable}
          loading={loading}
          onHide={handleOnHide}
          onBack={returnToEditProvision}
          onSave={handleUpdateVariable}
        />
      )}
      {displayRemoveVariable && (
        <RemoveVariableModalForm
          variable={currentVariable}
          loading={loading}
          onHide={handleOnHide}
          onBack={returnToEditProvision}
          onRemove={handleRemoveVariable}
        />
      )}
      {showError && <div className="alert alert-danger">{error}</div>}
    </Modal>
  );
};
export default EditProvisionModal;
