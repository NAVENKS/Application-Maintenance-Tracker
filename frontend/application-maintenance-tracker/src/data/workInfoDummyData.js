export const currentUserRole = "DEVELOPER"; 

export const workInfo = {
  id: "TK801",
  title: "Payment timeout issue",
  description:
    "Timeout occurs during peak hours due to gateway misconfiguration.",
  status: "IN_PROGRESS",
  priority: "High",
  application: "Payment Service",
  assignedDeveloper: "Dev A",
  assignedTester: "Tester A",

  comments: [
    { role: "Admin", text: "High priority production issue." },
    { role: "Developer", text: "Root cause identified, fixing timeout config." },
    { role: "Tester", text: "Awaiting fix for testing." },
  ],

  closedAt: "2024-02-15",
};