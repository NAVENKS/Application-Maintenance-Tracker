const nodemailer = require('nodemailer');

// ── Gmail SMTP Transporter ───────────────────────────────────
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // ✅ use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const DEV_TESTER_EMAIL = process.env.DEV_TESTER_EMAIL || 'ksnaven123@gmail.com';

// ── Generic send (fire-and-forget, never crashes) ────────────
const sendEmail = async (to, subject, html) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️  EMAIL_USER / EMAIL_PASS not set — skipping email');
      return;
    }
    await transporter.sendMail({
      from: `"Application Maintenance Tracker" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to}: ${subject}`);
  } catch (err) {
    console.error(`❌ Email failed to ${to}:`, err.message);
  }
};

// ── HTML wrapper ─────────────────────────────────────────────
const wrapHtml = (title, body) => `
  <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden">
    <div style="background:linear-gradient(135deg,#1a237e,#283593);padding:20px 24px">
      <h2 style="margin:0;color:#fff;font-size:18px">${title}</h2>
    </div>
    <div style="padding:24px;color:#333;line-height:1.6">
      ${body}
    </div>
    <div style="background:#f5f5f5;padding:12px 24px;text-align:center;font-size:12px;color:#999">
      Application Maintenance Tracker &mdash; Automated Notification
    </div>
  </div>
`;

// ── Token detail table (reusable) ────────────────────────────
const tokenTable = (token) => `
  <table style="width:100%;border-collapse:collapse;margin:16px 0">
    <tr><td style="padding:8px 12px;background:#f8f9fa;font-weight:600;width:40%">Token ID</td><td style="padding:8px 12px">#${token.token_id}</td></tr>
    <tr><td style="padding:8px 12px;background:#f8f9fa;font-weight:600">Title</td><td style="padding:8px 12px">${token.title}</td></tr>
    <tr><td style="padding:8px 12px;background:#f8f9fa;font-weight:600">Application</td><td style="padding:8px 12px">${token.application_name}</td></tr>
    <tr><td style="padding:8px 12px;background:#f8f9fa;font-weight:600">Environment</td><td style="padding:8px 12px">${token.environment}</td></tr>
    <tr><td style="padding:8px 12px;background:#f8f9fa;font-weight:600">Priority</td><td style="padding:8px 12px">${token.priority || 'Not set'}</td></tr>
    <tr><td style="padding:8px 12px;background:#f8f9fa;font-weight:600">Status</td><td style="padding:8px 12px"><strong>${token.status}</strong></td></tr>
  </table>
`;

// ═══════════════════════════════════════════════════════════════
// EMAIL TEMPLATES
// ═══════════════════════════════════════════════════════════════

// 1. User creates a token → notify Admin
const sendTokenCreatedEmail = (adminEmail, token, creatorName) => {
  const subject = `🆕 New Token Created — #${token.token_id}: ${token.title}`;
  const html = wrapHtml('New Token Created', `
    <p><strong>${creatorName}</strong> has raised a new issue that requires your attention.</p>
    ${tokenTable(token)}
    <p><strong>Description:</strong></p>
    <p style="background:#f8f9fa;padding:12px;border-radius:4px">${token.description}</p>
    <p style="margin-top:16px">Please log in to the dashboard to review and assign this token.</p>
  `);
  sendEmail(adminEmail, subject, html);
};

// 2. Admin assigns token → notify Developer + Tester
const sendTokenAssignedEmail = (token, developerName, testerName) => {
  const subject = `📋 Token Assigned — #${token.token_id}: ${token.title}`;
  const html = wrapHtml('Token Assigned to You', `
    <p>A token has been assigned for development and testing.</p>
    ${tokenTable(token)}
    <p><strong>Developer:</strong> ${developerName}</p>
    <p><strong>Tester:</strong> ${testerName}</p>
    ${token.admin_comment ? `<p><strong>Admin Comment:</strong> ${token.admin_comment}</p>` : ''}
    <p style="margin-top:16px">Please log in to the dashboard to begin work.</p>
  `);
  sendEmail(DEV_TESTER_EMAIL, subject, html);
};

// 3. Developer updates status (IN_PROGRESS) → notify User
const sendStatusUpdateEmail = (userEmail, token, newStatus) => {
  const statusLabels = {
    'IN_PROGRESS': '🔧 In Progress',
    'SENT_FOR_TESTING': '🧪 Sent for Testing',
    'ASSIGNED': '📋 Assigned',
    'REJECTED': '❌ Rejected',
    'CLOSED': '✅ Closed',
  };
  const label = statusLabels[newStatus] || newStatus;
  const subject = `Status Update — #${token.token_id}: ${token.title} → ${newStatus}`;
  const html = wrapHtml('Token Status Updated', `
    <p>Your token status has been updated to: <strong>${label}</strong></p>
    ${tokenTable({ ...token, status: newStatus })}
    <p style="margin-top:16px">Log in to the dashboard to view full details.</p>
  `);
  sendEmail(userEmail, subject, html);
};

// 4. Developer sends to tester (SENT_FOR_TESTING) → notify Tester
const sendSentForTestingEmail = (token) => {
  const subject = `🧪 Ready for Testing — #${token.token_id}: ${token.title}`;
  const html = wrapHtml('Token Ready for Testing', `
    <p>The developer has completed work and sent this token for your testing.</p>
    ${tokenTable({ ...token, status: 'SENT_FOR_TESTING' })}
    <p style="margin-top:16px">Please log in to the dashboard to review and test.</p>
  `);
  sendEmail(DEV_TESTER_EMAIL, subject, html);
};

// 5. Tester approves/rejects → notify Admin + User
const sendTesterResultEmail = (adminEmail, userEmail, token, result) => {
  const isApproved = result === 'CLOSED';
  const emoji = isApproved ? '✅' : '❌';
  const label = isApproved ? 'Approved & Closed' : 'Rejected';
  const subject = `${emoji} Token ${label} — #${token.token_id}: ${token.title}`;
  const html = wrapHtml(`Token ${label}`, `
    <p>The tester has <strong>${label.toLowerCase()}</strong> this token.</p>
    ${tokenTable({ ...token, status: result })}
    ${!isApproved ? '<p>The token has been sent back to the developer for rework.</p>' : '<p>This token is now closed.</p>'}
    <p style="margin-top:16px">Log in to the dashboard to view full details.</p>
  `);
  // Send to admin
  sendEmail(adminEmail, subject, html);
  // Send to user (ticket creator)
  if (userEmail && userEmail !== adminEmail) {
    sendEmail(userEmail, subject, html);
  }
};

module.exports = {
  sendTokenCreatedEmail,
  sendTokenAssignedEmail,
  sendStatusUpdateEmail,
  sendSentForTestingEmail,
  sendTesterResultEmail,
};
