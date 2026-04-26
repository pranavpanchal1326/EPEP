/**
 * EPEP EVM Educational Content
 * Source of truth for tooltips and deep-dive modal content.
 * Sourced from ECI.gov.in and Indian Electoral Law.
 */

export const EVM_TOOLTIP_CONTENT = {
  'ballot-unit': {
    short: 'The Ballot Unit shows all candidates. Voters press the blue button next to their chosen candidate to cast their vote.',
    learnMoreId: 'ballot-unit-deep',
  },
  'control-unit': {
    short: 'The Control Unit is operated only by the Returning Officer — a government official who enables and monitors the machine.',
    learnMoreId: 'control-unit-deep',
  },
  'blue-button': {
    short: 'Each blue button is linked to one candidate. Once pressed, the EVM locks — no changes allowed. One voter, one vote.',
    learnMoreId: 'blue-button-deep',
  },
  'vvpat-unit': {
    short: 'The VVPAT prints a paper slip showing your voted candidate for 7 seconds. It is your proof the machine recorded correctly.',
    learnMoreId: 'vvpat-deep',
  },
  'nota-option': {
    short: 'NOTA (None Of The Above) lets you reject all candidates. Added by Supreme Court order in 2013. Your vote still counts.',
    learnMoreId: 'nota-deep',
  },
  'returning-officer': {
    short: 'The Returning Officer is a senior government official appointed by the ECI. Only they can enable the voting machine.',
    learnMoreId: 'returning-officer-deep',
  },
  'enable-button': {
    short: 'The RO presses Enable before each voter — this prevents double voting. The machine stays locked between voters.',
    learnMoreId: 'enable-button-deep',
  },
  'status-led': {
    short: 'The LED light shows machine status. Green = ready to vote. Amber = processing. Grey = locked. Matches the real EVM.',
    learnMoreId: 'status-led-deep',
  },
  'session-id': {
    short: 'Every vote gets a unique serial number — the same number appears on the VVPAT slip. This enables recounting audits.',
    learnMoreId: 'session-id-deep',
  },
  'mock-results': {
    short: 'These are randomly generated for education. Real results are declared only after all election phases close.',
    learnMoreId: 'mock-results-deep',
  },
};

export const EVM_LEARN_MORE_CONTENT = {
  'ballot-unit-deep': {
    title: 'The Ballot Unit',
    subtitle: 'The voter-facing half of the EVM',
    whatItIs: "The Ballot Unit (BU) is the component of the Electronic Voting Machine that faces the voter in the polling booth. It is a flat panel containing rows of buttons — one per candidate — with the candidate's serial number, name, and party symbol printed next to each button. The ballot unit is connected to the Control Unit by a 5-metre cable and has no independent power source. It cannot function without the Control Unit.",
    whyItExists: "Before EVMs, India used paper ballots — voters marked their choice with a rubber stamp. Paper ballots were vulnerable to booth capturing, ballot stuffing, and miscounting. The EVM's ballot unit eliminated these vulnerabilities. A voter can only press one button per session, and the machine physically locks after each vote, making double-voting mechanically impossible.",
    howItWorks: "When the Returning Officer enables the Control Unit, a ready signal travels down the cable to the Ballot Unit, activating all candidate buttons. The voter presses their chosen button. The BU sends the vote signal to the CU, which records it in encrypted memory. The BU then locks until the RO enables the next voter.",
    legalBasis: "Governed under Section 61A of the Representation of the People Act, 1951, inserted by amendment in 1989. The Election Commission of India was empowered to use EVMs in all elections by this amendment.",
    didYouKnow: "India's EVMs are manufactured only by two public sector units: Bharat Electronics Limited (BEL), Bangalore, and Electronics Corporation of India Limited (ECIL), Hyderabad. No private company manufactures Indian EVMs.",
    source: 'ECI.gov.in — EVM Technical Specifications, 2023',
    sourceUrl: 'https://www.eci.gov.in/evm',
  },
  'control-unit-deep': {
    title: 'The Control Unit',
    subtitle: "The Returning Officer's command center",
    whatItIs: "The Control Unit (CU) is the officer-facing component of the EVM. It contains the processor, encrypted memory, and power source (a single 6V alkaline battery). It has three key buttons: BALLOT (to enable the ballot unit for a new voter), CLOSE (to end polling), and RESULT (accessible only after closing, to display vote counts). The CU stores up to 3,840 votes per unit.",
    whyItExists: "The separation of Ballot Unit and Control Unit is a deliberate security design. Since only the Returning Officer can enable the next voter via the Control Unit, the system prevents a voter from voting twice. The officer keeps the CU in sight at all times while the voter uses the BU in a screened booth.",
    howItWorks: "At the start of polling, the RO presses BALLOT to enable the first voter. After each vote, the CU auto-locks. The RO presses BALLOT for the next voter. At close of polling, CLOSE is pressed — after which no more votes are accepted. Results are only accessible via RESULT button, and only after CLOSE has been pressed.",
    legalBasis: "The role and responsibilities of the Returning Officer are defined under Section 26 of the Representation of the People Act, 1951, and further specified in the ECI's Handbook for Returning Officers (updated 2024).",
    didYouKnow: "The Control Unit's memory is non-volatile — it retains vote data even if the battery dies or is removed. Data is only cleared when the machine is prepared for a new election.",
    source: 'ECI — Handbook for Returning Officers, 2024',
    sourceUrl: 'https://www.eci.gov.in',
  },
  'blue-button-deep': {
    title: 'The Candidate Selection Button',
    subtitle: 'One press. One vote. Irreversible.',
    whatItIs: "Each blue circular button on the Ballot Unit is electronically linked to one candidate. The buttons are made of robust ABS plastic and rated for over one million presses. The blue color is standardised — all Indian EVMs use the same blue regardless of manufacturer or election type.",
    whyItExists: "The physical button design — rather than a touchscreen — was a deliberate choice for reliability and accessibility. Physical buttons work without calibration, do not suffer from ghost touches, function in extreme heat or dust, and can be used by voters who have never touched a touchscreen.",
    howItWorks: "When a voter presses a candidate button, a signal travels through the cable to the Control Unit. The CU records the vote in its encrypted memory with a timestamp. The Ballot Unit immediately locks — all other buttons become unresponsive. The machine emits a beep confirming the vote was registered.",
    legalBasis: "ECI Technical Specification for EVMs, Revision 3 (2020). The locking mechanism after a single press is a mandatory specification — no EVM passes ECI certification without it.",
    didYouKnow: "The earliest Indian EVM prototypes in 1977 used toggle switches instead of buttons. The circular blue button design was standardised in 1998 after field trials across multiple states.",
    source: 'ECI — EVM Technical Specifications, Revision 3, 2020',
    sourceUrl: 'https://www.eci.gov.in/evm',
  },
  'vvpat-deep': {
    title: 'VVPAT — Voter Verifiable Paper Audit Trail',
    subtitle: 'Your 7-second paper proof',
    whatItIs: "The VVPAT is a printer unit attached to the Ballot Unit. When a vote is cast, it prints a small paper slip (approximately 49mm × 71mm) showing the voter's chosen candidate: serial number, name, and party symbol. The slip is visible through a transparent glass window for exactly 7 seconds, then drops into a sealed paper compartment.",
    whyItExists: "Opposition parties and civil society raised concerns about EVM tampering in the 2009 elections. The Supreme Court of India, in its 2013 judgment in the PUCL vs Union of India case, directed the ECI to introduce VVPAT in all elections. The paper slip serves as an independent audit trail.",
    howItWorks: "The VVPAT is connected to the Ballot Unit. When a candidate button is pressed, both the EVM records the digital vote AND the VVPAT prints the paper slip simultaneously. The window opens for 7 seconds — a timer set by ECI regulation. After 7 seconds, the slip drops.",
    legalBasis: "Supreme Court of India — PUCL vs Union of India (2013). ECI Notification on VVPAT guidelines, 2013.",
    didYouKnow: "In the 2024 Lok Sabha elections, over 5.5 million VVPAT units were deployed. The Supreme Court in April 2024 ruled that the current audit of 5 random EVMs per constituency is statistically sufficient.",
    source: 'Supreme Court — PUCL vs Union of India (2013) | ECI VVPAT Guidelines',
    sourceUrl: 'https://www.eci.gov.in/evm',
  },
  'nota-deep': {
    title: 'NOTA — None Of The Above',
    subtitle: 'The right to reject, enshrined by the Supreme Court',
    whatItIs: "NOTA (None Of The Above) is the last option on every Indian EVM ballot. It allows a voter to formally record their rejection of all candidates on the ballot. The NOTA symbol — a ballot paper with an X mark — was designed by the National Institute of Design, Ahmedabad.",
    whyItExists: "The People's Union for Civil Liberties (PUCL) argued before the Supreme Court that the right to vote includes the right to reject. The Supreme Court agreed in its landmark judgment on September 27, 2013.",
    howItWorks: "NOTA is treated as a valid vote in the count — it appears in the official results. However, NOTA votes do NOT change the outcome: even if NOTA gets the highest count, the candidate with the next highest votes wins.",
    legalBasis: "Supreme Court of India — PUCL vs Union of India (2013). ECI Order No. 3/ER/2013/SDR dated September 27, 2013.",
    didYouKnow: "In the 2024 Lok Sabha elections, NOTA received approximately 6.1 million votes nationally — about 0.99% of total votes cast.",
    source: 'Supreme Court — PUCL vs Union of India (2013) | ECI Statistical Report 2024',
    sourceUrl: 'https://www.eci.gov.in/statistical-report',
  },
  'returning-officer-deep': {
    title: 'The Returning Officer',
    subtitle: 'The guardian of every polling booth',
    whatItIs: "The Returning Officer (RO) is a senior government official appointed by the Election Commission of India for each constituency. The RO is responsible for the entire election process in their constituency.",
    whyItExists: "The RO system ensures that elections are conducted by neutral government officials under ECI supervision — not by political parties or candidates. The independence of the RO is guaranteed by the Constitution.",
    howItWorks: "On polling day, the RO delegates to Presiding Officers at each booth. The Presiding Officer operates the Control Unit — specifically the BALLOT button that enables each voter.",
    legalBasis: "Article 324 of the Constitution of India. Section 21 of the Representation of the People Act, 1951.",
    didYouKnow: "For the 2024 Lok Sabha elections, over 1.5 million government officials were deployed as Presiding Officers and polling staff.",
    source: 'ECI — Handbook for Returning Officers, 2024 | Article 324, Constitution of India',
    sourceUrl: 'https://www.eci.gov.in',
  },
  'enable-button-deep': {
    title: 'The Enable / BALLOT Button',
    subtitle: 'Why one button controls one voter',
    whatItIs: 'The BALLOT button on the Control Unit is the mechanism the Presiding Officer uses to authorise each voter to cast their vote. Without this button being pressed, the Ballot Unit remains locked.',
    whyItExists: 'This is the core anti-fraud mechanism of the EVM. Each voter must be individually authorised by a government official before they can vote. This prevents double voting.',
    howItWorks: 'When BALLOT is pressed, the Control Unit sends a single-voter-enable signal to the Ballot Unit. The BU activates for exactly one vote. Once that vote is cast, the BU locks again.',
    legalBasis: "ECI Instructions for Polling Stations, Clause 14.3. Indelible ink mandate: Section 61 of the Representation of the People Act, 1951.",
    didYouKnow: "There is a 90-second timeout after enablement. If no vote is cast, the unit locks to ensure the polling station keeps moving.",
    source: 'ECI — Instructions for Polling Stations, 2024 | RP Act, 1951, Section 61',
    sourceUrl: 'https://www.eci.gov.in',
  },
  'status-led-deep': {
    title: 'The Status LED',
    subtitle: 'What the lights are telling you',
    whatItIs: 'The LED indicator on the Control Unit shows the current operational state of the EVM at a glance. It provides an instant visual status check for the Presiding Officer.',
    whyItExists: 'In busy polling stations, the LED provides an instant visual status check. It tells the officer whether the machine is ready for the next voter or currently processing.',
    howItWorks: 'Green steady = ready for voter. Amber pulsing = processing/recording. The LED states are hardwired to the machine\'s operational firmware.',
    legalBasis: 'ECI Technical Specification for EVMs, Revision 3, Section 4.2.',
    didYouKnow: 'The amber/pulsing indicator for "processing" state was added in the M2 model series (2006 onwards) after Presiding Officers reported confusion.',
    source: 'ECI — EVM Technical Specifications, Revision 3, 2020',
    sourceUrl: 'https://www.eci.gov.in/evm',
  },
  'session-id-deep': {
    title: 'The Vote Serial Number',
    subtitle: 'Every vote has an audit trail',
    whatItIs: 'Every voting session generates a unique serial number. This number appears on the Control Unit screen and on the VVPAT slip simultaneously.',
    whyItExists: 'The serial number system is the backbone of EVM auditability. It allows cross-referencing the paper slip with the machine log if results are disputed.',
    howItWorks: 'In real EVMs, the VVPAT slip is printed with a machine ID, booth ID, and a sequential vote number. Our simulation randomises this ID to demonstrate the concept.',
    legalBasis: "ECI VVPAT Guidelines, 2013, Clause 7. Supreme Court — PUCL vs Union of India (2013).",
    didYouKnow: "In the 2024 elections, VVPAT slips from 2,723 randomly selected stations matched 100% with EVM digital counts.",
    source: 'ECI VVPAT Guidelines, 2013 | ECI Press Note, June 2024',
    sourceUrl: 'https://www.eci.gov.in',
  },
  'mock-results-deep': {
    title: 'Election Results — How They Really Work',
    subtitle: 'Why you never know the winner on voting day',
    whatItIs: 'The results shown in this simulator are randomly generated. Real Indian election results follow a strictly regulated counting process that happens weeks after polling closes.',
    whyItExists: "India's elections span multiple phases. Results are counted simultaneously on a single day to prevent early results from influencing later-phase voters.",
    howItWorks: 'On counting day, EVMs are opened in the presence of candidates\' agents. The RESULT button is pressed on each Control Unit to display totals.',
    legalBasis: "Section 64 of the Representation of the People Act, 1951. ECI's Returning Officer's Handbook, Chapter 9.",
    didYouKnow: "The fastest counting was the 2020 Delhi Assembly elections — results declared within 4 hours. The slowest was 1957, spanning nearly 3 months.",
    source: 'ECI — Handbook for Returning Officers, Chapter 9, 2024',
    sourceUrl: 'https://www.eci.gov.in',
  },
};

export const EVM_PHASE_GUIDE = {
  idle: {
    step: '01',
    instruction: 'Welcome to the EVM Simulator',
    hint: 'You are a voter in a polling booth. The Returning Officer must enable the machine before you can vote. Press "Enable Voting Machine" on the Control Unit (right panel) to begin.',
    tooltipId: 'returning-officer',
  },
  enabling: {
    step: '02',
    instruction: 'Returning Officer is enabling the machine',
    hint: 'In a real polling station, the Presiding Officer has checked your voter ID and applied indelible ink. They are now activating the EVM for your vote.',
    tooltipId: 'enable-button',
  },
  enabled: {
    step: '03',
    instruction: 'Machine enabled — cast your vote',
    hint: 'Press the blue circular button next to your chosen candidate on the Ballot Unit. You have one chance. The machine will lock the moment you press.',
    tooltipId: 'blue-button',
  },
  voting: {
    step: '04',
    instruction: 'Recording your vote',
    hint: "Your vote is being encrypted and stored in the EVM's memory. The machine is also sending a signal to the VVPAT printer.",
    tooltipId: 'blue-button',
  },
  voted: {
    step: '05',
    instruction: 'Vote recorded — check your VVPAT slip',
    hint: 'Your vote is confirmed. Look at the VVPAT unit (below the Ballot Unit) — a paper slip has printed showing your candidate. You have 7 seconds to verify it.',
    tooltipId: 'vvpat-unit',
  },
  results: {
    step: '06',
    instruction: 'Mock results (educational only)',
    hint: 'In a real election, these results would only be available on counting day. These numbers are randomly generated. Reset to vote again.',
    tooltipId: 'mock-results',
  },
};
