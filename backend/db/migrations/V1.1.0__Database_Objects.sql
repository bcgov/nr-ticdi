-- -- public.document_template definition

-- -- Drop table

-- -- DROP TABLE public.document_template;

-- CREATE TABLE public.document_template (
-- 	id serial4 NOT NULL,
-- 	document_type varchar NOT NULL,
-- 	template_version int4 NOT NULL,
-- 	template_author varchar NOT NULL,
-- 	active_flag bool NOT NULL,
-- 	is_deleted bool NOT NULL,
-- 	mime_type varchar NOT NULL,
-- 	file_name varchar NOT NULL,
-- 	the_file varchar NOT NULL,
-- 	"comments" varchar NOT NULL,
-- 	create_userid varchar NOT NULL,
-- 	update_userid varchar NOT NULL,
-- 	create_timestamp timestamp NOT NULL DEFAULT now(),
-- 	update_timestamp timestamp NOT NULL DEFAULT now(),
-- 	CONSTRAINT "PK_0e9c5bda0dd75f3bde7ae176c62" PRIMARY KEY (id)
-- );


-- -- public.nfr_data definition

-- -- Drop table

-- -- DROP TABLE public.nfr_data;

-- CREATE TABLE public.nfr_data (
-- 	id serial4 NOT NULL,
-- 	dtid int4 NULL,
-- 	variant_name varchar NULL,
-- 	template_id int4 NULL,
-- 	status varchar NULL,
-- 	active bool NULL,
-- 	create_userid varchar NULL,
-- 	update_userid varchar NULL,
-- 	create_timestamp timestamp NOT NULL DEFAULT now(),
-- 	update_timestamp timestamp NOT NULL DEFAULT now(),
-- 	CONSTRAINT "PK_d799fd74be596cab9c066ed23ac" PRIMARY KEY (id)
-- );


-- -- public.nfr_data_log definition

-- -- Drop table

-- -- DROP TABLE public.nfr_data_log;

-- CREATE TABLE public.nfr_data_log (
-- 	id serial4 NOT NULL,
-- 	document_template_id int4 NULL,
-- 	nfr_data_id int4 NULL,
-- 	dtid int4 NULL,
-- 	request_app_user varchar NULL,
-- 	request_json varchar NULL,
-- 	create_userid varchar NULL,
-- 	update_userid varchar NULL,
-- 	create_timestamp timestamp NULL DEFAULT now(),
-- 	update_timestamp timestamp NULL DEFAULT now(),
-- 	CONSTRAINT "PK_4482adc99fe410378694fd5cab5" PRIMARY KEY (id)
-- );


-- -- public.nfr_provision_group definition

-- -- Drop table

-- -- DROP TABLE public.nfr_provision_group;

-- CREATE TABLE public.nfr_provision_group (
-- 	id serial4 NOT NULL,
-- 	provision_group int4 NULL,
-- 	provision_group_text varchar NULL,
-- 	max int4 NULL,
-- 	CONSTRAINT "PK_db4bcde496c52c47aedb885287e" PRIMARY KEY (id)
-- );


-- -- public.nfr_provision_variant definition

-- -- Drop table

-- -- DROP TABLE public.nfr_provision_variant;

-- CREATE TABLE public.nfr_provision_variant (
-- 	id serial4 NOT NULL,
-- 	variant_name varchar NULL,
-- 	CONSTRAINT "PK_52d5e2ef42a148cf8c8076ab08e" PRIMARY KEY (id)
-- );


-- -- public.print_request_detail definition

-- -- Drop table

-- -- DROP TABLE public.print_request_detail;

-- CREATE TABLE public.print_request_detail (
-- 	id serial4 NOT NULL,
-- 	dtid int4 NULL,
-- 	tenure_file_number varchar NULL,
-- 	incorporation_number varchar NULL,
-- 	organization_unit varchar NULL,
-- 	purpose_name varchar NULL,
-- 	sub_purpose_name varchar NULL,
-- 	type_name varchar NULL,
-- 	sub_type_name varchar NULL,
-- 	licence_holder_name varchar NULL,
-- 	contact_agent varchar NULL,
-- 	contact_company_name varchar NULL,
-- 	contact_first_name varchar NULL,
-- 	contact_middle_name varchar NULL,
-- 	contact_last_name varchar NULL,
-- 	contact_phone_number varchar NULL,
-- 	contact_email_address varchar NULL,
-- 	first_name varchar NULL,
-- 	middle_name varchar NULL,
-- 	last_name varchar NULL,
-- 	legal_name varchar NULL,
-- 	email_address varchar NULL,
-- 	phone_number varchar NULL,
-- 	inspected_date varchar NULL,
-- 	mailing_address varchar NULL,
-- 	mailing_address_line_1 varchar NULL,
-- 	mailing_address_line_2 varchar NULL,
-- 	mailing_address_line_3 varchar NULL,
-- 	mailing_city varchar NULL,
-- 	mailing_province_state_code varchar NULL,
-- 	mailing_postal_code varchar NULL,
-- 	mailing_zip varchar NULL,
-- 	mailing_country_code varchar NULL,
-- 	mailing_country varchar NULL,
-- 	location_description varchar NULL,
-- 	tenure varchar NULL,
-- 	create_userid varchar NULL,
-- 	update_userid varchar NULL,
-- 	create_timestamp timestamp NOT NULL DEFAULT now(),
-- 	update_timestamp timestamp NOT NULL DEFAULT now(),
-- 	CONSTRAINT "PK_2de96ab00388f75e42763d1f10d" PRIMARY KEY (id)
-- );


-- -- public.print_request_log definition

-- -- Drop table

-- -- DROP TABLE public.print_request_log;

-- CREATE TABLE public.print_request_log (
-- 	id serial4 NOT NULL,
-- 	document_template_id int4 NULL,
-- 	print_request_detail_id int4 NULL,
-- 	dtid int4 NULL,
-- 	request_app_user varchar NULL,
-- 	request_json varchar NULL,
-- 	create_userid varchar NULL,
-- 	update_userid varchar NULL,
-- 	create_timestamp timestamp NULL DEFAULT now(),
-- 	update_timestamp timestamp NULL DEFAULT now(),
-- 	document_type varchar NULL,
-- 	CONSTRAINT "PK_e0a0d1732be69648cb82307c5ef" PRIMARY KEY (id)
-- );


-- -- public.typeorm_metadata definition

-- -- Drop table

-- -- DROP TABLE public.typeorm_metadata;

-- CREATE TABLE public.typeorm_metadata (
-- 	"type" varchar NOT NULL,
-- 	"database" varchar NULL,
-- 	"schema" varchar NULL,
-- 	"table" varchar NULL,
-- 	"name" varchar NULL,
-- 	value text NULL
-- );


-- -- public.nfr_provision definition

-- -- Drop table

-- -- DROP TABLE public.nfr_provision;

-- CREATE TABLE public.nfr_provision (
-- 	id serial4 NOT NULL,
-- 	"type" varchar NULL,
-- 	provision_name varchar NULL,
-- 	free_text varchar NULL,
-- 	help_text varchar NULL,
-- 	category varchar NULL,
-- 	active_flag bool NULL,
-- 	create_userid varchar NULL,
-- 	update_userid varchar NULL,
-- 	create_timestamp timestamp NOT NULL DEFAULT now(),
-- 	update_timestamp timestamp NOT NULL DEFAULT now(),
-- 	"provisionGroupId" int4 NULL,
-- 	CONSTRAINT "PK_c4a6f10af0456d58c04d4d145f3" PRIMARY KEY (id),
-- 	CONSTRAINT "FK_a43df8873b446878b2ee5cebb24" FOREIGN KEY ("provisionGroupId") REFERENCES public.nfr_provision_group(id)
-- );


-- -- public.nfr_provision_provision_variant_nfr_provision_variant definition

-- -- Drop table

-- -- DROP TABLE public.nfr_provision_provision_variant_nfr_provision_variant;

-- CREATE TABLE public.nfr_provision_provision_variant_nfr_provision_variant (
-- 	"nfrProvisionId" int4 NOT NULL,
-- 	"nfrProvisionVariantId" int4 NOT NULL,
-- 	CONSTRAINT "PK_5b9a48b11c13574b2a9304958af" PRIMARY KEY ("nfrProvisionId", "nfrProvisionVariantId"),
-- 	CONSTRAINT "FK_29eff651c342499678c06aad32b" FOREIGN KEY ("nfrProvisionVariantId") REFERENCES public.nfr_provision_variant(id) ON DELETE CASCADE ON UPDATE CASCADE,
-- 	CONSTRAINT "FK_636125267180d5eaf59688a2a43" FOREIGN KEY ("nfrProvisionId") REFERENCES public.nfr_provision(id) ON DELETE CASCADE ON UPDATE CASCADE
-- );
-- CREATE INDEX "IDX_29eff651c342499678c06aad32" ON public.nfr_provision_provision_variant_nfr_provision_variant USING btree ("nfrProvisionVariantId");
-- CREATE INDEX "IDX_636125267180d5eaf59688a2a4" ON public.nfr_provision_provision_variant_nfr_provision_variant USING btree ("nfrProvisionId");


-- -- public.nfr_provision_variable definition

-- -- Drop table

-- -- DROP TABLE public.nfr_provision_variable;

-- CREATE TABLE public.nfr_provision_variable (
-- 	id serial4 NOT NULL,
-- 	variable_name varchar NULL,
-- 	variable_value varchar NULL,
-- 	help_text varchar NULL,
-- 	create_userid varchar NULL,
-- 	update_userid varchar NULL,
-- 	create_timestamp timestamp NOT NULL DEFAULT now(),
-- 	update_timestamp timestamp NOT NULL DEFAULT now(),
-- 	"provisionId" int4 NULL,
-- 	CONSTRAINT "PK_e7bc9c66c16a184bea624bd8d97" PRIMARY KEY (id),
-- 	CONSTRAINT "FK_b24f739d9a39f30051eb9500650" FOREIGN KEY ("provisionId") REFERENCES public.nfr_provision(id)
-- );


-- -- public.nfr_data_provision definition

-- -- Drop table

-- -- DROP TABLE public.nfr_data_provision;

-- CREATE TABLE public.nfr_data_provision (
-- 	id serial4 NOT NULL,
-- 	provision_free_text varchar NULL,
-- 	"nfrProvisionId" int4 NULL,
-- 	"nfrDataId" int4 NULL,
-- 	CONSTRAINT "PK_73a4f1b680a4ab0819beb7a83ba" PRIMARY KEY (id),
-- 	CONSTRAINT "FK_31783ee54c5bc5e6b76a2803123" FOREIGN KEY ("nfrProvisionId") REFERENCES public.nfr_provision(id) ON DELETE CASCADE,
-- 	CONSTRAINT "FK_de4669e0ff571ddf23c9490059c" FOREIGN KEY ("nfrDataId") REFERENCES public.nfr_data(id) ON DELETE CASCADE
-- );


-- -- public.nfr_data_variable definition

-- -- Drop table

-- -- DROP TABLE public.nfr_data_variable;

-- CREATE TABLE public.nfr_data_variable (
-- 	id serial4 NOT NULL,
-- 	data_variable_value varchar NULL,
-- 	"nfrVariableId" int4 NULL,
-- 	"nfrDataId" int4 NULL,
-- 	CONSTRAINT "PK_78b5abaae0c841c70d3dbe79dd4" PRIMARY KEY (id),
-- 	CONSTRAINT "FK_2f9dc95b75fb29c01a332823044" FOREIGN KEY ("nfrVariableId") REFERENCES public.nfr_provision_variable(id) ON DELETE CASCADE,
-- 	CONSTRAINT "FK_76bc71b9b4fbbcdd622bab0ff19" FOREIGN KEY ("nfrDataId") REFERENCES public.nfr_data(id) ON DELETE CASCADE
-- );