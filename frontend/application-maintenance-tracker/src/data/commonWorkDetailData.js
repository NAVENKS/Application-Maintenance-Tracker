export const currentUserRole = "TESTER"; 
// change to "TESTER" to see tester view

export const workDetail = {
  tokenId: "TK1201",
  title: "Payment timeout issue",
  description:
    "Timeout occurs during payment processing in peak hours.",
  status: "IN_PROGRESS", // IN_PROGRESS | SENT_FOR_TESTING
  priority: "High",
  application: "Payment Service",
  environment: "Production",

  adminComment:
    "Production issue. Fix urgently and send for testing.",

  developerComment:
    "Root cause identified in gateway timeout configuration.",

  testerComment: "",
};
