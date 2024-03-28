import { FC, useCallback, useEffect, useState } from 'react';
// import Collapsible from '../../../app/components/common/Collapsible';
// import { DTRDisplayObject, DocType, DocumentDataObject, ProvisionGroup } from '../../../app/types/types';
// import TenureDetails from '../display/TenureDetails';
// import AreaDetails from '../display/AreaDetails';
// import DtidDetails from '../display/DtidDetails';
// import {
//   generateReport,
//   getDisplayData,
//   getDocumentProvisionsByDocTypeIdDtid,
//   saveDocument,
//   getMandatoryProvisionsByDocTypeId,
//   getGroupMaxByDocTypeId,
//   getDocumentDataByDocTypeIdAndDtid,
// } from '../../common/report';
// import { CURRENT_REPORT_PAGES } from '../../util/constants';
// import InterestedParties from '../display/InterestedParties';
// import { useParams } from 'react-router-dom';
// import Skeleton from 'react-loading-skeleton';
// import Provisions, { ProvisionData } from '../display/Provisions';
// import Variables from '../display/Variables';
// import { ProvisionJson, SaveProvisionData } from '../../components/table/reports/SelectedProvisionsTable';
// import { SaveVariableData, VariableJson } from '../../components/table/reports/VariablesTable';
// import { Button } from 'react-bootstrap';

export interface ReportPageProps {
  documentType: DocType;
}

const ReportPage: FC<ReportPageProps> = ({ documentType }) => {
  // const { dtid } = useParams<{ dtid: string }>();
  // const dtidNumber = dtid ? parseInt(dtid, 10) : null;
  // const [loading, setLoading] = useState<boolean>(false);
  // const [data, setData] = useState<DTRDisplayObject | null>(null);
  // const [allProvisions, setAllProvisions] = useState<ProvisionData[]>([]);
  // const [variableArray, setVariableArray] = useState<SaveVariableData[]>([]);
  // const [provisionArray, setProvisionArray] = useState<SaveProvisionData[]>([]);
  // const [variableJsonArray, setVariableJsonArray] = useState<VariableJson[]>([]);
  // const [provisionJsonArray, setProvisionJsonArray] = useState<ProvisionJson[]>([]);
  // const [selectedProvisionIds, setSelectedProvisionIds] = useState<number[]>([]);
  // const [mandatoryProvisionIds, setMandatoryProvisionIds] = useState<number[]>([]);
  // const [provisionGroups, setProvisionGroups] = useState<ProvisionGroup[]>([]);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (!dtidNumber) return;
  //     try {
  //       setLoading(true);
  //       // Fetch any existing documentData
  //       const displayData: DTRDisplayObject = await getDisplayData(dtidNumber);
  //       setData(displayData);
  //       // provisions, will be validated against
  //       const fetchProvisions: { provisions: ProvisionData[]; provisionIds: number[] } =
  //         await getDocumentProvisionsByDocTypeIdDtid(documentType.id, dtidNumber);
  //       setAllProvisions(fetchProvisions.provisions);
  //       const activeProvisionIDs = new Set(
  //         fetchProvisions.provisions
  //           .filter((provision) => provision.active_flag && !provision.is_deleted)
  //           .map((provision) => provision.provision_group.id)
  //       );
  //       // mandatory provisions, will be validated against
  //       const mpIds: number[] = await getMandatoryProvisionsByDocTypeId(documentType.id);
  //       console.log('mpIds');
  //       console.log(mpIds);
  //       setMandatoryProvisionIds(mpIds);
  //       // get provision groups and filter out the empty ones
  //       const provisionGroupsObject: ProvisionGroup[] = await getGroupMaxByDocTypeId(documentType.id);
  //       console.log('provision groups');
  //       const activeProvisionGroups = provisionGroupsObject.filter((group) => activeProvisionIDs.has(group.id));
  //       console.log(activeProvisionGroups);
  //       setProvisionGroups(activeProvisionGroups);
  //     } catch (error) {
  //       console.error('Failed to fetch data', error);
  //       setData(null);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, [dtidNumber, documentType.id]);

  // const handleGenerateReport = () => {
  //   if (dtidNumber) {
  //     const errorMessage = validateProvisions();
  //     if (!errorMessage) {
  //       if (data) {
  //         generateReport(dtidNumber, data!.fileNum, documentType.id, provisionJsonArray, variableJsonArray);
  //       }
  //     } else {
  //       alert(errorMessage);
  //     }
  //   }
  // };

  // const validateProvisions = (): string | null => {
  //   const unselectedMandatoryIds = mandatoryProvisionIds.filter(
  //     (mandatoryId) => !selectedProvisionIds.includes(mandatoryId)
  //   );
  //   const matchingProvisions = allProvisions.filter((provision) => unselectedMandatoryIds.includes(provision.id));
  //   const matchingGroupNumbers = [...new Set(matchingProvisions.map((provision) => provision.provision_group))];
  //   if (matchingGroupNumbers.length > 0) {
  //     return `There are unselected mandatory provisions the following groups: ${matchingGroupNumbers.join(', ')}`;
  //   } else {
  //     return null;
  //   }
  // };

  // const updateSelectedProvisionIds = useCallback((selectedProvisionIds: number[]) => {
  //   setSelectedProvisionIds(selectedProvisionIds);
  // }, []);

  // const updateVariableArray = useCallback((variableJsonData: VariableJson[]) => {
  //   console.log('variableJsonData');
  //   console.log(variableJsonData);
  //   // used for saving
  //   setVariableArray(
  //     variableJsonData.map((variable) => {
  //       return {
  //         provision_id: variable.provision_id,
  //         variable_id: variable.variable_id,
  //         variable_value: variable.variable_value,
  //       };
  //     })
  //   );
  //   // used to generate document
  //   setVariableJsonArray(variableJsonData);
  // }, []);

  // const updateProvisionArray = useCallback((provisionJsonData: ProvisionJson[]) => {
  //   // used for saving
  //   setProvisionArray(
  //     provisionJsonData.map((provision) => {
  //       return { provision_id: provision.provision_id, free_text: provision.free_text };
  //     })
  //   );
  //   // used to generate document
  //   setProvisionJsonArray(provisionJsonData);
  // }, []);

  // const handleDocumentSave = () => {
  //   console.log('saving...');
  //   console.log('variableArray');
  //   console.log(variableArray);
  //   const saveData = async () => {
  //     if (dtidNumber) {
  //       try {
  //         setLoading(true);
  //         await saveDocument(dtidNumber, documentType.id, provisionArray, variableArray);
  //       } catch (err) {
  //         console.log('Error saving Document Data');
  //         console.log(err);
  //       } finally {
  //         setLoading(false);
  //       }
  //     } else {
  //       console.log('No DTID was found.');
  //     }
  //   };
  //   saveData();
  // };

  return (
    <>
      {/* <div className="h1">Preview - {documentType.name} (Draft)</div>
      <hr />
      <div className="mb-3 mt-3">
        <div className="font-weight-bold inlineDiv mr-1">DTID:</div>
        <div className="inlineDiv" id="dtid">
          {data?.dtid || <Skeleton />}
        </div>
      </div>
      <div className="mb-3">
        <div className="font-weight-bold inlineDiv mr-1">Tenure File Number:</div>
        <div className="inlineDiv" id="tfn">
          {data?.fileNum || <Skeleton />}
        </div>
      </div>
      <div className="mb-3">
        <div className="font-weight-bold inlineDiv mr-1">Primary Contact Name:</div>
        <div className="inlineDiv">{data?.primaryContactName}</div>
      </div>
      <Collapsible title="Disposition Transaction ID Details">
        {data ? <DtidDetails data={data!} /> : <Skeleton />}
      </Collapsible>
      <Collapsible title="Tenure Details">{data ? <TenureDetails data={data!} /> : <Skeleton />}</Collapsible>
      {documentType.name === CURRENT_REPORT_PAGES.LUR ? (
        <Collapsible title="Area">{data ? <AreaDetails data={data!} /> : <Skeleton />}</Collapsible>
      ) : (
        <Collapsible title="Interested Parties">{data ? <InterestedParties data={data!} /> : <Skeleton />}</Collapsible>
      )}
      {provisionGroups && (
        <>
          <Collapsible title="Provisions">
            <Provisions
              dtid={dtidNumber!}
              documentType={documentType}
              provisionGroups={provisionGroups}
              updateHandler={updateProvisionArray}
              updateSelectedProvisionIds={updateSelectedProvisionIds}
            />
          </Collapsible>

          <Collapsible title="Variables">
            <Variables
              dtid={dtidNumber!}
              documentType={documentType}
              updateHandler={updateVariableArray}
              selectedProvisionIds={selectedProvisionIds}
            />
          </Collapsible>
        </>
      )}

      <div style={{ display: 'flex', gap: '10px' }}>
        <>
          <Button onClick={handleDocumentSave} variant="success" disabled={loading}>
            Save for later
          </Button>
          <Button onClick={handleGenerateReport} disabled={loading}>
            Create
          </Button>
        </>
      </div> */}
    </>
  );
};

export default ReportPage;
