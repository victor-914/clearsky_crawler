const fs = require("fs");
const path = require("path");
const os = require("os");
const { promisify } = require("util");
const extract = require("extract-zip");
const pdf = require("pdf-parse");
const mammoth = require("mammoth");
const xlsx = require("xlsx");

// Promisify fs functions
const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

const k = [
  {
    place_of_performance: "",
    department: " HOMELAND SECURITY, DEPARTMENT OF ",
    title:
      " Sources Sought Notice: FRC Ground Level HVAC and Roof Replacement ",
    active: "Active",
    _id: "04282025",
    updated_published_date:
      "Updated Published Date:  Apr 16, 2025 09:26 pm CDT ",
    original_published_date:
      "Original Published Date: Apr 11, 2025 06:32 am CDT",
    contract_opp_type: "Contract Opportunity Type:  Sources Sought  (Updated)",
    original_inactive_type:
      "Original Published Date: Apr 11, 2025 06:32 am CDT",
    updated_inactive_date: "Original Inactive Date: May 13, 2025",
    original_set_aside: " Original Set Aside: ",
    product_service_code: "Product Service Code: ",
    description:
      "Description View Changes The Department of Homeland Security (DHS), Federal Emergency Management Agency (FEMA), is conducting market research to determine the availability of qualified Contractors who can remove the existing roof membrane and insulation from the Federal Regional Center (FRC) ground-level roof and replace that with new insulation and provide modern roof membrane services.\n\nA site visit will be held for market research purposes at the Federal Regional Center with a start time of 9:00 AM CST on April 21, 2025, so that contractors are able to assess the workspace in-person. The contractors will gather in the Native Nations Room within the Federal Regional Center, which is located at 800 North Loop 288, Denton, Texas 76209, at 9:00 AM CST so that they can be escorted to the workspace.  All representatives form industry who are interested in participating in the site visit opportunity are required to submit a completed facilities access form to Contract Specialist, Barbara Gonzalez via email to barbara.gonzalez@fema.dhs.gov, and to the Region 6 Procurement Branch, via email to R6-Contracts@fema.dhs.gov no later than 12:00 PM CST on April 17, 2025.\n\nContractors who are interested are invited to provide responses to the questions that are expressed in the sources sought notice attachment by the submitting them to Contract Specialist, Barbara Gonzalez via email to barbara.gonzalez@fema.dhs.gov, and to the Region 6 Procurement Branch, via email to R6-Contracts@fema.dhs.gov, no later than 11:00 AM CST on April 28, 2025. \n\nNAICS: 236220\n",
    contracting_office_address:
      " Contracting Office Address  800 North Loop 288   Denton , TX 76209  USA ",
    primary_email: "    Barbara.gonzalez@fema.dhs.gov ",
    primary_tel: "   Phone Number Undisclosed ",
    secondary_email: "    R6-Contracts@fema.dhs.gov ",
    secondary_tel: "   Phone Number Undisclosed ",
    links: [
      "https://sam.gov/api/prod/opps/v3/opportunities/resources/files/d610117dd9ab4c37b66e80bfb67ea6f2/download?&token=",
      "https://sam.gov/api/prod/opps/v3/opportunities/resources/files/6a0c2883ffd94edd905134f9edb582dd/download?&token=",
      "https://sam.gov/api/prod/opps/v3/opportunities/resources/files/0ea8a52b9d7d4ae3a0241ec806cd7443/download?&token=",
    ],
  },
  {
    place_of_performance: "",
    department: " COMMERCE, DEPARTMENT OF ",
    title:
      " Operations and Maintenance (O&M) of the Central Utility Plant (CUP) ",
    active: "Active",
    _id: "1333ND2XCNB190XXX",
    updated_published_date: "",
    original_published_date:
      "Original Published Date: Apr 16, 2025 02:41 pm MDT",
    contract_opp_type: "Contract Opportunity Type: Sources Sought (Original) ",
    original_inactive_type:
      "Original Published Date: Apr 16, 2025 02:41 pm MDT",
    updated_inactive_date: "Original Inactive Date: May 22, 2025",
    original_set_aside: " Original Set Aside: ",
    product_service_code:
      "Product Service Code:  Z1JZ - MAINTENANCE OF MISCELLANEOUS BUILDINGS ",
    description:
      "DescriptionSynopsis: ***PLEASE OPEN ATTACHMENTS FOR COMPLETE SOURCES SOUGHT ANNOUNCEMENT INFORMATION***\n\nIn accordance with (IAW) FAR 15.201(c)(3) this is a SOURCES SOUGHT FOR MARKET RESEARCH. THIS\n\nSOURCES SOUGHT IS NOT A REQUEST FOR PROPOSALS, QUOTATIONS OR BIDS. This announcement constitutes a Sources Sought (market survey). This notice is a request for information to provide data for planning purposes only and does not constitute an Invitation for Bids, a Request for Proposals, a Solicitation, a Request for Quotes, or an indication the Government will contract for the services contained in this Sources Sought. A solicitation is not currently available. This Sources Sought is a market research tool used by the acquisition team to determine potential and eligible businesses that have the capability and interest in providing the required commercial services described herein, prior to determining the method of acquisition. This also serves as a Request for Comments on the draft performance work statement (PWS) for the planned project.\n\nThe U.S. Department of Commerce, National Institute of Standards & Technology (NIST), Acquisition Management Division (AMD), Team E-Boulder seeks information from PRIME CONTRACTORS that are capable and interested in performing the work on a commercial service contract at the NIST Boulder, Colorado Campus Site.\n\nThis request is not to be construed as a commitment on the part of the Government to award a contract, nor does the Government intend to pay for any information submitted as a result of this notice. The Government does not reimburse respondents for any cost associated with this source sought or reimburse expenses incurred to interested parties for preparing a response as a result of this posting. The Government is not obligated to and will not pay for any information or comments received from potential sources as a result of this Sources Sought and Request for Comments announcement. Any responses received will not be used as a proposal. Respondents will not be notified of the Sources Sought evaluation results, nor will questions be addressed by the Government.\n\nThe results of this Sources Sought will be utilized to assess the amount of interest and capability in the current market, and to determine if any Small Business Set-aside opportunities exist for this potential requirement. All Small Business Set-aside categories will be considered. This market research tool will be used to identify potential and eligible service contractors, of all sizes, prior to determining the method of acquisition and level of announcement for issuance of a solicitation.\n\nThe Request for Comments portion of this Sources Sought provides contractors the opportunity to make any comments, including recommendations, regarding the draft PWS for the potential project. Comments will be used for consideration in the development of the PWS. The Government will not provide responses to any questions or Requests for Information regarding this project as a part of this Sources Sought and Request for Comments.\n\nProject Description:\n\n\n\tNIST is soliciting for capability statements from all interested parties to perform as a Contractor for the Operation and Maintenance of Central Utility Plant, which includes preventative maintenance of all associated equipment, for the NIST Boulder, Colorado Campus. This also includes performing preventative and scheduled maintenance activities at the field sites in Ft. Collins, Colorado, and Kekaha, Hawaii.\n\n\n\n\n\n\tThe North American Industry Classification System (NAICS) code for the proposed acquisition is 811310, Commercial and Institutional Machinery and Equipment (except Automotive and Electronic) Repair and Maintenance, and the Small Business size standard is $7.5 million.\n\n\n\n\n\n\tPlanned acquisition type: Commercial Services, Firm-Fixed-Price Contract. The acquisition is planned to be performed in accordance with FAR PART 12 Acquisition Commercial Items and FAR PART 15 Contracting by Negotiation.\n\n\n\n\n\n\tSee the following attachments:\n\t\n\t\tDRAFT Performance Work Statement, 20 May 2021, “00 CUP PWS 2021-05-20.pdf”\n\t\tPWS Attachment 1 – Mechanical Room and Preventative Maintenance (MR_PM), “01 Mechanical Room and PM List 4-12-2023.pdf”\n\t\tPWS Attachment 2 – Spare Parts Inventory, “02 Spare Parts Inventory.pdf”\n\t\tPWS Attachment 3 – Monthly Report, “03 CUP Monthly Report.pdf”\n\t\tPWS Attachment 5 – Job Plans Revised, “05 PWS Attach 5 Job Plans 4-12-23.pdf”\n\t\tPWS Attachment 6 – Daily Report, “06 Daily Report.pdf”\n\t\tPWS Attachment 8 – NIST General Instructions, “08 NIST General Requirements.pdf”\n\t\tPWS Attachment 9 – NIST Safety Plan Requirements Checklist, “09 Safety Plan Checklist.pdf”\n\t\tPWS Attachment 10 – Primer on Safety Plan Require/Addendums COVID-19, “10 Primer on Safety Plan Requirements Addendums for COVID19.pdf”\n\t\tPWS Attachment 11 – Emergency Generators, “11 Emergency Generator Information.pdf”\n\t\tPWS Attachment 12 – Lighting Summary WWVh Field Site Kekaha, HI, “12 WWVH lighting summary.pdf”\n\t\tPWS Attachment 13 – Contract Transition Requirements, “13 Transition 11 Sep.pdf”\n\t\tComment Log for Draft PWS.\n\t\n\t\n\n\nSources Sought: Interested and capable PRIME CONTRACTORS are requested to electronically submit a Capabilities Statement of no more than twenty (20) pages in length inclusive of the following information:\n\n\n\tCompany name and address. The name, position title, telephone number and email address of a company point of contact (POC).\n\tUEI/CAGE code registered in the system for Award Management (SAM) at www.sam.gov.\n\tIndicate whether your company is a large business or a small business under the NAICS code specified in this announcement.\n\tCompany Profile description.\n\tStatement of Capability stating your company's skills, experience knowledge and equipment to perform the type of work identified in the PWS. This should include documentation of past specialized experience and technical competence in performing similar projects, up to five (5) recent and relevant past projects for which your company was the prime contractor. For the purposes of the Sources Sought, \"similar\" is defined as a high-pressure steam plant with the output capacity of at least 100 thousand pounds per hour of steam at a minimum of 100 psi, and a chilled water plant utilizing multiple chillers of at least 1200 tons in size. In addition to the above, simi lar projects may include conducting preventative maintenance for commercial building equipment such as air handlers, roof top packaged HVAC (natural gas heating and DX cooling), small, packaged boilers (1,500,000 to 2,500,000 BTU's), small (25 -50 ton) chillers, cooling towers, pumps, heat exchangers, and exhaust fans.\n\tRecent experience is experience performed within the last five (5) years. For each project experience, identify the following:\n\t\n\t\tDid your company perform as a prime or sub-contractor?\n\t\tDescription of the work performed by your company. Identify /describe the work types (i.e. steam plant, chilled water plant, preventative maintenance for commercial building equipment, etc.)\n\t\tApproximately what dollar amount and percentage, and what types of work d id your company perform directly? What percentage and types of work did your company sub-contract out?\n\t\tProvide a contract number, the customer organization Government/Agency or private firm), a POC, and a current telephone number and email address for the customer POC.\n\t\n\t\n\tCan your company provide the services as a PRIME contractor?\n\tWould your company provide the services per the Draft PWS as a part of a Joint Venture, Partnership, Mentor/Protégé or other legal arrangement? If so, please identify the legal arrangement.\n\tWould your company sub-contract work in the performance of the PWS? If so, what percentage of work would your company perform as a Prime Contractor?\n\tAny other relevant information that is not listed above which the Government may consider in developing the service requirement and market research.\n\tCompany sales brochures or marketing packages will NOT be considered.\n\n\nRequest for Comments: All comments provided in response to the Sources Sought shall be submitted electronically on the attached Request for Comments sheet. Comments will be used for consideration in the development of the PWS. The Government will not provide responses to any questions, Requests for Information, regarding this project as a part of this Sources Sought and Request for Comments.\n\nSubmittal Instructions: All responses to this Sources Sought shall be submitted via email by the required Response Date to Primary Point of Contact with a courtesy copy to the Alternate Point of Contact in this announcement.\n",
    contracting_office_address:
      " Contracting Office Address  ACQUISITION MANAGEMENT DIVISION 100 BUREAU DR.  GAITHERSBURG , MD 20899  USA ",
    primary_email: "    shawn.borisow@nist.gov ",
    primary_tel: "   Phone Number 3034975432 ",
    secondary_email: "",
    secondary_tel: "",
    links: [
      "https://sam.gov/api/prod/opps/v3/opportunities/resources/files/9f2d756bd546479abf39a41f8513aa89/download?&token=",
      "https://sam.gov/api/prod/opps/v3/opportunities/resources/files/fe0093c167c647c8a6d68c35acff32fb/download?&token=",
      "https://sam.gov/api/prod/opps/v3/opportunities/resources/files/8d15e753bbc3435e8319cc40fd50e4d5/download?&token=",
      "https://sam.gov/api/prod/opps/v3/opportunities/resources/files/3ec869f38c424fa581a245df39f2205c/download?&token=",
    ],
  },
  {
    place_of_performance: "",
    department: " INTERIOR, DEPARTMENT OF THE ",
    title: " JOFI-REPLACE ASPHALT ROOF AT KENNEDY NHS ",
    active: "Active",
    _id: "140P4325R0015",
    updated_published_date: "",
    original_published_date:
      "Original Published Date: Apr 16, 2025 04:18 pm EDT",
    contract_opp_type: "Contract Opportunity Type: Solicitation (Original) ",
    original_inactive_type:
      "Original Published Date: Apr 16, 2025 04:18 pm EDT",
    updated_inactive_date: "Original Inactive Date: May 31, 2025",
    original_set_aside:
      " Original Set Aside: Total Small Business Set-Aside (FAR 19.5)",
    product_service_code:
      "Product Service Code:  Z1JA - MAINTENANCE OF MUSEUMS AND EXHIBITION BUILDINGS ",
    description:
      "DescriptionThe National Park Service, Contracting Operations East, New England Major Acquisition Buying Office, issues this Request for Proposal (RFP) for a construction requirement at John Fitzgerald Kennedy National Historic Site in Brookline, Massachusetts. Work will consist of providing all labor, materials, tools and other equipment and supervision as required to replace the asphalt roof at John Fitzgerald Kennedy National Historic Site. Information is provided in the Statement of Work, included with the solicitation documents.The estimated magnitude of the complete requirement is between $25,000 and $100,000.Provisions and clauses - 04/16/2025Attachment 1 - Statement of Work - 04/16/2025Attachment 2 - DOL Construction Wage Rate Determination - 04/04/2025Attachment 3 - Construction Contract Administration - 04/16/2025",
    contracting_office_address:
      " Contracting Office Address  CHARLESTOWN NAVY YARD, BLDG I-1   BOSTON , MA 02108  USA ",
    primary_email: "    Jason_Albright@nps.gov ",
    primary_tel: "   Phone Number 6175196145 ",
    secondary_email: "",
    secondary_tel: "",
    links: [
      "https://sam.gov/api/prod/opps/v3/opportunities/resources/files/10447397feb1439ea8f2aaebe37ee5fd/download?&token=",
      "https://sam.gov/api/prod/opps/v3/opportunities/resources/files/1bf9a5d773f846b9b45e6958920e9c36/download?&token=",
      "https://sam.gov/api/prod/opps/v3/opportunities/resources/files/4b02b036ca45464699873786e9c6324c/download?&token=",
      "https://sam.gov/api/prod/opps/v3/opportunities/resources/files/36a5462fcfa44446acf399a47144352f/download?&token=",
    ],
  },
  {
    place_of_performance: "",
    department: " DEPT OF DEFENSE ",
    title: " McNary Dam Powerhouse Roof Guardrail ",
    active: "Active",
    _id: "W912EF25Q0034",
    updated_published_date:
      "Updated Published Date:  Apr 16, 2025 12:46 pm PDT ",
    original_published_date:
      "Original Published Date: Mar 24, 2025 08:12 am PDT",
    contract_opp_type: "Contract Opportunity Type:  Presolicitation  (Updated)",
    original_inactive_type:
      "Original Published Date: Mar 24, 2025 08:12 am PDT",
    updated_inactive_date: "Original Inactive Date: Apr 24, 2025",
    original_set_aside:
      " Original Set Aside: Total Small Business Set-Aside (FAR 19.5)",
    product_service_code: "Product Service Code:  9520 - STRUCTURAL SHAPES ",
    description:
      "Description View Changes This solicitation is cancelled in its entirety. \n",
    contracting_office_address:
      " Contracting Office Address  CONTRACTING DIVISION 201 NORTH 3RD AVE  WALLA WALLA , WA 99362-1876  USA ",
    primary_email: "    hillary.a.morgan@usace.army.mil ",
    primary_tel: "   Phone Number 5095277201 ",
    secondary_email: "    sara.edwards@usace.army.mil ",
    secondary_tel: "   Phone Number 5095277216 ",
    links: [
      "https://sam.gov/api/prod/opps/v3/opportunities/resources/files/20fad06583034d7983a4c3ea7f8a7b21/download?&token=",
      "https://sam.gov/api/prod/opps/v3/opportunities/resources/files/a0aead2976a54c679bba39132ef80675/download?&token=",
      "https://sam.gov/api/prod/opps/v3/opportunities/resources/files/800c65353f244a12b3be700539f029d0/download?&token=",
    ],
  },
  {
    place_of_performance: "",
    department: " VETERANS AFFAIRS, DEPARTMENT OF ",
    title:
      " Z1DA--646A4-24-402 Building #49 Roof Replacement | NCO 4  Construction West (VA-25-00058066) ",
    active: "Active",
    _id: "36C24425R0076",
    updated_published_date: "",
    original_published_date:
      "Original Published Date: Apr 16, 2025 02:50 pm EDT",
    contract_opp_type: "Contract Opportunity Type: Presolicitation (Original) ",
    original_inactive_type:
      "Original Published Date: Apr 16, 2025 02:50 pm EDT",
    updated_inactive_date: "Original Inactive Date: Jul 29, 2025",
    original_set_aside:
      " Original Set Aside: Service-Disabled Veteran-Owned Small Business (SDVOSB) Set-Aside (FAR 19.14)",
    product_service_code:
      "Product Service Code:  Z1DA - MAINTENANCE OF HOSPITALS AND INFIRMARIES ",
    description:
      "DescriptionThe Veterans Integrated Service Network #04 (VISN 04) Contracting Office / Pittsburgh Veteran Administration Medical Center anticipates soliciting an Invitation for Bid (IFB) and subsequently awarding a single, Firm-Fixed-Price contract. All construction must be in compliance with applicable codes, VA Design Guides, VA policy/standards, and the terms of this contract.  The contractor shall provide all tools, travel, trades, labor, materials, permits, licenses, and supervision for the Building 49 Roof Replacement project as specified in the Scope of Work.\n\nNote:   This notice is NOT an invitation for bid at this time.\n\nProject Scope Summary\nThe contractor shall provide all necessary resources to remove & replace existing roof (membrane only), flashings, wall terminations, & roof edge terminations on building #49 roof, as well as install lightning protection. The project consists of approximately 56,500 square feet of roofing material & replace with standard 60 mil White TPO set-in LVOC binding adhesive.\nSelection/Administration:\nThe Invitation for Bid shall set forth the requirements for responding to the solicitation. All bids will be evaluated on the basis of price only. \n\nThe solicitation and scope of work will be available at Contracting Opportunities http://SAM.gov.  Amendments to the solicitation will also be posted on this website.  All parties must obtain solicitation documents and amendments to the solicitation through the website. Hard copies will not be mailed.  It is the responsibility of the Contractor to frequently check the website for all notices, amendments, etc., regarding this solicitation.  The Government will not be responsible for any notification not sent or received by the Contractor regarding the solicitation.  The contract will be awarded in accordance with the procedures specified in the solicitation.\n\nThis contract is set-aside 100% for Service-Disabled Veteran Owned Small Business s (SDVOSB) capable of completing work under the North American Industrial Classification System (NAICS) code 236220 Commercial & Industrial Building & Construction with a size standard of $45.0 million in annual receipts for the past three years.  The contract will be awarded as a Firm Fixed Price (FFP) contract.   \n\nThe period of performance is 120 calendar days from receipt of the Notice to Proceed.  \n\nThe Magnitude of Construction cost is between $1,000,000 and $5,000,000.      \n\nThe solicitation issue date will be on or about May 1, 2025.      \n\nAll questions pertaining to this solicitation must be received in writing via e-mail to Amy.Demarest@va.gov and Christopher.McDevitt@va.gov.  NO TELEPHONE REQUESTS WILL BE HONORED.  All questions and Government responses will be posted to the SAM.gov website.  \n\nA pre-bid conference/site visit will be conducted on May 07, 2025 at 10:00 am EST. Attendees will meet at the front entrance of Building 49 on the VAPHS Heinz Campus.  All respondents must be registered in the System Award Management System (SAM) database at time of submittal.  Offerors must be verified in the Department of Veterans Affairs (VA), Center for Veterans Enterprise (CVE) at http://www.vetbiz.gov/ at time of Phase I submittal in accordance with Veterans Affairs Acquisition Regulation (VAAR) Subpart 819.7003(b).  Any offeror not CVE or SAM verified at time of bid submittal will be disqualified and bid will be rejected.\n\n",
    contracting_office_address:
      " Contracting Office Address  1010 DELAFIELD ROAD   PITTSBURGH , PA 15215  USA ",
    primary_email: "    Amy.Demarest@va.gov ",
    primary_tel: "   Phone Number 412-860-7204 ",
    secondary_email: "",
    secondary_tel: "",
    links: [
      "https://sam.gov/api/prod/opps/v3/opportunities/resources/files/480315531fbc4a7a85a285deeb6a54dc/download?&token=",
    ],
  },
  {
    place_of_performance: "",
    department: " ENVIRONMENTAL PROTECTION AGENCY ",
    title: " C--Intent to Sole Source Facility Mechanical Design ",
    active: "Active",
    _id: "68HERC25R0144",
    updated_published_date: "",
    original_published_date:
      "Original Published Date: Apr 16, 2025 01:04 pm EDT",
    contract_opp_type: "Contract Opportunity Type: Presolicitation (Original) ",
    original_inactive_type:
      "Original Published Date: Apr 16, 2025 01:04 pm EDT",
    updated_inactive_date: "Original Inactive Date: Sep 30, 2025",
    original_set_aside: " Original Set Aside: ",
    product_service_code:
      "Product Service Code:  C1DB - ARCHITECT AND ENGINEERING- CONSTRUCTION: LABORATORIES AND CLINICS ",
    description:
      "DescriptionSynopsis - Notice of Intent to Sole SourceDesign Services for Mechanical System and Roofing Integration, Ada, OklahomaProposed Solicitation Number: 68HERC25R0144The U.S. Environmental Protection Agency’s (EPA) Cincinnati Acquisition Division (located at 26 Martin Luther King Dr. W, Cincinnati, OH 45268) intends to solicit I DESIGN AND PLANNING, LLC (iDesign) (2531 Ridge RD STE 100, White Lake, Michigan, 48383-1750) on a sole source basis for a new firm-fixed price contract for the design of Mechanical Systems and Roofing Integration at the Robert Kerr Environmental Research Center. This sole source solicitation will be made under the authority of FAR Part 6.302-1 Only One Responsible Source and No Other Supplies Or Services Will Satisfy Agency Requirements. The design requirement requires the seamless integration of a newly proposed mechanical design with the recently upgraded mechanical systems designed by iDesign. The mechanical design will build upon a concept design prepared by iDesign. Therefore, iDesign is in a unique position to provide design integration of the new mechanical and roofing systems into the current mechanical system.The following is a partial listing of the requirements for this project:•\tCompletion of mechanical conception design to 100% construction documents. (final IFC set, stamped drawings). Final 100% submission to include cost estimate.•\tPrepare Design Alternates to replace roof at the Main Lab building  & Library and Conference Center (LCC) (Alternates to be awarded at the Government’s discretion)•\tRefine mechanical, electrical, plumbing (MEP), structural, and civil elements as needed.•\tIntegrate vendor data from pre-purchased mechanical equipment •\tDevelop detailed load calculations, layouts, and equipment schedules.•\tCoordinate with architectural and structural disciplines.•\tDevelop detailed engineering drawings, specifications, and schedules.•\tPerform quality control (QC) reviews to ensure compliance with project requirements.•\tConduct interdisciplinary clash detection and coordination.•\tComplete all final specifications, drawings, and submittal requirements.•\tProvide a permit-ready document package.•\tAddress final owner and stakeholder comments before issuing documents.•\tThe energy model should be performed in accordance with ASHRAE 90.1 and the Guiding Principles for Sustainable New Construction. The following is a partial listing of codes, standards, and regulatory references that apply to the Project:•\tAll applicable federal, state and local standards and regulations•\tAll Oklahoma state, fire, safety and health regulations•\tAll applicable NFPA Codes•\tOSHA, Occupational Safety and Health Administration Regulations•\tEPA Facilities Manuals (Volumes 1 – 4)•\tGSA Facilities Standards for the Public Buildings Service (P100)•\tNational Electric Code (NEC)•\tArchitectural Barriers Act Accessibility Standard (ABAAS)•\tAmerican National Standards Institute (ANSI)/American Society of Mechanical Engineers (ASME)•\tNational Environmental Balancing Bureau (NEBB)•\tState of Oklahoma ICC Adopted Codes•\tAmerican Society of Heating Refrigeration and Air Conditioning Engineering (ASHRAE)•\tSheet Metal and Air Conditioning Contractors’ National Association (SMACNA)•\tGuiding Principles for Sustainable Federal Buildings Conclusion:FAR Part 6.302-1, Only One Responsible Source And No Other Supplies Or Services Will Satisfy Agency Requirements.The nature of this acquisition requires the U.S. EPA to use the authority cited because of the complex nature of integrating the new design into the current design and roofing systems. iDesign is uniquely qualified to provide the ongoing design services given their past role providing the design services for the currently upgraded mechanical system. The utilization of a different A/E firm would likely require additional engineering support and additional lead time to become familiar with the status of the design work as well as existing site conditions.  A different firm would be forced to interpret the various elements of iDesign’s existing concept design to respond to questions raised by construction contractor.  This would result in a longer timeline for the completion and additional cost to the government.  A sole source award to iDesign will allow construction to continue with no disruption and effort lost. A disruption and requirements delay are likely if a new contractor were brought in. iDesign is also uniquely qualified for this work because of their in-depth knowledge of the EPA Robert S. Kerr Environmental Research Center facilities. This knowledge is critical to minimize costs, keep the Robert S. Kerr laboratories operational and the building occupant’s safe during the design integration. Finally—and critically—iDesign is currently providing construction administration services for ongoing construction work at the Ada facilities. To inject a new A/E firm, with new engineers and architects, into the existing, fluid construction project is extremely impractical. Questions would arise as to which A/E firm is responsible for reviewing and finalizing changes flowing from the new design, or for certifying that the new designs do not compromise features of existing design. Assigning liability for any potential issues would be very difficult. All of these potential challenges could result in construction delays or building closures. However, the research performed at the EPA Robert S. Kerr campus is mission critical and having a disruption in services, which could potentially close the labs for a period of time, cannot be permitted. As the continuation of design oversight, for the necessary laboratory consolidation, and consistency of the known consolidation requirements, it is in the best interest of the Government to award this follow-on contract to iDesign. Utilization of iDesign avoids all of the pitfalls enumerated above.This requirement will utilize FAR Part 36. The product service code is C1DB, Architect and Engineering – Construction: Laboratories. The North American Industry Classification System (NAICS) code is NAICS Code 541330 Engineering Services with a small business size of $25.5M. The estimated construction cost of the work resulting from the design is under $10M. The anticipated Period of Performance is 7 months. Contract award is anticipated to be made Spring 2025.THIS NOTICE IS NOT A REQUEST FOR PROPOSALS.  Notwithstanding, all responsible sources that believe they are capable of meeting the EPA’s requirement may submit a capability statement, proposal, or quotation—that must address the outlined requirements above—which shall be considered by the agency. Such documentation must be submitted to the Contracting Officer by 11:59 PM Eastern Time on May 1, 2025.  A determination not to compete the proposed firm-fixed-price contract based upon the responses received to this notice is solely within the discretion of the Government. All questions should be directed to the Contracting Officer, Greg Forrest, at forrest.greg@epa.gov. Responses to this notice must be submitted electronically via email. Telephone responses will not be honored. ",
    contracting_office_address:
      " Contracting Office Address  26 WEST MARTIN LUTHER KING DRIVE   CINCINNATI , OH 45268  USA ",
    primary_email: "    forrest.gregory@epa.gov ",
    primary_tel: "   Phone Number 513-487-2011 ",
    secondary_email: "",
    secondary_tel: "",
    links: [
      "https://sam.gov/api/prod/opps/v3/opportunities/resources/files/18099addcc1b46d98764334b79176c71/download?&token=",
    ],
  },
  {
    place_of_performance: "",
    department: " INTERIOR, DEPARTMENT OF THE ",
    title: " Roof Repair - Beclabito Day School  ",
    active: "Active",
    _id: "140A2325R0032",
    updated_published_date: "",
    original_published_date:
      "Original Published Date: Apr 16, 2025 09:52 am MDT",
    contract_opp_type: "Contract Opportunity Type: Solicitation (Original) ",
    original_inactive_type:
      "Original Published Date: Apr 16, 2025 09:52 am MDT",
    updated_inactive_date: "Original Inactive Date: May 30, 2025",
    original_set_aside: " Original Set Aside: ",
    product_service_code:
      "Product Service Code:  C1CA - ARCHITECT AND ENGINEERING- CONSTRUCTION: SCHOOLS ",
    description: "DescriptionRoof Repair - Beclabito Day School ",
    contracting_office_address:
      " Contracting Office Address  1011 INDIAN SCHOOL RD. SUITE 352A   Albuquerque , NM 87104  USA ",
    primary_email: "    maryjane.johnson@bie.edu ",
    primary_tel: "   Phone Number 5058034259 ",
    secondary_email: "",
    secondary_tel: "",
    links: [
      "https://sam.gov/api/prod/opps/v3/opportunities/resources/files/9b3311b6b205499f9e9278e54bf2c0be/download?&token=",
      "https://sam.gov/api/prod/opps/v3/opportunities/resources/files/ef362a80cc194c71aae09a412201ea8d/download?&token=",
      "https://sam.gov/api/prod/opps/v3/opportunities/resources/files/8e0a47d0ba304b36ad0474e357521dfc/download?&token=",
      "https://sam.gov/api/prod/opps/v3/opportunities/resources/files/8ed6ff8097764bdca76713b1b9f84e7e/download?&token=",
      "https://sam.gov/api/prod/opps/v3/opportunities/resources/files/9043475339c54104b49c1a755c7ad98b/download?&token=",
      "https://sam.gov/api/prod/opps/v3/opportunities/resources/files/874fdcbe303c44f69d66097881e3a99a/download?&token=",
      "https://sam.gov/api/prod/opps/v3/opportunities/resources/files/73d1bbefdfcf4db28f286a071f2c702d/download?&token=",
      "https://sam.gov/api/prod/opps/v3/opportunities/resources/files/959a38f29001421faee2f6cedf4ef810/download?&token=",
      "https://sam.gov/api/prod/opps/v3/opportunities/resources/files/16154ead02484040b263b8b3cc3af220/download?&token=",
    ],
  },
];

// Temporary directory for zip extraction
const tempDir = path.join(os.tmpdir(), "file_processor_temp");

async function ensureTempDir() {
  try {
    await mkdir(tempDir, { recursive: true });
  } catch (err) {
    if (err.code !== "EEXIST") throw err;
  }
}

function cleanFileName(filePath) {
  const basename = path.basename(filePath);
  // Remove .crdownload extension if present
  if (basename.endsWith(".crdownload")) {
    return {
      cleanedPath: filePath.replace(/\.crdownload$/, ""),
      wasCrdownload: true,
    };
  }
  return {
    cleanedPath: filePath,
    wasCrdownload: false,
  };
}

async function extractTextFromFile(filePath) {
  const { cleanedPath } = cleanFileName(filePath);
  const ext = path.extname(cleanedPath).toLowerCase();

  try {
    switch (ext) {
      case ".pdf":
        const pdfData = await readFile(cleanedPath);
        const pdfText = await pdf(pdfData);
        return {
          content: pdfText.text,
          preview: pdfText.text.substring(0, 200),
        };

      case ".docx":
      case ".doc":
        const docxResult = await mammoth.extractRawText({ path: cleanedPath });
        return {
          content: docxResult.value,
          preview: docxResult.value.substring(0, 200),
        };

      case ".xlsx":
      case ".xls":
        const workbook = xlsx.readFile(cleanedPath);
        let xlsxText = "";
        workbook.SheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          xlsxText += xlsx.utils.sheet_to_csv(sheet) + "\n\n";
        });
        return {
          content: xlsxText,
          preview: xlsxText.substring(0, 200),
        };

      case ".txt":
      case ".csv":
      case ".json":
        const textContent = await readFile(cleanedPath, "utf8");
        return {
          content: textContent,
          preview: textContent.substring(0, 200),
        };

      default:
        return {
          content: null,
          preview: `[Binary file - no text extraction for ${ext}]`,
        };
    }
  } catch (err) {
    return {
      content: null,
      preview: `[Error extracting text: ${err.message}]`,
    };
  }
}

async function processZipFile(zipPath, relativePath) {
  await ensureTempDir();
  const { cleanedPath } = cleanFileName(zipPath);
  const extractPath = path.join(tempDir, path.basename(cleanedPath, ".zip"));

  try {
    await extract(cleanedPath, { dir: extractPath });
    console.log(`\nExtracted ZIP contents from: ${relativePath}`);
    return await processDirectory(
      extractPath,
      path.join(relativePath, path.basename(cleanedPath))
    );
  } catch (err) {
    return { error: `ZIP extraction failed: ${err.message}` };
  }
}

async function processFile(filePath, relativePath) {
  const { cleanedPath, wasCrdownload } = cleanFileName(filePath);
  const ext = path.extname(cleanedPath).toLowerCase();
  const stats = await stat(cleanedPath);

  const fileInfo = {
    name: path.basename(cleanedPath),
    path: relativePath,
    fullPath: cleanedPath,
    extension: ext,
    size: stats.size,
    isDirectory: false,
    wasCrdownload,
    createdAt: stats.birthtime,
    modifiedAt: stats.mtime,
  };

  if (ext === ".zip") {
    fileInfo.zipContents = await processZipFile(filePath, relativePath);
  } else {
    const { content, preview } = await extractTextFromFile(filePath);
    fileInfo.content = content;
    fileInfo.preview = preview;
  }

  return fileInfo;
}

async function processDirectory(dirPath, relativePath = "") {
  const result = {
    name: path.basename(dirPath),
    path: relativePath || path.basename(dirPath),
    fullPath: dirPath,
    isDirectory: true,
    files: [],
    directories: [],
    fileCount: 0,
    directoryCount: 0,
  };

  try {
    const items = await readdir(dirPath);

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const itemRelativePath = path.join(relativePath, item);

      try {
        const itemStat = await stat(fullPath);

        if (itemStat.isDirectory()) {
          const subDir = await processDirectory(fullPath, itemRelativePath);
          result.directories.push(subDir);
          result.directoryCount += 1 + subDir.directoryCount;
          result.fileCount += subDir.fileCount;
        } else {
          const file = await processFile(fullPath, itemRelativePath);
          result.files.push(file);
          result.fileCount++;
        }
      } catch (err) {
        console.error(`Error processing ${fullPath}:`, err.message);
        result.files.push({
          name: item,
          path: itemRelativePath,
          error: err.message,
        });
      }
    }
  } catch (err) {
    result.error = err.message;
  }

  return result;
}

// function displayResults(results, depth = 0) {
//   const indent = "  ".repeat(depth);

//   console.log(`${indent}📁 ${results.name} (${results.path})`);
//   console.log(`${indent}  Total Files: ${results.fileCount}`);
//   console.log(`${indent}  Total Subdirectories: ${results.directoryCount}`);

//   // Display files
//   results.files.forEach((file) => {
//     const crdownloadTag = file.wasCrdownload ? " [CRDOWNLOAD]" : "";
//     // console.log(
//     //   `${indent}  📄 ${file.name} (${file.extension}, ${file.size} bytes)${crdownloadTag}`
//     // );

//     if (file.preview) {
//     //   console.log(
//     //     `${indent}    Preview: ${file.preview.replace(/\n/g, `\n${indent}    `)}`
//     //   );
//     }

//     if (file.zipContents) {
//     //   console.log(`${indent}    ZIP Contents:`);
//       displayResults(file.zipContents, depth + 2);
//     }

//     if (file.error) {
//       console.log(`${indent}    Error: ${file.error}`);
//     }
//   });

//   // Display subdirectories
//   results.directories.forEach((dir) => {
//     displayResults(dir, depth + 1);
//   });
// }

async function main() {
  try {
    // Change this to your download folder path
    const downloadFolder =
      "/home/victor/Desktop/work/ai_bid_agent/crawler/downloads";

    console.log(
      "⏳ Processing files... This may take a while for large directories...\n"
    );
    const results = await processDirectory(downloadFolder);

    const result = k.map((itemA) => {
      const match = results.directories.find((itemB) => itemB.name === itemA.title);
      return match ? { ...itemA, ...match } : itemA;
    });

    
    console.log("🚀 ~ result ~ result:", result)

    
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

// Run the main function
main();
