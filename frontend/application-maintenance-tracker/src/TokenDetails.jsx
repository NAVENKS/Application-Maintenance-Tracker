import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './css/TokenDetails.css';
import AdminNavbar from './AdminNavbar';
import api from './api/axios';

const TokenDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/tokens/${id}`)
      .then(res => {
        setToken(res.data.token);
        setComments(res.data.comments || []);
      })
      .catch(err => setError(err.response?.data?.message || 'Failed to load token'))
      .finally(() => setLoading(false));
  }, [id]);

  const formatDate = (d) => d ? new Date(d).toLocaleString() : '-';

  const getRoleClass = (role) => ({ ADMIN:'admin', DEVELOPER:'developer', TESTER:'tester' }[role] || '');

  return (
    <AdminNavbar>
      <div className="token-details-page">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
          <h2 className="page-title">Token Details</h2>
          <button onClick={() => navigate(-1)} style={{padding:'8px 16px',border:'1px solid #ccc',background:'#fff',borderRadius:'8px',cursor:'pointer'}}>← Back</button>
        </div>

        {loading ? <p>Loading...</p> : error ? <p style={{color:'red'}}>{error}</p> : !token ? <p>Token not found.</p> : (
          <>
            <div className="card">
              <h3>Basic Information</h3>
              <div className="info-grid">
                <div><strong>Token ID:</strong> #{token.token_id}</div>
                <div><strong>Status:</strong> <strong style={{color: token.status==='CLOSED'?'#2e7d32': token.status==='REJECTED'?'#c62828':'#1565c0'}}>{token.status}</strong></div>
                <div><strong>Priority:</strong> {token.priority || 'Unset'}</div>
                <div><strong>Application:</strong> {token.application_name}</div>
                <div><strong>Environment:</strong> {token.environment}</div>
                <div><strong>Created By:</strong> {token.creator_name}</div>
                <div><strong>Assigned Developer:</strong> {token.developer_name || '-'}</div>
                <div><strong>Assigned Tester:</strong> {token.tester_name || '-'}</div>
                <div><strong>Created At:</strong> {formatDate(token.created_at)}</div>
              </div>
              <div className="description-box">
                <strong>Description</strong>
                <p>{token.description}</p>
              </div>
            </div>

            <div className="card">
              <h3>Comments ({comments.length})</h3>
              {comments.length === 0 ? (
                <p style={{color:'#888'}}>No comments yet.</p>
              ) : comments.map((c, i) => (
                <div key={i} className={`comment ${getRoleClass(c.role)}`}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}>
                    <strong>{c.role} — {c.user_name}</strong>
                    <small style={{color:'#888'}}>{formatDate(c.created_at)}</small>
                  </div>
                  <p style={{margin:0}}>{c.comment}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </AdminNavbar>
  );
};

export default TokenDetails;