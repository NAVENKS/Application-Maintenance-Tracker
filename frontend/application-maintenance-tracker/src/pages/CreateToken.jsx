import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import UserNavbar from '../UserNavbar';
import './CreateToken.css';

const CreateToken = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    application_name: '',
    environment: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.post('/tokens', form);
      setSuccess('Token created successfully!');
      setTimeout(() => navigate('/user/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserNavbar>
      <div className="create-token-page">
        <h2 className="page-title">Create New Token</h2>

        <div className="form-card">
          {error && <div className="alert error">{error}</div>}
          {success && <div className="alert success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Issue Title *</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Brief description of the issue"
                  required
                />
              </div>

              <div className="form-group">
                <label>Application Name *</label>
                <input
                  name="application_name"
                  value={form.application_name}
                  onChange={handleChange}
                  placeholder="e.g. CRM Portal, HR System"
                  required
                />
              </div>

              <div className="form-group">
                <label>Environment *</label>
                <select name="environment" value={form.environment} onChange={handleChange} required>
                  <option value="">Select Environment</option>
                  <option value="Production">Production</option>
                  <option value="Staging">Staging</option>
                  <option value="Development">Development</option>
                  <option value="Testing">Testing</option>
                </select>
              </div>
            </div>

            <div className="form-group full-width">
              <label>Issue Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the issue in detail — steps to reproduce, expected vs actual behavior..."
                required
                rows={5}
              />
            </div>

            <div className="action-row">
              <button type="button" className="cancel-btn" onClick={() => navigate('/user/dashboard')}>
                Cancel
              </button>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Token'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </UserNavbar>
  );
};

export default CreateToken;
