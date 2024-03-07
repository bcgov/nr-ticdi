import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { NFR_REPORT_PAGES, REPORT_TYPES } from '../../util/constants';
import Collapsible from '../../components/common/Collapsible';
import TemplateInfoTable from '../../components/table/manage-templates/TemplateInfoTable';
import Button from '../../components/common/Button';
import AddProvisionModal from '../../components/modal/manage-templates/AddProvisionModal';
import UploadTemplateModal from '../../components/modal/manage-templates/UploadTemplateModal';
import RemoveTemplateModal from '../../components/modal/manage-templates/RemoveTemplateModal';
import ManageProvisionsTable from '../../components/table/manage-templates/ManageProvisionsTable';
import { GroupMax, Provision, ProvisionUpload, Variable } from '../../types/types';
import EditProvisionModal from '../../components/modal/manage-templates/EditProvisionModal';
import { addProvision, getGroupMax, updateProvision } from '../../common/manage-templates';

export interface ManageTemplatesPageProps {}

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
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { id } = useParams<{ id: string }>();
  let idNum: number;
  idNum = id ? parseInt(id) : 0;
  const reportType: string = REPORT_TYPES.filter((report) => report.reportIndex === idNum).map(
    (report) => report.reportType
  )[0];

  useEffect(() => {
    const getData = async () => {
      const fetchedGroupMaxArray = await getGroupMax();
      setGroupMaxArray(fetchedGroupMaxArray);
    };
    getData();
  }, []);

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
    <>
      <h1>Manage Templates</h1>
      <hr />
      {reportType === 'Notice of Final Review' ? (
        <>
          <Collapsible title={NFR_REPORT_PAGES.NFR_DEFAULT}>
            <TemplateInfoTable
              reportType={NFR_REPORT_PAGES.NFR_DEFAULT}
              refreshVersion={refreshTrigger}
              handleRemove={openRemoveTemplateModal}
            />
            <Button
              type="btn-success"
              onClick={() => openUploadModal(NFR_REPORT_PAGES.NFR_DEFAULT)}
              text="Upload New Version"
            />
          </Collapsible>
          <Collapsible title={NFR_REPORT_PAGES.NFR_DELAYED}>
            <TemplateInfoTable
              reportType={NFR_REPORT_PAGES.NFR_DELAYED}
              refreshVersion={refreshTrigger}
              handleRemove={openRemoveTemplateModal}
            />
            <Button
              type="btn-success"
              onClick={() => openUploadModal(NFR_REPORT_PAGES.NFR_DELAYED)}
              text="Upload New Version"
            />
          </Collapsible>
          <Collapsible title={NFR_REPORT_PAGES.NFR_NO_FEES}>
            <TemplateInfoTable
              reportType={NFR_REPORT_PAGES.NFR_NO_FEES}
              refreshVersion={refreshTrigger}
              handleRemove={openRemoveTemplateModal}
            />
            <Button
              type="btn-success"
              onClick={() => openUploadModal(NFR_REPORT_PAGES.NFR_NO_FEES)}
              text="Upload New Version"
            />
          </Collapsible>
          <Collapsible title={NFR_REPORT_PAGES.NFR_SURVEY_REQ}>
            <TemplateInfoTable
              reportType={NFR_REPORT_PAGES.NFR_SURVEY_REQ}
              refreshVersion={refreshTrigger}
              handleRemove={openRemoveTemplateModal}
            />
            <Button
              type="btn-success"
              onClick={() => openUploadModal(NFR_REPORT_PAGES.NFR_SURVEY_REQ)}
              text="Upload New Version"
            />
          </Collapsible>
          <Collapsible title={NFR_REPORT_PAGES.NFR_TO_OBTAIN}>
            <TemplateInfoTable
              reportType={NFR_REPORT_PAGES.NFR_TO_OBTAIN}
              refreshVersion={refreshTrigger}
              handleRemove={openRemoveTemplateModal}
            />
            <Button
              type="btn-success"
              onClick={() => openUploadModal(NFR_REPORT_PAGES.NFR_TO_OBTAIN)}
              text="Upload New Version"
            />
          </Collapsible>
          <Collapsible title="Manage NFR Provisions">
            <ManageProvisionsTable refreshVersion={refreshTrigger} editProvisionHandler={openEditProvisionModal} />
          </Collapsible>
        </>
      ) : (
        <Collapsible title={reportType}>
          <TemplateInfoTable
            reportType={reportType}
            refreshVersion={refreshTrigger}
            handleRemove={openRemoveTemplateModal}
          />
          <Button type="btn-success" onClick={() => openUploadModal(reportType)} text="Upload New Version" />
        </Collapsible>
      )}
      <UploadTemplateModal
        show={showUploadModal}
        onHide={() => setShowUploadModal(false)}
        onUpload={refreshTables}
        reportType={currentReportType}
      />
      <RemoveTemplateModal
        show={showRemoveTemplateModal}
        onHide={() => setShowRemoveTemplateModal(false)}
        onRemove={refreshTables}
        reportType={currentReportType}
        templateId={currentReportId}
      />
      <EditProvisionModal
        provision={currentProvision}
        variables={currentVariables}
        groupMaxArray={groupMaxArray}
        show={showEditProvisionModal}
        onHide={() => setShowEditProvisionModal(false)}
        updateProvisionHandler={updateProvisionHandler}
      />
      <AddProvisionModal
        groupMaxArray={groupMaxArray}
        show={showAddProvisionModal}
        onHide={() => setShowAddProvisionModal(false)}
        addProvisionHandler={addProvisionHandler}
      />
    </>
  );
};

export default ManageTemplatesPage;
