INSERT INTO public.provision (id,provision_name,free_text,help_text,category,active_flag,is_deleted,create_userid,update_userid,create_timestamp,update_timestamp) VALUES
	 (30,'INSURANCE REQUIRED - NFR OBTAIN SURVEY- OTHER','You must at your expense, effect and keep in force insurance as described in the enclosed «INTERIM_TENURE_TYPE».','Use when insurance is required on the interim tenure and may be covered under homeowners insurance etc.','OFFER - INSURANCE',true,false,NULL,'BSALL','2023-06-02 15:57:07.279427','2023-06-22 16:38:55.979829'),
	 (21,'ADDITIONAL REQUIREMENTS - FISHERIES AND OCEANS APPROVAL','You must deliver to us a copy of a permit issued by the Federal Department of Fisheries and Oceans in respect of your proposed use of the Land for aquaculture purposes.','Use to require delivery of a copy of a permit from Fisheries and Oceans for aquaculture purposes.','ADDITIONAL REQUIREMENTS',true,false,NULL,'BSALL','2023-06-02 15:57:07.279427','2023-06-15 14:46:47.992471'),
	 (5,'FREE FIELD - PREAMBLE INFORMATION','«PREAMBLE_FREE_FIELD»','Use when you want to enter additional information for the preamble','OFFER PREAMBLE',true,false,NULL,'LOMILLER','2023-06-02 15:57:07.279427','2023-06-26 17:42:07.859382'),
	 (23,'TEMPLATE VARIABLES - NFR - NO FEES','','Nominal rent tenures e.g. for community purposes being issued.  Do not use for Crown Grants.  No additional fees are being requested.','DOCUMENT TYPE',true,false,NULL,'BSALL','2023-06-02 15:57:07.279427','2023-06-15 17:46:18.385388'),
	 (12,'FREE FIELD FOR INSURANCE','«INSURANCE_FREE_FIELD»','Use when you want to enter additional information for insurance.','OFFER - INSURANCE',true,false,NULL,'LOMILLER','2023-06-02 15:57:07.279427','2023-06-26 18:38:59.492308'),
	 (2,'FEES','','Use this to create a table listing all the fees to be paid. Table is unprotected, will be able to modify text ','FEES',true,false,NULL,'BSALL','2023-06-02 15:57:07.279427','2023-06-22 16:23:44.53137'),
	 (7,'DELIVER SECURITY DEPOSIT','You must deliver to us a security deposit in the amount of $«SECURITY_AMOUNT» to guarantee the performance of your obligations under the «DB_TENURE_TYPE».  Please see attached information regarding acceptable types of security.','Use this to require delivery of security deposit','OFFER - SECURITY',true,false,NULL,'LOMILLER','2023-06-02 15:57:07.279427','2023-06-21 21:41:03.491356'),
	 (1,'TEMPLATE VARIABLES - NOTICE OF FINAL REVIEW','','majority of the new tenures and replacement tenures when survey is not required. Do not use for Crown Grants or when no additional fees are requested such as Nominal Rent tenures.','DOCUMENT TYPE',true,false,NULL,'BSALL','2023-06-02 15:57:07.279427','2023-06-13 21:16:55.658566'),
	 (9,'FREE FIELD FOR SECURITY SECTION','«SECURITY_FREE_FIELD»','Use where you need to add information regarding security','OFFER - SECURITY',true,false,NULL,'LOMILLER','2023-06-02 15:57:07.279427','2023-06-26 17:44:08.717371'),
	 (48,'BOUNDARY SURVEY PLAN - CLIENT PAYS','In preparing the boundary survey the surveyor is also to indicate on the plan the location, type and dimensions of all existing improvements on the Land.','Use when "as built" survey of existing improvements is required.','OFFER SURVEY',true,false,NULL,'BSALL','2023-06-02 15:57:07.279427','2023-06-27 14:57:22.134285');
INSERT INTO public.provision (id,provision_name,free_text,help_text,category,active_flag,is_deleted,create_userid,update_userid,create_timestamp,update_timestamp) VALUES
	 (49,'MONIES PAYABLE - NFR DELAYED','You must deliver to us the following amounts:','Use when you are providing a firm amount payable.','OFFER SURVEY',true,false,NULL,'LOMILLER','2023-06-02 15:57:07.279427','2023-06-28 18:33:54.808381'),
	 (74,'LETTER AFFIRMING BOUNDARY SURVEY','This letter must confirm that in preparing the boundary survey the surveyor will also indicate on the plan the location, type and dimensions of all existing improvements on the Land.','Use to remind client that Surveyor’s letter must confirm that location of improvements will be on boundary plan','OFFER - OBTAIN SURVEY',true,false,NULL,'LOMILLER','2023-06-02 15:57:07.279427','2023-06-22 23:32:25.268378'),
	 (76,'DELIVER SECURITY DEPOSIT - OBTAIN SURVEY','You must deliver to us a security deposit in the amount of $«SECURITY_AMOUNT» to guarantee the performance of your obligations under the «INTERIM_TENURE_TYPE».  Please see attached information regarding acceptable types of security.','Use this when security is required for the interim tenure','OFFER - SECURITY',true,false,NULL,'BSALL','2023-06-02 15:57:07.279427','2023-06-22 16:44:32.291826'),
	 (73,'LETTER AFFIRMING BC LAND SURVEYOR WAS HIRED','«DEADLINE_CONFIRM_SURVEY» you must submit to us a letter from a British Columbia Land Surveyor confirming that you have hired the surveyor to prepare a boundary survey of the Land at your expense.','When client must provide us with a letter confirming Surveyor has been hired','OFFER - OBTAIN SURVEY',true,false,NULL,'LOMILLER','2023-06-02 15:57:07.279427','2023-06-22 23:32:10.132454'),
	 (113,'ADDITIONAL REQUIREMENTS - AFFILIATE STATUS CERTIFICATE','You must deliver to us a certificate of affiliate status, in the form attached, for each affiliate of your company which will be using the communication site.','Use when a certificate of affiliate status is required for each affiliate of your company using the communication site.','ADDITIONAL REQUIREMENTS',true,false,NULL,'BSALL','2023-06-02 15:57:07.364365','2023-06-22 16:45:03.795999'),
	 (107,'FREE FIELD - ADDITIONAL REQUIREMENTS','«ADDITIONAL_REQUIREMENTS_FREE_FIELD»','Use where you want to state additional conditions of the offer','ADDITIONAL REQUIREMENTS',true,false,NULL,'LOMILLER','2023-06-02 15:57:07.364365','2023-06-26 17:48:12.021686'),
	 (10,'INSURANCE REQUIRED - NFR - OTHER','You must at your expense, effect and keep in force insurance as described in the enclosed «DB_TENURE_TYPE».','Use when insurance is required and may be covered under homeowners insurance etc.','OFFER - INSURANCE',true,false,NULL,'LOMILLER','2023-06-02 15:57:07.279427','2023-11-17 16:33:13.628615'),
	 (3,'REPLACEMENT STATEMENT','This is to replace «REPLACEMENT_TENURE_TYPE».',' Use this when the tenure is being replaced ','OFFER PREAMBLE',true,false,NULL,'BSALL','2023-06-02 15:57:07.279427','2023-06-20 18:16:12.396934'),
	 (99,'OCCUPATIONAL RENT STATEMENT','Please note that Occupational Rental under section 96 of the Land Act is payable for your occupation of the Land for the period from <<OCC_RENT_DETAILS>>.','Use this when occupational rent is payable','OFFER - MONIES - PAYABLE',true,false,NULL,'LOMILLER','2023-06-02 15:57:07.364365','2023-06-21 23:52:11.226929'),
	 (109,'ADDITIONAL REQUIREMENTS - MANAGEMENT PLAN','You must submit to us a management plan that is acceptable to us for your proposed development of the Land.','Use to require delivery of a management plan.','ADDITIONAL REQUIREMENTS',true,false,NULL,'LOMILLER','2023-06-02 15:57:07.364365','2023-06-12 21:33:54.879335');
INSERT INTO public.provision (id,provision_name,free_text,help_text,category,active_flag,is_deleted,create_userid,update_userid,create_timestamp,update_timestamp) VALUES
	 (91,'FEES','','Use this to create a table listing all the fees to be paid. Table is unprotected, will be able to modify text ','FEES',true,false,NULL,'BSALL','2023-06-02 15:57:07.364365','2023-06-29 21:41:36.444092'),
	 (4,'LAND DIFFERS FROM STATEMENT','The Land differs from what you applied for because «WHY_LAND_DIFFERS».','Use when land being offered differs from the applied area','OFFER PREAMBLE',true,false,NULL,'BSALL','2023-06-02 15:57:07.279427','2023-06-20 18:16:44.295381'),
	 (41,'TEMPLATE VARIABLES - NFR - DELAYED','','Use when applicant requires assurance tenure will be issued once additional requirements are fulfilled. (eg zoning, reports)','DOCUMENT TYPE',true,false,NULL,'BSALL','2023-06-02 15:57:07.279427','2023-06-15 17:46:42.133675'),
	 (72,'SURVEY DEPOSIT','You must, by «DEADLINE_SURVEY_DEPOSIT», pay to us a deposit of $«DEPOSIT_AMOUNT_SURVEY» (which, if a tenure is issued to you following completion of survey, will be credited against the amounts owing for that tenure).  If you choose not to proceed with the survey after it has been started, the deposit will be forfeited to the Province as liquidated damages.  Please make your cheque or money order payable to the Minister of Finance and deliver it to «DB_ADDRESS_LINE_REGIONAL_OFFICE».','Use when we require a deposit from the client because the Province is paying for the survey','OFFER SURVEY',true,false,NULL,'BSALL','2023-06-02 15:57:07.279427','2023-06-27 20:36:16.969351'),
	 (50,'ESTIMATED MONIES PAYABLE - NFR - DELAYED','You must deliver to us the following amounts as set out below (estimated amounts are set out below).  The final amounts owing will be calculated when the survey is complete and the area of the Land has been established.  It will include the following items, some of which are subject to adjustment if the survey plan and area of the Land do not, in our opinion, conform to the attached sketch.','Use when you are providing an estimated amount payable.','OFFER SURVEY',true,false,NULL,'LOMILLER','2023-06-02 15:57:07.279427','2023-06-28 18:34:04.60236'),
	 (112,'ADDITIONAL REQUIREMENTS - TAX CLEARANCE CERTIFICATE','You must deliver to us a Tax Clearance Certificate, obtained from the Provincial Tax Collector’s office at «TAX_COLLECTOR_OFFICE», verifying that there are no arrears of taxes in connection with the Land.','Use when a tax clearance certificate is required verifying that there are no arrears of taxes.','ADDITIONAL REQUIREMENTS',true,false,NULL,'LOMILLER','2023-06-02 15:57:07.364365','2023-06-12 21:36:03.361001'),
	 (110,'ADDITIONAL REQUIREMENTS - ZONING APPROVAL','You must deliver to us written confirmation from «LOCAL_GOVERNMENT» stating that it has adopted a zoning bylaw permitting the Land to be used for «PURPOSE_GENERIC_ZONING» purposes.','Use to require confirmation that a zoning bylaw permitting use of the Land for the intended purposes has been adopted.','ADDITIONAL REQUIREMENTS',true,false,NULL,'LOMILLER','2023-06-02 15:57:07.364365','2023-06-13 18:13:04.140914'),
	 (114,'ADDITIONAL REQUIREMENTS - OBTAIN AND DELIVER','You must obtain the «DOCUMENT_TO_OBTAIN» and «DEADLINE_TO_DELIVER», deliver a copy of it to us.','Use when you require immediate delivery of documentation.','ADDITIONAL REQUIREMENTS',true,false,NULL,'BSALL','2023-06-02 15:57:07.364365','2023-06-13 21:01:39.704815'),
	 (22,'ADDITIONAL REQUIREMENTS - COAST GUARD APPROVAL','You must deliver to us a copy of a letter of approval from the Canadian Coast Guard under the Navigable Waters Protection Act for your proposed construction on the Land.  In this regard, please contact: Canadian Coast Guard, «COAST_GUARD_ADDRESS».','Use to require delivery of a letter of approval from the Canadian Coast Guard for the proposed construction.','ADDITIONAL REQUIREMENTS',true,false,NULL,'BSALL','2023-06-02 15:57:07.279427','2023-06-15 14:46:33.558354'),
	 (71,'BOUNDARY SURVEY PLAN - MINISTRY PAYS','A boundary survey of the Land will be undertaken by a British Columbia Land Surveyor hired by us.','Use when we will pay a Surveyor to prepare a boundary survey','OFFER PREAMBLE',true,false,NULL,'BSALL','2023-06-02 15:57:07.279427','2023-06-27 14:57:45.158502');
INSERT INTO public.provision (id,provision_name,free_text,help_text,category,active_flag,is_deleted,create_userid,update_userid,create_timestamp,update_timestamp) VALUES
	 (90,'TEMPLATE VARIABLES - NFR - SURVEY REQUIRED','','Survey of the Land/improvements is required prior to issuance of tenure. E.g. when its a decision to convert an existing Licence for a Lease or SRW.  Not to be used for Crown Grants.','DOCUMENT TYPE',true,false,NULL,'BSALL','2023-06-02 15:57:07.364365','2023-06-15 17:47:18.794212'),
	 (66,'TEMPLATE VARIABLES - NFR- TO OBTAIN SURVEY','','Interim tenure is being issued for survey purposes and/or initial activity. A subsequent tenure will be issued upon completion of the requirements set out in interim tenure.  Not to be used for Crown Grants.','DOCUMENT TYPE',true,false,NULL,'BSALL','2023-06-02 15:57:07.279427','2023-06-22 16:19:52.911188'),
	 (8,'BLANKET SECURITY STATEMENT','According to our records, you are currently covered by a blanket security agreement between the Province and «BLANKET_BOND_NAME».  As long as this agreement is in good standing and you continue to be covered by it, you are not required to post security for this «DB_TENURE_TYPE» unless and until you receive further notice from us.','Use this when client is covered by blanket security agreement','OFFER - SECURITY',true,false,NULL,'BSALL','2023-06-02 15:57:07.279427','2023-06-22 17:15:25.058373'),
	 (111,'ADDITIONAL REQUIREMENTS - IMPROVEMENTS STAT DEC','You must deliver to us a statutory declaration, in the form attached, stating that all improvements on the Land are either owned by you or have been constructed, erected or place on the Land by you. Please sign this declaration in front of a solicitor or notary public.','Use this when a statutory declaration is required regarding ownership of improvements.','ADDITIONAL REQUIREMENTS',true,false,NULL,'BSALL','2023-06-02 15:57:07.364365','2023-06-20 20:34:35.62335'),
	 (97,'SURVEY - CLIENT - PAYS','«DEADLINE_CONFIRM_SURVEY», you must retain a British Columbia Land Surveyor to prepare a boundary survey of the Land at your expense.  

The survey must be completed and the plan submitted to the Surveyor General on or before «DEADLINE_COMPLETE_SURVEY».  If the survey is not completed on or before that date, and that date is not otherwise extended in writing by us we are under no further obligation to issue a «DB_TENURE_TYPE» of the Land to you.','Use when client pays for survey','OFFER SURVEY',true,false,NULL,'LOMILLER','2023-06-02 15:57:07.364365','2023-06-21 21:39:34.632611'),
	 (11,'INSURANCE REQUIRED - NFR - CERTIFICATE REQUIRED','You must deliver to us the attached Province of British Columbia Certificate of Insurance, signed by your insurance agent, for the insurance required to be maintained under the «DB_TENURE_TYPE».  A sample certificate is enclosed.','Use when a Certificate of Insurance is required.','OFFER - INSURANCE',true,false,NULL,'BSALL','2023-06-02 15:57:07.279427','2023-06-22 16:41:47.327374'),
	 (79,'INSURANCE REQUIRED - NFR OBTAIN SURVEY - CERTIFICATE','You must deliver to us the attached Province of British Columbia Certificate of Insurance, signed by your insurance agent, for the insurance required to be maintained under the «INTERIM_TENURE_TYPE».  A sample certificate is enclosed.','Use when a Certificate of Insurance is required.','OFFER - INSURANCE',true,false,NULL,'BSALL','2023-06-02 15:57:07.364365','2023-06-22 16:41:32.284043'),
	 (47,'SURVEY - MINISTRY PAYS (DEPOSIT REQUIRED) -NFR DELAYED','A boundary survey of the Land will be undertaken by a British Columbia Land Surveyor hired by us.  

You must, by «DEADLINE_SURVEY_DEPOSIT», pay to us a deposit of $«DEPOSIT_AMOUNT_SURVEY» (which, if the «DB_TENURE_TYPE» is issued, will be credited against the amounts set out below that you are required to pay).  If you choose not to proceed with the «DB_TENURE_TYPE» after the survey has been started, the deposit will be forfeited to the Province as liquidated damages.  Please make your cheque or money order payable to the Minister of Finance and deliver it to «DB_ADDRESS_LINE_REGIONAL_OFFICE».

If the survey is completed in accordance with the requirements set out above, we will complete the «DB_TENURE_TYPE» documents by inserting the correct legal description for the Land and by inserting the required monies payable.  The monies payable are calculated on the basis of the area of the Land at a rate of $«RATE_PER_METRE_SURVEY_DEPOSIT_DELAYED».  If the area of the Land exceeds «MAXIMUM_AREA_SURVEY_DEPOSIT_DELAYED», this offer terminates unless we agree with you in writing to proceed with the issuance of the «DB_TENURE_TYPE».','Use to require payment of a deposit where Province is to pay for a survey.','OFFER SURVEY',true,false,NULL,'BSALL','2023-06-02 15:57:07.279427','2023-06-27 15:09:33.645396'),
	 (77,'BLANKET SECURITY - OBTAIN SURVEY','According to our records, you are currently covered by a blanket security agreement between the Province and «BLANKET_BOND_NAME».  As long as this agreement is in good standing and you continue to be covered by it, you are not required to post security for this «INTERIM_TENURE_TYPE» until you receive further notice from us.','Client has a blanket security - we are issuing interim tenure','OFFER - SECURITY',true,false,NULL,'BSALL','2023-06-02 15:57:07.279427','2023-06-22 16:58:36.242497'),
	 (46,'SURVEY - CLIENT PAYS - NFR DELAYED','«DEADLINE_CONFIRM_SURVEY», you must retain a British Columbia Land Surveyor to prepare a boundary survey of the Land at your expense.  

The survey must be completed, and the plan submitted to the Surveyor General on or before «DEADLINE_COMPLETE_SURVEY».  If the survey is not completed on or before that date, and that date is not otherwise extended in writing by us we are under no further obligation to issue a «DB_TENURE_TYPE» of the Land to you.

If the survey is completed in accordance with the requirements set out above, we will complete the «DB_TENURE_TYPE» documents by inserting the correct legal description for the Land and by inserting the required monies payable.  The monies payable are calculated on the basis of the area of the Land at a rate of $«RATE_PER_METRE».  If the area of the Land exceeds «MAXIMUM_AREA», this offer terminates unless we agree with you in writing to proceed with the issuance of the «DB_TENURE_TYPE».','Use when the client pays for survey.','OFFER SURVEY',true,false,NULL,'LOMILLER','2023-06-02 15:57:07.279427','2023-07-20 19:12:59.172236');
INSERT INTO public.provision (id,provision_name,free_text,help_text,category,active_flag,is_deleted,create_userid,update_userid,create_timestamp,update_timestamp) VALUES
	 (96,'SURVEY DEPOSIT REQUIRED','You must, by «DEADLINE_SURVEY_DEPOSIT», pay to us a deposit of $«DEPOSIT_AMOUNT_SURVEY» (which, if the «DB_TENURE_TYPE» is issued, will be credited against the amounts set out below that you are required to pay).  

If you choose not to proceed with the «DB_TENURE_TYPE» after the survey has been started, the deposit will be forfeited to the Province as liquidated damages.  Please make your cheque or money order payable to the Minister of Finance and deliver it to «DB_ADDRESS_LINE_REGIONAL_OFFICE».','Use to require payment of a deposit where Province is to pay for a survey.','OFFER SURVEY',true,false,NULL,'BSALL','2023-06-02 15:57:07.364365','2023-06-27 20:35:35.371359'),
	 (101,'DELIVER SECURITY DEPOSIT & SURVEY DEPOSIT','In addition to the deposit referred to in the "Survey" portion of this letter, you must deliver to us a security deposit in the amount of $«SECURITY_AMOUNT» to guarantee the performance of your obligations under the «DB_TENURE_TYPE».  Please see attached information regarding acceptable types of security.','Use this where 2 deposits are to be delivered: one for the survey and another for clean-up under the terms of the tenure to be issued','OFFER - SECURITY',true,false,NULL,'BSALL','2023-06-02 15:57:07.364365','2023-06-30 15:22:22.442357'),
	 (116,'ERIC TEST PROVISION 2','ERIC TEST FREE TEXT','This is a Test Provision for QA purposes','ERIC''S CATEGORY',true,false,'EANDERSO','EANDERSO','2024-04-23 16:01:24.839959','2024-04-23 16:04:06.079752'),
	 (115,'TEST ERIC PROVISION','TEST','','SAMPLE',false,true,'EANDERSO','EANDERSO','2024-04-22 19:27:14.990666','2024-04-23 16:05:10.827651'),
	 (117,'NEW ERIC PROVISION ADDED','Adding some free text','Some hel[ful text','A NEW ERIC CATEGORY',true,false,'EANDERSO','','2024-04-23 22:16:21.67488','2024-04-23 22:16:21.67488'),
	 (118,'ERIC EVEN NEWER PROVISION','Some newer free text','Some newer help text','SUPER DUPER CATEGORY',true,false,'EANDERSO','','2024-04-23 22:23:28.025206','2024-04-23 22:23:28.025206'),
	 (119,'NEW PROVISION WITH UNDERSCORE REMOVED','Free text more free text','Helpfully','NOT THE UNDERSCORE CATEGORY',true,true,'EANDERSO','EANDERSO','2024-04-23 22:24:40.861445','2024-04-23 22:40:24.298932');