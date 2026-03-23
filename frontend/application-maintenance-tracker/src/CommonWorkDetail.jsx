import '../src/css/globals.css'
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './css/CommonWorkDetail.css';
import DeveloperNavbar from './DeveloperNavbar';
import TesterNavbar from './TesterNavbar';
import api from './api/axios';

const CommonWorkDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [token, setToken] = useState(null);
  const [comments, setComments] = useState([]);
  const [devComment, setDevComment] = useState('');
  const [testerComment, setTesterComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isDeveloper = user?.role === 'DEVELOPER';
  const isTester = user?.role === 'TESTER';
  const Navbar = isDeveloper ? DeveloperNavbar : TesterNavbar;

  useEffect(() => {
    api.get(`/tokens/${id}`)
      .then(res => {
        setToken(res.data.token);
        setComments(res.data.comments || []);
        // Pre-fill developer comment if exists
        const existing = res.data.comments?.find(c => c.role === 'DEVELOPER');
        if (existing) setDevComment(existing.comment);
      })
      .catch(err => setError(err.response?.data?.message || 'Failed to load token'))
      .finally(() => setLoading(false));
  }, [id]);

  const adminComment = token?.admin_comment || comments.find(c => c.role === 'ADMIN')?.comment || 'No admin instructions.';
  const developerComment = comments.find(c => c.role === 'DEVELOPER')?.comment || '';

  const handleSaveProgress = async () => {
    if (!devComment.trim()) return setError('Please add a comment before saving.');
    setSubmitting(true); setError(''); setMessage('');
    try {
      await api.post('/tokens/developer-update', { token_id: id, comment: devComment });
      setMessage('Progress saved!');
      // Refresh token
      const res = await api.get(`/tokens/${id}`);
      setToken(res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally { setSubmitting(false); }
  };

  const handleSendToTester = async () => {
    setSubmitting(true); setError(''); setMessage('');
    try {
      await api.post('/tokens/send-to-tester', { token_id: id, comment: devComment || undefined });
      setMessage('Sent to tester!');
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send');
    } finally { setSubmitting(false); }
  };

  const handleApprove = async () => {
    setSubmitting(true); setError(''); setMessage('');
    try {
      await api.post('/tokens/tester-approve', { token_id: id, comment: testerComment || undefined });
      setMessage('Token approved and closed!');
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve');
    } finally { setSubmitting(false); }
  };

  const handleReject = async () => {
    if (!testerComment.trim()) return setError('Please add a rejection comment before rejecting.');
    setSubmitting(true); setError(''); setMessage('');
    try {
      await api.post('/tokens/tester-reject', { token_id: id, comment: testerComment });
      setMessage('Token rejected and sent back to developer!');
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject');
    } finally { setSubmitting(false); }
  };

  if (loading) return <Navbar><p style={{padding:'24px'}}>Loading...</p></Navbar>;

  return (
    <Navbar>
      <div className="work-detail-page">
        <h2 className="page-title">Work Details</h2>

        {error && <div style={{color:'#c62828',padding:'10px',background:'#ffebee',borderRadius:'8px',marginBottom:'16px'}}>{error}</div>}
        {message && <div style={{color:'#2e7d32',padding:'10px',background:'#e8f5e9',borderRadius:'8px',marginBottom:'16px'}}>{message}</div>}

        {/* Token Info */}
        {token && (
          <div className="card">
            <h3>Token Information</h3>
            <div className="info-grid">
              <div><strong>Token ID:</strong> #{token.token_id}</div>
              <div><strong>Status:</strong> <span style={{fontWeight:600}}>{token.status}</span></div>
              <div><strong>Priority:</strong> {token.priority}</div>
              <div><strong>Application:</strong> {token.application_name}</div>
              <div><strong>Environment:</strong> {token.environment}</div>
              {isTester && <div><strong>Developer:</strong> {token.developer_name || '-'}</div>}
            </div>
            <div className="description-box">
              <strong>Issue Description</strong>
              <p>{token.description}</p>
            </div>
          </div>
        )}

        {/* Admin Comment */}
        <div className="card admin-card">
          <h3>Admin Comment</h3>
          <p>{adminComment}</p>
        </div>

        {/* DEVELOPER VIEW */}
        {isDeveloper && (
          <div className="card">
            <h3>Developer Update</h3>
            <textarea
              value={devComment}
              onChange={e => setDevComment(e.target.value)}
              placeholder="Add or update your work comment"
              rows={4}
              style={{width:'100%',boxSizing:'border-box'}}
            />
            <div className="action-row">
              <button className="send-btn" onClick={handleSaveProgress} disabled={submitting}>
                Save Progress
              </button>
              <button className="send-btn" onClick={handleSendToTester} disabled={submitting}
                style={{background:'#2e7d32'}}>
                Send to Tester
              </button>
            </div>
          </div>
        )}

        {/* TESTER VIEW */}
        {isTester && (
          <>
            <div className="card dev-card">
              <h3>Developer Comment</h3>
              <p>{developerComment || 'No comment added yet.'}</p>
            </div>
            <div className="card">
              <h3>Tester Decision</h3>
              <textarea
                placeholder="Add testing comment (required for rejection)"
                value={testerComment}
                onChange={e => setTesterComment(e.target.value)}
                rows={4}
                style={{width:'100%',boxSizing:'border-box'}}
              />
              <div className="action-row">
                <button className="approve-btn" onClick={handleApprove} disabled={submitting}>
                  ✓ Approve
                </button>
                <button className="reject-btn" onClick={handleReject} disabled={submitting}>
                  ✗ Reject
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Navbar>
  );
};

export default CommonWorkDetail;
