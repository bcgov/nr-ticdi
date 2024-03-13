BEGIN;
SET CLIENT_ENCODING TO 'utf8';
ALTER TABLE public.nfr_provision_group DISABLE TRIGGER ALL;
ALTER TABLE public.nfr_provision DISABLE TRIGGER ALL;
ALTER TABLE public.nfr_provision_variable DISABLE TRIGGER ALL;
ALTER TABLE public.nfr_provision_variant DISABLE TRIGGER ALL;
ALTER TABLE public.nfr_provision_provision_variant_nfr_provision_variant DISABLE TRIGGER ALL;

-- nfr_provision_group
INSERT INTO public.nfr_provision_group (provision_group,provision_group_text,max) VALUES
	 (1,'DOCUMENT TYPE',999),
	 (2,'FEES',999),
	 (5,'PREAMBLE',3),
	 (15,'OCCUPATIONAL RENT',1),
	 (20,'SECURITY',2),
	 (25,'INSURANCE',2),
	 (28,'',3),
	 (27,'ADDITIONAL REQUIREMENTS',999),
	 (34,'ADDITIONAL REQUIREMENTS',999),
	 (10,'SURVEY REQUIREMENTS',999);
INSERT INTO public.nfr_provision_group (provision_group,provision_group_text,max) VALUES
	 (14,'OBTAIN SURVEY',999),
	 (12,'SURVEY FEES',1);

--nfr_provision
INSERT INTO public.nfr_provision ("type",provision_name,free_text,help_text,category,active_flag,create_userid,update_userid,create_timestamp,update_timestamp,"provisionGroupId") VALUES
	 ('O','INSURANCE REQUIRED - NFR OBTAIN SURVEY- OTHER','You must at your expense, effect and keep in force insurance as described in the enclosed «INTERIM_TENURE_TYPE».','Use when insurance is required on the interim tenure and may be covered under homeowners insurance etc.','OFFER - INSURANCE',true,NULL,'BSALL','2023-06-02 15:57:07.279427','2023-06-22 16:38:55.979829',9),
	 ('O','ADDITIONAL REQUIREMENTS - FISHERIES AND OCEANS APPROVAL','You must deliver to us a copy of a permit issued by the Federal Department of Fisheries and Oceans in respect of your proposed use of the Land for aquaculture purposes.','Use to require delivery of a copy of a permit from Fisheries and Oceans for aquaculture purposes.','ADDITIONAL REQUIREMENTS',true,NULL,'BSALL','2023-06-02 15:57:07.279427','2023-06-15 14:46:47.992471',10),
	 ('O','FREE FIELD - PREAMBLE INFORMATION','«PREAMBLE_FREE_FIELD»','Use when you want to enter additional information for the preamble','OFFER PREAMBLE',true,NULL,'LOMILLER','2023-06-02 15:57:07.279427','2023-06-26 17:42:07.859382',3),
	 ('M','TEMPLATE VARIABLES - NFR - NO FEES','','Nominal rent tenures e.g. for community purposes being issued.  Do not use for Crown Grants.  No additional fees are being requested.','DOCUMENT TYPE',true,NULL,'BSALL','2023-06-02 15:57:07.279427','2023-06-15 17:46:18.385388',1),
	 ('O','FREE FIELD FOR INSURANCE','«INSURANCE_FREE_FIELD»','Use when you want to enter additional information for insurance.','OFFER - INSURANCE',true,NULL,'LOMILLER','2023-06-02 15:57:07.279427','2023-06-26 18:38:59.492308',9),
	 ('M','FEES','','Use this to create a table listing all the fees to be paid. Table is unprotected, will be able to modify text ','FEES',true,NULL,'BSALL','2023-06-02 15:57:07.279427','2023-06-22 16:23:44.53137',2),
	 ('O','DELIVER SECURITY DEPOSIT','You must deliver to us a security deposit in the amount of $«SECURITY_AMOUNT» to guarantee the performance of your obligations under the «DB_TENURE_TYPE».  Please see attached information regarding acceptable types of security.','Use this to require delivery of security deposit','OFFER - SECURITY',true,NULL,'LOMILLER','2023-06-02 15:57:07.279427','2023-06-21 21:41:03.491356',8),
	 ('M','TEMPLATE VARIABLES - NOTICE OF FINAL REVIEW','','majority of the new tenures and replacement tenures when survey is not required. Do not use for Crown Grants or when no additional fees are requested such as Nominal Rent tenures.','DOCUMENT TYPE',true,NULL,'BSALL','2023-06-02 15:57:07.279427','2023-06-13 21:16:55.658566',1),
	 ('O','FREE FIELD FOR SECURITY SECTION','«SECURITY_FREE_FIELD»','Use where you need to add information regarding security','OFFER - SECURITY',true,NULL,'LOMILLER','2023-06-02 15:57:07.279427','2023-06-26 17:44:08.717371',8),
	 ('O','BOUNDARY SURVEY PLAN - CLIENT PAYS','In preparing the boundary survey the surveyor is also to indicate on the plan the location, type and dimensions of all existing improvements on the Land.','Use when "as built" survey of existing improvements is required.','OFFER SURVEY',true,NULL,'BSALL','2023-06-02 15:57:07.279427','2023-06-27 14:57:22.134285',4);
INSERT INTO public.nfr_provision ("type",provision_name,free_text,help_text,category,active_flag,create_userid,update_userid,create_timestamp,update_timestamp,"provisionGroupId") VALUES
	 ('V','MONIES PAYABLE - NFR DELAYED','You must deliver to us the following amounts:','Use when you are providing a firm amount payable.','OFFER SURVEY',true,NULL,'LOMILLER','2023-06-02 15:57:07.279427','2023-06-28 18:33:54.808381',5),
	 ('O','LETTER AFFIRMING BOUNDARY SURVEY','This letter must confirm that in preparing the boundary survey the surveyor will also indicate on the plan the location, type and dimensions of all existing improvements on the Land.','Use to remind client that Surveyor’s letter must confirm that location of improvements will be on boundary plan','OFFER - OBTAIN SURVEY',true,NULL,'LOMILLER','2023-06-02 15:57:07.279427','2023-06-22 23:32:25.268378',6),
	 ('O','DELIVER SECURITY DEPOSIT - OBTAIN SURVEY','You must deliver to us a security deposit in the amount of $«SECURITY_AMOUNT» to guarantee the performance of your obligations under the «INTERIM_TENURE_TYPE».  Please see attached information regarding acceptable types of security.','Use this when security is required for the interim tenure','OFFER - SECURITY',true,NULL,'BSALL','2023-06-02 15:57:07.279427','2023-06-22 16:44:32.291826',8),
	 ('O','LETTER AFFIRMING BC LAND SURVEYOR WAS HIRED','«DEADLINE_CONFIRM_SURVEY» you must submit to us a letter from a British Columbia Land Surveyor confirming that you have hired the surveyor to prepare a boundary survey of the Land at your expense.','When client must provide us with a letter confirming Surveyor has been hired','OFFER - OBTAIN SURVEY',true,NULL,'LOMILLER','2023-06-02 15:57:07.279427','2023-06-22 23:32:10.132454',6),
	 ('O','ADDITIONAL REQUIREMENTS - AFFILIATE STATUS CERTIFICATE','You must deliver to us a certificate of affiliate status, in the form attached, for each affiliate of your company which will be using the communication site.','Use when a certificate of affiliate status is required for each affiliate of your company using the communication site.','ADDITIONAL REQUIREMENTS',true,NULL,'BSALL','2023-06-02 15:57:07.364365','2023-06-22 16:45:03.795999',10),
	 ('O','FREE FIELD - ADDITIONAL REQUIREMENTS','«ADDITIONAL_REQUIREMENTS_FREE_FIELD»','Use where you want to state additional conditions of the offer','ADDITIONAL REQUIREMENTS',true,NULL,'LOMILLER','2023-06-02 15:57:07.364365','2023-06-26 17:48:12.021686',10),
	 ('O','INSURANCE REQUIRED - NFR - OTHER','You must at your expense, effect and keep in force insurance as described in the enclosed ','Use when insurance is required and may be covered under homeowners insurance etc.','OFFER - INSURANCE',true,NULL,'BSALL','2023-06-02 15:57:07.279427','2023-06-22 16:38:10.794413',9),
	 ('O','REPLACEMENT STATEMENT','This is to replace «REPLACEMENT_TENURE_TYPE».',' Use this when the tenure is being replaced ','OFFER PREAMBLE',true,NULL,'BSALL','2023-06-02 15:57:07.279427','2023-06-20 18:16:12.396934',3),
	 ('O','OCCUPATIONAL RENT STATEMENT','Please note that Occupational Rental under section 96 of the Land Act is payable for your occupation of the Land for the period from <<OCC_RENT_DETAILS>>.','Use this when occupational rent is payable','OFFER - MONIES - PAYABLE',true,NULL,'LOMILLER','2023-06-02 15:57:07.364365','2023-06-21 23:52:11.226929',7),
	 ('O','ADDITIONAL REQUIREMENTS - MANAGEMENT PLAN','You must submit to us a management plan that is acceptable to us for your proposed development of the Land.','Use to require delivery of a management plan.','ADDITIONAL REQUIREMENTS',true,NULL,'LOMILLER','2023-06-02 15:57:07.364365','2023-06-12 21:33:54.879335',10);
INSERT INTO public.nfr_provision ("type",provision_name,free_text,help_text,category,active_flag,create_userid,update_userid,create_timestamp,update_timestamp,"provisionGroupId") VALUES
	 ('M','FEES','','Use this to create a table listing all the fees to be paid. Table is unprotected, will be able to modify text ','FEES',true,NULL,'BSALL','2023-06-02 15:57:07.364365','2023-06-29 21:41:36.444092',2),
	 ('O','LAND DIFFERS FROM STATEMENT','The Land differs from what you applied for because «WHY_LAND_DIFFERS».','Use when land being offered differs from the applied area','OFFER PREAMBLE',true,NULL,'BSALL','2023-06-02 15:57:07.279427','2023-06-20 18:16:44.295381',3),
	 ('M','TEMPLATE VARIABLES - NFR - DELAYED','','Use when applicant requires assurance tenure will be issued once additional requirements are fulfilled. (eg zoning, reports)','DOCUMENT TYPE',true,NULL,'BSALL','2023-06-02 15:57:07.279427','2023-06-15 17:46:42.133675',1),
	 ('V','SURVEY DEPOSIT','You must, by «DEADLINE_SURVEY_DEPOSIT», pay to us a deposit of $«DEPOSIT_AMOUNT_SURVEY» (which, if a tenure is issued to you following completion of survey, will be credited against the amounts owing for that tenure).  If you choose not to proceed with the survey after it has been started, the deposit will be forfeited to the Province as liquidated damages.  Please make your cheque or money order payable to the Minister of Finance and deliver it to «DB_ADDRESS_LINE_REGIONAL_OFFICE».','Use when we require a deposit from the client because the Province is paying for the survey','OFFER SURVEY',true,NULL,'BSALL','2023-06-02 15:57:07.279427','2023-06-27 20:36:16.969351',5),
	 ('V','ESTIMATED MONIES PAYABLE - NFR - DELAYED','You must deliver to us the following amounts as set out below (estimated amounts are set out below).  The final amounts owing will be calculated when the survey is complete and the area of the Land has been established.  It will include the following items, some of which are subject to adjustment if the survey plan and area of the Land do not, in our opinion, conform to the attached sketch.','Use when you are providing an estimated amount payable.','OFFER SURVEY',true,NULL,'LOMILLER','2023-06-02 15:57:07.279427','2023-06-28 18:34:04.60236',5),
	 ('O','ADDITIONAL REQUIREMENTS - TAX CLEARANCE CERTIFICATE','You must deliver to us a Tax Clearance Certificate, obtained from the Provincial Tax Collector’s office at «TAX_COLLECTOR_OFFICE», verifying that there are no arrears of taxes in connection with the Land.','Use when a tax clearance certificate is required verifying that there are no arrears of taxes.','ADDITIONAL REQUIREMENTS',true,NULL,'LOMILLER','2023-06-02 15:57:07.364365','2023-06-12 21:36:03.361001',10),
	 ('O','ADDITIONAL REQUIREMENTS - ZONING APPROVAL','You must deliver to us written confirmation from «LOCAL_GOVERNMENT» stating that it has adopted a zoning bylaw permitting the Land to be used for «PURPOSE_GENERIC_ZONING» purposes.','Use to require confirmation that a zoning bylaw permitting use of the Land for the intended purposes has been adopted.','ADDITIONAL REQUIREMENTS',true,NULL,'LOMILLER','2023-06-02 15:57:07.364365','2023-06-13 18:13:04.140914',10),
	 ('O','ADDITIONAL REQUIREMENTS - OBTAIN AND DELIVER','You must obtain the «DOCUMENT_TO_OBTAIN» and «DEADLINE_TO_DELIVER», deliver a copy of it to us.','Use when you require immediate delivery of documentation.','ADDITIONAL REQUIREMENTS',true,NULL,'BSALL','2023-06-02 15:57:07.364365','2023-06-13 21:01:39.704815',10),
	 ('O','ADDITIONAL REQUIREMENTS - COAST GUARD APPROVAL','You must deliver to us a copy of a letter of approval from the Canadian Coast Guard under the Navigable Waters Protection Act for your proposed construction on the Land.  In this regard, please contact: Canadian Coast Guard, «COAST_GUARD_ADDRESS».','Use to require delivery of a letter of approval from the Canadian Coast Guard for the proposed construction.','ADDITIONAL REQUIREMENTS',true,NULL,'BSALL','2023-06-02 15:57:07.279427','2023-06-15 14:46:33.558354',10),
	 ('O','BOUNDARY SURVEY PLAN - MINISTRY PAYS','A boundary survey of the Land will be undertaken by a British Columbia Land Surveyor hired by us.','Use when we will pay a Surveyor to prepare a boundary survey','OFFER PREAMBLE',true,NULL,'BSALL','2023-06-02 15:57:07.279427','2023-06-27 14:57:45.158502',4);
INSERT INTO public.nfr_provision ("type",provision_name,free_text,help_text,category,active_flag,create_userid,update_userid,create_timestamp,update_timestamp,"provisionGroupId") VALUES
	 ('M','TEMPLATE VARIABLES - NFR - SURVEY REQUIRED','','Survey of the Land/improvements is required prior to issuance of tenure. E.g. when its a decision to convert an existing Licence for a Lease or SRW.  Not to be used for Crown Grants.','DOCUMENT TYPE',true,NULL,'BSALL','2023-06-02 15:57:07.364365','2023-06-15 17:47:18.794212',1),
	 ('M','TEMPLATE VARIABLES - NFR- TO OBTAIN SURVEY','','Interim tenure is being issued for survey purposes and/or initial activity. A subsequent tenure will be issued upon completion of the requirements set out in interim tenure.  Not to be used for Crown Grants.','DOCUMENT TYPE',true,NULL,'BSALL','2023-06-02 15:57:07.279427','2023-06-22 16:19:52.911188',1),
	 ('O','BLANKET SECURITY STATEMENT','According to our records, you are currently covered by a blanket security agreement between the Province and «BLANKET_BOND_NAME».  As long as this agreement is in good standing and you continue to be covered by it, you are not required to post security for this «DB_TENURE_TYPE» unless and until you receive further notice from us.','Use this when client is covered by blanket security agreement','OFFER - SECURITY',true,NULL,'BSALL','2023-06-02 15:57:07.279427','2023-06-22 17:15:25.058373',8),
	 ('O','ADDITIONAL REQUIREMENTS - IMPROVEMENTS STAT DEC','You must deliver to us a statutory declaration, in the form attached, stating that all improvements on the Land are either owned by you or have been constructed, erected or place on the Land by you. Please sign this declaration in front of a solicitor or notary public.','Use this when a statutory declaration is required regarding ownership of improvements.','ADDITIONAL REQUIREMENTS',true,NULL,'BSALL','2023-06-02 15:57:07.364365','2023-06-20 20:34:35.62335',10),
	 ('O','SURVEY - CLIENT - PAYS','«DEADLINE_CONFIRM_SURVEY», you must retain a British Columbia Land Surveyor to prepare a boundary survey of the Land at your expense.  

The survey must be completed and the plan submitted to the Surveyor General on or before «DEADLINE_COMPLETE_SURVEY».  If the survey is not completed on or before that date, and that date is not otherwise extended in writing by us we are under no further obligation to issue a «DB_TENURE_TYPE» of the Land to you.','Use when client pays for survey','OFFER SURVEY',true,NULL,'LOMILLER','2023-06-02 15:57:07.364365','2023-06-21 21:39:34.632611',4),
	 ('O','INSURANCE REQUIRED - NFR - CERTIFICATE REQUIRED','You must deliver to us the attached Province of British Columbia Certificate of Insurance, signed by your insurance agent, for the insurance required to be maintained under the «DB_TENURE_TYPE».  A sample certificate is enclosed.','Use when a Certificate of Insurance is required.','OFFER - INSURANCE',true,NULL,'BSALL','2023-06-02 15:57:07.279427','2023-06-22 16:41:47.327374',9),
	 ('O','INSURANCE REQUIRED - NFR OBTAIN SURVEY - CERTIFICATE','You must deliver to us the attached Province of British Columbia Certificate of Insurance, signed by your insurance agent, for the insurance required to be maintained under the «INTERIM_TENURE_TYPE».  A sample certificate is enclosed.','Use when a Certificate of Insurance is required.','OFFER - INSURANCE',true,NULL,'BSALL','2023-06-02 15:57:07.364365','2023-06-22 16:41:32.284043',9),
	 ('O','SURVEY - MINISTRY PAYS (DEPOSIT REQUIRED) -NFR DELAYED','A boundary survey of the Land will be undertaken by a British Columbia Land Surveyor hired by us.  

You must, by «DEADLINE_SURVEY_DEPOSIT», pay to us a deposit of $«DEPOSIT_AMOUNT_SURVEY» (which, if the «DB_TENURE_TYPE» is issued, will be credited against the amounts set out below that you are required to pay).  If you choose not to proceed with the «DB_TENURE_TYPE» after the survey has been started, the deposit will be forfeited to the Province as liquidated damages.  Please make your cheque or money order payable to the Minister of Finance and deliver it to «DB_ADDRESS_LINE_REGIONAL_OFFICE».

If the survey is completed in accordance with the requirements set out above, we will complete the «DB_TENURE_TYPE» documents by inserting the correct legal description for the Land and by inserting the required monies payable.  The monies payable are calculated on the basis of the area of the Land at a rate of $«RATE_PER_METRE_SURVEY_DEPOSIT_DELAYED».  If the area of the Land exceeds «MAXIMUM_AREA_SURVEY_DEPOSIT_DELAYED», this offer terminates unless we agree with you in writing to proceed with the issuance of the «DB_TENURE_TYPE».','Use to require payment of a deposit where Province is to pay for a survey.','OFFER SURVEY',true,NULL,'BSALL','2023-06-02 15:57:07.279427','2023-06-27 15:09:33.645396',4),
	 ('O','BLANKET SECURITY - OBTAIN SURVEY','According to our records, you are currently covered by a blanket security agreement between the Province and «BLANKET_BOND_NAME».  As long as this agreement is in good standing and you continue to be covered by it, you are not required to post security for this «INTERIM_TENURE_TYPE» until you receive further notice from us.','Client has a blanket security - we are issuing interim tenure','OFFER - SECURITY',true,NULL,'BSALL','2023-06-02 15:57:07.279427','2023-06-22 16:58:36.242497',8),
	 ('O','SURVEY - CLIENT PAYS - NFR DELAYED','«DEADLINE_CONFIRM_SURVEY», you must retain a British Columbia Land Surveyor to prepare a boundary survey of the Land at your expense.  

The survey must be completed, and the plan submitted to the Surveyor General on or before «DEADLINE_COMPLETE_SURVEY».  If the survey is not completed on or before that date, and that date is not otherwise extended in writing by us we are under no further obligation to issue a «DB_TENURE_TYPE» of the Land to you.

If the survey is completed in accordance with the requirements set out above, we will complete the «DB_TENURE_TYPE» documents by inserting the correct legal description for the Land and by inserting the required monies payable.  The monies payable are calculated on the basis of the area of the Land at a rate of $«RATE_PER_METRE».  If the area of the Land exceeds «MAXIMUM_AREA», this offer terminates unless we agree with you in writing to proceed with the issuance of the «DB_TENURE_TYPE».','Use when the client pays for survey.','OFFER SURVEY',true,NULL,'LOMILLER','2023-06-02 15:57:07.279427','2023-07-20 19:12:59.172236',4);
INSERT INTO public.nfr_provision ("type",provision_name,free_text,help_text,category,active_flag,create_userid,update_userid,create_timestamp,update_timestamp,"provisionGroupId") VALUES
	 ('O','SURVEY DEPOSIT REQUIRED','You must, by «DEADLINE_SURVEY_DEPOSIT», pay to us a deposit of $«DEPOSIT_AMOUNT_SURVEY» (which, if the «DB_TENURE_TYPE» is issued, will be credited against the amounts set out below that you are required to pay).  

If you choose not to proceed with the «DB_TENURE_TYPE» after the survey has been started, the deposit will be forfeited to the Province as liquidated damages.  Please make your cheque or money order payable to the Minister of Finance and deliver it to «DB_ADDRESS_LINE_REGIONAL_OFFICE».','Use to require payment of a deposit where Province is to pay for a survey.','OFFER SURVEY',true,NULL,'BSALL','2023-06-02 15:57:07.364365','2023-06-27 20:35:35.371359',4),
	 ('O','DELIVER SECURITY DEPOSIT & SURVEY DEPOSIT','In addition to the deposit referred to in the “Survey” portion of this letter, you must deliver to us a security deposit in the amount of $«SECURITY_AMOUNT» to guarantee the performance of your obligations under the «DB_TENURE_TYPE».  Please see attached information regarding acceptable types of security.','Use this where 2 deposits are to be delivered: one for the survey and another for clean-up under the terms of the tenure to be issued','OFFER - SECURITY',true,NULL,'BSALL','2023-06-02 15:57:07.364365','2023-06-30 15:22:22.442357',8);

-- nfr_provision_variable
INSERT INTO public.nfr_provision_variable (variable_name,variable_value,help_text,create_userid,update_userid,create_timestamp,update_timestamp,"provisionId") VALUES
	 ('DATE_OF_NOTICE','','Date of letter: Month Day ,Year',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-02 15:57:07.279427',1),
	 ('DEADLINE_COMPLETION_REQUIREMENTS','','Enter the date (month day, year) for completion of requirements',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-02 15:57:07.279427',1),
	 ('FACSIMILE_NUMBER','','Type in your facsimile number - "250 ___-____"',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-02 15:57:07.279427',1),
	 ('PURPOSE_GENERIC','','used for "_________" purposes.',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-02 15:57:07.279427',1),
	 ('SALUTATION','','Dear "______":  Type in the person’’s name or Sir or Madam.',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-02 15:57:07.279427',1),
	 ('TELEPHONE_NUMBER','','Type in your telephone number - "250 ___-____"',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-02 15:57:07.279427',1),
	 ('SECURITY_AMOUNT','','#.## to post as security - indicate an amount even if blanket bond applies. Put in Decimal.',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-02 15:57:07.279427',7),
	 ('COAST_GUARD_ADDRESS','','Type in the address of the Canadian Coast Guard office.',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-02 15:57:07.279427',22),
	 ('DATE_OF_NOTICE','','Date of letter: Month Day ,Year',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-02 15:57:07.279427',23),
	 ('DEADLINE_COMPLETION_REQUIREMENTS','','Enter the date (month day, year) for completion of requirements',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-02 15:57:07.279427',23);
INSERT INTO public.nfr_provision_variable (variable_name,variable_value,help_text,create_userid,update_userid,create_timestamp,update_timestamp,"provisionId") VALUES
	 ('FACSIMILE_NUMBER','','Type in your facsimile number - "250 ___-____"',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-02 15:57:07.279427',23),
	 ('PURPOSE_GENERIC','','used for "_________" purposes.',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-02 15:57:07.279427',23),
	 ('SALUTATION','','Dear "______":  Type in the person’’s name or Sir or Madam.',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-02 15:57:07.279427',23),
	 ('TELEPHONE_NUMBER','','Type in your telephone number - "250 ___-____"',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-02 15:57:07.279427',23),
	 ('DATE_OF_NOTICE','','Date of letter: Month Day ,Year',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-02 15:57:07.279427',41),
	 ('DEADLINE_COMPLETION_REQUIREMENTS','','Enter the date (month day, year) for completion of requirements',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-02 15:57:07.279427',41),
	 ('FACSIMILE_NUMBER','','Type in your facsimile number - "250 ___-____"',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-02 15:57:07.279427',41),
	 ('PURPOSE_GENERIC','','used for "_________" purposes.',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-02 15:57:07.279427',41),
	 ('CLIENT_FILE_NO','','Your file:  "______"',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-13 21:20:25.383347',1),
	 ('NUMBER_OF_COPIES','','type the number (two) of how many copies of the tenure documents are being forwarded to client to sign. ',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-13 21:26:39.628364',23);
INSERT INTO public.nfr_provision_variable (variable_name,variable_value,help_text,create_userid,update_userid,create_timestamp,update_timestamp,"provisionId") VALUES
	 ('NUMBER_OF_COPIES','','type the number (two) of how many copies of the tenure documents are being forwarded to client to sign. ',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-13 21:25:44.257358',1),
	 ('ATTENTION_LINE','','Attention: "______"',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-13 21:26:50.872419',23),
	 ('CLIENT_FILE_NO','','Your file:  "______"',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-13 21:27:04.425352',23),
	 ('ATTENTION_LINE','','Attention: "______"',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-13 21:28:04.897347',41),
	 ('CLIENT_FILE_NO','','Your file:  "______" ',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-13 21:28:12.654356',41),
	 ('NUMBER_OF_COPIES','','type the number (two) of how many copies of the tenure documents are being forwarded to client to sign. ',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-13 21:28:32.644364',41),
	 ('FEE_DOCUMENTATION_AMOUNT','','EG: "1000.00" (no comma, and use decimals)',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-20 19:47:18.08737',2),
	 ('FEE_OCCUPATIONAL_RENTAL_AMOUNT','','EG: "1000.00" (no comma, and use decimals)',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-20 19:47:36.347441',2),
	 ('BLANKET_BOND_NAME','','enter details of blanket security',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-22 17:16:22.131377',8),
	 ('FEE_APPLICATION_AMOUNT','','EG: "1000.00" (no comma, and use decimals)',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-20 19:47:25.315439',2);
INSERT INTO public.nfr_provision_variable (variable_name,variable_value,help_text,create_userid,update_userid,create_timestamp,update_timestamp,"provisionId") VALUES
	 ('WHY_LAND_DIFFERS','','The Land differs from what you applied for because "____". Explain why area is different.',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-13 21:36:29.985325',4),
	 ('REPLACEMENT_TENURE_TYPE','','Specify type and tenure number which is being replaced e.g. Lease No. 999999.',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-16 20:36:04.20696',3),
	 ('FEE_OTHER_CREDIT_AMOUNT','','EG: "1000.00" (no comma, and use decimals)',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-20 19:47:45.891637',2),
	 ('SALUTATION','','Dear "______":  Type in the person’’s name or Sir or Madam.',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-02 15:57:07.279427',41),
	 ('TELEPHONE_NUMBER','','Type in your telephone number - "250 ___-____"',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-02 15:57:07.279427',41),
	 ('RATE_PER_METRE','','$"#.## per square metre/per hectare"  Put in the decimal.',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-02 15:57:07.279427',46),
	 ('DEPOSIT_AMOUNT_SURVEY','','$"#.##" Enter amount of survey deposit.  Put in the decimal.',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-02 15:57:07.279427',47),
	 ('DATE_OF_NOTICE','','Date of letter: Month Day ,Year',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-02 15:57:07.279427',66),
	 ('DEADLINE_COMPLETION_REQUIREMENTS','','Enter the date (month day, year) for completion of requirements',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-02 15:57:07.279427',66),
	 ('FACSIMILE_NUMBER','','Type in your facsimile number - "250 ___-____"',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-02 15:57:07.279427',66);
INSERT INTO public.nfr_provision_variable (variable_name,variable_value,help_text,create_userid,update_userid,create_timestamp,update_timestamp,"provisionId") VALUES
	 ('INTERIM_TENURE_TYPE','','Insert the type of tenure now being used. e.g. Licence.',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-02 15:57:07.279427',66),
	 ('PURPOSE_GENERIC','','used for "_________" purposes.',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-02 15:57:07.279427',66),
	 ('SALUTATION','','Dear "______":  Type in the person’’s name or Sir or Madam.',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-02 15:57:07.279427',66),
	 ('TELEPHONE_NUMBER','','Type in your telephone number - "250 ___-____"',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-02 15:57:07.279427',66),
	 ('DEADLINE_SURVEY_DEPOSIT','','Deadline to pay survey deposit. Enter Month, Day, Year',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-02 15:57:07.279427',72),
	 ('DEPOSIT_AMOUNT_SURVEY','','$"#.##" Enter amount of survey deposit.  Put in the decimal.',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-02 15:57:07.279427',72),
	 ('DEADLINE_CONFIRM_SURVEY','','Enter "On or before [date]" OR "Within [45] days from the date of this letter".  Capitalize first character as this is the start of a sentence.',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-02 15:57:07.279427',73),
	 ('SECURITY_AMOUNT','','#.## to post as security - indicate an amount even if blanket bond applies. Put in Decimal.',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-02 15:57:07.279427',76),
	 ('ATTENTION_LINE','','Attention: "______" ',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-13 21:28:50.005304',66),
	 ('CLIENT_FILE_NO','','Your file:  "______" ',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-13 21:28:57.756376',66);
INSERT INTO public.nfr_provision_variable (variable_name,variable_value,help_text,create_userid,update_userid,create_timestamp,update_timestamp,"provisionId") VALUES
	 ('NUMBER_OF_COPIES','','type the number (two) of how many copies of the tenure documents are being forwarded to client to sign. ',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-13 21:29:17.789098',66),
	 ('MAXIMUM_AREA_SURVEY_DEPOSIT_DELAYED','','Enter the number of hectares. EG. "0.5 hectares"',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-23 20:26:40.639362',47),
	 ('MAXIMUM_AREA','','Enter the number of hectares. EG. "0.5 hectares"',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-23 18:33:30.847392',46),
	 ('DEADLINE_CONFIRM_SURVEY','','Enter: "On or before [date]"  this date is when the survey plan must be submitted to the SGs office',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-20 18:00:21.374354',46),
	 ('DEADLINE_SURVEY_DEPOSIT','','Deadline to pay survey deposit. Enter [date]',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-23 20:11:04.128362',47),
	 ('DEADLINE_COMPLETE_SURVEY','','Enter: [date] the survey must be completed by',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-21 15:43:07.536357',46),
	 ('RATE_PER_METRE_SURVEY_DEPOSIT_DELAYED','','$"#.## per square metre/per hectare"  Put in the decimal.',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-15 17:41:36.463885',47),
	 ('INTERIM_TENURE_TYPE','','(Blanket Security) Insert the type of tenure now being used. e.g. Licence.',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-22 17:24:43.417375',77),
	 ('INTERIM_TENURE_TYPE','','(Security) Insert the type of tenure now being used. e.g. Licence.',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-22 17:25:02.184734',76),
	 ('BLANKET_BOND_NAME','','enter details of blanket security',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-22 17:16:03.192347',77);
INSERT INTO public.nfr_provision_variable (variable_name,variable_value,help_text,create_userid,update_userid,create_timestamp,update_timestamp,"provisionId") VALUES
	 ('FACSIMILE_NUMBER','','Type in your facsimile number - "250 ___-____"',NULL,NULL,'2023-06-02 15:57:07.364365','2023-06-02 15:57:07.364365',90),
	 ('PURPOSE_GENERIC','','used for "_________" purposes.',NULL,NULL,'2023-06-02 15:57:07.364365','2023-06-02 15:57:07.364365',90),
	 ('RATE_PER_METRE','','$"#.## per square metre/per hectare"  Put in the decimal.',NULL,NULL,'2023-06-02 15:57:07.364365','2023-06-02 15:57:07.364365',90),
	 ('SALUTATION','','Dear "______":  Type in the person’’s name or Sir or Madam.',NULL,NULL,'2023-06-02 15:57:07.364365','2023-06-02 15:57:07.364365',90),
	 ('TELEPHONE_NUMBER','','Type in your telephone number - "250 ___-____"',NULL,NULL,'2023-06-02 15:57:07.364365','2023-06-02 15:57:07.364365',90),
	 ('FEE_APPLICATION_AMOUNT','','$"#.##" payable. Fill in either amount, or "0" if nothing payable for this category of fee. Put in decimals.',NULL,NULL,'2023-06-02 15:57:07.364365','2023-06-02 15:57:07.364365',91),
	 ('FEE_OCCUPATIONAL_RENTAL_AMOUNT','','$"#.##" payable. Fill in either amount, or "0" if nothing payable for this category of fee. Put in decimals.',NULL,NULL,'2023-06-02 15:57:07.364365','2023-06-02 15:57:07.364365',91),
	 ('FEE_OTHER_CREDIT_AMOUNT','','$"#.##" payable. Fill in either amount, or "0" if nothing payable for this category of fee. Put in decimals.',NULL,NULL,'2023-06-02 15:57:07.364365','2023-06-02 15:57:07.364365',91),
	 ('DEADLINE_SURVEY_DEPOSIT','','Deadline to pay survey deposit. Enter Month, Day, Year',NULL,NULL,'2023-06-02 15:57:07.364365','2023-06-02 15:57:07.364365',96),
	 ('DEPOSIT_AMOUNT_SURVEY','','$"#.##" Enter amount of survey deposit.  Put in the decimal.',NULL,NULL,'2023-06-02 15:57:07.364365','2023-06-02 15:57:07.364365',96);
INSERT INTO public.nfr_provision_variable (variable_name,variable_value,help_text,create_userid,update_userid,create_timestamp,update_timestamp,"provisionId") VALUES
	 ('SECURITY_AMOUNT','','#.## to post as security - indicate an amount even if blanket bond applies. Put in Decimal.',NULL,NULL,'2023-06-02 15:57:07.364365','2023-06-02 15:57:07.364365',101),
	 ('LOCAL_GOVERNMENT','','Type in the name of the local government.',NULL,NULL,'2023-06-02 15:57:07.364365','2023-06-02 15:57:07.364365',110),
	 ('TAX_COLLECTOR_OFFICE','','Type in the address of the local Provincial Tax Collector’’s office.',NULL,NULL,'2023-06-02 15:57:07.364365','2023-06-02 15:57:07.364365',112),
	 ('DOCUMENT_TO_OBTAIN','','You must obtain the [specify the name of the document(s)] and ....',NULL,NULL,'2023-06-02 15:57:07.364365','2023-06-02 15:57:07.364365',114),
	 ('PURPOSE_GENERIC_ZONING','','used for "_________" purposes.',NULL,NULL,'2023-06-02 15:57:07.364365','2023-06-13 18:06:54.115699',110),
	 ('ATTENTION_LINE','','Attention: "______" ',NULL,NULL,'2023-06-02 15:57:07.279427','2023-06-13 21:16:49.648451',1),
	 ('DAYS_TO_RETURN_DOCUMENTS','','Enter [# days]  "You must sign and return them to us within (# days) of our letter to you .....’’',NULL,NULL,'2023-06-02 15:57:07.364365','2023-06-21 15:56:28.489881',90),
	 ('CLIENT_FILE_NO','','Your file:  "______"',NULL,NULL,'2023-06-02 15:57:07.364365','2023-06-13 21:29:43.260364',90),
	 ('DATE_OF_NOTICE','','Date of letter: Month Day ,Year',NULL,NULL,'2023-06-02 15:57:07.364365','2023-06-13 21:30:06.91673',90),
	 ('NUMBER_OF_COPIES','','type the number (two) of how many copies of the tenure documents are being forwarded to client to sign. ',NULL,NULL,'2023-06-02 15:57:07.364365','2023-06-13 21:30:30.231347',90);
INSERT INTO public.nfr_provision_variable (variable_name,variable_value,help_text,create_userid,update_userid,create_timestamp,update_timestamp,"provisionId") VALUES
	 ('DEADLINE_CONFIRM_SURVEY','','Enter "On or before [date]" .. this is the date the surveyor must be hired by',NULL,NULL,'2023-06-02 15:57:07.364365','2023-06-14 22:18:37.124318',97),
	 ('PREAMBLE_FREE_FIELD','','Use when you want to enter additional information for the preamble','LOMILLER',NULL,'2023-06-26 17:30:55.159152','2023-06-26 17:31:31.493375',5),
	 ('ATTENTION_LINE','','Attention: "______"',NULL,NULL,'2023-06-02 15:57:07.364365','2023-06-16 21:02:12.755383',90),
	 ('INSURANCE_FREE_FIELD','','Use when you want to enter additional information for insurance.','LOMILLER',NULL,'2023-06-26 17:45:00.98355','2023-06-26 18:38:56.168009',12),
	 ('DEADLINE_COMPLETION_REQUIREMENTS','','Enter the date (month day, year) for completion of requirements for the NFR',NULL,NULL,'2023-06-02 15:57:07.364365','2023-06-20 17:48:10.48195',90),
	 ('MAXIMUM_AREA','','Enter: "# hectares"',NULL,NULL,'2023-06-02 15:57:07.364365','2023-06-20 18:01:49.180358',90),
	 ('OCC_RENT_DETAILS','','Occupational Rental is payable for your occupation of the Land for the period from "___". ',NULL,NULL,'2023-06-02 15:57:07.364365','2023-06-20 23:08:37.630361',99),
	 ('ADDITIONAL_REQUIREMENTS_FREE_FIELD','','Use where you want to state additional conditions of the offer.','LOMILLER',NULL,'2023-06-26 17:48:35.340383','2023-06-26 18:39:33.478342',107),
	 ('DEADLINE_COMPLETE_SURVEY','','Enter the date (month day, year) the plan must be submitted to the SG''s office',NULL,NULL,'2023-06-02 15:57:07.364365','2023-06-21 15:50:26.530352',97),
	 ('DAYS_TO_DELIVER_DOCUMENTS','','Enter [# days] .. "We will forward the documents to you within # days of the survey being completed.....’’',NULL,NULL,'2023-06-02 15:57:07.364365','2023-06-21 15:55:14.497797',90);
INSERT INTO public.nfr_provision_variable (variable_name,variable_value,help_text,create_userid,update_userid,create_timestamp,update_timestamp,"provisionId") VALUES
	 ('INTERIM_TENURE_TYPE','','(Insurance Other) Insert the type of tenure now being used. e.g. Licence.','BSALL',NULL,'2023-06-15 18:18:50.859363','2023-06-22 17:23:27.119879',30),
	 ('INTERIM_TENURE_TYPE','','(Insurance Certificate) Insert the type of tenure now being used. e.g. Licence.','BSALL',NULL,'2023-06-15 18:15:43.795116','2023-06-22 17:24:10.979754',79),
	 ('SECURITY_FREE_FIELD','','Use where you need to add information regarding security.','LOMILLER',NULL,'2023-06-23 21:00:33.78888','2023-06-23 21:00:33.78888',9),
	 ('DEADLINE_TO_DELIVER','','(Obtain and Deliver) Enter "on or before [date]" OR "within [45] days from the date of this letter.',NULL,NULL,'2023-06-02 15:57:07.364365','2023-06-27 22:08:08.797474',114);

-- nfr_provision_variant
INSERT INTO public.nfr_provision_variant (variant_name) VALUES
	 ('NOTICE OF FINAL REVIEW'),
	 ('NOTICE OF FINAL REVIEW (DELAYED)'),
	 ('NOTICE OF FINAL REVIEW (NO FEES)'),
	 ('NOTICE OF FINAL REVIEW (SURVEY REQUIRED)'),
	 ('NOTICE OF FINAL REVIEW (TO OBTAIN SURVEY)');

-- nfr_provision_provision_variant_nfr_provision_variant
INSERT INTO public.nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId","nfrProvisionVariantId") VALUES
	 (1,1),
	 (2,1),
	 (3,1),
	 (4,1),
	 (5,1),
	 (114,1),
	 (7,1),
	 (8,1),
	 (9,1),
	 (10,1);
INSERT INTO public.nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId","nfrProvisionVariantId") VALUES
	 (11,1),
	 (12,1),
	 (114,2),
	 (114,3),
	 (114,5),
	 (110,2),
	 (22,2),
	 (22,3),
	 (22,4),
	 (21,1);
INSERT INTO public.nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId","nfrProvisionVariantId") VALUES
	 (22,1),
	 (23,3),
	 (22,5),
	 (21,2),
	 (21,3),
	 (21,4),
	 (21,5),
	 (48,4),
	 (71,4),
	 (101,2);
INSERT INTO public.nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId","nfrProvisionVariantId") VALUES
	 (77,5),
	 (79,5),
	 (30,5),
	 (91,4),
	 (96,5),
	 (101,5),
	 (41,2),
	 (46,2),
	 (47,2),
	 (48,2);
INSERT INTO public.nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId","nfrProvisionVariantId") VALUES
	 (49,2),
	 (50,2),
	 (66,5),
	 (71,5),
	 (73,5),
	 (74,5),
	 (76,5),
	 (90,4),
	 (96,4),
	 (97,4);
INSERT INTO public.nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId","nfrProvisionVariantId") VALUES
	 (99,4),
	 (101,4),
	 (107,4),
	 (109,4),
	 (110,4),
	 (111,4),
	 (112,4),
	 (113,4),
	 (114,4),
	 (4,2);
INSERT INTO public.nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId","nfrProvisionVariantId") VALUES
	 (4,3),
	 (4,4),
	 (4,5),
	 (3,2),
	 (3,3),
	 (3,4),
	 (3,5),
	 (2,2),
	 (2,5),
	 (10,2);
INSERT INTO public.nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId","nfrProvisionVariantId") VALUES
	 (10,3),
	 (10,4),
	 (11,2),
	 (11,3),
	 (11,4),
	 (12,2),
	 (12,3),
	 (12,4),
	 (12,5),
	 (5,2);
INSERT INTO public.nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId","nfrProvisionVariantId") VALUES
	 (5,3),
	 (5,4),
	 (5,5),
	 (99,1),
	 (99,2),
	 (99,5),
	 (7,3),
	 (7,2),
	 (7,4),
	 (8,3);
INSERT INTO public.nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId","nfrProvisionVariantId") VALUES
	 (8,2),
	 (8,4),
	 (9,3),
	 (9,2),
	 (9,5),
	 (9,4),
	 (107,1),
	 (107,2),
	 (107,3),
	 (107,5);
INSERT INTO public.nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId","nfrProvisionVariantId") VALUES
	 (109,1),
	 (109,2),
	 (109,3),
	 (109,5),
	 (110,1),
	 (110,3),
	 (110,5),
	 (111,1),
	 (111,2),
	 (111,3);
INSERT INTO public.nfr_provision_provision_variant_nfr_provision_variant ("nfrProvisionId","nfrProvisionVariantId") VALUES
	 (111,5),
	 (112,1),
	 (112,2),
	 (112,3),
	 (112,5),
	 (113,1),
	 (113,2),
	 (113,3),
	 (113,5);

ALTER TABLE public.nfr_provision_group ENABLE TRIGGER ALL;
ALTER TABLE public.nfr_provision ENABLE TRIGGER ALL;
ALTER TABLE public.nfr_provision_variable ENABLE TRIGGER ALL;
ALTER TABLE public.nfr_provision_variant ENABLE TRIGGER ALL;
ALTER TABLE public.nfr_provision_provision_variant_nfr_provision_variant ENABLE TRIGGER ALL;

COMMIT;