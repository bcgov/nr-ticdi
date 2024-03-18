import { FC, useEffect, useState } from 'react';
import ManageProvisionsTable from '../../components/table/manage-templates/ManageProvisionsTable';
import { Button } from 'react-bootstrap';
import { DocType, GroupMax, Provision, ProvisionUpload, Variable } from '../../types/types';
import { addProvision, getGroupMax, getProvisions, getVariables, updateProvision } from '../../common/manage-templates';
import EditProvisionModal from '../../components/modal/manage-templates/EditProvisionModal';
import AddProvisionModal from '../../components/modal/manage-templates/AddProvisionModal';
import { getDocumentTypes } from '../../common/report';

interface ManageProvisionsPageProps {}

const ManageProvisionsPage: FC<ManageProvisionsPageProps> = () => {
  const [data, setData] = useState<{
    allProvisions?: Provision[];
    allVariables?: Variable[];
    groupMaxArray?: GroupMax[];
    documentTypes?: DocType[];
  }>({});
  const [currentProvision, setCurrentProvision] = useState<Provision>();
  const [showEditProvisionModal, setShowEditProvisionModal] = useState<boolean>(false);
  const [showAddProvisionModal, setShowAddProvisionModal] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const getData = async () => {
      const groupMaxArray = await getGroupMax();
      const provisions = await getProvisions();
      const variables = await getVariables();
      const documentTypes = await getDocumentTypes();
      setData({ allProvisions: provisions, allVariables: variables, groupMaxArray, documentTypes });
    };
    getData();
  }, [refreshTrigger]);

  useEffect(() => {
    if (currentProvision && data.allProvisions) {
      const updatedProvision: Provision | undefined = data.allProvisions.find((p) => p.id === currentProvision.id);
      if (updatedProvision) setCurrentProvision(updatedProvision);
    }
  }, [currentProvision, data.allProvisions]);

  const refreshTables = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const openEditProvisionModal = (provision: Provision, variables: Variable[]) => {
    setCurrentProvision(provision);
    setShowEditProvisionModal(true);
  };

  const updateProvisionHandler = async (provisionUpload: ProvisionUpload, provisionId: number) => {
    await updateProvision({ ...provisionUpload, id: provisionId });
  };

  const addProvisionHandler = async (provisionUpload: ProvisionUpload) => {
    await addProvision(provisionUpload);
  };

  const currentVariables = data.allVariables?.filter((v) => v.provision_id === currentProvision?.id) || [];

  return (
    <>
      <h1>Manage Provisions</h1>
      <hr />
      <ManageProvisionsTable
        provisions={data.allProvisions}
        variables={data.allVariables}
        editProvisionHandler={openEditProvisionModal}
      />
      <Button variant="success" onClick={() => setShowAddProvisionModal(true)}>
        Add a Provision
      </Button>

      <EditProvisionModal
        provision={currentProvision}
        variables={currentVariables}
        documentTypes={data.documentTypes}
        groupMaxArray={data.groupMaxArray}
        show={showEditProvisionModal}
        onHide={() => setShowEditProvisionModal(false)}
        updateProvisionHandler={updateProvisionHandler}
        refreshTables={refreshTables}
      />
      <AddProvisionModal
        groupMaxArray={data.groupMaxArray}
        documentTypes={data.documentTypes}
        show={showAddProvisionModal}
        onHide={() => setShowAddProvisionModal(false)}
        addProvisionHandler={addProvisionHandler}
        refreshTables={refreshTables}
      />
    </>
  );
};

export default ManageProvisionsPage;
