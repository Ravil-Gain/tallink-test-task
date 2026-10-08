import { useLocation, useNavigate } from "react-router";
import { useAppState } from "../../app/AppStateProvider";
import { useQuote } from "../../app/useQuote";
import { convert, formatMoney, parseStringAmount } from "../../shared/lib/money";
import Keypad from "./ui/Keypad";
import type { KeypadAction, KeypadMode } from "./types";

export default function KeypadWidget() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const {
    amount,
    setAmount,
    from,
    setFrom,
    to,
    setTo,
    history,
    setHistory,
    selected,
    setSelected,
  } = useAppState();
  const { quote, loading } = useQuote();
  const mode: KeypadMode = pathname === "/history" ? "history" : "exchange";

  const handleExchangeAction = (action: KeypadAction) => {
    if (/^(\d|00)$/.test(action)) { // pick only numbers & '00'
      setAmount((value) => (value === "0" ? action : value + action));
      return;
    }

    switch (action) {
      case ".":
        setAmount((value) => (value.includes(".") ? value : `${value}.`));
        break;
      case "⌫":
        setAmount((value) => (value.length > 1 ? value.slice(0, -1) : "0"));
        break;
      case "C":
        setAmount("0");
        break;
      case "m": {
        const parsedAmount = parseStringAmount(amount);
        if (!Number.isFinite(parsedAmount) || loading || !quote) return;
        const result = formatMoney(convert(quote.amount, quote.rate));

        setHistory((records) => [
          ...records,
          { from, to, amount: formatMoney(parsedAmount), result },
        ]);
        break;
      }
      default:
        break;
    }
  };

  const handleHistoryAction = (action: KeypadAction) => {
    switch (action) {
      case "⌫": {
        const nextHistory = history.filter((_, index) => index !== selected);
        setHistory(nextHistory);
        setSelected((index) => Math.min(index, Math.max(0, nextHistory.length - 1)));
        break;
      }
      case "C":
        setHistory([]);
        setSelected(0);
        break;
      case "▲":
        setSelected((index) => Math.max(0, index - 1));
        break;
      case "▼":
        setSelected((index) => Math.min(Math.max(0, history.length - 1), index + 1));
        break;
      case "OK": {
        const record = history[selected];
        if (!record) return;
        setFrom(record.from);
        setTo(record.to);
        setAmount(record.amount);
        navigate("/exchange");
        break;
      }
      default:
        break;
    }
  };

  const handleAction = mode === "history" ? handleHistoryAction : handleExchangeAction;

  return <Keypad mode={mode} onAction={handleAction} saveDisabled={loading || !quote} />;
}
