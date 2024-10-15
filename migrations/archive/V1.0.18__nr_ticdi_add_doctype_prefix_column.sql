ALTER TABLE document_type ADD COLUMN prefix VARCHAR(50) DEFAULT '';
UPDATE document_type SET prefix = 'Lease' WHERE name ILIKE 'Standard Lease';
UPDATE document_type SET prefix = 'Licence' WHERE name ILIKE 'Standard Licence';
UPDATE document_type SET prefix = 'Assumption' WHERE name ILIKE 'Assignment Assumption';
UPDATE document_type SET prefix = 'Modification' WHERE name ILIKE 'Modification Agreement';
UPDATE document_type SET prefix = 'NFR' WHERE name ILIKE 'Notice of Final Review%';
UPDATE document_type SET prefix = 'LUR' WHERE name ILIKE 'Land Use Report';
UPDATE document_type SET prefix = 'Lease' WHERE name ILIKE 'Grazing Lease';
