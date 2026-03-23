import '../src/css/globals.css'
import "./css/DeveloperWorkDetails.css";
import AdminNavbar from "./AdminNavbar";
import { workDetails } from "./data/developerWorkDetailsData";
import DeveloperNavbar from "./DeveloperNavbar";

const DeveloperWorkDetails = () => {
  return (
    <DeveloperNavbar>
      <div className="dev-work-page">
        <h2 className="page-title">Assigned Works</h2>

        {/* Work Details */}
        <div className="card">
          <h3>Work Details</h3>

          <div className="details-grid">
            <div><strong>Token ID:</strong> {workDetails.id}</div>
            <div><strong>Priority:</strong> {workDetails.priority}</div>
            <div><strong>Status:</strong> {workDetails.status}</div>
            <div><strong>Application:</strong> {workDetails.application}</div>
            <div><strong>Environment:</strong> {workDetails.environment}</div>
            <div><strong>Assigned Tester:</strong> {workDetails.assignedTester}</div>
          </div>

          <div className="description-box">
            <strong>Issue Description</strong>
            <p>{workDetails.description}</p>
          </div>

          <div className="admin-note">
            <strong>Admin Instructions</strong>
            <p>{workDetails.adminNotes}</p>
          </div>
        </div>

        {/* Developer Update */}
        <div className="card">
          <h3>Update Work</h3>

          <label>Developer Comment</label>
          <textarea
            placeholder="Describe what you fixed or current progress"
          />

          <div className="action-row">
            <button className="progress-btn">Save Progress</button>
            <button className="send-btn">
              Send to Tester
            </button>
          </div>
        </div>
      </div>
    </DeveloperNavbar>
  );
};

export default DeveloperWorkDetails;
