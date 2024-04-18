import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC, useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';

export type DocumentProvisionSearchState = {
  provisionName: string;
  id: string;
  type: string;
  group: string;
  freeText: string;
  category: string;
  associated: boolean;
  isAdvancedSearch: boolean;
};
interface DocumentProvisionSearchProps {
  onSearch: (searchState: DocumentProvisionSearchState) => void;
}

const DocumentProvisionSearch: FC<DocumentProvisionSearchProps> = ({ onSearch }) => {
  const [searchState, setSearchState] = useState({
    provisionName: '',
    id: '',
    type: '',
    group: '',
    freeText: '',
    category: '',
    associated: true,
    isAdvancedSearch: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSearchState((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(`name: ${name}, value: ${value}`);
    setSearchState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    onSearch(searchState);
  }, [onSearch, searchState]);

  const toggleAdvancedSearch = () => {
    setSearchState((prevState) => ({
      ...prevState,
      isAdvancedSearch: !prevState.isAdvancedSearch,
    }));
    onSearch(searchState);
  };

  return (
    <>
      {searchState.isAdvancedSearch ? (
        <>
          {/* Advanced Search Inputs */}
          <Col sm={4}>
            {/* Similar structure for other inputs */}
            <Row>
              <Col sm={5} className="text-end">
                Provision Name:
              </Col>
              <Col sm={7}>
                <input
                  className="form-control mb-1"
                  type="text"
                  name="provisionName"
                  value={searchState.provisionName}
                  onChange={handleChange}
                  style={{ width: '100%' }}
                />
              </Col>
            </Row>
            {/* Repeat for other fields */}
            <Row>
              <Col sm={5} className="search-label">
                ID:
              </Col>
              <Col sm={7}>
                <input
                  className="form-control mb-1"
                  type="number"
                  name="id"
                  value={searchState.id}
                  onChange={handleChange}
                  style={{ width: '100%' }}
                />
              </Col>
            </Row>

            <Row>
              <Col sm={5} className="search-label">
                Type:
              </Col>
              <Col sm={7}>
                <select
                  className="form-control mb-1"
                  value={searchState.type}
                  name="type"
                  onChange={handleSelectChange}
                  style={{ width: '100%' }}
                >
                  <option value=""></option>
                  <option value="O">O</option>
                  <option value="M">M</option>
                  <option value="B">B</option>
                  <option value="V">V</option>
                </select>
                {/* <input className="mb-1" type="text" name="type" value={searchState.type} onChange={handleChange} /> */}
              </Col>
            </Row>

            <Row>
              <Col sm={5} className="search-label">
                Group:
              </Col>
              <Col sm={7}>
                <input
                  className="form-control mb-1"
                  type="text"
                  name="group"
                  value={searchState.group}
                  onChange={handleChange}
                  style={{ width: '100%' }}
                />
              </Col>
            </Row>

            <Row>
              <Col sm={5} className="search-label">
                Free Text:
              </Col>
              <Col sm={7}>
                <input
                  className="form-control mb-1"
                  type="text"
                  name="freeText"
                  value={searchState.freeText}
                  onChange={handleChange}
                  style={{ width: '100%' }}
                />
              </Col>
            </Row>

            <Row>
              <Col sm={5} className="search-label">
                Category:
              </Col>
              <Col sm={7}>
                <input
                  className="form-control mb-1"
                  type="text"
                  name="category"
                  value={searchState.category}
                  onChange={handleChange}
                  style={{ width: '100%' }}
                />
              </Col>
            </Row>

            <Row>
              <Col sm={5} className="search-label">
                Associated:
              </Col>
              <Col sm={7}>
                <input
                  className="mb-1"
                  type="checkbox"
                  name="associated"
                  checked={searchState.associated}
                  onChange={handleChange}
                />
              </Col>
            </Row>
          </Col>
          <Col sm={2}>
            <Button variant="primary" onClick={toggleAdvancedSearch}>
              Advanced <FontAwesomeIcon icon={faCaretDown} />
            </Button>
          </Col>
        </>
      ) : (
        <>
          {/* Basic Search Inputs */}
          <Col sm={1}>
            <input
              className="form-control"
              type="number"
              name="id"
              placeholder="ID"
              value={searchState.id}
              onChange={handleChange}
              style={{ width: '100%' }}
            />
          </Col>
          <Col sm={3}>
            <input
              className="form-control ml-2"
              type="text"
              name="provisionName"
              placeholder="Provision Name"
              value={searchState.provisionName}
              onChange={handleChange}
              style={{ width: '100%' }}
            />
          </Col>
          <Col sm={2}>
            <Button variant="primary" onClick={toggleAdvancedSearch}>
              Advanced <FontAwesomeIcon icon={faCaretUp} />
            </Button>
          </Col>
        </>
      )}
      {/* {!searchState.isAdvancedSearch ? (
        <Col sm={8}>
          <Col sm={6} style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="mt-3">
            <input
              type="number"
              name="id"
              placeholder="ID"
              value={searchState.id}
              onChange={handleChange}
              style={{ width: '60px' }}
              className="ml-2"
            />
            <input
              type="text"
              name="provisionName"
              placeholder="Provision Name"
              value={searchState.provisionName}
              onChange={handleChange}
              style={{ width: '300px' }}
            />
            <Col sm={4}>
              <Button variant="primary" onClick={toggleAdvancedSearch}>
                Advanced <FontAwesomeIcon icon={faCaretDown} />
              </Button>
            </Col>
          </Col>
        </Col>
      ) : (
        <>
          <Col sm={6}>
            <Row>
              <Col sm={3} className="search-label">
                Provision Name:
              </Col>
              <Col sm={3}>
                <input
                  className="search-input"
                  type="text"
                  name="provisionName"
                  value={searchState.provisionName}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Row>
              <Col sm={3} className="search-label">
                ID:
              </Col>
              <Col sm={3}>
                <input
                  className="search-input"
                  type="number"
                  name="id"
                  value={searchState.id}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Row>
              <Col sm={3} className="search-label">
                Type:
              </Col>
              <Col sm={3}>
                <input
                  className="search-input"
                  type="text"
                  name="type"
                  value={searchState.type}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Row>
              <Col sm={3} className="search-label">
                Group:
              </Col>
              <Col sm={3}>
                <input
                  className="search-input"
                  type="text"
                  name="group"
                  value={searchState.group}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Row>
              <Col sm={3} className="search-label">
                Free Text:
              </Col>
              <Col sm={3}>
                <input
                  className="search-input"
                  type="text"
                  name="freeText"
                  value={searchState.freeText}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Row>
              <Col sm={3} className="search-label">
                Category:
              </Col>
              <Col sm={3}>
                <input
                  className="search-input"
                  type="text"
                  name="category"
                  value={searchState.category}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Row>
              <Col sm={3} className="search-label">
                Associated:
              </Col>
              <Col sm={3}>
                <input
                  className="search-input"
                  type="checkbox"
                  name="associated"
                  checked={searchState.associated}
                  onChange={handleChange}
                />
              </Col>
            </Row>
          </Col>
          <Col sm={2}>
            <Button variant="primary" onClick={toggleAdvancedSearch} className="mt-3">
              Advanced <FontAwesomeIcon icon={faCaretUp} />
            </Button>
          </Col>
        </>
      )} */}
    </>
  );
};

export default DocumentProvisionSearch;
