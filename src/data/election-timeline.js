/**
 * EPEP Election Timeline Data
 */
const ELECTION_TIMELINE_DATA = {
  lokSabha: {
    title: "Lok Sabha",
    subtitle: "House of the People (Lower House of Parliament)",
    frequency: "Every 5 Years",
    seats: 543,
    governingBody: "Election Commission of India (ECI)",
    phases: [
      {
        phaseId: "ls-phase-1",
        phaseTitle: "Announcement & Schedule",
        phaseIcon: "Megaphone",
        steps: [
          {
            stepId: "ls-step-1",
            title: "Announcement of Election Schedule",
            description: "The ECI announces the dates for polling, nominations, and results.",
            responsible: ["ECI"],
            timeline: "Approx. 60 days before polling",
            legalBasis: "Article 324, Constitution of India",
            sourceUrl: "https://eci.gov.in/mcc/",
            voterAction: false,
            voterActionText: ""
          },
          {
            stepId: "ls-step-2",
            title: "Electoral Roll Verification",
            description: "Citizens must ensure their names are present in the final electoral rolls.",
            responsible: ["Voter", "ECI"],
            timeline: "Ongoing until nomination deadline",
            legalBasis: "Registration of Electors Rules, 1960",
            sourceUrl: "https://voters.eci.gov.in/",
            voterAction: true,
            voterActionText: "Check your name on voters.eci.gov.in or via Voter Helpline App."
          }
        ]
      },
      {
        phaseId: "ls-phase-2",
        phaseTitle: "Nominations & Scrutiny",
        phaseIcon: "FileText",
        steps: [
          {
            stepId: "ls-step-3",
            title: "Filing of Nominations",
            description: "Candidates file their nomination papers and security deposits.",
            responsible: ["Candidate", "RO"],
            timeline: "Within 7 days of notification",
            legalBasis: "Section 33, RP Act 1951",
            sourceUrl: "https://eci.gov.in/",
            voterAction: false,
            voterActionText: ""
          },
          {
            stepId: "ls-step-4",
            title: "Scrutiny of Nominations",
            description: "The RO examines nomination papers for validity.",
            responsible: ["RO"],
            timeline: "Day after nomination deadline",
            legalBasis: "Section 36, RP Act 1951",
            sourceUrl: "https://eci.gov.in/",
            voterAction: false,
            voterActionText: ""
          }
        ]
      },
      {
        phaseId: "ls-phase-3",
        phaseTitle: "Campaigning",
        phaseIcon: "Users",
        steps: [
          {
            stepId: "ls-step-5",
            title: "Election Campaign",
            description: "Political parties reach out to voters.",  
            responsible: ["Parties", "Candidates"],
            timeline: "Ends 48 hours before polling",
            legalBasis: "Section 126, RP Act 1951",
            sourceUrl: "https://eci.gov.in/",
            voterAction: false,
            voterActionText: ""
          }
        ]
      },
      {
        phaseId: "ls-phase-4",
        phaseTitle: "Polling & Counting",
        phaseIcon: "CheckSquare",
        steps: [
          {
            stepId: "ls-step-6",
            title: "Polling Day",
            description: "Voters cast their votes using EVMs and VVPATs.",
            responsible: ["Voter", "ECI"],
            timeline: "As per announced schedule",
            legalBasis: "Section 56-63, RP Act 1951",
            sourceUrl: "https://eci.gov.in/",
            voterAction: true,
            voterActionText: "Carry a valid ID and visit your assigned booth to vote."
          },
          {
            stepId: "ls-step-7",
            title: "Counting & Results",
            description: "Votes are counted and results are declared by the RO.",
            responsible: ["ECI", "RO"],
            timeline: "Usually within 3-4 days after last phase",
            legalBasis: "Section 64, RP Act 1951",
            sourceUrl: "https://eci.gov.in/",
            voterAction: false,
            voterActionText: ""
          }
        ]
      }
    ]
  },
  rajyaSabha: {
    title: "Rajya Sabha",
    subtitle: "Council of States (Upper House of Parliament)",
    frequency: "Permanent House (1/3rd retire every 2 years)",
    seats: 245,
    governingBody: "Election Commission of India (ECI)",
    phases: [
      {
        phaseId: "rs-phase-1",
        phaseTitle: "Notification & Nomination",
        phaseIcon: "Clipboard",
        steps: [
          {
            stepId: "rs-step-1",
            title: "Presidential Notification",
            description: "The President issues a notification.",
            responsible: ["President", "ECI"],
            timeline: "Biennial process",
            legalBasis: "Article 80, Constitution of India",
            sourceUrl: "https://rajyasabha.nic.in/",
            voterAction: false,
            voterActionText: ""
          }
        ]
      },
      {
        phaseId: "rs-phase-2",
        phaseTitle: "Indirect Election",
        phaseIcon: "Gavel",
        steps: [
          {
            stepId: "rs-step-2",
            title: "Voting by MLAs",
            description: "MLAs vote via single transferable vote.",
            responsible: ["MLAs"],
            timeline: "As per schedule",
            legalBasis: "Article 80(4), Constitution of India",
            sourceUrl: "https://rajyasabha.nic.in/",
            voterAction: false,
            voterActionText: ""
          }
        ]
      }
    ]
  },
  stateAssembly: {
    title: "Vidhan Sabha",
    subtitle: "State Legislative Assembly",
    frequency: "Every 5 Years",
    seats: 4123,
    governingBody: "Election Commission of India (ECI)",
    phases: [
      {
        phaseId: "sa-phase-1",
        phaseTitle: "Process Overview",
        phaseIcon: "Map",
        steps: [
          {
            stepId: "sa-step-1",
            title: "Similiar to Lok Sabha",
            description: "The process follows the same pattern.",
            responsible: ["ECI", "Voter"],
            timeline: "Varies by State",
            legalBasis: "Article 170, Constitution of India",
            sourceUrl: "https://eci.gov.in/",
            voterAction: true,
            voterActionText: "Ensure you are registered in your state's assembly constituency."
          }
        ]
      }
    ]
  },
  localBody: {
    title: "Local Body",
    subtitle: "Panchayats & Municipalities",
    frequency: "Every 5 Years",
    seats: 3200000,
    governingBody: "State Election Commission (SEC)",
    phases: [
      {
        phaseId: "lb-phase-1",
        phaseTitle: "State Governance",
        phaseIcon: "Home",
        steps: [
          {
            stepId: "lb-step-1",
            title: "SEC Jurisdiction",
            description: "Local Body elections are managed by SEC.",
            responsible: ["SEC"],
            timeline: "Varies by State",
            legalBasis: "73rd & 74th Amendments, Constitution",
            sourceUrl: "https://sec.maharashtra.gov.in/",
            voterAction: true,
            voterActionText: "Check your local SEC website for ward-level voter lists."
          }
        ]
      }
    ]
  }
};
export default ELECTION_TIMELINE_DATA;