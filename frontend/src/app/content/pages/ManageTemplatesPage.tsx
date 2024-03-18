import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { NFR_REPORT_PAGES, REPORT_TYPES } from '../../util/constants';
import Collapsible from '../../components/common/Collapsible';
import TemplateInfoTable from '../../components/table/manage-templates/TemplateInfoTable';
import AddProvisionModal from '../../components/modal/manage-templates/AddProvisionModal';
import UploadTemplateModal from '../../components/modal/manage-templates/UploadTemplateModal';
import RemoveTemplateModal from '../../components/modal/manage-templates/RemoveTemplateModal';
import ManageProvisionsTable from '../../components/table/manage-templates/ManageProvisionsTable';
import { GroupMax, Provision, ProvisionUpload, Variable } from '../../types/types';
import EditProvisionModal from '../../components/modal/manage-templates/EditProvisionModal';
import { addProvision, getGroupMax, getProvisions, getVariables, updateProvision } from '../../common/manage-templates';
import { Button } from 'react-bootstrap';

export interface ManageTemplatesPageProps {}

// TODO - template upload and provisions to be split out into separate pages
//        provision / variables routes are changing to be centered around document types instead of variants

const ManageTemplatesPage: FC<ManageTemplatesPageProps> = () => {
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [showRemoveTemplateModal, setShowRemoveTemplateModal] = useState<boolean>(false);
  const [showEditProvisionModal, setShowEditProvisionModal] = useState<boolean>(false);
  const [showAddProvisionModal, setShowAddProvisionModal] = useState<boolean>(false);
  const [currentReportType, setCurrentReportType] = useState<string>('');
  const [currentReportId, setCurrentReportId] = useState<number>(-1);
  const [currentProvision, setCurrentProvision] = useState<Provision>();
  const [currentVariables, setCurrentVariables] = useState<Variable[]>();
  const [groupMaxArray, setGroupMaxArray] = useState<GroupMax[]>();
  const [allProvisions, setAllProvisions] = useState<Provision[]>();
  const [allVariables, setAllVariables] = useState<Variable[]>();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { id } = useParams<{ id: string }>();
  let idNum: number;
  idNum = id ? parseInt(id) : 0;
  const reportType: string = REPORT_TYPES.filter((report) => report.reportIndex === idNum).map(
    (report) => report.reportType
  )[0];

  useEffect(() => {
    const getData = async () => {
      const fetchedGroupMaxArray: GroupMax[] = await getGroupMax();
      setGroupMaxArray(fetchedGroupMaxArray);
      const provisionData: Provision[] = await getProvisions();
      setAllProvisions(provisionData);
      const variablesData: Variable[] = await getVariables();
      setAllVariables(variablesData);
      if (currentProvision && currentVariables) {
        const updatedProvision: Provision | undefined = provisionData.find((p) => p.id === currentProvision.id);
        if (updatedProvision) setCurrentProvision(updatedProvision);
        const updatedVariables: Variable[] | undefined = variablesData.filter(
          (v) => v.provision_id === currentProvision.id
        );
        setCurrentVariables(updatedVariables);
      }
    };
    getData();
  }, [refreshTrigger]);

  const openUploadModal = (report: string) => {
    setCurrentReportType(report);
    setShowUploadModal(true);
  };

  const openRemoveTemplateModal = (id: number, report: string) => {
    setCurrentReportType(report);
    setCurrentReportId(id);
    setShowRemoveTemplateModal(true);
  };

  const openEditProvisionModal = (provision: Provision, variables: Variable[]) => {
    setCurrentProvision(provision);
    setCurrentVariables(variables);
    setShowEditProvisionModal(true);
  };

  const updateProvisionHandler = async (provisionUpload: ProvisionUpload, provisionId: number) => {
    await updateProvision({ ...provisionUpload, id: provisionId });
  };

  const addProvisionHandler = async (provisionUpload: ProvisionUpload) => {
    await addProvision(provisionUpload);
  };

  const refreshTables = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <></>
    // <>
    //   <h1>Manage Templates</h1>
    //   <hr />
    //   {/** TO BE MOVED TO IT'S OWN PAGE */}
    //   {reportType === 'Notice of Final Review' ? (
    //     <>
    //       <Collapsible title={NFR_REPORT_PAGES.NFR_DEFAULT}>
    //         <TemplateInfoTable
    //           documentType={NFR_REPORT_PAGES.NFR_DEFAULT}
    //           refreshVersion={refreshTrigger}
    //           handleRemove={openRemoveTemplateModal}
    //         />
    //         <Button variant="success" onClick={() => openUploadModal(NFR_REPORT_PAGES.NFR_DEFAULT)}>
    //           Upload New Version
    //         </Button>
    //       </Collapsible>
    //       <Collapsible title={NFR_REPORT_PAGES.NFR_DELAYED}>
    //         <TemplateInfoTable
    //           reportType={NFR_REPORT_PAGES.NFR_DELAYED}
    //           refreshVersion={refreshTrigger}
    //           handleRemove={openRemoveTemplateModal}
    //         />
    //         <Button variant="success" onClick={() => openUploadModal(NFR_REPORT_PAGES.NFR_DELAYED)}>
    //           Upload New Version
    //         </Button>
    //       </Collapsible>
    //       <Collapsible title={NFR_REPORT_PAGES.NFR_NO_FEES}>
    //         <TemplateInfoTable
    //           reportType={NFR_REPORT_PAGES.NFR_NO_FEES}
    //           refreshVersion={refreshTrigger}
    //           handleRemove={openRemoveTemplateModal}
    //         />
    //         <Button variant="success" onClick={() => openUploadModal(NFR_REPORT_PAGES.NFR_NO_FEES)}>
    //           Upload New Version
    //         </Button>
    //       </Collapsible>
    //       <Collapsible title={NFR_REPORT_PAGES.NFR_SURVEY_REQ}>
    //         <TemplateInfoTable
    //           reportType={NFR_REPORT_PAGES.NFR_SURVEY_REQ}
    //           refreshVersion={refreshTrigger}
    //           handleRemove={openRemoveTemplateModal}
    //         />
    //         <Button variant="success" onClick={() => openUploadModal(NFR_REPORT_PAGES.NFR_SURVEY_REQ)}>
    //           Upload New Version
    //         </Button>
    //       </Collapsible>
    //       <Collapsible title={NFR_REPORT_PAGES.NFR_TO_OBTAIN}>
    //         <TemplateInfoTable
    //           reportType={NFR_REPORT_PAGES.NFR_TO_OBTAIN}
    //           refreshVersion={refreshTrigger}
    //           handleRemove={openRemoveTemplateModal}
    //         />
    //         <Button variant="success" onClick={() => openUploadModal(NFR_REPORT_PAGES.NFR_TO_OBTAIN)}>
    //           Upload New Version
    //         </Button>
    //       </Collapsible>
    //       <Collapsible title="Manage Document Provisions">
    //         <ManageProvisionsTable
    //           provisions={allProvisions}
    //           variables={allVariables}
    //           editProvisionHandler={openEditProvisionModal}
    //         />
    //         <Button variant="success" onClick={() => setShowAddProvisionModal(true)}>
    //           Add a Provision
    //         </Button>
    //       </Collapsible>
    //     </>
    //   ) : (
    //     <Collapsible title={reportType}>
    //       <TemplateInfoTable
    //         reportType={reportType}
    //         refreshVersion={refreshTrigger}
    //         handleRemove={openRemoveTemplateModal}
    //       />
    //       <Button variant="success" onClick={() => openUploadModal(reportType)}>
    //         Upload New Version
    //       </Button>
    //     </Collapsible>
    //   )}
    //   <UploadTemplateModal
    //     show={showUploadModal}
    //     onHide={() => setShowUploadModal(false)}
    //     onUpload={refreshTables}
    //     documentTypeId={1}
    //     documentTypeName="placeholder"
    //   />
    //   <RemoveTemplateModal
    //     show={showRemoveTemplateModal}
    //     onHide={() => setShowRemoveTemplateModal(false)}
    //     onRemove={refreshTables}
    //     documentTypeId={1}
    //     templateId={currentReportId}
    //   />
    //   <EditProvisionModal
    //     provision={currentProvision}
    //     variables={currentVariables}
    //     documentTypes={[]}
    //     groupMaxArray={groupMaxArray}
    //     show={showEditProvisionModal}
    //     onHide={() => setShowEditProvisionModal(false)}
    //     updateProvisionHandler={updateProvisionHandler}
    //     refreshTables={refreshTables}
    //   />
    //   <AddProvisionModal
    //     groupMaxArray={groupMaxArray}
    //     documentTypes={[]}
    //     show={showAddProvisionModal}
    //     onHide={() => setShowAddProvisionModal(false)}
    //     addProvisionHandler={addProvisionHandler}
    //     refreshTables={refreshTables}
    //   />
    // </>
  );
};

export default ManageTemplatesPage;
