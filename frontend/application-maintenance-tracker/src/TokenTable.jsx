const TokenTable = ({ tokens }) => {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th>Token ID</th>
          <th>Title</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Last Updated</th>
        </tr>
      </thead>
      <tbody>
        {tokens.map((t) => (
          <tr key={t.id}>
            <td>{t.id}</td>
            <td>{t.title}</td>
            <td>{t.priority}</td>
            <td>{t.status}</td>
            <td>{t.updatedAt}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
  },
};

export default TokenTable;