-- public.document_data definition

-- Drop table

-- DROP TABLE public.document_data;

CREATE TABLE public.document_data (
	id serial4 NOT NULL,
	dtid int4 NULL,
	template_id int4 NULL,
	status varchar NULL,
	active bool NULL,
	create_userid varchar NULL,
	update_userid varchar NULL,
	create_timestamp timestamp NOT NULL DEFAULT now(),
	update_timestamp timestamp NOT NULL DEFAULT now(),
	"documentTypeId" int4 NULL,
	CONSTRAINT "PK_document_data" PRIMARY KEY (id)
);


-- public.document_data_log definition

-- Drop table

-- DROP TABLE public.document_data_log;

CREATE TABLE public.document_data_log (
	id serial4 NOT NULL,
	dtid int4 NULL,
	document_type_id int4 NULL,
	document_data_id int4 NULL,
	document_template_id int4 NULL,
	request_app_user varchar NULL,
	request_json varchar NULL,
	create_userid varchar NULL,
	update_userid varchar NULL,
	create_timestamp timestamp NULL DEFAULT now(),
	update_timestamp timestamp NULL DEFAULT now(),
	CONSTRAINT "PK_document_data_log" PRIMARY KEY (id)
);

-- public.document_data_provision definition

-- Drop table

-- DROP TABLE public.document_data_provision;

CREATE TABLE public.document_data_provision (
	id serial4 NOT NULL,
	"documentTypeProvisionId" int4 NULL,
	"documentProvisionId" int4 NULL,
	"documentDataId" int4 NULL,
	CONSTRAINT "PK_document_data_provision" PRIMARY KEY (id)
);


-- public.document_data_variable definition

-- Drop table

-- DROP TABLE public.document_data_variable;

CREATE TABLE public.document_data_variable (
	id serial4 NOT NULL,
	data_variable_value varchar NULL,
	"documentVariableId" int4 NULL,
	"documentDataId" int4 NULL,
	CONSTRAINT "PK_document_data_variable" PRIMARY KEY (id)
);


-- public.document_template definition

-- Drop table

-- DROP TABLE public.document_template;

CREATE TABLE public.document_template (
	id serial4 NOT NULL,
	template_version int4 NOT NULL,
	template_author varchar NOT NULL,
	active_flag bool NOT NULL,
	is_deleted bool NOT NULL,
	mime_type varchar NOT NULL,
	file_name varchar NOT NULL,
	the_file varchar NOT NULL,
	"comments" varchar NOT NULL,
	create_userid varchar NOT NULL,
	update_userid varchar NOT NULL,
	create_timestamp timestamp NOT NULL DEFAULT now(),
	update_timestamp timestamp NOT NULL DEFAULT now(),
	"documentTypeId" int4 NULL,
	CONSTRAINT "PK_document_template" PRIMARY KEY (id)
);



-- public.document_type definition

-- Drop table

-- DROP TABLE public.document_type;

CREATE TABLE public.document_type (
	id serial4 NOT NULL,
	"name" varchar NOT NULL,
	created_by varchar NULL,
	created_date timestamp NULL,
	create_userid varchar NOT NULL,
	update_userid varchar NOT NULL,
	create_timestamp timestamp NOT NULL DEFAULT now(),
	update_timestamp timestamp NOT NULL DEFAULT now(),
	CONSTRAINT "PK_document_type" PRIMARY KEY (id)
);

-- public.provision definition

-- Drop table

-- DROP TABLE public.provision;

CREATE TABLE public.provision (
	id serial4 NOT NULL,
	provision_name varchar NULL,
	free_text varchar NULL,
	help_text varchar NULL,
	category varchar NULL,
	active_flag bool NULL,
	is_deleted bool NULL,
	create_userid varchar NULL,
	update_userid varchar NULL,
	create_timestamp timestamp NOT NULL DEFAULT now(),
	update_timestamp timestamp NOT NULL DEFAULT now(),
	CONSTRAINT "PK_provision" PRIMARY KEY (id)
);

-- public.provision_group definition

-- Drop table

-- DROP TABLE public.provision_group;

CREATE TABLE public.provision_group (
	id serial4 NOT NULL,
	provision_group int4 NULL,
	provision_group_text varchar NULL,
	max int4 NULL,
	"documentTypeId" int4 NULL,
	CONSTRAINT "PK_provision_group" PRIMARY KEY (id)
);

-- public.provision_variable definition

-- Drop table

-- DROP TABLE public.provision_variable;

CREATE TABLE public.provision_variable (
	id serial4 NOT NULL,
	variable_name varchar NULL,
	variable_value varchar NULL,
	help_text varchar NULL,
	create_userid varchar NULL,
	update_userid varchar NULL,
	create_timestamp timestamp NOT NULL DEFAULT now(),
	update_timestamp timestamp NOT NULL DEFAULT now(),
	"provisionId" int4 NULL,
	CONSTRAINT "PK_provision_variable" PRIMARY KEY (id)
);

-- public.document_data_id_seq definition

-- DROP SEQUENCE public.document_data_id_seq;

CREATE SEQUENCE public.document_data_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;


-- public.document_data_log_id_seq definition

-- DROP SEQUENCE public.document_data_log_id_seq;

CREATE SEQUENCE public.document_data_log_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;


-- public.document_data_provision_id_seq definition

-- DROP SEQUENCE public.document_data_provision_id_seq;

CREATE SEQUENCE public.document_data_provision_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;


-- public.document_data_variable_id_seq definition

-- DROP SEQUENCE public.document_data_variable_id_seq;

CREATE SEQUENCE public.document_data_variable_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;


-- public.document_template_id_seq definition

-- DROP SEQUENCE public.document_template_id_seq;

CREATE SEQUENCE public.document_template_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;


-- public.document_type_id_seq definition

-- DROP SEQUENCE public.document_type_id_seq;

CREATE SEQUENCE public.document_type_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;


-- public.document_type_provision_id_seq definition

-- DROP SEQUENCE public.document_type_provision_id_seq;

CREATE SEQUENCE public.document_type_provision_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;


-- public.provision_group_id_seq definition

-- DROP SEQUENCE public.provision_group_id_seq;

CREATE SEQUENCE public.provision_group_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;


-- public.provision_id_seq definition

-- DROP SEQUENCE public.provision_id_seq;

CREATE SEQUENCE public.provision_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;


-- public.provision_variable_id_seq definition

-- DROP SEQUENCE public.provision_variable_id_seq;

CREATE SEQUENCE public.provision_variable_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;