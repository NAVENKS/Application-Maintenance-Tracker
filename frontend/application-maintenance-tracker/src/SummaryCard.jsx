import './css/UserDashboard.css'
const SummaryCard = ({ title, value, className }) => {
  return (
    <div className={`summary-card ${className}`}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
};

export default SummaryCard;
