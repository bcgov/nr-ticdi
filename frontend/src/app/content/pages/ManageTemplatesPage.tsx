import { FC } from 'react';
import { useParams } from 'react-router';
import { REPORT_TYPES } from '../../util/constants';
import Collapsible from '../../components/common/Collapsible';

export interface ManageTemplatesPageProps {}

const ManageTemplatesPage: FC<ManageTemplatesPageProps> = () => {
  const { id } = useParams<{ id: string }>();
  let idNum: number;
  idNum = id ? parseInt(id) : 0;
  const reportType: string = REPORT_TYPES.filter((report) => report.reportIndex === idNum).map(
    (report) => report.reportType
  )[0];

  return (
    <>
      <h1>Manage Templates</h1>
      <hr />
      <div className="form-group row d-flex justify-content-between align-items-center">
        <Collapsible title={reportType}>
          <div>todo</div>
          <hr />
        </Collapsible>
      </div>
    </>
  );
};

export default ManageTemplatesPage;
