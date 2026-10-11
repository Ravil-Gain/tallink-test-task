import { useAppState } from "../../app/AppStateProvider";

export default function History() {
  const { history, selected } = useAppState();

  return (
    <section className="flex min-h-0 flex-1 flex-col px-4 pb-0 pt-12 compact-landscape:pt-0 sm:px-5">
      <ul className="min-h-0 flex-1 space-y-0 overflow-y-auto overscroll-contain text-[22px] leading-[1.05]">
        {history.map((record, index) => (
          <li
            key={`${record.from}-${record.to}-${record.amount}-${index}`}
            data-testid="history-item"
            aria-selected={index === selected}
            className={`truncate ${index === selected ? "font-semibold text-[#2875ff]" : ""}`}
          >
            {record.from} {record.amount} → {record.to} {record.result}
          </li>
        ))}
      </ul>
      <p data-testid="history-count" className="flex h-8 shrink-0 items-center justify-center text-[10px]">
        {history.length} records
      </p>
    </section>
  );
}
