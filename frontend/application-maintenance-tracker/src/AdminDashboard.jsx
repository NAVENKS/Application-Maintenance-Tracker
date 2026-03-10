import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/AdminDashboard.css';
import SummaryCard from './SummaryCard';
import AdminNavbar from './AdminNavbar';
import api from './api/axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({ total: 0, today: 0, open: 0, closed: 0 });
  const [unassigned, setUnassigned] = useState([]);
  const [todayTokens, setTodayTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/tokens/admin/all'),
      api.get('/tokens/admin/unassigned'),
      api.get('/tokens/admin/today'),
    ])
      .then(([allRes, unassignedRes, todayRes]) => {
        setSummary(allRes.data.summary || {});
        setUnassigned(unassignedRes.data.tokens || []);
        setTodayTokens(todayRes.data.tokens || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d) => d ? new Date(d).toLocaleDateString() : '-';

  return (
    <AdminNavbar>
      <div className="admin-dashboard">
        <h2 className="dashboard-title">Admin Dashboard</h2>

        <div className="summary-row">
          <SummaryCard title="Total Tokens"  value={summary.total || 0}  className="card-total" />
          <SummaryCard title="Tokens Today"  value={summary.today || 0}  className="card-open" />
          <SummaryCard title="Open Tokens"   value={summary.open || 0}   className="card-progress" />
          <SummaryCard title="Closed Tokens" value={summary.closed || 0} className="card-closed" />
        </div>

        {loading ? <p>Loading...</p> : (
          <div className="admin-content">
            {/* Unassigned Tokens */}
            <div className="admin-section">
              <h3>Unassigned Tokens ({unassigned.length})</h3>
              <table>
                <thead>
                  <tr>
                    <th>Token ID</th>
                    <th>Title</th>
                    <th>Created By</th>
                    <th>Created At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {unassigned.length === 0 ? (
                    <tr><td colSpan={5} style={{textAlign:'center',color:'#888'}}>No unassigned tokens</td></tr>
                  ) : unassigned.map(t => (
                    <tr key={t.token_id}>
                      <td>#{t.token_id}</td>
                      <td>{t.title}</td>
                      <td>{t.creator_name}</td>
                      <td>{formatDate(t.created_at)}</td>
                      <td>
                        <button className="assign-btn" onClick={() => navigate(`/admin/assign/${t.token_id}`)}>
                          Assign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Today's Tokens */}
            <div className="admin-section">
              <h3>Today's Tokens ({todayTokens.length})</h3>
              <table>
                <thead>
                  <tr>
                    <th>Token ID</th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Created By</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {todayTokens.length === 0 ? (
                    <tr><td colSpan={5} style={{textAlign:'center',color:'#888'}}>No tokens created today</td></tr>
                  ) : todayTokens.map(t => (
                    <tr key={t.token_id}>
                      <td>#{t.token_id}</td>
                      <td>{t.title}</td>
                      <td>{t.status}</td>
                      <td>{t.creator_name}</td>
                      <td>{formatDate(t.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminNavbar>
  );
};

export default AdminDashboard;
