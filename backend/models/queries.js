const pool = require('../config/database');



const findUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const getUsersByRole = async (role) => {
  const result = await pool.query(
    'SELECT id, name, email, role FROM users WHERE role = $1 ORDER BY name',
    [role]
  );
  return result.rows;
};



const createToken = async (title, description, application_name, environment, created_by) => {
  const result = await pool.query(
    `INSERT INTO tokens (title, description, application_name, environment, created_by, status)
     VALUES ($1, $2, $3, $4, $5, 'OPEN') RETURNING *`,
    [title, description, application_name, environment, created_by]
  );
  return result.rows[0];
};

const getTokensByUser = async (userId) => {
  const result = await pool.query(
    `SELECT t.*, u.name as creator_name
     FROM tokens t
     JOIN users u ON t.created_by = u.id
     WHERE t.created_by = $1
     ORDER BY t.created_at DESC`,
    [userId]
  );
  return result.rows;
};

const getAllTokens = async () => {
  const result = await pool.query(
    `SELECT t.*,
            u.name AS creator_name,
            ta.developer_id,
            ta.tester_id,
            ta.admin_comment,
            ta.assigned_at,
            dev.name AS developer_name,
            tst.name AS tester_name
     FROM tokens t
     LEFT JOIN users u ON t.created_by = u.id
     LEFT JOIN token_assignments ta ON t.token_id = ta.token_id
     LEFT JOIN users dev ON ta.developer_id = dev.id
     LEFT JOIN users tst ON ta.tester_id = tst.id
     ORDER BY t.created_at DESC`
  );
  return result.rows;
};

const getTodayTokens = async () => {
  const result = await pool.query(
    `SELECT t.*, u.name AS creator_name
     FROM tokens t
     JOIN users u ON t.created_by = u.id
     WHERE t.created_at::date = CURRENT_DATE
     ORDER BY t.created_at DESC`
  );
  return result.rows;
};

const getUnassignedTokens = async () => {
  const result = await pool.query(
    `SELECT t.*, u.name AS creator_name
     FROM tokens t
     JOIN users u ON t.created_by = u.id
     WHERE t.status = 'OPEN'
     ORDER BY t.created_at DESC`
  );
  return result.rows;
};

const getTokenById = async (tokenId) => {
  const result = await pool.query(
    `SELECT t.*,
            u.name AS creator_name,
            ta.developer_id,
            ta.tester_id,
            ta.admin_comment,
            ta.assigned_at,
            dev.name AS developer_name,
            tst.name AS tester_name
     FROM tokens t
     LEFT JOIN users u ON t.created_by = u.id
     LEFT JOIN token_assignments ta ON t.token_id = ta.token_id
     LEFT JOIN users dev ON ta.developer_id = dev.id
     LEFT JOIN users tst ON ta.tester_id = tst.id
     WHERE t.token_id = $1`,
    [tokenId]
  );
  return result.rows[0];
};

const updateTokenStatus = async (tokenId, newStatus) => {
  const result = await pool.query(
    `UPDATE tokens SET status = $1 WHERE token_id = $2 RETURNING *`,
    [newStatus, tokenId]
  );
  return result.rows[0];
};

const updateTokenPriority = async (tokenId, priority) => {
  await pool.query(
    `UPDATE tokens SET priority = $1 WHERE token_id = $2`,
    [priority, tokenId]
  );
};



const assignToken = async (tokenId, developerId, testerId, assignedBy, adminComment) => {
  const existing = await pool.query(
    'SELECT * FROM token_assignments WHERE token_id = $1',
    [tokenId]
  );
  if (existing.rows.length > 0) {
    const result = await pool.query(
      `UPDATE token_assignments
       SET developer_id = $1, tester_id = $2, assigned_by = $3, admin_comment = $4, assigned_at = NOW()
       WHERE token_id = $5 RETURNING *`,
      [developerId, testerId, assignedBy, adminComment, tokenId]
    );
    return result.rows[0];
  } else {
    const result = await pool.query(
      `INSERT INTO token_assignments (token_id, developer_id, tester_id, assigned_by, admin_comment)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [tokenId, developerId, testerId, assignedBy, adminComment]
    );
    return result.rows[0];
  }
};

const getAssignment = async (tokenId) => {
  const result = await pool.query(
    `SELECT ta.*, dev.name AS developer_name, tst.name AS tester_name
     FROM token_assignments ta
     LEFT JOIN users dev ON ta.developer_id = dev.id
     LEFT JOIN users tst ON ta.tester_id = tst.id
     WHERE ta.token_id = $1`,
    [tokenId]
  );
  return result.rows[0];
};



const getDeveloperTokens = async (developerId) => {
  const result = await pool.query(
    `SELECT t.*, ta.admin_comment, ta.tester_id, ta.developer_id,
            u.name AS creator_name, tst.name AS tester_name, dev.name AS developer_name
     FROM tokens t
     JOIN token_assignments ta ON t.token_id = ta.token_id
     JOIN users u ON t.created_by = u.id
     LEFT JOIN users tst ON ta.tester_id = tst.id
     LEFT JOIN users dev ON ta.developer_id = dev.id
     WHERE ta.developer_id = $1
       AND t.status NOT IN ('CLOSED')
     ORDER BY t.created_at DESC`,
    [developerId]
  );
  return result.rows;
};

const getClosedDeveloperTokens = async (developerId) => {
  const result = await pool.query(
    `SELECT t.*, ta.admin_comment, ta.tester_id, ta.developer_id,
            u.name AS creator_name, tst.name AS tester_name, dev.name AS developer_name
     FROM tokens t
     JOIN token_assignments ta ON t.token_id = ta.token_id
     JOIN users u ON t.created_by = u.id
     LEFT JOIN users tst ON ta.tester_id = tst.id
     LEFT JOIN users dev ON ta.developer_id = dev.id
     WHERE ta.developer_id = $1 AND t.status = 'CLOSED'
     ORDER BY t.created_at DESC`,
    [developerId]
  );
  return result.rows;
};


const getTesterTokens = async (testerId) => {
  const result = await pool.query(
    `SELECT t.*, ta.admin_comment, ta.developer_id, ta.tester_id,
            u.name AS creator_name, dev.name AS developer_name, tst.name AS tester_name
     FROM tokens t
     JOIN token_assignments ta ON t.token_id = ta.token_id
     JOIN users u ON t.created_by = u.id
     LEFT JOIN users dev ON ta.developer_id = dev.id
     LEFT JOIN users tst ON ta.tester_id = tst.id
     WHERE ta.tester_id = $1
       AND t.status = 'SENT_FOR_TESTING'
     ORDER BY t.created_at DESC`,
    [testerId]
  );
  return result.rows;
};

const getClosedTesterTokens = async (testerId) => {
  const result = await pool.query(
    `SELECT t.*, ta.admin_comment, ta.developer_id, ta.tester_id,
            u.name AS creator_name, dev.name AS developer_name, tst.name AS tester_name
     FROM tokens t
     JOIN token_assignments ta ON t.token_id = ta.token_id
     JOIN users u ON t.created_by = u.id
     LEFT JOIN users dev ON ta.developer_id = dev.id
     LEFT JOIN users tst ON ta.tester_id = tst.id
     WHERE ta.tester_id = $1 AND t.status = 'CLOSED'
     ORDER BY t.created_at DESC`,
    [testerId]
  );
  return result.rows;
};


const addComment = async (tokenId, userId, role, comment) => {
  const result = await pool.query(
    `INSERT INTO token_comments (token_id, user_id, role, comment)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [tokenId, userId, role, comment]
  );
  return result.rows[0];
};

const getCommentsByToken = async (tokenId) => {
  const result = await pool.query(
    `SELECT tc.*, u.name AS user_name
     FROM token_comments tc
     JOIN users u ON tc.user_id = u.id
     WHERE tc.token_id = $1
     ORDER BY tc.created_at ASC`,
    [tokenId]
  );
  return result.rows;
};


const addHistory = async (tokenId, oldStatus, newStatus, changedBy) => {
  await pool.query(
    `INSERT INTO token_status_history (token_id, old_status, new_status, changed_by)
     VALUES ($1, $2, $3, $4)`,
    [tokenId, oldStatus, newStatus, changedBy]
  );
};


const getUserSummary = async (userId) => {
  const result = await pool.query(
    `SELECT
       COUNT(*) AS total,
       COUNT(*) FILTER (WHERE status = 'OPEN') AS open,
       COUNT(*) FILTER (WHERE status IN ('ASSIGNED','IN_PROGRESS','SENT_FOR_TESTING')) AS in_progress,
       COUNT(*) FILTER (WHERE status = 'REJECTED') AS rejected,
       COUNT(*) FILTER (WHERE status = 'CLOSED') AS closed
     FROM tokens WHERE created_by = $1`,
    [userId]
  );
  return result.rows[0];
};

const getAdminSummary = async () => {
  const result = await pool.query(
    `SELECT
       COUNT(*) AS total,
       COUNT(*) FILTER (WHERE created_at::date = CURRENT_DATE) AS today,
       COUNT(*) FILTER (WHERE status = 'OPEN') AS open,
       COUNT(*) FILTER (WHERE status = 'CLOSED') AS closed
     FROM tokens`
  );
  return result.rows[0];
};

const getDeveloperSummary = async (developerId) => {
  const result = await pool.query(
    `SELECT
       COUNT(*) FILTER (WHERE t.status = 'ASSIGNED') AS assigned,
       COUNT(*) FILTER (WHERE t.status = 'IN_PROGRESS') AS in_progress,
       COUNT(*) FILTER (WHERE t.status = 'SENT_FOR_TESTING') AS sent_for_testing,
       COUNT(*) FILTER (WHERE t.status = 'REJECTED') AS rejected,
       COUNT(*) FILTER (WHERE t.status = 'CLOSED') AS completed
     FROM tokens t
     JOIN token_assignments ta ON t.token_id = ta.token_id
     WHERE ta.developer_id = $1`,
    [developerId]
  );
  return result.rows[0];
};

const getTesterSummary = async (testerId) => {
  const result = await pool.query(
    `SELECT
       COUNT(*) FILTER (WHERE t.status = 'SENT_FOR_TESTING') AS to_test,
       COUNT(*) FILTER (WHERE t.status = 'CLOSED') AS approved,
       COUNT(*) FILTER (WHERE t.status = 'REJECTED') AS rejected
     FROM tokens t
     JOIN token_assignments ta ON t.token_id = ta.token_id
     WHERE ta.tester_id = $1`,
    [testerId]
  );
  return result.rows[0];
};


const getAdminEmail = async () => {
  const result = await pool.query(
    "SELECT email FROM users WHERE role = 'ADMIN' LIMIT 1"
  );
  return result.rows[0]?.email || null;
};

const getUserEmailById = async (userId) => {
  const result = await pool.query(
    'SELECT email FROM users WHERE id = $1',
    [userId]
  );
  return result.rows[0]?.email || null;
};

module.exports = {
  findUserByEmail,
  getUsersByRole,
  createToken,
  getTokensByUser,
  getAllTokens,
  getTodayTokens,
  getUnassignedTokens,
  getTokenById,
  updateTokenStatus,
  updateTokenPriority,
  assignToken,
  getAssignment,
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
  getAdminEmail,
  getUserEmailById,
};
