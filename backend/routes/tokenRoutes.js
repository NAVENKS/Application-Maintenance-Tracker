const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');
const {
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
} = require('../controllers/tokenController');

// Apply auth to all token routes
router.use(authMiddleware);

// ─── USER ────────────────────────────────────────────────────────────────────
router.post('/', allowRoles('USER'), createNewToken);
router.get('/', allowRoles('USER'), getMyTokens);

// ─── ADMIN ───────────────────────────────────────────────────────────────────
router.get('/admin/all', allowRoles('ADMIN'), adminGetAllTokens);
router.get('/admin/today', allowRoles('ADMIN'), adminGetTodayTokens);
router.get('/admin/unassigned', allowRoles('ADMIN'), adminGetUnassignedTokens);
router.get('/admin/users', allowRoles('ADMIN'), adminGetUsers);
router.post('/assign', allowRoles('ADMIN'), adminAssignToken);

// ─── DEVELOPER ───────────────────────────────────────────────────────────────
router.get('/developer/assigned', allowRoles('DEVELOPER'), developerGetAssigned);
router.post('/developer-update', allowRoles('DEVELOPER'), developerUpdate);
router.post('/send-to-tester', allowRoles('DEVELOPER'), developerSendToTester);

// ─── TESTER ──────────────────────────────────────────────────────────────────
router.get('/tester/assigned', allowRoles('TESTER'), testerGetAssigned);
router.post('/tester-approve', allowRoles('TESTER'), testerApprove);
router.post('/tester-reject', allowRoles('TESTER'), testerReject);

// ─── SHARED ──────────────────────────────────────────────────────────────────
// Closed tokens (developer and tester my-works)
router.get('/closed', allowRoles('DEVELOPER', 'TESTER'), getClosedTokens);

// Token detail (all authenticated roles) — must come LAST to avoid catching other routes
router.get('/:id', allowRoles('USER', 'ADMIN', 'DEVELOPER', 'TESTER'), getTokenDetail);

module.exports = router;
