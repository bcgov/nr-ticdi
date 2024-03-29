-- Initialize Database Provisions
-- Create groups
INSERT INTO provision_group (provision_group, max, provision_group_text) VALUES (1,999,'DOCUMENT TYPE');
INSERT INTO provision_group (provision_group, max, provision_group_text) VALUES (2,999,'FEES');
INSERT INTO provision_group (provision_group, max, provision_group_text) VALUES (5,3,'PREAMBLE');
INSERT INTO provision_group (provision_group, max, provision_group_text) VALUES (10,3,'SURVEY REQUIREMENTS');
INSERT INTO provision_group (provision_group, max, provision_group_text) VALUES (12,3,'SURVEY FEES');
INSERT INTO provision_group (provision_group, max, provision_group_text) VALUES (14,3,'OBTAIN SURVEY');
INSERT INTO provision_group (provision_group, max, provision_group_text) VALUES (15,1,'OCCUPATIONAL RENT');
INSERT INTO provision_group (provision_group, max, provision_group_text) VALUES (20,2,'SECURITY');
INSERT INTO provision_group (provision_group, max, provision_group_text) VALUES (25,2,'INSURANCE');
INSERT INTO provision_group (provision_group, max, provision_group_text) VALUES (27,3,'ADDITIONAL REQUIREMENTS');
INSERT INTO provision_group (provision_group, max, provision_group_text) VALUES (28,3,'ADDITIONAL REQUIREMENTS');
INSERT INTO provision_group (provision_group, max, provision_group_text) VALUES (34,999,'ADDITIONAL REQUIREMENTS');

INSERT INTO document_type (name, created_by, created_date, create_userid, update_userid) VALUES ('Notice of Final Review', 'system', '2024-03-19 00:00:00', 'system', 'system');
INSERT INTO document_type (name, created_by, created_date, create_userid, update_userid) VALUES ('Notice of Final Review (Delayed)', 'system', '2024-03-19 00:00:00', 'system', 'system');
INSERT INTO document_type (name, created_by, created_date, create_userid, update_userid) VALUES ('Notice of Final Review (No Fees)', 'system', '2024-03-19 00:00:00', 'system', 'system');
INSERT INTO document_type (name, created_by, created_date, create_userid, update_userid) VALUES ('Notice of Final Review (Survey Required)', 'system', '2024-03-19 00:00:00', 'system', 'system');
INSERT INTO document_type (name, created_by, created_date, create_userid, update_userid) VALUES ('Notice of Final Review (To Obtain Survey)', 'system', '2024-03-19 00:00:00', 'system', 'system');

-- Helper functions for grabbing document type ids, group ids, current variable id, and current provision id.
CREATE OR REPLACE FUNCTION get_current_provision_id() RETURNS INTEGER AS $$
DECLARE
	provision_id INTEGER;
BEGIN
	SELECT max(id) INTO provision_id FROM provision;
	return provision_id;
END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION get_last_provision_variable_id() RETURNS INTEGER AS $$
DECLARE
	provision_variable_id INTEGER;
BEGIN
	SELECT max(id) INTO provision_variable_id FROM provision_variable;
	return provision_variable_id;
END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION get_doc_type_default() RETURNS INTEGER AS $$
DECLARE
    document_type_id INTEGER;
BEGIN
    SELECT id INTO document_type_id FROM document_type WHERE name = 'Notice of Final Review';
    RETURN document_type_id;
END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION get_doc_type_delayed() RETURNS INTEGER AS $$
DECLARE
    document_type_id INTEGER;
BEGIN
    SELECT id INTO document_type_id FROM document_type WHERE name = 'Notice of Final Review (Delayed)';
    RETURN document_type_id;
END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION get_doc_type_nofees() RETURNS INTEGER AS $$
DECLARE
    document_type_id INTEGER;
BEGIN
    SELECT id INTO document_type_id FROM document_type WHERE name = 'Notice of Final Review (No Fees)';
    RETURN document_type_id;
END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION get_doc_type_surveyreq() RETURNS INTEGER AS $$
DECLARE
    document_type_id INTEGER;
BEGIN
    SELECT id INTO document_type_id FROM document_type WHERE name = 'Notice of Final Review (Survey Required)';
    RETURN document_type_id;
END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION get_doc_type_toobtain() RETURNS INTEGER AS $$
DECLARE
    document_type_id INTEGER;
BEGIN
    SELECT id INTO document_type_id FROM document_type WHERE name = 'Notice of Final Review (To Obtain Survey)';
    RETURN document_type_id;
END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION get_provision_group_id(p_provision_group INTEGER)
RETURNS INTEGER AS $$
DECLARE
  pg_id INTEGER;
BEGIN
  SELECT id INTO pg_id FROM provision_group WHERE provision_group = p_provision_group;
  RETURN pg_id;
END;
$$ LANGUAGE plpgsql;

-- Create Provisions and relations to document types
-- Document Type 'NOTICE OF FINAL REVIEW'
INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('M',get_provision_group_id(1),'TEMPLATE VARIABLES - NOTICE OF FINAL REVIEW','','Use this to enter values for each of the variables in the boilerplate of the NOTICE OF FINAL REVIEW letter.','DOCUMENT TYPE', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_default());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('ATTENTION_LINE','','Attention: "______" - MUST FILL A VALUE IN - IF NOT REQUIRED, DELETE AFTER MERGING PROCESS.',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('CLIENT_FILE_NO','','Your file:  "______" - MUST FILL A VALUE IN - IF NOT REQUIRED, DELETE AFTER MERGING PROCESS.',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('DATE_OF_NOTICE','','Date of letter: Month Day ,Year',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('DEADLINE_COMPLETION_REQUIREMENTS','','Enter the date (month day, year) for completion of requirements',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('FACSIMILE_NUMBER','','Type in your facsimile number - "250 ___-____"',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('NUMBER_OF_COPIES','','three copies of tenure documents which are being forwarded to client to sign.  The number should be typed as a word, not a number.',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('PURPOSE_GENERIC','','used for "_________" purposes.',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('SALUTATION','','Dear "______":  Type in the person’s name or Sir or Madam.',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('TELEPHONE_NUMBER','','Type in your telephone number - "250 ___-____"',get_current_provision_id());

INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('M',get_provision_group_id(2),'FEES','','Use this to create a table listing all the fees to be paid. Table is unprotected, so you will be able to modify text ','FEES', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_default()), (get_current_provision_id(), get_doc_type_delayed()), (get_current_provision_id(), get_doc_type_nofees()), (get_current_provision_id(), get_doc_type_toobtain()), (get_current_provision_id(), get_doc_type_surveyreq());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('FEE_APPLICATION_AMOUNT','','$"#.##" payable. Fill in either amount, or "0" if nothing payable for this category of fee. Put in decimals.',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('FEE_DOCUMENTATION_AMOUNT','','$"#.##" payable. Fill in either amount, or "0" if nothing payable for this category of fee. Put in decimals.',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('FEE_OCCUPATIONAL_RENTAL_AMOUNT','','$"#.##" payable. Fill in either amount, or "0" if nothing payable for this category of fee. Put in decimals.',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('FEE_OTHER_CREDIT_AMOUNT','','$"#.##" payable. Fill in either amount, or "0" if nothing payable for this category of fee. Put in decimals.',get_current_provision_id());

INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('V',get_provision_group_id(5),'REPLACEMENT STATEMENT','',' Use this when tenure is being replaced','PREAMBLE', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_default()), (get_current_provision_id(), get_doc_type_delayed()), (get_current_provision_id(), get_doc_type_nofees()), (get_current_provision_id(), get_doc_type_toobtain()), (get_current_provision_id(), get_doc_type_surveyreq());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('REPLACEMENT_TENURE_TYPE','','____No. #. Use to specify type and number of tenure being replaced e.g. lease No. 999.',get_current_provision_id());

INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('V',get_provision_group_id(5),'LAND DIFFERS FROM STATEMENT','','Use when land being offered differs from the applied area','OFFER PREAMBLE', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_default()), (get_current_provision_id(), get_doc_type_delayed()), (get_current_provision_id(), get_doc_type_nofees()), (get_current_provision_id(), get_doc_type_toobtain()), (get_current_provision_id(), get_doc_type_surveyreq());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('WHY_LAND_DIFFERS','','The Land differs from what you applied for because "____". Explain why you are offering some...',get_current_provision_id());

INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('V',get_provision_group_id(5),'FREE FIELD - PREAMBLE INFORMATION','','Use when you want to enter additonal information for the preamble','OFFER PREAMBLE', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_default()), (get_current_provision_id(), get_doc_type_delayed()), (get_current_provision_id(), get_doc_type_nofees()), (get_current_provision_id(), get_doc_type_toobtain()), (get_current_provision_id(), get_doc_type_surveyreq());

INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('V',get_provision_group_id(15),'OCCUPATIONAL RENT STATEMENT','','Use this where occupational rent is payable','OFFER - MONIES - PAYABLE', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_default()), (get_current_provision_id(), get_doc_type_delayed()), (get_current_provision_id(), get_doc_type_nofees()), (get_current_provision_id(), get_doc_type_toobtain()), (get_current_provision_id(), get_doc_type_surveyreq());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('OCC_RENT_DETAILS','','Occupatianal Rental is payable for your occupation of the Land for the period from "___". Set out ...',get_current_provision_id());

INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('V',get_provision_group_id(20),'DELIVER SECURITY DEPOSIT - NOTICE OF FINAL REVIEW','','Use this to require delivery of security deposit','OFFER - SECURITY', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_default()), (get_current_provision_id(), get_doc_type_delayed()), (get_current_provision_id(), get_doc_type_surveyreq());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('SECURITY_AMOUNT','','#.## to post as security - indicate an amount even if blanket bond applies. Put in Decimal.',get_current_provision_id());

INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('V',get_provision_group_id(20),'BLANKET SECURITY STATEMENT','','Use this when client is covered by blanket security agreement','OFFER - SECURITY', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_default()), (get_current_provision_id(), get_doc_type_delayed()), (get_current_provision_id(), get_doc_type_nofees()), (get_current_provision_id(), get_doc_type_surveyreq());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('BLANKET_BOND_NAME','','You are currently covered by a blanket bond between MELP and "____". S...',get_current_provision_id());

INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('V',get_provision_group_id(20),'FREE FIELD FOR SECURITY SECTION','','Use where you need to add information regarding security','OFFER - SECURITY', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_default()), (get_current_provision_id(), get_doc_type_delayed()), (get_current_provision_id(), get_doc_type_nofees()), (get_current_provision_id(), get_doc_type_toobtain()), (get_current_provision_id(), get_doc_type_surveyreq());

INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('V',get_provision_group_id(25),'INSURANCE REQUIRED - NOTICE OF FINAL REVIEW - OTHER','','Use when insurance is required for other tenures eg. homeowners','OFFER - INSURANCE', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_default()), (get_current_provision_id(), get_doc_type_delayed()), (get_current_provision_id(), get_doc_type_nofees()), (get_current_provision_id(), get_doc_type_surveyreq());

INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('V',get_provision_group_id(25),'INSURANCE REQUIRED - NOTICE OF FINAL REVIEW - CERTIFICATE REQUIRED','','Use when insurance along with a Certificate of Insurance is required.','OFFER - INSURANCE', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_default()), (get_current_provision_id(), get_doc_type_delayed()), (get_current_provision_id(), get_doc_type_nofees()), (get_current_provision_id(), get_doc_type_toobtain()), (get_current_provision_id(), get_doc_type_surveyreq());

INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('V',get_provision_group_id(25),'FREE FIELD FOR INSURANCE','','Use where you want to enter additonal information on insurance','OFFER - INSURANCE', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_default()), (get_current_provision_id(), get_doc_type_delayed()), (get_current_provision_id(), get_doc_type_nofees()), (get_current_provision_id(), get_doc_type_toobtain()), (get_current_provision_id(), get_doc_type_surveyreq());

INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('V',get_provision_group_id(27),'FREE FIELD - ADDITIONAL REQUIREMENTS','','Use where you want to state additional conditions of the offer','ADDITIONAL REQUIREMENTS', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_default()), (get_current_provision_id(), get_doc_type_delayed()), (get_current_provision_id(), get_doc_type_nofees()), (get_current_provision_id(), get_doc_type_toobtain()), (get_current_provision_id(), get_doc_type_surveyreq());

INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('V',get_provision_group_id(27),'FREE FIELD - ADDITIONAL REQUIREMENTS - 2','','Use where you want to state additional conditions of the offer','ADDITIONAL REQUIREMENTS', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_default()), (get_current_provision_id(), get_doc_type_nofees()), (get_current_provision_id(), get_doc_type_toobtain()), (get_current_provision_id(), get_doc_type_surveyreq());

INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('V',get_provision_group_id(27),'ADDITIONAL REQUIREMENTS - MANAGEMENT PLAN','','Use to require delivery of a management plan.','ADDITIONAL REQUIREMENTS', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_default()), (get_current_provision_id(), get_doc_type_delayed()), (get_current_provision_id(), get_doc_type_nofees()), (get_current_provision_id(), get_doc_type_toobtain()), (get_current_provision_id(), get_doc_type_surveyreq());

INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('V',get_provision_group_id(27),'ADDITIONAL REQUIREMENTS - ZONING APPROVAL','','Use to require confirmation that a zoning bylaw permitting use of the Land for the intended purposes has been adopted.','ADDITIONAL REQUIREMENTS', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_default()), (get_current_provision_id(), get_doc_type_delayed()), (get_current_provision_id(), get_doc_type_nofees()), (get_current_provision_id(), get_doc_type_toobtain()), (get_current_provision_id(), get_doc_type_surveyreq());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('LOCAL_GOVERNMENT','','Type in the name of the local government.',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('PURPOSE_GENERIC','','used for "_________" purposes.',get_current_provision_id());

INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('V',get_provision_group_id(27),'ADDITIONAL REQUIREMENTS - IMPROVEMENTS STAT DEC','','Use this when a statutory declaration is required regarding ownership of improvements.','ADDITIONAL REQUIREMENTS', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_default()), (get_current_provision_id(), get_doc_type_delayed()), (get_current_provision_id(), get_doc_type_nofees()), (get_current_provision_id(), get_doc_type_toobtain()), (get_current_provision_id(), get_doc_type_surveyreq());

INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('V',get_provision_group_id(27),'ADDITIONAL REQUIREMENTS - TAX CLEARANCE CERTIFICATE','','Use when a tax clearance certificate is required verifying that there are no arrears of taxes.','ADDITIONAL REQUIREMENTS', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_default()), (get_current_provision_id(), get_doc_type_delayed()), (get_current_provision_id(), get_doc_type_nofees()), (get_current_provision_id(), get_doc_type_toobtain()), (get_current_provision_id(), get_doc_type_surveyreq());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('TAX_COLLECTOR_OFFICE','','Type in the address of the local Provincial Tax Collector’s office.',get_current_provision_id());

INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('V',get_provision_group_id(27),'ADDITIONAL REQUIREMENTS - AFFILIATE STATUS CERTIFICATE','','Use when a certificate of affiliate status is required for each affiliate of your company using the communication site.','ADDITIONAL REQUIREMENTS', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_default()), (get_current_provision_id(), get_doc_type_delayed()), (get_current_provision_id(), get_doc_type_nofees()), (get_current_provision_id(), get_doc_type_toobtain()), (get_current_provision_id(), get_doc_type_surveyreq());

INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('V',get_provision_group_id(27),'ADDITIONAL REQUIREMENTS - OBTAIN AND DELIVER','','Use when you require immediate delivery of documentation.','ADDITIONAL REQUIREMENTS', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_default()), (get_current_provision_id(), get_doc_type_delayed()), (get_current_provision_id(), get_doc_type_nofees()), (get_current_provision_id(), get_doc_type_toobtain()), (get_current_provision_id(), get_doc_type_surveyreq());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('DEADLINE_TO_DELIVER','','Enter "on or before [date]" OR "within [45] days from the date of this letter.',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('DOCUMENT_TO_OBTAIN','','You must obtain the [specify the name of the document(s)] and ....',get_current_provision_id());

INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('V',get_provision_group_id(27),'ADDITIONAL REQUIREMENTS - FISHERIES AND OCEANS APPROVAL','','Use to require delivery of a copy of a permit from Fisheries and Oceans for aquaculture purposes.','ADDITIONAL REQUIREMENTS', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_default());

INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('V',get_provision_group_id(27),'ADDITIONAL REQUIREMENTS - COAST GUARD APPROVAL','','Use to require delivery of a letter of approval from the Canadian Coast Guard for the proposed construction.','ADDITIONAL REQUIREMENTS', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_default());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('COAST_GUARD_ADDRESS','','Type in the address of the Canadian Coast Guard office.',get_current_provision_id());

-- Document Type 'NOTICE OF FINAL REVIEW (NO FEES)'
INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('M',get_provision_group_id(1),'TEMPLATE VARIABLES - NOTICE OF FINAL REVIEW - NO FEES','','require message from POLICY','DOCUMENT TYPE', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_nofees());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('ATTENTION_LINE','','Attention: "______" - MUST FILL A VALUE IN - IF NOT REQUIRED, DELETE AFTER MERGING PROCESS.',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('CLIENT_FILE_NO','','Your file:  "______" - MUST FILL A VALUE IN - IF NOT REQUIRED, DELETE AFTER MERGING PROCESS.',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('DATE_OF_NOTICE','','Date of letter: Month Day ,Year',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('DEADLINE_COMPLETION_REQUIREMENTS','','Enter the date (month day, year) for completion of requirements',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('FACSIMILE_NUMBER','','Type in your facsimile number - "250 ___-____"',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('NUMBER_OF_COPIES','','three copies of tenure documents which are being forwarded to client to sign.  The number should be typed as a word, not a number.',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('PURPOSE_GENERIC','','used for "_________" purposes.',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('REPLACEMENT_TENURE_TYPE','','____No. #. Use to specify type and number of tenure being replaced e.g. lease No. 999.',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('SALUTATION','','Dear "______":  Type in the person’s name or Sir or Madam.',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('TELEPHONE_NUMBER','','Type in your telephone number - "250 ___-____"',get_current_provision_id());


-- Document Type 'NOTICE OF FINAL REVIEW (DELAYED)'
INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('M',get_provision_group_id(1),'TEMPLATE VARIABLES - NOTICE OF FINAL REVIEW - DELAYED','','require message from POLICY','DOCUMENT TYPE', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_delayed());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('ATTENTION_LINE','','Attention: "______" - MUST FILL A VALUE IN - IF NOT REQUIRED, DELETE AFTER MERGING PROCESS.',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('CLIENT_FILE_NO','','Your file:  "______" - MUST FILL A VALUE IN - IF NOT REQUIRED, DELETE AFTER MERGING PROCESS.',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('DATE_OF_NOTICE','','Date of letter: Month Day ,Year',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('DEADLINE_COMPLETION_REQUIREMENTS','','Enter the date (month day, year) for completion of requirements',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('FACSIMILE_NUMBER','','Type in your facsimile number - "250 ___-____"',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('NUMBER_OF_COPIES','','three copies of tenure documents which are being forwarded to client to sign.  The number should be typed as a word, not a number.',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('PURPOSE_GENERIC','','used for "_________" purposes.',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('SALUTATION','','Dear "______":  Type in the person’s name or Sir or Madam.',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('TELEPHONE_NUMBER','','Type in your telephone number - "250 ___-____"',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('TENURE_TYPE','','Type in the tenure type. e.g. Lease',get_current_provision_id());

INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('V',get_provision_group_id(10),'SURVEY CONFIRMATION - CLIENT PAYS - DELAYED','','Use when the client pays for survey.','OFFER SURVEY', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_delayed());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('DEADLINE_COMPLETE_SURVEY','','on or before "month day, year"',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('DEADLINE_CONFIRM_SURVEY','','Enter "On or before [date]" OR "Within [45] days from the date of this letter".  Capitalize first character as this is the start of a sentence.',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('MAXIMUM_AREA','','# hectares',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('RATE_PER_METRE','','$"#.## per square metre/per hectare"  Put in the decimal.',get_current_provision_id());

INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('V',get_provision_group_id(10),'SURVEY DEPOSIT - DELAYED','','Use to require payment of a deposit where Province is to pay for a survey.','OFFER SURVEY', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_delayed());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('SURVEY_DEPOSIT_DELAYED','','Deadline to pay survey deposit. Enter Month, Day, Year',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('DEPOSIT_AMOUNT_SURVEY','','$"#.##" Enter amount of survey deposit.  Put in the decimal.',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('MAXIMUM_AREA','','# hectares',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('RATE_PER_METRE','','$"#.## per square metre/per hectare"  Put in the decimal.',get_current_provision_id());

INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('V',get_provision_group_id(10),'PREPARE BOUNDARY PLAN (CLIENT PAYS)','','require message from POLICY','OFFER SURVEY', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_delayed()), (get_current_provision_id(), get_doc_type_surveyreq());

INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('M',get_provision_group_id(12),'MONIES PAYABLE - NOTICE OF FINAL REVIEW - DELAYED','','Use when you are providing a firm amount payable.','OFFER SURVEY', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_delayed());

INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('M',get_provision_group_id(12),'ESTIMATED MONIES PAYABLE - NOTICE OF FINAL REVIEW - DELAYED','','Use when you are providing an estimated amount payable.','OFFER SURVEY', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_delayed());

INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('V',get_provision_group_id(20),'DELIVER SECURITY DEPOSIT (& SURVEY DEPOSIT) - NOTICE OF FINAL REVIEW','','Use this where 2 deposits are to be delivered: one for the survey and another for clean-up under the terms of the tenure to be issued','OFFER - SECURITY', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_delayed());


-- Document Type 'NOTICE OF FINAL REVIEW (TO OBTAIN SURVEY)'
INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('M',get_provision_group_id(1),'TEMPLATE VARIABLES - NOTICE OF FINAL REVIEW - TO OBTAIN SURVEY','','require message from POLICY','DOCUMENT TYPE', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_toobtain());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('ATTENTION_LINE','','Attention: "______" - MUST FILL A VALUE IN - IF NOT REQUIRED, DELETE AFTER MERGING PROCESS.',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('CLIENT_FILE_NO','','Your file:  "______" - MUST FILL A VALUE IN - IF NOT REQUIRED, DELETE AFTER MERGING PROCESS.',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('DATE_OF_NOTICE','','Date of letter: Month Day ,Year',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('DEADLINE_COMPLETION_REQUIREMENTS','','Enter the date (month day, year) for completion of requirements',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('FACSIMILE_NUMBER','','Type in your facsimile number - "250 ___-____"',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('INTERIM_TENURE_TYPE','','Insert the type of tenure now being used. e.g. Licence.',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('NUMBER_OF_COPIES','','three copies of tenure documents which are being forwarded to client to sign.  The number should be typed as a word, not a number.',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('PURPOSE_GENERIC','','used for "_________" purposes.',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('SALUTATION','','Dear "______":  Type in the person’s name or Sir or Madam.',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('TELEPHONE_NUMBER','','Type in your telephone number - "250 ___-____"',get_current_provision_id());

INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('V',get_provision_group_id(10),'BOUNDARY SURVEY (WE PAY)','','Use where we will pay a B.C.L.S. to prepare a boundary survey','OFFER PREAMBLE', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_toobtain());

INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('V',get_provision_group_id(12),'SURVEY DEPOSIT','','Use to require payment of a deposit where Province is to pay for a survey','OFFER SURVEY', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_toobtain());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('DEADLINE_SURVEY_DEPOSIT','','Deadline to pay survey deposit. Enter Month, Day, Year',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('DEPOSIT_AMOUNT_SURVEY','','$"#.##" Enter amount of survey deposit.  Put in the decimal.',get_current_provision_id());

INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('V',get_provision_group_id(14),'LETTER AFFIRMING BC LAND SURVEYOR WAS HIRED','','Use to require client to submit letter confirming B.C.L.S. has been hired','OFFER - OBTAIN SURVEY', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_toobtain());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('DEADLINE_CONFIRM_SURVEY','','Enter "On or before [date]" OR "Within [45] days from the date of this letter".  Capitalize first character as this is the start of a sentence.',get_current_provision_id());

INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('V',get_provision_group_id(14),'LETTER AFFIRMING BOUNDARY SURVEY','','Use to remind client that surveyor’s letter must confirm that location of improvements will be on boundary plan','OFFER - OBTAIN SURVEY', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_toobtain());

INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('V',get_provision_group_id(20),'DELIVER SECURITY DEPOSIT - OS','','require message from POLICY','OFFER - SECURITY', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_toobtain());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('INTERIM_TENURE_TYPE','','Insert the type of tenure now being used. e.g. Licence.',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('SECURITY_AMOUNT','','#.## to post as security - indicate an amount even if blanket bond applies. Put in Decimal.',get_current_provision_id());

INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('V',get_provision_group_id(20),'BLANKET SECURITY STATEMENT - OS','','Use this when client is covered by blanket security agreement.','OFFER - SECURITY', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_toobtain());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('BLANKET_BOND_NAME','','You are currently covered by a blanket bond between MELP and "____". S...',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('INTERIM_TENURE_TYPE','','Insert the type of tenure now being used. e.g. Licence.',get_current_provision_id());

INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('V',get_provision_group_id(25),'INSURANCE REQUIRED - NOTICE OF FINAL REVIEW - OTHER - OS','','Use when insurance is required for other tenures eg. homeowners','OFFER - INSURANCE', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_toobtain());


-- Document Type 'NOTICE OF FINAL REVIEW (SURVEY REQUIRED)'
INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('M',get_provision_group_id(1),'TEMPLATE VARIABLES - NOTICE OF FINAL REVIEW - SURVEY REQUIRED','','require message from POLICY','DOCUMENT TYPE', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_surveyreq());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('ATTENTION_LINE','','Attention: "______" - MUST FILL A VALUE IN - IF NOT REQUIRED, DELETE AFTER MERGING PROCESS.',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('CLIENT_FILE_NO','','Your file:  "______" - MUST FILL A VALUE IN - IF NOT REQUIRED, DELETE AFTER MERGING PROCESS.',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('DATE_OF_NOTICE','','Date of letter: Month Day ,Year',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('DAYS_TO_DELIVER_DOCUMENTS','','# days in the sentence: We will forward the documents to you within ___of the survey being completed.....',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('DAYS_TO_RETURN_DOCUMENTS','','__ days - You must sign and return them to us within _____ of our letter to you .......',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('DEADLINE_COMPLETION_REQUIREMENTS','','Enter the date (month day, year) for completion of requirements',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('FACSIMILE_NUMBER','','Type in your facsimile number - "250 ___-____"',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('MAXIMUM_AREA','','# hectares',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('NUMBER_OF_COPIES','','three copies of tenure documents which are being forwarded to client to sign.  The number should be typed as a word, not a number.',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('PURPOSE_GENERIC','','used for "_________" purposes.',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('RATE_PER_METRE','','$"#.## per square metre/per hectare"  Put in the decimal.',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('SALUTATION','','Dear "______":  Type in the person’s name or Sir or Madam.',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('TELEPHONE_NUMBER','','Type in your telephone number - "250 ___-____"',get_current_provision_id());

INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('V',get_provision_group_id(10),'SURVEY - MINISTRY PAYS','','Use where ministry pays fro survey','OFFER SURVEY', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_surveyreq());

INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('V',get_provision_group_id(10),'SURVEY DEPOSIT - DEL','','Use to require payment of a deposit where Province is to pay for a survey.','OFFER SURVEY', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_surveyreq());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('DEADLINE_SURVEY_DEPOSIT','','Deadline to pay survey deposit. Enter Month, Day, Year',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('DEPOSIT_AMOUNT_SURVEY','','$"#.##" Enter amount of survey deposit.  Put in the decimal.',get_current_provision_id());

INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('V',get_provision_group_id(10),'SURVEY - CLIENT - PAYS','','Use when client pays for survey','OFFER SURVEY', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_surveyreq());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('DEADLINE_COMPLETE_SURVEY','','on or before "month day, year"',get_current_provision_id());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('DEADLINE_CONFIRM_SURVEY','','Enter "On or before [date]" OR "Within [45] days from the date of this letter".  Capitalize first character as this is the start of a sentence.',get_current_provision_id());

INSERT INTO provision (type, "provisionGroupId", provision_name, free_text, help_text, category, active_flag, sequence_value, is_deleted) VALUES ('V',get_provision_group_id(20),'DELIVER SECURITY DEPOSIT (& SURVEY DEPOSIT) - NOTICE OF FINAL REVIEW','','Use this where 2 deposits are to be delivered: one for the survey and another for clean-up under the terms of the tenure to be issued','OFFER - SECURITY', true, 1, false);
INSERT INTO provision_document_type (provision_id, document_type_id) VALUES (get_current_provision_id(), get_doc_type_surveyreq());
INSERT INTO provision_variable (variable_name, variable_value, help_text, "provisionId") VALUES ('SECURITY_AMOUNT','','#.## to post as security - indicate an amount even if blanket bond applies. Put in Decimal.',get_current_provision_id());