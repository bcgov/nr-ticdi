-- Special brackets aren't making it through pg_dump, this corrects them
UPDATE provision
SET free_text = REPLACE(free_text, '┬½', '«');
UPDATE provision
SET free_text = REPLACE(free_text, '┬╗', '»');