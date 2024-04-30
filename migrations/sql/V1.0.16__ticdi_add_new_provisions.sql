-- aapl provs
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (250, 'Template Variables - Assignment/Assumption', '', '', '', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (251, 'Preamble Assignment - Standard', 'The Assignor and the Province entered into a «TENURE_TO_BE_ASSIGNED» (herein called the “Document”) over those lands more particularly known and described as: 
        <UNPROTECT>

        <NO_NUMBER>«DB_LEGAL_DESCRIPTION»<\NO_NUMBER>', 'Select when no previously assignment or amendment.', 'Preamble', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (252, 'Preamble Assignment - Amended', 'The Assignor and the Province entered into a «TENURE_TO_BE_ASSIGNED», as amended by the agreement dated for reference «DATE_AMENDING_AGREEMENT» (herein collectively called the “Document”) over those lands more particularly known and described as:
     <UNPROTECT>

        <NO_NUMBER>«DB_LEGAL_DESCRIPTION»<\NO_NUMBER>', ' Select when tenure has been previously amended.', 'Preamble', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (253, 'Preamble Assignment - Schedule Of History Of Amendments', 'The Assignor and the Province entered into tenure agreements, and all of the amendments to each of them, (herein called collectively the “Document”) as dated and described in the attached Schedule called “History of Amendments”.', 'Select when there have been many previous amendments to and transfers of the tenure and you want to list them on a Schedule. Select the provision called "Schedule of History of Amendments" and list them.', 'Preamble', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (254, 'Preamble Assignment - Assigned', '«NAME_ORIGINAL_PARTY» and the Province entered into a «TENURE_ORIGINAL», which was subsequently assigned to the Assignor on «DATE_ASSIGNMENT» (herein called the “Document”) over those lands more particularly known and described as: 
        <UNPROTECT>

        <NO_NUMBER>«DB_LEGAL_DESCRIPTION»<\NO_NUMBER>', 'Select when tenure has previously been assigned to the Assignor.', 'Preamble', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (255, 'Preamble Assignment - Assigned Amended', '«NAME_ORIGINAL_PARTY» and the Province entered into a «TENURE_ORIGINAL», which was subsequently assigned to the Assignor on «DATE_ASSIGNMENT» and amended by the agreement dated for reference «DATE_AMENDING_AGREEMENT» (herein called the “Document”) over those lands more particularly known and described as: 
        <UNPROTECT>

        <NO_NUMBER>«DB_LEGAL_DESCRIPTION»<\NO_NUMBER>', 'Select when the tenure has previously been assigned to assignor and amended.', 'Preamble', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (256, 'Preamble Assignment - Free Field', '', 'Use to elaborate preamble', 'Preamble', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (257, 'Warranties Assignment - Individual', 'is a Canadian citizen, permanent resident of Canada or the owner of the upland adjacent to the Land which is the subject of the Document; and

is nineteen (19) years of age or older.', 'Select when assignment is to an individual.', 'Warranties and Rep.', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (258, 'Warranties Assignment - Corp', 'is a corporation duly formed under laws of the Province of British Columbia and has filed all necessary documents under such laws and has complied with all requirements of the Business Corporations Act;

has the power, capacity and authority to enter into this agreement and to carry out its obligations contemplated herein, all of which have been duly and validly authorized by all necessary proceedings; and

is in good standing with respect to the filing of returns in the Office of the Registrar of Companies of British Columbia.', 'Select when assignment is to a corporation.', 'Warranties and Rep.', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (259, 'Warranties Assignment - Society', 'is incorporated or registered under the Society Act and has legal capacity to acquire land.', 'Select when assignment is to a society.', 'Warranties and Rep.', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (260, 'Warranties Assignment - District', 'is a district or municipality incorporated under the Local Government Act and has the legal capacity to acquire land.', 'Select when assignment is to a municipality.', 'Warranties and Rep.', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (261, 'Warranties Assignment - Assignee Unknown', 'if an individual,
is a Canadian citizen, permanent resident of Canada or the owner of the upland adjacent to the Land which is the subject of the Document; and
is nineteen (19) years of age or older;
<NO_NUMBER>OR<\NO_NUMBER>
if a corporation
is a corporation duly formed under laws of the Province of British Columbia and has filed all necessary documents under such laws and has complied with all requirements of the Business Corporations Act;
has the power, capacity and authority to enter into this agreement and to carry out its obligations contemplated herein, all of which have been duly and validly authorized by all necessary proceedings; and
 is in good standing with respect to the filing of returns in the Office of the Registrar of Companies of British Columbia.
<NO_NUMBER>OR<\NO_NUMBER>
if a society, is incorporated or registered under the Society Act and has legal capacity to acquire land.
<NO_NUMBER>OR<\NO_NUMBER>
if a district or municipality, is a district or municipality incorporated under the Local Government Act and has the legal capacity to acquire land.', 'Use when Assignor requests an assignment package. Leave blank spaces for assignee details; Assignor fills them in and returns it signed by Assignor and Assignee.', 'Warranties and Rep.', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (262, 'Warranties Assignment - Westbank First Nation', 'is the Westbank First Nation under the Westbank First Nation Self Government Act and has the legal capacity to acquire land.', 'Select when assignment is to West Bank First Nation', 'Warranties and Rep.', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (263, 'Free Field - Warranties Assignment', '', 'Free field for additional eligibility declaration', 'Warranties and Rep.', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (264, 'Queens Representative Signing Block', 'SIGNED on behalf of HIS MAJESTY
THE KING IN RIGHT OF THE
PROVINCE OF BRITISH COLUMBIA
by the minister responsible for the Land Act
or the minister''s authorized representative



	
Minister responsible for the Land Act
or the minister''s authorized representative', '', 'Signing Blocks', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (265, 'Assignor Signing Block - Individual', 'SIGNED BY
«DB_NAME_TENANT»



	
Assignor', '', 'Signing Blocks', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (266, 'Assignor Signing Block - Corporation', 'SIGNED BY
«DB_NAME_CORPORATION»


	
Assignor', '', 'Signing Blocks', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (267, 'Assignee Signing Block', 'SIGNED BY
(Type Assignee’s Name Here)



	
Assignee', '', 'Signing Blocks', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (268, 'Assignee Signing Block - 2', 'SIGNED BY
(Type Assignee’s Name Here)



	
Assignee', '', 'Signing Blocks', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (269, 'Individual Client(S) Signing Block', 'SIGNED BY
«DB_NAME_TENANT»


	', 'This signing block can be modified on your generated document.', 'Signing Blocks', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (270, 'Corporation - Society Signing Block', 'SIGNED on behalf of «DB_NAME_CORPORATION»
by a duly authorized signatory


	
Authorized Signatory', 'This signing block can be modified on your generated document.', 'Signing Blocks', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (271, 'Municipal Signing Block', 'SIGNED on behalf of «DB_NAME_CORPORATION»
By its authorized signatories 


		
Authorized Signatory


_		
Authorized Signatory', 'This signing block can be modified on your generated document.', 'Signing Blocks', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (272, 'Partnership Signing Block', 'SIGNED on behalf of 	
by its general partner	


BY: 	

BY: 	', 'This signing block can be modified on your generated document.', 'Signing Blocks', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (273, 'Bc Hydro - Licenses Signing Block', 'SIGNED by a duly authorized
signatory of BRITISH COLUMBIA
HYDRO AND POWER AUTHORITY


	
Authorized Signatory', 'This signing block can be modified on your generated document.', 'Signing Blocks', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (274, 'Telus Signing Block', 'SIGNED by a duly authorized signatory 
of Telus Communications Inc. by its 
authorized signatory:


	
Rights of Way Manager
Telus Communications Inc.', 'This signing block can be modified on your generated document.', 'Signing Blocks', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (275, 'Schedule Of History Of Amendments', '
<UNPROTECT>
HISTORY OF AMENDMENTS', 'Select when you select "Preamble Assignment - Schedule of History of Amendments"', 'Schedules', TRUE, FALSE, 'system', 'system', NOW(), NOW());

-- slpl provs
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (276, 'TEMPLATE STANDARD LICENCE', '', '', '', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (277, 'LAND DEFINITION-SCHEDULE REQUIRED', '“Land” means that part or those parts of the Crown land either described in, or shown outlined by bold line on, the schedule attached to this Agreement entitled “Legal Description Schedule” except for those parts of the land that, on the Commencement Date, consist of highways (as defined in the Transportation Act);', 'Use where schedule is necessary and tenure is for dry land.', 'INTERPRETATION', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (278, 'AQUATIC LAND DEFINITION-SCHEDULE REQUIRED', '“Land” means that part or those parts of the Crown land either described in, or shown outlined by bold line on, the schedule attached to this Agreement entitled “Legal Description Schedule” except for those parts of the land that, on the Commencement Date, consist of highways (as defined in the Transportation Act) and land covered by water;', 'Use where schedule is necessary and tenure includes land covered by water.', 'INTERPRETATION', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (279, 'INTERIM LICENCE TO LEASE OR SROW', 'If you 

are not in default under this Agreement;

have delivered to us not later than 30 days prior to the expiration of this Agreement an appropriate legal survey for a «TENURE_TYPE» of the Land completed by a British Columbia Land Surveyor and, where applicable, confirmation that the legal survey has been deposited with the Land Title Survey Authority; and 

have paid to us the fees due under the Land Act for issuance of a «TENURE_TYPE»;

<NO_NUMBER>then we will grant to you a «TENURE_TYPE» over the Land described in the legal survey, substantially on the terms and conditions set out in the form used by us at the time the “«TENURE_TYPE»” is being offered. <\NO_NUMBER>

Our obligation to grant you a «TENURE_TYPE» under section 2.3 will cease if the form of «TENURE_TYPE» we deliver to you is not executed and returned to us within 60 days of the date of delivery.

If we determine that the area of the land comprised within or described by the legal survey referred to in section 2.3 is greater than the area of the Land, then the fee specified in Article 3 will be adjusted accordingly and you will pay the additional fee to us prior to issuance of the «TENURE_TYPE».
', 'Use when the licence you are issuing is to lead to a grant of a SRW or a Lease following completion of a boundary survey.', 'GRANT AND TERM', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (280, 'PREPAID LAND RENT', 'The Fee for the Term is $«FLAT_FEE», the receipt of which we acknowledge.', 'Use when there is a single up-front fee for the entire term - for licences and rights of way only.', 'FEES', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (281, 'ANNUAL LAND RENT', 'You will pay to us 

for the first year of the Term, Fees of $«FLAT_FEE», payable in advance on the Commencement Date; and

for each year during the remainder of the Term, the Fees either determined by us under section 3.2 or established under section 3.3, payable in advance on each anniversary of the Commencement Date.

We will, not later than 15 days before each anniversary of the Commencement Date during the Term, give written notice to you specifying in our sole discretion the Fees payable by you under subsection 3.1(b) for the subsequent year of the Term and we will establish such Fees in accordance with our policies applicable to your use of the Land under this Agreement.

If we do not give notice to you under section 3.2, the Fees payable by you under subsection 3.1(b) for the year for which notice was not given will be the same as the Fees payable by you for the preceding year of the Term.', 'Use when rent/fees are paid on an annual basis', 'FEES', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (282, 'ANNUAL RENT FOR MARINA', 'In this Article,

<NO_NUMBER>“Ancillary Marine Use” means boathouses, fuel docks, marina ways (portion submerged at mean high tide), launching ramps (portion submerged at high tide), boat sales dock, boat rentals dock and boat charters dock where they are below the mean water mark and not on fill;

“Land Value” means for the first five years of the Term the value for the Land established by us prior to the Commencement Date which value shall thereafter be subject to review by us prior to the sixth anniversary of the Commencement Date and thereafter at five year intervals during the remainder of the Term;

“Linear Footage of Moorage Space” means the linear footage of all moorage space within the Land, whether open or covered by a boathouse, together with the linear footage of all improvements used for an Ancillary Marine Use; 

“Month to Month Moorage Charge per Linear Footage” means: <\NO_NUMBER>
the standard monthly linear footage rate that you charge to your customers for the use of moorage space; or
if you do not have a standard monthly linear footage rate but charge on a prepaid annual linear footage basis, the annual rate will be converted to an equivalent monthly rate; or
if we determine that you charge a membership fee or any other charge which is not solely a linear footage charge, we may determine a month to month moorage charge per linear footage taking into consideration the rates charged by commercial marinas which charge on a linear footage basis that we may determine to be comparable having regard to location and other factors; 
<NO_NUMBER>

“Moorage Fee Discount” means the following: «MOORAGE_FEE_DISCOUNT»

“Non-Moorage Fee Discount” means the following: «NON_MOORAGE_FEE_DISCOUNT» 

“Potential Gross Income from Moorage” means for any particular year of the Term, the amount calculated as follows: A x B x C 
where:
A =	the amount of Linear Footage of Moorage Space on the Land;
B = 	the Month to Month Moorage Charge per Linear Footage; and 
C = 	the number of months the operation was open for business in that year; <\NO_NUMBER>

You will pay to us
	
for the first year of the Term, Fees of $«FLAT_FEE», payable in advance on the Commencement Date; and

for each year during the remainder of the Term on each anniversary of the Commencement Date you must pay Fees either determined by us under section 3.3 or established under section 3.4. 

We will, not later than 15 days before the anniversary of the Commencement Date during each year of the Term, give written notice to you of the Fees payable under section 3.2(b) as calculated in accordance with section 3.4, or notice specifying in our sole discretion the Fees payable by you under section 3.2(b), for the subsequent year of the Term and we will establish such Fees in accordance with our pricing policies applicable to your use of the Land under this Agreement.

Unless specified otherwise in the notice provided under section 3.3 or if no notice is provided under section 3.3, the Fees payable by you under section 3.2(b) for the year for which notice was not given will be the sum of A and B 

<NO_NUMBER>where: 

A = Percent as set by policy of the Potential Gross Income from Moorage for the previous year, less the Moorage Fee Discount, if any; and

B = Percent as set by policy of the Land Value, less the Non-Moorage Fee Discount, if any. <\NO_NUMBER>

You must no later than «DEADLINE_STAT_DEC_MARINA» days prior to the anniversary of the Commencement Date deliver to us a report or statutory declaration in a form acceptable to us, verifying the information necessary to calculate the Fees under section 3.4.

If you fail to deliver the Statutory Declaration referred to in section 3.5 to us before the deadline referred to in section 3.5 we may:

enter upon the Land and do such things as are necessary to determine the information required in section 3.5; and

based on the information determined under subsection (a) above, set the annual Fees, retroactive to the last anniversary date of the Commencement Date.', 'Use for marina and yacht club tenures', 'FEES', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (283, 'REQUEST FOR RECORDS', 'provide to us, within 30 days of receiving a request from us, all reports and records we may request from you concerning your activities under this Agreement and all other matters related to this Agreement;', 'Use for tenures which may require submission of proof of meeting requirements (e,g, remote residential, guided recreation)', 'OBLIGATIONS', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (284, 'PUBLIC FINANCIAL ACCOUNTING', 'submit to us, no later than 30 days after each anniversary date of this Agreement, a notarized financial accounting listing sources of revenue and total revenue, as well as nature and amount of total expenses for the previous year;', 'Use to confirm non-commercial use for public wharves or other nominal rent tenures where fees may be collected', 'OBLIGATIONS', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (285, 'CONSTRUCT CATTLEGUARDS-ROADWAY', 'construct suitable cattleguards at all points where the roadway you construct crosses any fence lines or natural range barriers, to our satisfaction;', 'Use to require construction of cattleguards.', 'OBLIGATIONS', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (286, 'NOTICE REQUIRED-CONSTRUCTION COMPLETION', 'notify us in writing of the completion of the construction of the roadway within 30 days of the date of completion;', 'Use to require notification of roadway construction', 'OBLIGATIONS', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (287, 'AQUACULTURE SIGNAGE', 'permanently affix to the Improvements a sign stating your name and the type and file number of this Agreement, in legible block letters not less than 20 cm (8 inches) tall and placed so the text is clearly visible to the public on or around the Land;', 'Use for aquaculture licences where visible signage is required', 'OBLIGATIONS', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (288, 'PUBLIC-NOT RESTRICT USE', 'not restrict, or permit the restriction of, the use of any service or facility (set out in Article 2) to a defined or limited group of persons, it being the intention of the parties that such services and facilities will be available for use by all members of the public.', 'Use for public wharves, marinas and roadways', 'OBLIGATIONS - ACCESS', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (289, 'FENCING MAY BE REQUIRED', 'at our written request and at your expense, construct fences in the locations on the Land and to the standards required by us within the time specified by us;', 'Use where fencing is to occur when notice is given', 'OBLIGATIONS', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (290, 'SETBACK AND ELEVATION (METRIC)', 'not construct or erect any Improvement on the Land within «SETBACK_FLOODING_DISTANCE» metres of the natural boundary of «SETBACK_FLOODING_WATERBODY_NAME» nor where the underside of the wooden floor system or top of pad of any such Improvement is less than «ELEVATION_FLOODING_DISTANCE_METRIC» metres above the natural boundary of «SETBACK_FLOODING_WATERBODY_NAME»; and

<NO_NUMBER>in addition to the provisions of this Agreement, you<\NO_NUMBER>

acknowledge that we do not represent to you that any Improvement will not be damaged by flooding, erosion, or debris flow; and

agree to indemnify and save us harmless against all loss, damage, costs and liabilities including fees of solicitors and other professional advisors arising out of any breach or violation of this subsection, or out of any personal injury, death or property damage occurring on the Land or happening by virtue of any flood, erosion, or debris flow;', 'Use when you want to specify the minimum setback and elevation in metric measurement for existing or proposed improvements', 'OBLIGATIONS - FLOODING', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (291, 'SETBACK AND ELEVATION (GEODETIC)', 'not construct or erect any Improvement on the Land within «SETBACK_FLOODING_DISTANCE» metres of the natural boundary of «SETBACK_FLOODING_WATERBODY_NAME» nor where the underside of the wooden floor system or top of pad of any such Improvement is less than «ELEVATION_FLOODING_DISTANCE_GEODETIC» metres above the natural boundary of «SETBACK_FLOODING_WATERBODY_NAME»; and

<NO_NUMBER>in addition to the provisions of this Agreement, you<\NO_NUMBER>

acknowledge that we do not represent to you that any Improvement will not be damaged by flooding, erosion, or debris flow; and

agree to indemnify and save us harmless against all loss, damage, costs and liabilities including fees of solicitors and other professional advisors arising out of any breach or violation of this subsection, or out of any personal injury, death or property damage occurring on the Land or happening by virtue of any flood, erosion, or debris flow;', 'Use when you want to specify the minimum setbacks in metric measurement and the elevations in Geodetic Survey of Canada for existing or proposed improvements.', 'OBLIGATIONS - FLOODING', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (292, 'RIO TINTO FLOODING AREA', 'Indemnify and save harmless us and Rio Tinto Alcan Inc. (“Rio Tinto”) from and against any and all losses, claims, damages, actions, causes of action, costs and expenses that we or Rio Tinto may sustain, incur, suffer or be put to by reason of the use or occupation of the Land by you, your servants, agents, employees or assigns.

<NO_NUMBER>You and your successors and assigns must release and forever discharge us and Rio Tinto, their servants, agents and employees, of and from any and all actions, rights, causes of action, claims and demands which you ever had, now have or which you or your successors or assigns hereafter can, shall or may have by reason of or in any way arising out of<\NO_NUMBER>

your use or occupation of the Land under this Agreement;

the rights granted to Rio Tinto by permit No. 3449 dated December 29th, 1950 and issued under the Water Act R.S.B.C. 1979, c. 429; and

any submersion, erosion, infiltration, or enclavement of the Land or a part thereof as a direct or indirect result of authorized flooding;', 'Use when tenure is being issued within a "Rio Tinto" flooding area', 'OBLIGATIONS - FLOODING', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (293, 'FLOODING ELEVATION (METRIC)', 'not construct or erect any Improvement on the Land where the underside of the wooden floor system or top of pad of any such Improvement is less than «ELEVATION_FLOODING_DISTANCE_METRIC» metres above the natural boundary of «SETBACK_FLOODING_WATERBODY_NAME»; and

<NO_NUMBER>in addition to the provisions of this Agreement, you<\NO_NUMBER>

acknowledge that we do not represent to you that any Improvement will not be damaged by flooding, erosion, or debris flow; and

agree to indemnify and save us harmless against all loss, damage, costs and liabilities including fees of solicitors and other professional advisors arising out of any breach or violation of this subsection, or out of any personal injury, death or property damage occurring on the Land or happening by virtue of any flood,  erosion or debris flow;', 'Use when you want to specify the minimum elevation in metric measurement for existing or proposed improvements.', 'OBLIGATIONS - FLOODING', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (294, 'FLOODING ELEVATION (GEODETIC)', 'not construct or erect any Improvement on the Land where the underside of the wooden floor system or top of pad of any such Improvement is less than «ELEVATION_FLOODING_DISTANCE_GEODETIC» metres Geodetic Survey Canada datum; and

<NO_NUMBER>in addition to the provisions of this Agreement, you<\NO_NUMBER>

acknowledge that we do not represent to you that any Improvement will not be damaged by flooding, erosion, or debris flow; and

agree to indemnify and save us harmless against all loss, damage, costs and liabilities including fees of solicitors and other professional advisors arising out of any breach or violation of this subsection, or out of any personal injury, death or property damage occurring on the Land happening by virtue of any flood, erosion, or debris flow;', 'Use when you can only provide minimum the elevation in geodetic survey data (no setback data) for existing or proposed improvements', 'OBLIGATIONS - FLOODING', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (295, 'ACCOMMODATE DISABLED VESSELS', 'provide without compensation temporary accommodation to any vessel that is disabled or that seeks shelter from weather conditions in which it may be unseaworthy;', 'Use in foreshore tenures that cover areas of protected moorage', 'OBLIGATIONS - FORESHORE', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (296, 'RESTORE SURFACE SOIL', 'if any soil is disturbed by you as a result of your construction or maintenance of the Improvements, at your expense, restore the surface of the Land to a condition satisfactory to us;', 'Use to require restoration of surface soil following construction or maintenance of improvements', 'OBLIGATIONS', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (297, 'MIGRATING MATERIAL FROM SEAWALL', 'at our request and at your expense, remove all material that migrates from the existing seawall/erosion barrier onto the adjacent beach area;', 'Use this special proviso where a clean-up of migrating material from a seawall or erosion barrier may occur', 'OBLIGATIONS', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (298, 'FREE FIELD OBLIGATIONS', 'USER WOULD START THE SENTENCE WITH "You must…."', 'You must  "___________;"', 'OBLIGATIONS - FREE FIELD', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (299, 'FREE FIELD OBLIGATIONS - 2', 'USER WOULD START THE SENTENCE WITH "You must…."', 'You must  "___________;"', 'OBLIGATIONS - FREE FIELD', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (300, 'RESTORE SURFACE COMMENCEMENT DATE', '<NO_NUMBER>(v) 	unless otherwise specified in the Management Plan, restore the surface of the Land to the condition that the Land was in on the Commencement Date, but if you are not directed or permitted to remove an Improvement under paragraph (iv), this paragraph will not apply to that part of the surface of the Land on which that Improvement is located, <\NO_NUMBER>', 'Choose this if they are to restore the land as it was on the commencement date.', 'OBLIGATIONS', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (301, 'RESTORE SURFACE SPECIFIC DATE', '<NO_NUMBER>(vi)	unless otherwise specified in the Management Plan, restore the surface of the Land to the condition that the Land was in on «RESTORE_SURFACE_DATE», but if you are not directed or permitted to remove an Improvement under paragraph (iv), this paragraph will not apply to that part of the surface of the Land on which that Improvement is located, <\NO_NUMBER>', 'Choose this if they are to restore the land as it was on a specific date.', 'OBLIGATIONS', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (302, 'RESTORE SURFACE PRIOR USE', '<NO_NUMBER>(vii)	unless otherwise specified in the Management Plan, restore the surface of the Land as nearly as may reasonably be possible, to the condition that the Land was in at the time it originally began to be used for the purposes described in this Agreement, but if you are not directed or permitted to remove an Improvement under paragraph (iv), this paragraph will not apply to that part of the surface of the Land on which that Improvement is located,<\NO_NUMBER>', 'Choose this if they are to restore to the condition that the land was in at the time it originally began to be used for this purpose', 'OBLIGATIONS', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (303, 'AQUATIC-NO RESIDENCE', 'you will not moor or secure any vessel or structure to the Improvements or on any part of the Land for use as a live-aboard facility, whether permanent or temporary;', 'Use to prohibit live-aboard use of marina and other moorage facilities.', 'LIMITATIONS', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (304, 'AQUATIC -- NO DIVERSION', 'you will not interrupt or divert the movement of water or of beach materials by water along the shoreline unless you have obtained our prior written approval;', 'Use to prohibit diversion of water.', 'LIMITATIONS', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (305, 'AQUATIC - PILE DRIVER ONLY', 'you will not use mechanized equipment other than a pile-driver during the construction, operation or maintenance of Improvements on the Land;', 'Use to permit use of a pile driver.', 'LIMITATIONS', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (306, 'PUBLIC-LEVY FEE', 'you may levy a fee for access and use of the Land by the public, for non-commercial or industrial purposes, provided such fee is in accordance with the limits established by us from time to time;', 'Use where tenant may levy a fee for access and use of the land.', 'LIMITATIONS', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (307, 'HYDRO-ELECTRIC PROJECT', 'notwithstanding anything to the contrary in this Agreement, if we, in our sole discretion, determine that the Land is required for flooding purposes in connection with a hydro electric power project, we may cancel this Agreement on 90 days written notice to you, and where we cancel this Agreement under this provision, neither you nor any person claiming under you shall be entitled to any form of compensation;', 'Use when tenure is being issued in an area which may be flooded due to a hydro electric project', 'LIMITATIONS - FLOODING', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (308, 'FLOODING-ENGINEERS REPORT', 'you are aware of and, on behalf of yourself and your heirs, executors, administrators, successors and assigns, hereby acknowledge that there is a potential flood, erosion and debris flow danger to the Land from «WATER_HAZARD_NAME»;

during the term of this Agreement, no building, mobile home or unit, or modular home shall be constructed, altered, reconstructed, moved, extended or located except where you have provided us, the building inspector for the local government in which the Land is located (the “Building Inspector”), if applicable, and the regional Water Manager of the ministry responsible for the Water Sustainability Act with a signed and stamped engineering report completed by a professional engineer experienced in hydrotechnical and geotechnical engineering, registered in the Province of British Columbia, certifying that the Land may be used safely in the manner and for the use intended;

the engineering report referred to in the previous subsection shall be completed to the satisfaction of the Building Inspector, if applicable, and the regional Water Manager of the ministry responsible for the Water Sustainability Act and shall contain provisions respecting the use of the Land to reduce the potential for property damage, injury or possible loss of life, including, without restricting the generality of the foregoing, provisions respecting

the siting, structural design and maintenance of buildings, structures or protective works on the Land;

the maintenance or planting of vegetation on the Land;

the placement and maintenance of fill on the Land; or

other conditions for the safe use of the Land or of the buildings, structures or protective works on the Land;

upon completion of a satisfactory engineering report, this Agreement will be amended to reflect the conditions of the engineering report;

on behalf of yourself and your successors and assigns, you acknowledge that we do not represent to you, or to any other person that any Improvement or chattel, including the contents of any Improvement, on the Land will not be damaged by flooding or erosion and, on behalf of yourself and your successors and assigns, with full knowledge of the potential flood, erosion or debris flow danger,

you agree to indemnify and to save us and our employees, servants or agents harmless from all loss, damage, costs, actions, suits, debts, accounts, claims and demands which we or any of our employees, servants or agents, may suffer or incur or be put to arising out of or in connection with any breach of any proviso on your part or your heirs, executors, administrators, successors and assigns contained in this Agreement or arising out of or in connection with any personal injury, death or loss or damage to the Land, or to any building, modular home, mobile home or unit, improvement, chattel or other structure, including the contents of them, built, constructed or placed on the Land, caused by flooding, erosion or some such similar cause; and

you remise, release and forever discharge us and our employees, servants or agents from all manner of actions, causes of action, suits, debts, accounts, covenants, contracts, claims and demands which you or any of your heirs, executors, administrators, successors and assigns may have against us and our employees, servants or agents for and by reason of any personal injury, death or loss or damage to the Land, or to any building, modular home, mobile home or unit, improvement, chattel or other structure, including the contents of any of them, built, constructed or placed on the Land, caused by flooding, erosion or some such similar cause;

nothing in this Agreement shall prejudice or affect our rights, powers and remedies in relation to you, including your heirs, executors, administrators, successors and assigns, or the Land, under any law, bylaw, order or regulation or in equity, all of which rights, powers and remedies may be fully and effectively exercised by us as if this Agreement had not been made by the parties;', 'Use when the client must obtain an engineer''s report before building or placing a mobile home on the land', 'LIMITATIONS', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (309, 'FREE FIELD - LIMITATIONS', '', 'You agree with us that "______;"  Use to set out additional Limitations to which the agreement is subject.', 'LIMITATIONS', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (310, 'LIMITATIONS - FREE FIELD - 2', '', 'You agree with us that "______;"  Use to set out additional Limitations to which the agreement is subject.', 'LIMITATIONS', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (311, 'MINIMUM RESIDENTIAL INSURANCE', 'You must without limiting your obligations or liabilities under this Agreement, at your expense, purchase and maintain during the Term the following insurance with insurers licensed to do business in Canada:

(a)	Comprehensive Personal Liability and/or other insurance as required in an amount of not less than $«INSURANCE_AMOUNT» per occurrence, with an extension insuring against liability for bodily injury, and property damage arising from accidents or occurrences on the Land or the Improvements, including «PERSONAL_LIABILITY_USE»;

(b)	make your insurer aware of this Agreement within 30 days of signing this Agreement.', 'For non-commercial tenures only.', 'SECURITY & INSURANCE', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (312, 'MINIMUM COMMERCIAL INSURANCE & ASSOCIATED USES', 'You must without limiting your obligations or liabilities under this Agreement, at your expense, purchase and maintain during the Term the following insurance with insurers licensed to do business in Canada:

Commercial General Liability and, if applicable Marine General Liability insurance in an amount of not less than $«INSURANCE_AMOUNT» inclusive per occurrence insuring against liability for personal injury, bodily injury and property damage, including coverage for all accidents or occurrences on the Land or the Improvements.  Such policy will include cross liability, liability assumed under contract, provision to provide 30 days advance notice to us of material change or cancellation, and include us as additional insured but only with respect to liability arising out of the activities of the named insured;
<SECTION_550>
<\SECTION_550>

You must

ensure that all insurance required to be maintained by you under this Agreement is primary and does not require the sharing of any loss by any of our insurers;

within 10 working days of Commencement Date of this Agreement, provide to us evidence of all required insurance in the form of a completed “Province of British Columbia Certificate of Insurance”;

if the required insurance policy or policies expire or are cancelled before the end of the Term of this Agreement, provide within 10 working days of the cancellation or expiration, evidence of new or renewal policy or policies of all required insurance in the form of a completed “Province of British Columbia Certificate of Insurance”;

notwithstanding subsection (b) or (c) above, if requested by us, provide to us certified copies of the required insurance policies.

We may, acting reasonably, from time to time, require you to

change the amount of insurance set out in subsection 6.6(a); and

provide and maintain another type or types of insurance in replacement of or in addition to the insurance previously required to be maintained by you under this Agreement;

<NO_NUMBER>and you will, within 60 days of receiving such notice, cause the amounts and types to be changed and deliver to us a completed “Province of British Columbia Certificate of Insurance” for all insurance then required to be maintained by you under this Agreement. <\NO_NUMBER>

You shall provide, maintain, and pay for any additional insurance which you are required by law to carry, or which you consider necessary to insure risks not otherwise covered by the insurance specified in this Agreement in your sole discretion.

You waive all rights of recourse against us with regard to damage to your own property arising from any source whatsoever.', 'Commercial insurance is mandatory for most Crown Land Programs.', 'SECURITY & INSURANCE', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (313, 'SUDDEN AND ACCIDENTAL ENDORSEMENT', 'Sudden and accidental pollution endorsement on the Commercial General Liability insurance policy with a limit of liability not less than two million dollars ($2,000,000); or if such endorsement is unavailable sudden and accidental pollution insurance insuring against bodily injury, property damage and cleanup expenses arising from new pollution conditions arising from the performance of this Agreement by you with a limit of liability not less than two million dollars ($2,000,000) per occurrence, including provision to provide 30 days advance notice to us of material change or cancellation, and the policy shall include us as additional insured;', 'For land tenures with a risk of bodily injury, property damage and cleanup expenses arising from newly discovered pollution conditions caused by the tenure holder.', 'SECURITY & INSURANCE', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (314, 'ENVIRONMENTAL IMPAIRMENT LIABILITY', 'Environmental Impairment Liability (Pollution Legal Liability) insurance insuring against bodily injury, property damage, and cleanup expenses (including removal and/or transit and disposal of contaminants) arising from gradual or sudden pollution events arising from the performance of this Agreement by you in an amount not less than two million dollars ($2,000,000) per occurrence, including provision to provide 30 days advance notice to us of material change or cancellation, and include us as additional insured.  If this insurance is written on a claims-made basis it must include the option to purchase an extended reporting period of 24 months beyond the date of cancellation or expiry of this Agreement;', 'For land tenures that are subject to significant quantities of pollutants which cause harm if accidentally spilled or released or which might gradually seep to neighbouring properties over a long period. Consult with Risk Management Branch before using.', 'SECURITY & INSURANCE', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (315, 'AVIATION LIABILITY', 'Aviation Liability insurance on all aircraft operated or used in the performance of this Agreement insuring against bodily injury, property damage, and passenger liability, in an amount not less than the limits of liability imposed by any Canadian Aviation Regulation and in any event not less than a per occurrence combined single limit of:

One million dollars ($1,000,000) for aircraft carrying pilot only (no passengers), or

three million dollars ($3,000,000) for aircraft up to 5 passenger seats, or 

three million dollars ($3,000,000) plus one million dollars ($1,000,000) for each additional passenger seat for aircraft up to 10 passenger seats, or

ten million dollars ($10,000,000) for aircraft over 10 passenger seats;

<NO_NUMBER>and such policy will include cross liability, provision to provide 30 days advance notice to us of material change or cancellation and include us as additional insured.  Where applicable, such policy will also include coverage for aerial drift or misapplication of fertilizers or herbicide chemicals in an amount not less than fifty thousand dollars ($50,000) per occurrence;<\NO_NUMBER>', 'For tenured activities that include operation of aircraft (including helicopters) whether owned or leased by tenure holder', 'SECURITY & INSURANCE', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (316, 'AIRCRAFT LIABILITY', 'Aviation Liability insurance on all aircraft operated or used in the performance of this Agreement insuring against bodily injury, property damage, and passenger liability, in an amount not less than the limits of liability imposed by any Canadian Aviation Regulation and in any event not less than a per occurrence combined single limit of:
One million dollars ($1,000,000) for aircraft carrying pilot only (no passengers), or
three million dollars ($3,000,000) for aircraft up to 5 passenger seats, or 
three million dollars ($3,000,000) plus one million dollars ($1,000,000) for each additional passenger seat for aircraft up to 10 passenger seats, or
ten million dollars ($10,000,000) for aircraft over 10 passenger seats;
<NO_NUMBER>and such policy will include cross liability, provision to provide 30 days advance notice to us of material change or cancellation and include us as additional insured.  Where applicable, such policy will also include coverage for aerial drift or misapplication of fertilizers or herbicide chemicals in an amount not less than fifty thousand dollars ($50,000) per occurrence;<\NO_NUMBER>', 'For tenured activities that include operation of aircraft (including helicopters) whether owned or leased by tenure holder', 'SECURITY & INSURANCE', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (317, 'AIRPORT PREMISES AND OPERATIONS LIABILITY', 'Airport Premises and Operations Liability in an amount not less than five million dollars ($5,000,000) per accident or occurrence, and such policy will include cross liability, provision to provide 30 days advance notice to us of material change or cancellation, and include us as additional insured;', 'For land tenure activities that involve the operation and maintenance of an airstrip, runway or airport.', 'SECURITY & INSURANCE', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (318, 'WATERCRAFT LIABILITY', 'Watercraft liability insurance on all watercraft operated or used in the performance of this Agreement by you (including rented watercraft), in an amount not less than the limits of liability imposed by the Marine Liability Act and in any event not less than $«INSURANCE_AMOUNT» and such policy will include cross liability, provision to provide 30 days advance notice to us of material change or cancellation, and include us as additional insured and if applicable, include coverage for marine towing operations;', 'Land tenure activities that include the operation of watercraft, whether owned or leased by the tenure holder, not otherwise covered by Commercial General Liability.', 'SECURITY & INSURANCE', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (319, 'ALTERNATIVE RISK FINANCING', 'Despite sections 6.6 and 6.7, your obligations under those sections are suspended for so long as we in our sole discretion acknowledge our acceptance to you in writing your alternative risk financing program in respect of the matters covered by those sections.

<NO_NUMBER>If, in our sole discretion, your alternative risk financing program in respect of the matters covered by sections 6.6 and 6.7 is no longer acceptable to us, we will provide written notice to you and you must, within 60 days of such notice, obtain and provide to us evidence of compliance with section 6.6 of this Agreement.<\NO_NUMBER>', 'Use when alternative risk financing (self-insurance) has been accepted.', 'SECURITY & INSURANCE', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (320, 'CROSS-CANCELLATION-GENERIC', 'if you fail to maintain in good standing any Disposition or other licence, permit, or agreement in any way related to your use and occupation of the Land under this Agreement, including without limitation the «CROSS_CANCELLATION_DETAILS»', 'Use when you want to identify specific cross cancellation details.', 'TERMINATION', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (321, 'CROSS CANCELLATION - FEE SIMPLE', 'if you transfer or assign your interest in fee simple in all that parcel or tract of land more particularly described as «CLIENT_FEE_SIMPLE_LEGAL»;', 'Use when you want to link the tenure to a parcel owned by the tenure holder.', 'TERMINATION', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (322, 'INDIVIDUAL CLIENT(S) SIGNING BLOCK', 'SIGNED BY
«DB_NAME_TENANT»', 'This signing block can be modified on your generated document.', 'SIGNING BLOCKS', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (323, 'CORPORATION - SOCIETY  SIGNING BLOCK', 'SIGNED on behalf of «DB_NAME_CORPORATION»by a duly authorized signatory  Authorized Signatory
', 'This signing block can be modified on your generated document.', 'SIGNING BLOCKS', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (324, 'MUNICIPAL SIGNING BLOCK', 'SIGNED on behalf of «DB_NAME_CORPORATION»
By its authorized signatories 		
Authorized Signatory_		
Authorized Signatory', 'This signing block can be modified on your generated document.', 'SIGNING BLOCKS', TRUE, FALSE, 'system', 'system', NOW(), NOW());
INSERT INTO provision (id, provision_name, free_text, help_text, category, active_flag, is_deleted, create_userid, update_userid, create_timestamp, update_timestamp) VALUES (325, 'PARTNERSHIP SIGNING BLOCK', 'SIGNED on behalf of by its general partner 
BY: 	
BY: 	', 'This signing block can be modified on your generated document.', 'SIGNING BLOCKS', TRUE, FALSE, 'system', 'system', NOW(), NOW());

-- aapl vars
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('DOCUMENT_REFERENCE_DATE', '', 'Document reference date: Month, Day, Year', 'system', 'system', NOW(), NOW(), 250);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('NAME_ASSIGNEE', '', 'Enter name and  address of Assignee', 'system', 'system', NOW(), NOW(), 250);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('TENURE_TO_BE_ASSIGNED', '', 'Enter type of tenure and date e.g. "lease agreement dated [month, day, year]', 'system', 'system', NOW(), NOW(), 251);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('DATE_AMENDING_AGREEMENT', '', 'Enter date "month, day, year" of agreement which amended tenure to be assigned', 'system', 'system', NOW(), NOW(), 252);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('TENURE_TO_BE_ASSIGNED', '', 'Enter type of tenure and date e.g. "lease agreement dated [month, day, year]', 'system', 'system', NOW(), NOW(), 252);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('', '', '', 'system', 'system', NOW(), NOW(), 253);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('DATE_ASSIGNMENT', '', '"month, day, year"', 'system', 'system', NOW(), NOW(), 254);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('NAME_ORIGINAL_PARTY', '', 'Enter name of original tenure holder of tenure to be assigned. Select when tenure has previously been assigned to the Assignor.', 'system', 'system', NOW(), NOW(), 254);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('TENURE_ORIGINAL', '', 'Enter tenure type & date of previous amendment eg "lease agreement dated May 1, 2001", which was subsequently assigned to the Assignor... (for multiple previous assignments, add another "which was subsequently assigned to ...")', 'system', 'system', NOW(), NOW(), 254);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('DATE_AMENDING_AGREEMENT', '', 'Enter date "month, day, year" of agreement which amended tenure to be assigned', 'system', 'system', NOW(), NOW(), 255);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('DATE_ASSIGNMENT', '', '"month, day, year"', 'system', 'system', NOW(), NOW(), 255);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('NAME_ORIGINAL_PARTY', '', 'Enter name of original tenure holder of tenure to be assigned. Select when tenure has previously been assigned to the Assignor.', 'system', 'system', NOW(), NOW(), 255);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('TENURE_ORIGINAL', '', 'Enter tenure type & date of previous amendment eg "lease agreement dated May 1, 2001", which was subsequently assigned to the Assignor... (for multiple previous assignments, add another "which was subsequently assigned to ...")', 'system', 'system', NOW(), NOW(), 255);

-- slpl vars
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('COMMENCEMENT_DATE', '', 'Commencement Date (m,d,y) for offer letters and tenure documents.', 'system', 'system', NOW(), NOW(), 276);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('DOCUMENT_REFERENCE_DATE', '', 'Document reference date: Month, Day, Year', 'system', 'system', NOW(), NOW(), 276);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('PURPOSE_SPECIFIC', '', 'For "xxxx" purposes as set out in the Management Plan. Enter specific purpose/use being authorized - details are described in the Management Plan', 'system', 'system', NOW(), NOW(), 276);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('SECURITY_AMOUNT', '', '#.## to post as security - indicate an amount even if blanket bond applies. Put in Decimal.', 'system', 'system', NOW(), NOW(), 276);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('TERMINATION_DATE', '', 'Month Day, Year', 'system', 'system', NOW(), NOW(), 276);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('TENURE_TYPE', '', 'Type in the tenure type. e.g. Lease', 'system', 'system', NOW(), NOW(), 279);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('FLAT_FEE', '', '$"#.##" - a one-time fee for the term for prepaid tenures, or the fee for the first year for tenures with annual rent. Put in decimals.', 'system', 'system', NOW(), NOW(), 280);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('FLAT_FEE', '', '$"#.##" - a one-time fee for the term for prepaid tenures, or the fee for the first year for tenures with annual rent. Put in decimals.', 'system', 'system', NOW(), NOW(), 281);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('DEADLINE_STAT_DEC_MARINA', '', 'Enter deadline to deliver marina stat dec "within __days of" OR "no less than__days prior to" an anniversary of the Commencement Date', 'system', 'system', NOW(), NOW(), 282);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('FLAT_FEE', '', '$"#.##" - a one-time fee for the term for prepaid tenures, or the fee for the first year for tenures with annual rent. Put in decimals.', 'system', 'system', NOW(), NOW(), 282);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('MOORAGE_FEE_DISCOUNT', '', 'the sum of $##.## OR "NIL" OR "____% X ____"  NOTE: Adjust your text to ensure that the % symbol is NOT at the end of the formula', 'system', 'system', NOW(), NOW(), 282);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('NON_MOORAGE_FEE_DISCOUNT', '', 'the sum of $##.## OR "NIL" OR "____% X ____"  NOTE: Adjust your text to ensure that the % symbol is NOT at the end of the formula', 'system', 'system', NOW(), NOW(), 282);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('ELEVATION_FLOODING_DISTANCE_METRIC', '', 'is less than "# metres"', 'system', 'system', NOW(), NOW(), 290);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('SETBACK_FLOODING_DISTANCE', '', '# (of metres)', 'system', 'system', NOW(), NOW(), 290);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('SETBACK_FLOODING_WATERBODY_NAME', '', 'Name of water body setback apllies to (lake/river/etc.)', 'system', 'system', NOW(), NOW(), 290);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('ELEVATION_FLOODING_DISTANCE_GEODETIC', '', '# (of meters Geodetic Survey Canada datum)', 'system', 'system', NOW(), NOW(), 291);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('SETBACK_FLOODING_DISTANCE', '', '# (of metres)', 'system', 'system', NOW(), NOW(), 291);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('SETBACK_FLOODING_WATERBODY_NAME', '', 'Name of water body setback apllies to (lake/river/etc.)', 'system', 'system', NOW(), NOW(), 291);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('ELEVATION_FLOODING_DISTANCE_METRIC', '', 'is less than "# metres"', 'system', 'system', NOW(), NOW(), 293);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('SETBACK_FLOODING_WATERBODY_NAME', '', 'Name of water body setback apllies to (lake/river/etc.)', 'system', 'system', NOW(), NOW(), 293);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('ELEVATION_FLOODING_DISTANCE_GEODETIC', '', '# (of meters Geodetic Survey Canada datum)', 'system', 'system', NOW(), NOW(), 294);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('RESTORE_SURFACE_DATE', '', 'to the condition that the Land was in on "m,d,y"', 'system', 'system', NOW(), NOW(), 301);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('WATER_HAZARD_NAME', '', 'Name of water body.', 'system', 'system', NOW(), NOW(), 308);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('INSURANCE_AMOUNT', '', '$"#,000,000.00" - minimum of 2 for Communication Sites and 5 for Heliski.', 'system', 'system', NOW(), NOW(), 311);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('PERSONAL_LIABILITY_USE', '', 'Type in personal use - ..... occurrences on the Land or the improvements including "eg private moorage, geothermal or transmission of electricity"', 'system', 'system', NOW(), NOW(), 311);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('INSURANCE_AMOUNT', '', '$"#,000,000.00" - minimum of 2 for Communication Sites and 5 for Heliski.', 'system', 'system', NOW(), NOW(), 312);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('INSURANCE_AMOUNT', '', '$"#,000,000.00" - minimum of 2 for Communication Sites and 5 for Heliski.', 'system', 'system', NOW(), NOW(), 318);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('CROSS_CANCELLATION_DETAILS', '', '[licence] number__,  issued [date] by [ministry][OGC]', 'system', 'system', NOW(), NOW(), 320);
INSERT INTO provision_variable (variable_name, variable_value, help_text, create_userid, update_userid, create_timestamp, update_timestamp, "provisionId") VALUES ('CLIENT_FEE_SIMPLE_LEGAL', '', 'Enter Legal of fee simple parcel owned by tenureholder.', 'system', 'system', NOW(), NOW(), 321);

-- Insert missing combinations of document_type and provision
INSERT INTO document_type_provision ("documentTypeId", "provisionId", associated, sequence_value, type, "provisionGroupId")
SELECT dt.id AS "documentTypeId",
       p.id AS "provisionId",
       'f' AS associated,
       1 AS sequence_value,
       NULL AS type,
       NULL AS "provisionGroupId"
FROM document_type dt
CROSS JOIN provision p
LEFT JOIN document_type_provision dtp
ON dtp."documentTypeId" = dt.id AND dtp."provisionId" = p.id
WHERE dtp.id IS NULL;

SELECT setval('provision_id_seq', 325, true);

COMMIT;
