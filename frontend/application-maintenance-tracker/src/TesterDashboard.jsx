import '../src/css/globals.css'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/TesterDashboard.css';
import SummaryCard from './SummaryCard';
import TesterNavbar from './TesterNavbar';
import api from './api/axios';

const TesterDashboard = () => {
  const navigate = useNavigate();
  const [tokens, setTokens] = useState([]);
  const [summary, setSummary] = useState({ to_test: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tokens/tester/assigned')
      .then(res => {
        setTokens(res.data.tokens || []);
        setSummary(res.data.summary || {});
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <TesterNavbar>
      <div className="tester-dashboard">
        <h2 className="dashboard-title">Tester Dashboard</h2>

        <div className="summary-row">
          <SummaryCard title="Tokens to Test" value={summary.to_test || 0}  className="card-progress" />
          <SummaryCard title="Approved"        value={summary.approved || 0} className="card-closed" />
          <SummaryCard title="Rejected"        value={summary.rejected || 0} className="card-rejected" />
        </div>

        {loading ? <p>Loading...</p> : (
          <div className="tester-content">
            <div className="tester-section">
              <h3>Tokens Pending for Testing ({tokens.length})</h3>
              <table>
                <thead>
                  <tr>
                    <th>Token ID</th>
                    <th>Title</th>
                    <th>Developer</th>
                    <th>Priority</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tokens.length === 0 ? (
                    <tr><td colSpan={5} style={{textAlign:'center',color:'#888'}}>No tokens awaiting testing</td></tr>
                  ) : tokens.map(t => (
                    <tr key={t.token_id}>
                      <td>#{t.token_id}</td>
                      <td>{t.title}</td>
                      <td>{t.developer_name || '-'}</td>
                      <td>{t.priority}</td>
                      <td>
                        <button
                          className="approve-btn"
                          onClick={() => navigate(`/tester/work/${t.token_id}`)}
                        >
                          Review
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
    </TesterNavbar>
  );
};

export default TesterDashboard;
