import '../src/css/globals.css'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/DeveloperDashboard.css';
import SummaryCard from './SummaryCard';
import DeveloperNavbar from './DeveloperNavbar';
import api from './api/axios';

const DeveloperDashboard = () => {
  const navigate = useNavigate();
  const [tokens, setTokens] = useState([]);
  const [summary, setSummary] = useState({ assigned: 0, in_progress: 0, sent_for_testing: 0, rejected: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tokens/developer/assigned')
      .then(res => {
        setTokens(res.data.tokens || []);
        setSummary(res.data.summary || {});
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const assigned = tokens.filter(t => t.status === 'ASSIGNED' || t.status === 'IN_PROGRESS');
  const rejected = tokens.filter(t => t.status === 'REJECTED');

  const getStatusClass = (s) => ({
    ASSIGNED:'status-assigned', IN_PROGRESS:'status-progress', REJECTED:'status-rejected'
  }[s] || '');

  return (
    <DeveloperNavbar>
      <div className="developer-dashboard">
        <h2 className="dashboard-title">Developer Dashboard</h2>

        <div className="summary-row">
          <SummaryCard title="Assigned"         value={summary.assigned || 0}         className="card-open" />
          <SummaryCard title="In Progress"      value={summary.in_progress || 0}      className="card-progress" />
          <SummaryCard title="Sent for Testing" value={summary.sent_for_testing || 0} className="card-total" />
          <SummaryCard title="Rejected"         value={summary.rejected || 0}         className="card-rejected" />
          <SummaryCard title="Completed"        value={summary.completed || 0}        className="card-closed" />
        </div>

        {loading ? <p>Loading...</p> : (
          <div className="developer-content">
            {/* Assigned / In Progress */}
            <div className="developer-section">
              <h3>My Assigned Work</h3>
              <table>
                <thead>
                  <tr>
                    <th>Token ID</th><th>Title</th><th>Priority</th><th>Status</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assigned.length === 0 ? (
                    <tr><td colSpan={5} style={{textAlign:'center',color:'#888'}}>No assigned tokens</td></tr>
                  ) : assigned.map(t => (
                    <tr key={t.token_id}>
                      <td>#{t.token_id}</td>
                      <td>{t.title}</td>
                      <td>{t.priority}</td>
                      <td><span className={`status-badge ${getStatusClass(t.status)}`}>{t.status}</span></td>
                      <td>
                        <button className="work-btn" onClick={() => navigate(`/developer/work/${t.token_id}`)}>
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Rejected Tokens */}
            <div className="developer-section">
              <h3>Rejected Tokens</h3>
              <table>
                <thead>
                  <tr>
                    <th>Token ID</th><th>Title</th><th>Priority</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rejected.length === 0 ? (
                    <tr><td colSpan={4} style={{textAlign:'center',color:'#888'}}>No rejected tokens</td></tr>
                  ) : rejected.map(t => (
                    <tr key={t.token_id}>
                      <td>#{t.token_id}</td>
                      <td>{t.title}</td>
                      <td>{t.priority}</td>
                      <td>
                        <button className="fix-btn" onClick={() => navigate(`/developer/work/${t.token_id}`)}>
                          Fix Again
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DeveloperNavbar>
  );
};

export default DeveloperDashboard;
