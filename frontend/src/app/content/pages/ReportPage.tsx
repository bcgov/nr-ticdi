import { FC, useEffect, useState } from 'react';
import Collapsible from '../../../app/components/common/Collapsible';
import { DTRDisplayObject } from '../../../app/types/types';
import TenureDetails from '../display/TenureDetails';
import Button from '../../../app/components/common/Button';
import AreaDetails from '../display/AreaDetails';
import DtidDetails from '../display/DtidDetails';
import { generateReport, getData } from '../../common/report';
import VariantDropdown from '../../components/common/VariantDropdown';
import { CURRENT_REPORT_PAGES, NFR_REPORT_PAGES, NFR_VARIANTS } from '../../util/constants';
import InterestedParties from '../display/InterestedParties';
import { useParams } from 'react-router';
import Skeleton from 'react-loading-skeleton';
import Provisions from '../display/Provisions';

export interface ReportPageProps {
  documentDescription: string;
}

const ReportPage: FC<ReportPageProps> = ({ documentDescription }) => {
  const { dtid } = useParams<{ dtid: string }>();
  const dtidNumber = dtid ? parseInt(dtid, 10) : null;

  const [data, setData] = useState<DTRDisplayObject | null>(null);
  const [showNfr, setShowNfr] = useState<boolean>(false);

  useEffect(() => {
    setShowNfr(NFR_VARIANTS.includes(documentDescription.toUpperCase()));
    const fetchData = async () => {
      if (dtidNumber) {
        try {
          const fetchedData: DTRDisplayObject = await getData(dtidNumber);

          setData(fetchedData);
        } catch (error) {
          console.error('Failed to fetch data', error);
          setData(null);
        }
      }
    };
    fetchData();
  }, [dtidNumber, documentDescription]);

  const generateReportHandler = () => {
    if (dtidNumber) {
      generateReport(dtidNumber, data!.fileNum, documentDescription);
    }
  };

  return (
    <>
      <div className="h1">Preview - {documentDescription} (Draft)</div>
      <hr />
      {Object.values(NFR_REPORT_PAGES).includes(documentDescription) && (
        <div>
          <VariantDropdown values={NFR_REPORT_PAGES} />
          <hr />
        </div>
      )}
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
      {documentDescription === CURRENT_REPORT_PAGES.LUR ? (
        <Collapsible title="Area">{data ? <AreaDetails data={data!} /> : <Skeleton />}</Collapsible>
      ) : (
        <Collapsible title="Interested Parties">{data ? <InterestedParties data={data!} /> : <Skeleton />}</Collapsible>
      )}
      {showNfr && (
        <Collapsible title="Provisions">
          <Provisions dtid={dtidNumber!} variantName={documentDescription} />
        </Collapsible>
      )}
      {/* {showNfr && 
      <Collapsible title="Variables">
        <Variables dtid={dtidNumber!} variantName={documentDescription} />
      </Collapsible>
      } */}

      <Button text="Create" onClick={generateReportHandler} />
    </>
  );
};

export default ReportPage;
