const {
  createToken,
  getTokensByUser,
  getAllTokens,
  getTodayTokens,
  getUnassignedTokens,
  getTokenById,
  updateTokenStatus,
  updateTokenPriority,
  assignToken,
  getDeveloperTokens,
  getClosedDeveloperTokens,
  getTesterTokens,
  getClosedTesterTokens,
  addComment,
  getCommentsByToken,
  addHistory,
  getUserSummary,
  getAdminSummary,
  getDeveloperSummary,
  getTesterSummary,
  getUsersByRole,
  getAdminEmail,
  getUserEmailById,
} = require('../models/queries');

const {
  sendTokenCreatedEmail,
  sendTokenAssignedEmail,
  sendStatusUpdateEmail,
  sendSentForTestingEmail,
  sendTesterResultEmail,
} = require('../utils/emailService');

// ─── USER ────────────────────────────────────────────────────────────────────

const createNewToken = async (req, res) => {
  try {
    const { title, description, application_name, environment } = req.body;
    if (!title || !description || !application_name || !environment) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const token = await createToken(title, description, application_name, environment, req.user.id);
    await addHistory(token.token_id, null, 'OPEN', req.user.id);

    // 📧 Email admin about new token
    getAdminEmail().then(adminEmail => {
      if (adminEmail) sendTokenCreatedEmail(adminEmail, token, req.user.name || 'A user');
    }).catch(err => console.error('Email lookup failed:', err.message));

    res.status(201).json({ message: 'Token created successfully', token });
  } catch (err) {
    console.error('Create token error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyTokens = async (req, res) => {
  try {
    const [tokens, summary] = await Promise.all([
      getTokensByUser(req.user.id),
      getUserSummary(req.user.id),
    ]);
    res.json({ tokens, summary });
  } catch (err) {
    console.error('Get my tokens error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── ADMIN ───────────────────────────────────────────────────────────────────

const adminGetAllTokens = async (req, res) => {
  try {
    const [tokens, summary] = await Promise.all([getAllTokens(), getAdminSummary()]);
    res.json({ tokens, summary });
  } catch (err) {
    console.error('Admin get all tokens error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const adminGetTodayTokens = async (req, res) => {
  try {
    const tokens = await getTodayTokens();
    res.json({ tokens });
  } catch (err) {
    console.error('Admin get today tokens error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const adminGetUnassignedTokens = async (req, res) => {
  try {
    const tokens = await getUnassignedTokens();
    res.json({ tokens });
  } catch (err) {
    console.error('Admin get unassigned tokens error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const adminGetUsers = async (req, res) => {
  try {
    const [developers, testers] = await Promise.all([
      getUsersByRole('DEVELOPER'),
      getUsersByRole('TESTER'),
    ]);
    res.json({ developers, testers });
  } catch (err) {
    console.error('Admin get users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const adminAssignToken = async (req, res) => {
  try {
    const { token_id, developer_id, tester_id, priority, admin_comment } = req.body;
    if (!token_id || !developer_id || !tester_id || !priority) {
      return res.status(400).json({ message: 'token_id, developer_id, tester_id, and priority are required' });
    }
    const token = await getTokenById(token_id);
    if (!token) return res.status(404).json({ message: 'Token not found' });

    await updateTokenPriority(token_id, priority);
    await assignToken(token_id, developer_id, tester_id, req.user.id, admin_comment || '');

    const oldStatus = token.status;
    await updateTokenStatus(token_id, 'ASSIGNED');
    await addHistory(token_id, oldStatus, 'ASSIGNED', req.user.id);

    // 📧 Email developer & tester about assignment
    const updatedToken = await getTokenById(token_id);
    sendTokenAssignedEmail(
      updatedToken,
      updatedToken.developer_name || 'Developer',
      updatedToken.tester_name || 'Tester'
    );

    // 📧 Email user about status change
    getUserEmailById(token.created_by).then(userEmail => {
      if (userEmail) sendStatusUpdateEmail(userEmail, updatedToken, 'ASSIGNED');
    }).catch(err => console.error('Email lookup failed:', err.message));

    res.json({ message: 'Token assigned successfully' });
  } catch (err) {
    console.error('Assign token error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── TOKEN DETAIL (ALL ROLES) ─────────────────────────────────────────────────

const getTokenDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const token = await getTokenById(id);
    if (!token) return res.status(404).json({ message: 'Token not found' });

    const allComments = await getCommentsByToken(id);
    const role = req.user.role;

    // Comment visibility rules
    let comments;
    if (token.status === 'CLOSED' || role === 'ADMIN' || role === 'USER') {
      comments = allComments; // all visible
    } else if (role === 'DEVELOPER') {
      // Developer sees only ADMIN comments (not TESTER)
      comments = allComments.filter((c) => c.role === 'ADMIN');
    } else if (role === 'TESTER') {
      // Tester sees ADMIN + DEVELOPER comments
      comments = allComments.filter((c) => c.role === 'ADMIN' || c.role === 'DEVELOPER');
    } else {
      comments = allComments;
    }

    res.json({ token, comments });
  } catch (err) {
    console.error('Get token detail error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── DEVELOPER ───────────────────────────────────────────────────────────────

const developerGetAssigned = async (req, res) => {
  try {
    const [tokens, summary] = await Promise.all([
      getDeveloperTokens(req.user.id),
      getDeveloperSummary(req.user.id),
    ]);
    res.json({ tokens, summary });
  } catch (err) {
    console.error('Developer get assigned error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const developerUpdate = async (req, res) => {
  try {
    const { token_id, comment } = req.body;
    if (!token_id || !comment) {
      return res.status(400).json({ message: 'token_id and comment are required' });
    }
    const token = await getTokenById(token_id);
    if (!token) return res.status(404).json({ message: 'Token not found' });

    // Add or update developer comment
    const allComments = await getCommentsByToken(token_id);
    const existingDevComment = allComments.find((c) => c.user_id === req.user.id && c.role === 'DEVELOPER');

    if (!existingDevComment) {
      await addComment(token_id, req.user.id, 'DEVELOPER', comment);
    } else {
      // Update the existing developer comment
      const pool = require('../config/database');
      await pool.query(
        'UPDATE token_comments SET comment = $1 WHERE comment_id = $2',
        [comment, existingDevComment.comment_id]
      );
    }

    if (token.status === 'ASSIGNED' || token.status === 'REJECTED') {
      await updateTokenStatus(token_id, 'IN_PROGRESS');
      await addHistory(token_id, token.status, 'IN_PROGRESS', req.user.id);

      // 📧 Email user about IN_PROGRESS status
      getUserEmailById(token.created_by).then(userEmail => {
        if (userEmail) sendStatusUpdateEmail(userEmail, token, 'IN_PROGRESS');
      }).catch(err => console.error('Email lookup failed:', err.message));
    }

    res.json({ message: 'Developer update saved' });
  } catch (err) {
    console.error('Developer update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const developerSendToTester = async (req, res) => {
  try {
    const { token_id, comment } = req.body;
    if (!token_id) return res.status(400).json({ message: 'token_id is required' });

    const token = await getTokenById(token_id);
    if (!token) return res.status(404).json({ message: 'Token not found' });

    // Save comment if provided
    if (comment) {
      const allComments = await getCommentsByToken(token_id);
      const existingDevComment = allComments.find((c) => c.user_id === req.user.id && c.role === 'DEVELOPER');
      if (!existingDevComment) {
        await addComment(token_id, req.user.id, 'DEVELOPER', comment);
      } else {
        const pool = require('../config/database');
        await pool.query(
          'UPDATE token_comments SET comment = $1 WHERE comment_id = $2',
          [comment, existingDevComment.comment_id]
        );
      }
    }

    const oldStatus = token.status;
    await updateTokenStatus(token_id, 'SENT_FOR_TESTING');
    await addHistory(token_id, oldStatus, 'SENT_FOR_TESTING', req.user.id);

    // 📧 Email tester that work is ready for testing
    sendSentForTestingEmail(token);

    // 📧 Email user about status change
    getUserEmailById(token.created_by).then(userEmail => {
      if (userEmail) sendStatusUpdateEmail(userEmail, token, 'SENT_FOR_TESTING');
    }).catch(err => console.error('Email lookup failed:', err.message));

    res.json({ message: 'Token sent to tester' });
  } catch (err) {
    console.error('Send to tester error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── TESTER ──────────────────────────────────────────────────────────────────

const testerGetAssigned = async (req, res) => {
  try {
    const [tokens, summary] = await Promise.all([
      getTesterTokens(req.user.id),
      getTesterSummary(req.user.id),
    ]);
    res.json({ tokens, summary });
  } catch (err) {
    console.error('Tester get assigned error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const testerApprove = async (req, res) => {
  try {
    const { token_id, comment } = req.body;
    if (!token_id) return res.status(400).json({ message: 'token_id is required' });

    const token = await getTokenById(token_id);
    if (!token) return res.status(404).json({ message: 'Token not found' });

    if (comment) {
      await addComment(token_id, req.user.id, 'TESTER', comment);
    }

    await updateTokenStatus(token_id, 'CLOSED');
    await addHistory(token_id, token.status, 'CLOSED', req.user.id);

    // 📧 Email admin + user about approval
    Promise.all([getAdminEmail(), getUserEmailById(token.created_by)])
      .then(([adminEmail, userEmail]) => {
        if (adminEmail || userEmail) sendTesterResultEmail(adminEmail, userEmail, token, 'CLOSED');
      }).catch(err => console.error('Email lookup failed:', err.message));

    res.json({ message: 'Token approved and closed' });
  } catch (err) {
    console.error('Tester approve error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const testerReject = async (req, res) => {
  try {
    const { token_id, comment } = req.body;
    if (!token_id) return res.status(400).json({ message: 'token_id is required' });

    const token = await getTokenById(token_id);
    if (!token) return res.status(404).json({ message: 'Token not found' });

    if (comment) {
      await addComment(token_id, req.user.id, 'TESTER', comment);
    }

    await updateTokenStatus(token_id, 'REJECTED');
    await addHistory(token_id, token.status, 'REJECTED', req.user.id);

    // 📧 Email admin + user about rejection
    Promise.all([getAdminEmail(), getUserEmailById(token.created_by)])
      .then(([adminEmail, userEmail]) => {
        if (adminEmail || userEmail) sendTesterResultEmail(adminEmail, userEmail, token, 'REJECTED');
      }).catch(err => console.error('Email lookup failed:', err.message));

    res.json({ message: 'Token rejected and sent back to developer' });
  } catch (err) {
    console.error('Tester reject error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── CLOSED (MY WORKS) ───────────────────────────────────────────────────────

const getClosedTokens = async (req, res) => {
  try {
    const role = req.user.role;
    let tokens = [];
    if (role === 'DEVELOPER') {
      tokens = await getClosedDeveloperTokens(req.user.id);
    } else if (role === 'TESTER') {
      tokens = await getClosedTesterTokens(req.user.id);
    }

    // Enrich each token with all comments
    const enriched = await Promise.all(
      tokens.map(async (t) => {
        const comments = await getCommentsByToken(t.token_id);
        return { ...t, comments };
      })
    );

    res.json({ tokens: enriched });
  } catch (err) {
    console.error('Get closed tokens error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createNewToken,
  getMyTokens,
  adminGetAllTokens,
  adminGetTodayTokens,
  adminGetUnassignedTokens,
  adminGetUsers,
  adminAssignToken,
  getTokenDetail,
  developerGetAssigned,
  developerUpdate,
  developerSendToTester,
  testerGetAssigned,
  testerApprove,
  testerReject,
  getClosedTokens,
};
