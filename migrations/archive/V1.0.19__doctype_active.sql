ALTER TABLE document_type ADD COLUMN active BOOLEAN;
UPDATE document_type SET active=true;