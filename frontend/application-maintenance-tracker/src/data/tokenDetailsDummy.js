export const tokenDetails = {
  id: "TK601",
  title: "Payment timeout issue",
  description:
    "Users face timeout while making payments during peak hours.",
  status: "CLOSED", // change to CLOSED to test
  priority: "High",
  application: "Payment Service",
  environment: "Production",
  createdBy: "User A",
  assignedDeveloper: "Dev A",
  assignedTester: "Tester A",
  createdAt: "2024-02-10",
  closedAt: "2024-02-12",

  comments: [
    {
      role: "Admin",
      message: "Assigning as high priority due to production impact.",
    },
    {
      role: "Developer",
      message: "Identified issue in timeout config, working on fix.",
    },
    {
      role: "Tester",
      message: "Initial testing pending.",
    },
  ],
};
