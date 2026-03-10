import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/AdminAllRecords.css';
import AdminNavbar from './AdminNavbar';
import api from './api/axios';

const AdminAllRecords = () => {
  const navigate = useNavigate();
  const [tokens, setTokens] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tokens/admin/all')
      .then(res => {
        setTokens(res.data.tokens || []);
        setFiltered(res.data.tokens || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = tokens;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        String(t.token_id).includes(q) || t.title.toLowerCase().includes(q)
      );
    }
    if (statusFilter) {
      result = result.filter(t => t.status === statusFilter);
    }
    setFiltered(result);
  }, [search, statusFilter, tokens]);

  const formatDate = (d) => d ? new Date(d).toLocaleDateString() : '-';

  const getStatusClass = (status) => {
    const map = {
      OPEN:'status-open', ASSIGNED:'status-assigned',
      IN_PROGRESS:'status-in-progress', SENT_FOR_TESTING:'status-testing',
      REJECTED:'status-rejected', CLOSED:'status-closed',
    };
    return map[status] || '';
  };

  return (
    <AdminNavbar>
      <div className="admin-records">
        <h2 className="page-title">All Records</h2>

        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search by Token ID or Title"
            className="search-input"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="status-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="OPEN">Open</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="SENT_FOR_TESTING">Sent for Testing</option>
            <option value="REJECTED">Rejected</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        {loading ? <p>Loading...</p> : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Token ID</th>
                  <th>Title</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>User</th>
                  <th>Developer</th>
                  <th>Tester</th>
                  <th>Created At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={9} style={{textAlign:'center',color:'#888'}}>No records found</td></tr>
                ) : filtered.map(t => (
                  <tr key={t.token_id}>
                    <td>#{t.token_id}</td>
                    <td>{t.title}</td>
                    <td>{t.priority || '-'}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(t.status)}`}>{t.status}</span>
                    </td>
                    <td>{t.creator_name}</td>
                    <td>{t.developer_name || '-'}</td>
                    <td>{t.tester_name || '-'}</td>
                    <td>{formatDate(t.created_at)}</td>
                    <td>
                      {t.status === 'OPEN' ? (
                        <button className="assign-btn" onClick={() => navigate(`/admin/assign/${t.token_id}`)}>
                          Assign
                        </button>
                      ) : (
                        <button className="detail-btn" onClick={() => navigate(`/admin/token/${t.token_id}`)}>
                          Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminNavbar>
  );
};

export default AdminAllRecords;
