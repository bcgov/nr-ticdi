-- Initialize Database Provisions
-- Create groups
INSERT INTO nfr_provision_group (provision_group, max) VALUES (1,3);
INSERT INTO nfr_provision_group (provision_group, max) VALUES (2,3);
INSERT INTO nfr_provision_group (provision_group, max) VALUES (5,3);
INSERT INTO nfr_provision_group (provision_group, max) VALUES (10,3);
INSERT INTO nfr_provision_group (provision_group, max) VALUES (12,3);
INSERT INTO nfr_provision_group (provision_group, max) VALUES (14,3);
INSERT INTO nfr_provision_group (provision_group, max) VALUES (15,3);
INSERT INTO nfr_provision_group (provision_group, max) VALUES (20,3);
INSERT INTO nfr_provision_group (provision_group, max) VALUES (25,3);
INSERT INTO nfr_provision_group (provision_group, max) VALUES (27,3);
INSERT INTO nfr_provision_group (provision_group, max) VALUES (28,3);
INSERT INTO nfr_provision_group (provision_group, max) VALUES (34,3);

-- Create variants
INSERT INTO nfr_provision_variant (variant_name) VALUES ('NOTICE OF FINAL REVIEW');
INSERT INTO nfr_provision_variant (variant_name) VALUES ('NOTICE OF FINAL REVIEW (DELAYED)');
INSERT INTO nfr_provision_variant (variant_name) VALUES ('NOTICE OF FINAL REVIEW (NO FEES)');
INSERT INTO nfr_provision_variant (variant_name) VALUES ('NOTICE OF FINAL REVIEW (SURVEY REQUIRED)');
INSERT INTO nfr_provision_variant (variant_name) VALUES ('NOTICE OF FINAL REVIEW (TO OBTAIN SURVEY)');

-- Helper functions for grabbing variant ids, group ids, and current provision id.
CREATE OR REPLACE FUNCTION get_current_provision_id() RETURNS INTEGER AS $$
DECLARE
	provision_id INTEGER;
BEGIN
	SELECT max(id) INTO provision_id FROM nfr_provision;
	return provision_id;
END;
$$ LANGUAGE PLPGSQL;
CREATE OR REPLACE FUNCTION get_variant_default() RETURNS INTEGER AS $$
DECLARE
    variant_id INTEGER;
BEGIN
    SELECT id INTO variant_id FROM nfr_provision_variant WHERE variant_name = 'NOTICE OF FINAL REVIEW';
    RETURN variant_id;
END;
$$ LANGUAGE PLPGSQL;
CREATE OR REPLACE FUNCTION get_variant_delayed() RETURNS INTEGER AS $$
DECLARE
    variant_id INTEGER;
BEGIN
    SELECT id INTO variant_id FROM nfr_provision_variant WHERE variant_name = 'NOTICE OF FINAL REVIEW (DELAYED)';
    RETURN variant_id;
END;
$$ LANGUAGE PLPGSQL;
CREATE OR REPLACE FUNCTION get_variant_nofees() RETURNS INTEGER AS $$
DECLARE
    variant_id INTEGER;
BEGIN
    SELECT id INTO variant_id FROM nfr_provision_variant WHERE variant_name = 'NOTICE OF FINAL REVIEW (NO FEES)';
    RETURN variant_id;
END;
$$ LANGUAGE PLPGSQL;
CREATE OR REPLACE FUNCTION get_variant_surveyreq() RETURNS INTEGER AS $$
DECLARE
    variant_id INTEGER;
BEGIN
    SELECT id INTO variant_id FROM nfr_provision_variant WHERE variant_name = 'NOTICE OF FINAL REVIEW (SURVEY REQUIRED)';
    RETURN variant_id;
END;
$$ LANGUAGE PLPGSQL;
CREATE OR REPLACE FUNCTION get_variant_toobtain() RETURNS INTEGER AS $$
DECLARE
    variant_id INTEGER;
BEGIN
    SELECT id INTO variant_id FROM nfr_provision_variant WHERE variant_name = 'NOTICE OF FINAL REVIEW (TO OBTAIN SURVEY)';
    RETURN variant_id;
END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION get_provision_group_id(p_provision_group INTEGER)
RETURNS INTEGER AS $$
DECLARE
  pg_id INTEGER;
BEGIN
  SELECT id INTO pg_id FROM nfr_provision_group WHERE provision_group = p_provision_group;
  RETURN pg_id;
END;
$$ LANGUAGE plpgsql;

-- Create Provisions and relations to variants
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('V',get_provision_group_id(1),'TEMPLATE VARIABLES - NOTICE OF FINAL REVIEW','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_default());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('V',get_provision_group_id(1),'TEMPLATE VARIABLES - NOTICE OF FINAL REVIEW - NO FEES','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_delayed());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('V',get_provision_group_id(1),'TEMPLATE VARIABLES - NOTICE OF FINAL REVIEW - DELAYED','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_nofees());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('V',get_provision_group_id(1),'TEMPLATE VARIABLES - NOTICE OF FINAL REVIEW - TO OBTAIN SURVEY','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_surveyreq());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('V',get_provision_group_id(1),'TEMPLATE VARIABLES - NOTICE OF FINAL REVIEW - SURVEY REQUIRED','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_toobtain());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('V',get_provision_group_id(2),'FEES','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_default());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_nofees());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_surveyreq());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_toobtain());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(5),'REPLACEMENT STATEMENT','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_default());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_delayed());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_nofees());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_surveyreq());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_toobtain());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(5),'LAND DIFFERS FROM STATEMENT','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_default());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_delayed());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_nofees());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_surveyreq());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_toobtain());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(5),'FREE FIELD - PREAMBLE INFORMATION','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_default());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_delayed());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_nofees());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_surveyreq());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_toobtain());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(10),'SURVEY CONFIRMATION - CLIENT PAYS - DELAYED','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_nofees());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(10),'SURVEY DEPOSIT - DELAYED','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_nofees());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(10),'PREPARE BOUNDARY PLAN (CLIENT PAYS)','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_nofees());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(10),'PREPARE BOUNDARY PLAN (CLIENT PAYS)','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_toobtain());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(10),'BOUNDARY SURVEY (WE PAY)','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_surveyreq());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(10),'SURVEY - MINISTRY PAYS','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_toobtain());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(10),'SURVEY DEPOSIT - DEL','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_toobtain());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(10),'SURVEY - CLIENT - PAYS','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_toobtain());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(12),'SURVEY DEPOSIT','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_surveyreq());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(14),'LETTER AFFIRMING BC LAND SURVEYOR WAS HIRED','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_surveyreq());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(14),'LETTER AFFIRMING BOUNDARY SURVEY','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_surveyreq());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('M',get_provision_group_id(12),'MONIES PAYABLE - NOTICE OF FINAL REVIEW - DELAYED','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_nofees());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('M',get_provision_group_id(12),'ESTIMATED MONIES PAYABLE - NOTICE OF FINAL REVIEW - DELAYED','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_nofees());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(15),'OCCUPATIONAL RENT STATEMENT','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_default());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_nofees());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_surveyreq());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_toobtain());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('H',get_provision_group_id(20),'SECURITY - NOTICE OF FINAL REVIEW','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_default());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_delayed());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_nofees());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_surveyreq());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_toobtain());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(20),'DELIVER SECURITY DEPOSIT - NOTICE OF FINAL REVIEW','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_default());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_delayed());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_nofees());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_toobtain());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(20),'BLANKET SECURITY STATEMENT','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_default());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_delayed());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_nofees());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_toobtain());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(20),'DELIVER SECURITY DEPOSIT (& SURVEY DEPOSIT) - NOTICE OF FINAL REVIEW','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_nofees());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_toobtain());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(20),'DELIVER SECURITY DEPOSIT - OS','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_surveyreq());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(20),'BLANKET SECURITY STATEMENT - OS','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_surveyreq());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_toobtain());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(20),'FREE FIELD FOR SECURITY SECTION','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_default());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_delayed());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_nofees());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_surveyreq());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_toobtain());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('H',get_provision_group_id(25),'INSURANCE - NOTICE OF FINAL REVIEW','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_default());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_delayed());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_nofees());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_surveyreq());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_toobtain());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(25),'INSURANCE REQUIRED - NOTICE OF FINAL REVIEW - OTHER','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_default());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_delayed());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_nofees());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_toobtain());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(25),'INSURANCE REQUIRED - NOTICE OF FINAL REVIEW - CERTIFICATE REQUIRED','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_default());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_delayed());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_nofees());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_toobtain());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(25),'INSURANCE REQUIRED - NOTICE OF FINAL REVIEW - OTHER - OS','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_surveyreq());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(25),'INSURANCE REQUIRED - NOTICE OF FINAL REVIEW - CERTIFICATE REQUIRED - OS','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_surveyreq());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(25),'FREE FIELD FOR INSURANCE','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_default());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_delayed());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_nofees());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_surveyreq());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_toobtain());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('H',get_provision_group_id(27),'ADDITIONAL REQUIREMENTS','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_toobtain());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(27),'FREE FIELD - ADDITIONAL REQUIREMENTS','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_toobtain());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(27),'FREE FIELD - ADDITIONAL REQUIREMENTS - 2','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_toobtain());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(27),'ADDITIONAL REQUIREMENTS - MANAGEMENT PLAN','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_toobtain());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(27),'ADDITIONAL REQUIREMENTS - ZONING APPROVAL','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_toobtain());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(27),'ADDITIONAL REQUIREMENTS - IMPROVEMENTS STAT DEC','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_toobtain());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(27),'ADDITIONAL REQUIREMENTS - TAX CLEARANCE CERTIFICATE','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_toobtain());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(27),'ADDITIONAL REQUIREMENTS - AFFILIATE STATUS CERTIFICATE','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_toobtain());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(27),'ADDITIONAL REQUIREMENTS - OBTAIN AND DELIVER','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_toobtain());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('H',get_provision_group_id(28),'ADDITIONAL REQUIREMENTS','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_surveyreq());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(28),'FREE FIELD - ADDITIONAL REQUIREMENTS','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_surveyreq());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(28),'FREE FIELD - ADDITIONAL REQUIREMENTS - 2','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_surveyreq());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(28),'ADDITIONAL REQUIREMENTS - MANAGEMENT PLAN','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_surveyreq());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(28),'ADDITIONAL REQUIREMENTS - ZONING APPROVAL','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_surveyreq());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(28),'ADDITIONAL REQUIREMENTS - IMPROVEMENTS STAT DEC','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_surveyreq());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(28),'ADDITIONAL REQUIREMENTS - TAX CLEARANCE CERTIFICATE','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_surveyreq());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(28),'ADDITIONAL REQUIREMENTS - AFFILIATE STATUS CERTIFICATE','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_surveyreq());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(28),'ADDITIONAL REQUIREMENTS - OBTAIN AND DELIVER','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_surveyreq());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('H',get_provision_group_id(34),'ADDITIONAL REQUIREMENTS','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_default());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_delayed());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_nofees());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(34),'FREE FIELD - ADDITIONAL REQUIREMENTS','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_default());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_delayed());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_nofees());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(34),'FREE FIELD - ADDITIONAL REQUIREMENTS - 2','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_default());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_delayed());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(34),'ADDITIONAL REQUIREMENTS - MANAGEMENT PLAN','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_default());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_delayed());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_nofees());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(34),'ADDITIONAL REQUIREMENTS - ZONING APPROVAL','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_default());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_delayed());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_nofees());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(34),'ADDITIONAL REQUIREMENTS - IMPROVEMENTS STAT DEC','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_default());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_delayed());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_nofees());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(34),'ADDITIONAL REQUIREMENTS - TAX CLEARANCE CERTIFICATE','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_default());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_delayed());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_nofees());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(34),'ADDITIONAL REQUIREMENTS - AFFILIATE STATUS CERTIFICATE','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_default());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_delayed());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_nofees());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(34),'ADDITIONAL REQUIREMENTS - OBTAIN AND DELIVER','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_default());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_delayed());
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_nofees());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(34),'ADDITIONAL REQUIREMENTS - FISHERIES AND OCEANS APPROVAL','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_default());
INSERT INTO nfr_provision (type, "provisionGroupId", provision_text, free_text, category) VALUES ('O',get_provision_group_id(34),'ADDITIONAL REQUIREMENTS - COAST GUARD APPROVAL','','');
INSERT INTO nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId", "nfrProvisionVariantId") VALUES (get_current_provision_id(), get_variant_default());
