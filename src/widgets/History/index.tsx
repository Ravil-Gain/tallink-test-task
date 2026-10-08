import { useAppState } from "../../app/AppStateProvider";

export default function History() {
  const { history, selected } = useAppState();

  return (
    <section>
      <h1>History</h1>
      <ul>
        {history.map((record, index) => (
          <li
            key={`${record.from}-${record.to}-${record.amount}-${index}`}
            data-testid="history-item"
            aria-selected={index === selected}
            style={{ fontWeight: index === selected ? "bold" : "normal" }}
          >
            {record.from} {record.amount} → {record.to} {record.result}
          </li>
        ))}
      </ul>
      <p data-testid="history-count">{history.length} records</p>
    </section>
  );
}
