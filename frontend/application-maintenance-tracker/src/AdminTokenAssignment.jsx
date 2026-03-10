import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './css/AdminTokenAssignment.css';
import AdminNavbar from './AdminNavbar';
import api from './api/axios';

const AdminTokenAssignment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [developers, setDevelopers] = useState([]);
  const [testers, setTesters] = useState([]);
  const [form, setForm] = useState({ developer_id: '', tester_id: '', priority: '', admin_comment: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    Promise.all([
      api.get(`/tokens/${id}`),
      api.get('/tokens/admin/users'),
    ])
      .then(([tokenRes, usersRes]) => {
        setToken(tokenRes.data.token);
        setDevelopers(usersRes.data.developers || []);
        setTesters(usersRes.data.testers || []);
      })
      .catch(err => setError(err.response?.data?.message || 'Failed to load data'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.developer_id || !form.tester_id || !form.priority) {
      return setError('Please select priority, developer, and tester');
    }
    setSubmitting(true);
    setError('');
    try {
      await api.post('/tokens/assign', {
        token_id: id,
        developer_id: form.developer_id,
        tester_id: form.tester_id,
        priority: form.priority,
        admin_comment: form.admin_comment,
      });
      setSuccess('Token assigned successfully!');
      setTimeout(() => navigate('/admin/all-records'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Assignment failed');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleString() : '-';

  return (
    <AdminNavbar>
      <div className="assign-page">
        <h2 className="page-title">Assign Token</h2>

        {loading ? <p>Loading...</p> : !token ? (
          <p>Token not found.</p>
        ) : (
          <>
            {/* Token Details */}
            <div className="card">
              <h3>Token Details</h3>
              <div className="details-grid">
                <div><strong>Token ID:</strong> #{token.token_id}</div>
                <div><strong>Title:</strong> {token.title}</div>
                <div><strong>Created By:</strong> {token.creator_name}</div>
                <div><strong>Created At:</strong> {formatDate(token.created_at)}</div>
                <div><strong>Status:</strong> {token.status}</div>
                <div><strong>Application:</strong> {token.application_name}</div>
                <div><strong>Environment:</strong> {token.environment}</div>
              </div>
              <div className="description-box">
                <strong>Description</strong>
                <p>{token.description}</p>
              </div>
            </div>

            {/* Assignment Form */}
            <div className="card">
              <h3>Assignment</h3>

              {error && <div style={{color:'#c62828',padding:'10px',background:'#ffebee',borderRadius:'8px',marginBottom:'16px'}}>{error}</div>}
              {success && <div style={{color:'#2e7d32',padding:'10px',background:'#e8f5e9',borderRadius:'8px',marginBottom:'16px'}}>{success}</div>}

              <form onSubmit={handleSubmit}>
                <div className="assign-grid">
                  <div>
                    <label>Priority *</label>
                    <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} required>
                      <option value="">Select Priority</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div>
                    <label>Assign Developer *</label>
                    <select value={form.developer_id} onChange={e => setForm({...form, developer_id: e.target.value})} required>
                      <option value="">Select Developer</option>
                      {developers.map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.email})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>Assign Tester *</label>
                    <select value={form.tester_id} onChange={e => setForm({...form, tester_id: e.target.value})} required>
                      <option value="">Select Tester</option>
                      {testers.map(t => (
                        <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="comment-box">
                  <label>Admin Comment / Instructions</label>
                  <textarea
                    placeholder="Set priority justification or special instructions for developer"
                    value={form.admin_comment}
                    onChange={e => setForm({...form, admin_comment: e.target.value})}
                  />
                </div>

                <div className="action-row">
                  <button type="button" onClick={() => navigate(-1)} style={{padding:'10px 20px',border:'1px solid #ccc',background:'#fff',borderRadius:'8px',cursor:'pointer'}}>
                    Cancel
                  </button>
                  <button type="submit" className="assign-btn" disabled={submitting}>
                    {submitting ? 'Assigning...' : 'Confirm Assignment'}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </AdminNavbar>
  );
};

export default AdminTokenAssignment;
