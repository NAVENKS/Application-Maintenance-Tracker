export const currentUserRole = "DEVELOPER";
// DEVELOPER | TESTER
export const closedWorks = [
  {
    tokenId: "TK1501",
    title: "Payment timeout issue",
    application: "Payment Service",
    priority: "High",
    closedAt: "2024-03-05",

    developerName: "Dev A",
    testerName: "Tester A",

    adminComment: "Production issue. Fix urgently.",
    developerComment: "Timeout increased and gateway config optimized.",
    testerComment: "Verified in UAT. Issue resolved successfully.",
  },
  {
    tokenId: "TK1502",
    title: "UI alignment bug",
    application: "Dashboard UI",
    priority: "Low",
    closedAt: "2024-03-02",

    developerName: "Dev B",
    testerName: "Tester B",

    adminComment: "Minor UI issue.",
    developerComment: "CSS fixed and responsiveness improved.",
    testerComment: "Checked on all screen sizes.",
  },
];
