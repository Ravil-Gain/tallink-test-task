import backIcon from "../../../shared/ui/back.svg";
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
    <div
      role="group"
      aria-label={mode === "history" ? "History keypad" : "Exchange keypad"}
      className="grid shrink-0 grid-cols-4 gap-y-[min(1cqw,4px)] rounded-t-[26px] bg-[#F3EEEE] px-4 pb-[min(5.5cqw,22px)] pt-[min(5.5cqw,22px)] compact-landscape:py-[2dvh]"
    >
      {BUTTON_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="col-span-4 grid grid-cols-4 items-center">
          {row.map(({ action, testId, historyOnly }) => {
            return (
              <div key={action} className="keypad-cell">
                <button
                  type="button"
                  data-testid={testId}
                  aria-label={
                    action === "▲"
                      ? "Previous item"
                      : action === "▼"
                        ? "Next item"
                        : action === "OK"
                          ? "Confirm selection"
                          : undefined
                  }
                  disabled={
                    (mode === "history" && HISTORY_DISABLED_ACTIONS.has(action)) ||
                    (mode === "exchange" && (historyOnly || (action === "m" && saveDisabled)))
                  }
                  onClick={() => onAction(action)}
                  className={`keypad-button ${`keypad-button--value keypad-button--${
                    action === "C"
                      ? "clear"
                      : action === "⌫"
                        ? "backspace"
                        : action === "m"
                          ? "save"
                          : "digit"
                  }`}`}
                >
                  {historyOnly ? (
                    mode === "history" ? (
                      action === "▼" ? (
                        <span>🔽</span>
                      ) : action === "▲" ? (
                        <span>🔼</span>
                      ) : action === "OK" ? (
                        <span>🆗</span>
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )
                  ) : action === "⌫" ? (
                    <img
                      src={backIcon}
                      alt=""
                      aria-hidden="true"
                      className="keypad-backspace-icon"
                    />
                  ) : (
                    action
                  )}
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
