/**
 * A search page which displays information on previously
 * generated NFR reports and allows users to navigate to
 * their respective report pages
 */

import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchDataTable from '../../components/table/search/SearchDataTable';

// TODO - redo page to include all document types, replace variant with document type

const SearchPage: FC = () => {
  const [selectedDocument, setSelectedDocument] = useState<{ dtid: number; variant: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleOpenDocument = async () => {
    if (selectedDocument) {
      navigate(`/dtid/${selectedDocument.dtid}/${selectedDocument.variant}`);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectedDocumentChange = (dtid: number, variant: string) => {
    setSelectedDocument({ dtid, variant });
  };

  return (
    <>
      <div className="h1">Preview - {'Search'} (Draft)</div>
      <hr />
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          style={{ width: '300px' }}
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <SearchDataTable searchTerm={searchTerm} setSelectedDocumentChange={handleSelectedDocumentChange} />
      <div className="row justify-content-end mt-4">
        <div className="col-md-5 d-flex justify-content-end">
          <button type="button" className="btn btn-success" onClick={handleOpenDocument}>
            Open
          </button>
        </div>
      </div>
    </>
  );
};

export default SearchPage;
