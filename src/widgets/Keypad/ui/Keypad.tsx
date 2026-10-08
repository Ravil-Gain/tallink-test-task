import type { KeypadAction, KeypadMode } from "../types";

interface KeypadProps {
  mode: KeypadMode;
  onAction: (action: KeypadAction) => void;
  saveDisabled?: boolean;
}

interface KeypadButton {
  action: KeypadAction;
  testId: string;
  historyOnly?: boolean;
}

const BUTTON_ROWS: KeypadButton[][] = [
  [
    { action: "C", testId: "key-clear" },
    { action: "⌫", testId: "key-backspace" },
    { action: "m", testId: "key-save" },
  ],
  [
    { action: "7", testId: "key-7" },
    { action: "8", testId: "key-8" },
    { action: "9", testId: "key-9" },
    { action: "▲", testId: "key-up", historyOnly: true },
  ],
  [
    { action: "4", testId: "key-4" },
    { action: "5", testId: "key-5" },
    { action: "6", testId: "key-6" },
    { action: "▼", testId: "key-down", historyOnly: true },
  ],
  [
    { action: "1", testId: "key-1" },
    { action: "2", testId: "key-2" },
    { action: "3", testId: "key-3" },
    { action: "OK", testId: "key-ok", historyOnly: true },
  ],
  [
    { action: "00", testId: "key-00" },
    { action: "0", testId: "key-0" },
    { action: ".", testId: "key-dot" },
  ],
];

const HISTORY_DISABLED_ACTIONS = new Set<KeypadAction>([
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "00",
  ".",
  "m",
]);

export default function Keypad({ mode, onAction, saveDisabled = false }: KeypadProps) {
  return (
    <table style={{ borderCollapse: "collapse" }}>
      <tbody>
        {BUTTON_ROWS.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map(({ action, testId, historyOnly }) => {
              if (historyOnly && mode !== "history") return null;

              return (
                <td key={action}>
                  <button
                    type="button"
                    data-testid={testId}
                    disabled={
                      (mode === "history" && HISTORY_DISABLED_ACTIONS.has(action)) ||
                      (mode === "exchange" && action === "m" && saveDisabled)
                    }
                    onClick={() => onAction(action)}
                    style={{ width: 48, height: 32 }}
                  >
                    {action}
                  </button>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
