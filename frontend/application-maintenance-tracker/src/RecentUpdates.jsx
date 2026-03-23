import '../src/css/globals.css'
const RecentUpdates = ({ updates }) => {
  return (
    <div style={styles.box}>
      <h4>Recent Updates</h4>
      <ul>
        {updates.map((u, index) => (
          <li key={index}>{u}</li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  box: {
    padding: "16px",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
};

export default RecentUpdates;
