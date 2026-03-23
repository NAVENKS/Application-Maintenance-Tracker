import '../src/css/globals.css'
import './css/UserDashboard.css';

const CARD_CONFIGS = {
  'card-total':    { icon: 'grid',    color: 'indigo', label: 'All time'       },
  'card-open':     { icon: 'folder',  color: 'amber',  label: 'Awaiting action'},
  'card-progress': { icon: 'clock',   color: 'sky',    label: 'Being handled'  },
  'card-rejected': { icon: 'xmark',   color: 'red',    label: 'Declined'       },
  'card-closed':   { icon: 'check',   color: 'green',  label: 'Resolved'       },
};

const ICONS = {
  grid:   <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor"/></svg>,
  folder: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 4h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4Z" stroke="currentColor" strokeWidth="1.5"/><path d="M5 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" stroke="currentColor" strokeWidth="1.5"/></svg>,
  clock:  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  xmark:  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  check:  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="M5 8.5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

const SummaryCard = ({ title, value, className }) => {
  const cfg = CARD_CONFIGS[className] || { icon: 'grid', color: 'indigo', label: '' };
  return (
    <div className={`summary-card summary-card--${cfg.color}`}>
      <div className="summary-card__bar" />
      <div className="summary-card__top">
        <span className="summary-card__label">{title}</span>
        <div className="summary-card__dot">
          {ICONS[cfg.icon]}
        </div>
      </div>
      <h2 className="summary-card__value">{value}</h2>
      <p className="summary-card__sub">{cfg.label}</p>
    </div>
  );
};

export default SummaryCard;