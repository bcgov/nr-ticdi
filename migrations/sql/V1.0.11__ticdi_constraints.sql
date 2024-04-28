-- public.document_data foreign keys

ALTER TABLE public.document_data ADD CONSTRAINT "FK_document_data_document_type" FOREIGN KEY ("documentTypeId") REFERENCES public.document_type(id);

-- public.document_data_provision foreign keys

ALTER TABLE public.document_data_provision ADD CONSTRAINT "FK_document_data_provision_document_type_provision" FOREIGN KEY ("documentTypeProvisionId") REFERENCES public.document_type_provision(id) ON DELETE CASCADE;
ALTER TABLE public.document_data_provision ADD CONSTRAINT "FK_document_data_provision_provision" FOREIGN KEY ("documentProvisionId") REFERENCES public.provision(id);
ALTER TABLE public.document_data_provision ADD CONSTRAINT "FK_document_data_provision_document_data" FOREIGN KEY ("documentDataId") REFERENCES public.document_data(id) ON DELETE CASCADE;

-- public.document_data_variable foreign keys

ALTER TABLE public.document_data_variable ADD CONSTRAINT "FK_document_data_variable_document_data" FOREIGN KEY ("documentDataId") REFERENCES public.document_data(id) ON DELETE CASCADE;
ALTER TABLE public.document_data_variable ADD CONSTRAINT "FK_document_data_variable_provision_variable" FOREIGN KEY ("documentVariableId") REFERENCES public.provision_variable(id) ON DELETE CASCADE;

-- public.document_template foreign keys

ALTER TABLE public.document_template ADD CONSTRAINT "FK_document_template_document_type" FOREIGN KEY ("documentTypeId") REFERENCES public.document_type(id);

-- public.provision_group foreign keys

ALTER TABLE public.provision_group ADD CONSTRAINT "FK_provision_group_document_type" FOREIGN KEY ("documentTypeId") REFERENCES public.document_type(id);


-- public.provision_variable foreign keys

ALTER TABLE public.provision_variable ADD CONSTRAINT "FK_provision_variable_provision" FOREIGN KEY ("provisionId") REFERENCES public.provision(id);
