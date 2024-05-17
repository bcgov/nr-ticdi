import { FC, useEffect, useState } from 'react';
import { ProvisionGroup } from '../../../types/types';
import { Modal } from 'react-bootstrap';
import EditProvisionGroupsModalForm from './forms/EditProvisionGroupsModalForm';
import AddProvisionGroupModalForm from './forms/AddProvisionGroupModalForm';
import RemoveProvisionGroupModalForm from './forms/RemoveProvisionGroupModalForm';
import { addProvisionGroup, removeProvisionGroup, updateProvisionGroups } from '../../../common/manage-doc-types';

interface EditProvisionGroupsModalProps {
  show: boolean;
  onHide: () => void;
  refreshTables: () => void;
  provisionGroups: ProvisionGroup[];
  documentTypeId: number;
}

const EditProvisionGroupsModal: FC<EditProvisionGroupsModalProps> = ({
  show,
  onHide,
  refreshTables,
  provisionGroups,
  documentTypeId,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [displayEdit, setDisplayEdit] = useState(true);
  const [displayAdd, setDisplayAdd] = useState(false);
  const [displayRemove, setDisplayRemove] = useState(false);
  const [updatedProvisionGroups, setUpdatedProvisionGroups] = useState<ProvisionGroup[]>([]);

  const [groupToRemove, setGroupToRemove] = useState<ProvisionGroup>({
    id: -1,
    provision_group: -1,
    provision_group_text: '',
    max: -1,
  });

  useEffect(() => {
    setUpdatedProvisionGroups(provisionGroups);
  }, [provisionGroups]);

  const displayEditHandler = () => {
    setDisplayAdd(false);
    setDisplayRemove(false);
    setDisplayEdit(true);
    setShowError(false);
  };

  const displayAddHandler = () => {
    setDisplayEdit(false);
    setDisplayRemove(false);
    setDisplayAdd(true);
    setShowError(false);
  };

  const displayRemoveHandler = (provisionGroup: ProvisionGroup) => {
    setGroupToRemove(provisionGroup);
    setDisplayAdd(false);
    setDisplayEdit(false);
    setDisplayRemove(true);
    setShowError(false);
  };

  const onHideHandler = () => {
    onHide();
    setShowError(false);
    setDisplayAdd(false);
    setDisplayRemove(false);
    setDisplayEdit(true);
  };

  // this gets called every time a cell in the table is changed, could be more efficient
  const updateProvisionGroupsState = (newProvisionGroupState: ProvisionGroup[]) => {
    setUpdatedProvisionGroups(newProvisionGroupState);
    console.log('updated');
    console.log(newProvisionGroupState);
  };

  const saveProvisionGroups = async () => {
    try {
      setLoading(true);
      await updateProvisionGroups(updatedProvisionGroups, documentTypeId);
      onHide();
      refreshTables();
    } catch (err) {
      console.log(err);
      setError('Error saving provision groups.');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const addNewGroupHandler = async (provision_group: number, provision_group_text: string, max: number) => {
    console.log('addNewGroupHandler');
    if (provisionGroups.find((pg) => pg.provision_group === provision_group)) {
      setError('A provision group with that group number already exists.');
      setShowError(true);
      return;
    }
    // if (provisionGroups.find((pg) => pg.provision_group_text === provision_group_text)) {
    //   setError('A provision group with that description already exists.');
    //   setShowError(true);
    //   return;
    // }
    // create provision group
    try {
      setLoading(true);
      await addProvisionGroup(provision_group, provision_group_text, max, documentTypeId);
      refreshTables();
      displayEditHandler();
    } catch (err) {
      console.log(err);
      setError('Adding provision group failed.');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const removeGroupHandler = async (provisionGroupId: number) => {
    try {
      await removeProvisionGroup(provisionGroupId);
      refreshTables();
      displayEditHandler();
    } catch (err) {
      console.log(err);
      setError('Removing provision group failed.');
      setShowError(true);
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHideHandler} size="lg">
        {displayEdit && (
          <EditProvisionGroupsModalForm
            provisionGroups={provisionGroups}
            loading={loading}
            onHide={onHideHandler}
            saveProvisionGroups={saveProvisionGroups}
            updateProvisionGroupsState={updateProvisionGroupsState}
            displayRemoveHandler={displayRemoveHandler}
            displayAddHandler={displayAddHandler}
          />
        )}
        {displayAdd && (
          <AddProvisionGroupModalForm
            loading={loading}
            displayEditHandler={displayEditHandler}
            onAdd={addNewGroupHandler}
          />
        )}
        {displayRemove && (
          <RemoveProvisionGroupModalForm
            loading={loading}
            provisionGroup={groupToRemove}
            displayEditHandler={displayEditHandler}
            onRemove={removeGroupHandler}
          />
        )}
        {showError && <div className="alert alert-danger">{error}</div>}
      </Modal>
    </>
  );
};

export default EditProvisionGroupsModal;
