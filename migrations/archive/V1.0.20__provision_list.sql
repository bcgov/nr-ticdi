ALTER TABLE provision
ADD COLUMN list_items text[] DEFAULT '{}',
ADD COLUMN list_enabled boolean DEFAULT false;

UPDATE provision
SET list_items = '{}',
    list_enabled = false;
