import { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import './css/MyWorks.css';
import DeveloperNavbar from './DeveloperNavbar';
import TesterNavbar from './TesterNavbar';
import api from './api/axios';

const MyWorks = () => {
  const { user } = useAuth();
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  const isDeveloper = user?.role === 'DEVELOPER';
  const Navbar = isDeveloper ? DeveloperNavbar : TesterNavbar;

  useEffect(() => {
    api.get('/tokens/closed')
      .then(res => setWorks(res.data.tokens || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d) => d ? new Date(d).toLocaleDateString() : '-';

  const getComment = (comments, role) => comments?.find(c => c.role === role)?.comment || 'N/A';

  return (
    <Navbar>
      <div className="my-works-page">
        <h2 className="page-title">My Works (Closed)</h2>

        {loading ? (
          <p>Loading...</p>
        ) : works.length === 0 ? (
          <p className="empty-text">No completed works yet.</p>
        ) : (
          works.map(work => (
            <div key={work.token_id} className="work-card">
              <div className="work-header">
                <h3>{work.title}</h3>
                <span className="closed-badge">Closed</span>
              </div>

              <div className="work-info">
                <p><strong>Token ID:</strong> #{work.token_id}</p>
                <p><strong>Application:</strong> {work.application_name}</p>
                <p><strong>Priority:</strong> {work.priority}</p>
                <p><strong>Environment:</strong> {work.environment}</p>
              </div>

              <div className="work-info">
                <p><strong>Developer:</strong> {work.developer_name || work.developer?.name || '-'}</p>
                <p><strong>Tester:</strong> {work.tester_name || '-'}</p>
              </div>

              <div className="comment-section admin">
                <strong>Admin Comment</strong>
                <p>{work.admin_comment || getComment(work.comments, 'ADMIN')}</p>
              </div>

              <div className="comment-section developer">
                <strong>Developer Comment</strong>
                <p>{getComment(work.comments, 'DEVELOPER')}</p>
              </div>

              <div className="comment-section tester">
                <strong>Tester Comment</strong>
                <p>{getComment(work.comments, 'TESTER')}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </Navbar>
  );
};

export default MyWorks;
