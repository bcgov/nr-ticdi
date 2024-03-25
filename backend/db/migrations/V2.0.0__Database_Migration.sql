BEGIN;
----------------------------------
-- Changes to NFR & related tables
----------------------------------
-- Rename tables
ALTER TABLE public.nfr_data RENAME TO document_data;

ALTER TABLE public.nfr_provision RENAME TO provision;
ALTER TABLE public.nfr_provision_variable RENAME TO provision_variable;
ALTER TABLE public.nfr_provision_group RENAME TO provision_group;

ALTER TABLE public.nfr_data_provision RENAME TO document_data_provision;
ALTER TABLE public.nfr_data_variable RENAME TO document_data_variable;

-- Rename columns
ALTER TABLE public.document_data_provision
    RENAME COLUMN "nfrProvisionId" TO document_provision_id;
ALTER TABLE public.document_data_provision
    RENAME COLUMN "nfrDataId" TO document_data_id;
ALTER TABLE public.provision
    RENAME COLUMN "provisionGroupId" TO provision_group_id;

ALTER TABLE public.document_data_variable   
    RENAME COLUMN "nfrVariableId" TO document_variable_id;
ALTER TABLE public.document_data_variable   
    RENAME COLUMN "nfrDataId" TO document_data_id;


-- Modify constraints
ALTER TABLE public.provision
DROP CONSTRAINT "FK_a43df8873b446878b2ee5cebb24",
ADD CONSTRAINT "FK_provision_group_id" FOREIGN KEY (provision_group_id) REFERENCES public.provision(id);

ALTER TABLE public.document_data_provision
DROP CONSTRAINT "FK_31783ee54c5bc5e6b76a2803123",
ADD CONSTRAINT "FK_document_provision_id" FOREIGN KEY (document_provision_id) REFERENCES public.provision(id) ON DELETE CASCADE;

ALTER TABLE public.document_data_provision
DROP CONSTRAINT "FK_de4669e0ff571ddf23c9490059c",
ADD CONSTRAINT "FK_document_data_id" FOREIGN KEY (document_data_id) REFERENCES public.document_data(id) ON DELETE CASCADE;

ALTER TABLE public.document_data_variable
DROP CONSTRAINT "FK_2f9dc95b75fb29c01a332823044",
ADD CONSTRAINT "FK_2f9dc95b75fb29c01a332823044" FOREIGN KEY (document_variable_id) REFERENCES public.provision_variable(id) ON DELETE CASCADE;

ALTER TABLE public.document_data_variable
DROP CONSTRAINT "FK_76bc71b9b4fbbcdd622bab0ff19",
ADD CONSTRAINT "FK_76bc71b9b4fbbcdd622bab0ff19" FOREIGN KEY (document_data_id) REFERENCES public.document_data(id) ON DELETE CASCADE;

----------------------------------
-- Changes to template tables
----------------------------------
-- Create new document_type table
CREATE TABLE public.document_type (
    id serial PRIMARY KEY,
    name varchar NOT NULL,
    created_by character varying,
    created_date timestamp NULL DEFAULT now(),
    create_userid varchar NOT NULL,
    update_userid varchar NOT NULL,
    create_timestamp timestamp NOT NULL DEFAULT now(),
    update_timestamp timestamp NOT NULL DEFAULT now()
);
INSERT INTO public.document_type (name, created_by, created_date, create_userid, update_userid)
VALUES ('Land Use Report', 'system', '2024-03-19 00:00:00', 'system', 'system');
VALUES ('Notice of Final Review', 'system', '2024-03-19 00:00:00', 'system', 'system');
VALUES ('Notice of Final Review (Delayed)', 'system', '2024-03-19 00:00:00', 'system', 'system');
VALUES ('Notice of Final Review (No Fees)', 'system', '2024-03-19 00:00:00', 'system', 'system');
VALUES ('Notice of Final Review (Survey Required)', 'system', '2024-03-19 00:00:00', 'system', 'system');
VALUES ('Notice of Final Review (To Obtain Survey)', 'system', '2024-03-19 00:00:00', 'system', 'system');
VALUES ('Grazing Lease', 'system', '2024-03-19 00:00:00', 'system', 'system');

ALTER TABLE public.document_template ADD COLUMN document_type_id int4;
ALTER TABLE public.document_template DROP COLUMN document_type;

UPDATE public.document_template
SET document_type_id = (SELECT id FROM public.document_type WHERE name = 'Land Use Report');

ALTER TABLE public.document_template
ADD CONSTRAINT fk_document_template_document_type_id
FOREIGN KEY (document_type_id) REFERENCES public.document_type(id);

ALTER TABLE public.document_template
ALTER COLUMN document_type_id SET NOT NULL;

----------------------------------
-- Changes to logs tables
----------------------------------
-- Create new unified log table
CREATE TABLE public.document_data_log (
    id serial4 NOT NULL,
    dtid int4 NULL,
    document_type_id int4 NULL, -- New column
    document_data_id int4 NULL, -- Previously nfr_data_id, no direct table join
    document_template_id int4 NULL,
    request_app_user varchar NULL,
    request_json varchar NULL,
    create_userid varchar NULL,
    update_userid varchar NULL,
    create_timestamp timestamp NULL DEFAULT now(),
    update_timestamp timestamp NULL DEFAULT now(),
    PRIMARY KEY (id)
);

-- Copy over nfr_data_log data
INSERT INTO public.document_data_log (
    dtid,
    document_type_id,
    document_data_id,
    document_template_id,
    request_app_user,
    request_json,
    create_userid,
    update_userid,
    create_timestamp,
    update_timestamp
)
SELECT
    dtid,
    NULL,
    nfr_data_id AS document_data_id,
    document_template_id,
    request_app_user,
    request_json,
    create_userid,
    update_userid,
    create_timestamp,
    update_timestamp
FROM
    public.nfr_data_log;

-- Copy over print_request_log data
INSERT INTO public.document_data_log (
    dtid,
    document_type_id,
    document_data_id,
    document_template_id,
    request_app_user,
    request_json,
    create_userid,
    update_userid,
    create_timestamp,
    update_timestamp
)
SELECT
    dtid,
    NULL,
    NULL,
    document_template_id,
    request_app_user,
    request_json,
    create_userid,
    update_userid,
    create_timestamp,
    update_timestamp
FROM
    public.print_request_log;

----------------------------------
-- Delete tables which are no longer being used
----------------------------------
DROP TABLE public.nfr_data_log;
DROP TABLE public.print_request_log;
DROP VIEW public.print_request_detail_view;
DROP TABLE public.print_request_detail;
DROP TABLE public.nfr_provision_provision_variant_nfr_provision_variant;
DROP TABLE public.nfr_provision_variant;

COMMIT;