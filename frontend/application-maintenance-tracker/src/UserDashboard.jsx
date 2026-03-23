import '../src/css/globals.css'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/UserDashboard.css';
import SummaryCard from './SummaryCard';
import UserNavbar from './UserNavbar';
import api from './api/axios';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [tokens, setTokens] = useState([]);
  const [summary, setSummary] = useState({ total: 0, open: 0, in_progress: 0, rejected: 0, closed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tokens')
      .then(res => {
        setTokens(res.data.tokens || []);
        setSummary(res.data.summary || {});
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d) => d ? new Date(d).toLocaleDateString() : '-';

  const getStatusClass = (status) => {
    const map = {
      OPEN: 'status-open', ASSIGNED: 'status-assigned',
      IN_PROGRESS: 'status-progress', SENT_FOR_TESTING: 'status-testing',
      REJECTED: 'status-rejected', CLOSED: 'status-closed',
    };
    return map[status] || '';
  };

  return (
    <UserNavbar>
      <div className="user-dashboard">
        <h2 className="dashboard-title">User Dashboard</h2>

        <div className="summary-row">
          <SummaryCard title="Total Tokens"  value={summary.total || 0}       className="card-total" />
          <SummaryCard title="Open"          value={summary.open || 0}        className="card-open" />
          <SummaryCard title="In Progress"   value={summary.in_progress || 0} className="card-progress" />
          <SummaryCard title="Rejected"      value={summary.rejected || 0}    className="card-rejected" />
          <SummaryCard title="Closed"        value={summary.closed || 0}      className="card-closed" />
        </div>

        <div className="dashboard-content">
          <div className="tokens-section">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '20px' }}>
              <h3>My Tokens</h3>
              <button
                onClick={() => navigate('/user/create-token')}
                className="btn-primary"
              >
                + New Token
              </button>
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : tokens.length === 0 ? (
              <p style={{ color:'#888', marginTop:16 }}>No tokens yet. Create your first one!</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Token ID</th>
                    <th>Title</th>
                    <th>Application</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {tokens.map(t => (
                    <tr key={t.token_id}>
                      <td>#{t.token_id}</td>
                      <td>{t.title}</td>
                      <td>{t.application_name}</td>
                      <td>{t.priority || 'Unset'}</td>
                      <td><span className={`status-badge ${getStatusClass(t.status)}`}>{t.status}</span></td>
                      <td>{formatDate(t.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </UserNavbar>
  );
};

export default UserDashboard;
