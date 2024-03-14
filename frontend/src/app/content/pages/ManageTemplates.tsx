import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { REPORT_TYPES } from '../../util/constants';

const ManageTemplates: FC = () => {

    const [selectedReport, setSelectedReport] = useState('0');
    const navigate = useNavigate();

    const selectedReportHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedReport(event.target.value);
      };

      const manageReportsHandler = () => {
        navigate(`/manage-templates/${selectedReport}`);
      };
    

    return (
        <>
         <div className="col-md-3">
        <h3>Manage Templates</h3>
      </div>
      <hr />
      <div className="col-md-3">
        <h4>Select a Template:</h4>
      </div>
      <div className="form-group row">
        <div className="col-md-4">
          <select
            id="reportTypes"
            style={{ minWidth: '200px' }}
            className="border border-1 rounded pl-2 ml-4"
            value={selectedReport}
            onChange={selectedReportHandler}
          >
            {REPORT_TYPES.map((report) => (
              <option key={report.reportIndex} value={report.reportIndex}>
                {report.reportType}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <button
            id="manageButton"
            className="btn"
            onClick={manageReportsHandler}
            style={{ backgroundColor: 'purple', color: 'white' }}
          >
            Manage
          </button>
        </div>
      </div>
        </>
    );
};

export default ManageTemplates;