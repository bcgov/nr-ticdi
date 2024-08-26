import { FC, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Provision, ProvisionUpload, Variable } from '../../types/types';
import ManageProvisionsTable from '../../components/table/manage-provisions/ManageProvisionsTable';
import EditProvisionModal from '../../components/modal/manage-provisions/EditProvisionModal';
import AddProvisionModal from '../../components/modal/manage-provisions/AddProvisionModal';
import RemoveProvisionModal from '../../components/modal/manage-provisions/RemoveProvisionModal';
import {
  addProvision,
  getProvisions,
  getVariables,
  removeProvision,
  updateProvision,
} from '../../common/manage-provisions';

interface ManageProvisionsPageProps {}

const ManageProvisionsPage: FC<ManageProvisionsPageProps> = () => {
  const [data, setData] = useState<{
    allProvisions?: Provision[];
    allVariables?: Variable[];
  }>({});
  const [currentProvision, setCurrentProvision] = useState<Provision>();
  const [showEditProvisionModal, setShowEditProvisionModal] = useState<boolean>(false);
  const [showAddProvisionModal, setShowAddProvisionModal] = useState<boolean>(false);
  const [showRemoveProvisionModal, setShowRemoveProvisionModal] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [filteredProvisions, setFilteredProvisions] = useState<Provision[]>([]);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    const getData = async () => {
      const provisions = await getProvisions();
      const variables = await getVariables();
      setData({ allProvisions: provisions, allVariables: variables });
    };
    getData();
  }, [refreshTrigger]);

  useEffect(() => {
    if (currentProvision && data.allProvisions) {
      const updatedProvision: Provision | undefined = data.allProvisions.find((p) => p.id === currentProvision.id);
      if (updatedProvision) setCurrentProvision(updatedProvision);
    }
  }, [currentProvision, data.allProvisions]);

  useEffect(() => {
    if (data.allProvisions) {
      if (!filterText || filterText === '') {
        setFilteredProvisions(data.allProvisions);
      } else {
        handleFilterProvisions(filterText);
      }
    }
  }, [data.allProvisions]);

  const refreshTables = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const openEditProvisionModal = (provision: Provision, variables: Variable[]) => {
    setCurrentProvision(provision);
    setShowEditProvisionModal(true);
  };

  const openRemoveProvisionModal = (provision: Provision) => {
    setCurrentProvision(provision);
    setShowRemoveProvisionModal(true);
  };

  const updateProvisionHandler = async (provisionUpload: ProvisionUpload, provisionId: number) => {
    await updateProvision({ ...provisionUpload, id: provisionId });
  };

  const addProvisionHandler = async (provisionUpload: ProvisionUpload) => {
    await addProvision(provisionUpload);
  };
  const removeProvisionHandler = async (id: number) => {
    await removeProvision(id);
    refreshTables();
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text: string = event.target.value;
    handleFilterProvisions(text);
  };

  const handleFilterProvisions = (searchTerm: string) => {
    const searchKeys: string[] = ['provision_name', 'category'];
    setFilterText(searchTerm);

    const fp: Provision[] = data.allProvisions
      ? data.allProvisions.filter((item) =>
          searchKeys.some((key) => (item as any)[key]?.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        )
      : [];

    setFilteredProvisions(fp);
  };

  const currentVariables = data.allVariables?.filter((v) => v.provision_id === currentProvision?.id) || [];

  return (
    <>
      <h1>Manage Provisions</h1>
      <hr />
      <div>
        <input
          type="text"
          className="form-control"
          style={{ maxWidth: '200px' }}
          placeholder="Search..."
          value={filterText}
          onChange={handleSearch}
        />
      </div>
      <ManageProvisionsTable
        provisions={filteredProvisions}
        variables={data.allVariables}
        editProvisionHandler={openEditProvisionModal}
        removeProvisionHandler={openRemoveProvisionModal}
      />
      <Button variant="success" onClick={() => setShowAddProvisionModal(true)}>
        Add a Provision
      </Button>

      <EditProvisionModal
        provision={currentProvision}
        variables={currentVariables}
        show={showEditProvisionModal}
        onHide={() => setShowEditProvisionModal(false)}
        updateProvisionHandler={updateProvisionHandler}
        refreshTables={refreshTables}
      />
      <AddProvisionModal
        show={showAddProvisionModal}
        onHide={() => setShowAddProvisionModal(false)}
        addProvisionHandler={addProvisionHandler}
        refreshTables={refreshTables}
      />
      <RemoveProvisionModal
        provision={currentProvision}
        show={showRemoveProvisionModal}
        onHide={() => setShowRemoveProvisionModal(false)}
        onRemove={removeProvisionHandler}
      />
    </>
  );
};

export default ManageProvisionsPage;
