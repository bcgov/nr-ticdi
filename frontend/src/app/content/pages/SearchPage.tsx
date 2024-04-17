/**
 * A search page which displays information on previously
 * generated NFR reports and allows users to navigate to
 * their respective report pages
 */

import { FC, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchDataTable from '../../components/table/search/SearchDataTable';
import { DocType } from '../../types/types';
import { setSearchState } from '../../store/reducers/searchSlice';
import { useDispatch } from 'react-redux';
import { getDocumentTypes } from '../../common/manage-doc-types';
import { Row, Col } from 'react-bootstrap';

const SearchPage: FC = () => {
  const [selectedDocument, setSelectedDocument] = useState<{ dtid: number; documentType: DocType } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDocType, setSearchDocType] = useState<string>('');
  const [docTypes, setDocTypes] = useState<DocType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getDocumentTypes();
        setDocTypes(data);
      } catch (error) {
        console.log('Error fetching doc types');
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpenDocument = async () => {
    if (selectedDocument) {
      dispatch(
        setSearchState({
          dtid: selectedDocument.dtid,
          document_type: selectedDocument.documentType,
          searching: true,
        })
      );
      navigate('/');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDocTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchDocType(e.target.value);
  };

  const handleSelectedDocumentChange = useCallback((dtid: number, documentType: DocType) => {
    setSelectedDocument({ dtid, documentType });
  }, []);

  return (
    <>
      <div className="h1">Preview - {'Search'} (Draft)</div>
      <hr />
      <Row style={{ marginLeft: '15px', marginBottom: '15px' }}>
        <Col sm={5}>
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            style={{ width: '360px' }}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Col>
      </Row>
      <Row style={{ marginLeft: '15px', marginBottom: '15px' }}>
        <Col sm={5}>
          <select
            className="form-control"
            value={searchDocType}
            onChange={handleDocTypeChange}
            style={{ width: '360px' }}
            disabled={loading}
          >
            <option value="">Select a document type</option>
            {docTypes.map((docType) => (
              <option key={docType.id} value={docType.name}>
                {docType.name}
              </option>
            ))}
          </select>
        </Col>
      </Row>
      <SearchDataTable
        searchTerm={searchTerm}
        searchDocType={searchDocType}
        setSelectedDocumentChange={handleSelectedDocumentChange}
      />
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
