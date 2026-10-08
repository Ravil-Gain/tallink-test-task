# Findings

#### Parse amounts with thousands separators

**Problem:** `parseFloat("1,000")` returns `1`, so formatted amounts could be interpreted incorrectly. This also affected amounts restored from History because saved values include grouping separators.

**Solution:** I added a shared amount parser that removes grouping separators and other non-numeric characters before parsing, then used it for conversions and restored history values. I covered common formatted amounts with unit tests.

#### Format monetary values consistently

**Problem:** Raw floating-point conversion results could show excess precision or rounding artifacts in the exchange result and saved records.

**Solution:** I centralized display formatting in `formatMoney`, rounded to two decimal places, and used one `Intl.NumberFormat` instance for grouping and decimal display.

#### Prevent duplicate keypad clicks in StrictMode

**Problem:** React StrictMode runs effects through an extra setup and cleanup cycle in development. The original keypad's native click listener was not removed, so a click could be handled more than once.

**Solution:** I added effect cleanup to remove the listener. As the keypad was moved into its own widget, I also replaced delegated DOM event handling with React button callbacks.

#### Add routes for the two app screens

**Problem:** The app had no real navigation between Exchange Rate and History, and the route pages were only placeholders.

**Solution:** I added React Router routes for Exchange, History, and Not Found, with a shared layout for the navigation, app state, and keypad. The existing root route remains available.

#### Keep exchange state and quote data in sync

**Problem:** Quote requests could finish out of order after the amount or currencies changed, leaving a result from an earlier selection on screen. Invalid API responses and failed requests also had no useful UI state.

**Solution:** I moved shared exchange state into `AppStateProvider`, debounce quote requests, abort obsolete requests, and expose a quote only when its recorded request matches the current amount and currencies. I also added response validation and loading/error states for rates and quotes.

#### Restore the selected history conversion accurately

**Problem:** Selecting a saved conversion must restore its original amount and both currencies; otherwise the next quote can be calculated for a different conversion. Deleting the selected record can also leave the selection pointing past the end of the list.

**Solution:** I wired the History keypad actions to restore the selected record's currencies and amount before navigating back to Exchange. After deletion or clearing, the selection is kept within the remaining records.

#### Add coverage for the user workflows

**Problem:** The app's currency loading, quote lifecycle, history selection, and keypad actions needed repeatable regression checks. Tests also need a one-shot command suitable for CI.

**Solution:** I configured Vitest with jsdom and Testing Library, added focused tests for the money helpers, provider, exchange/history widgets, and keypad, and added a coverage command with 80% thresholds. The CI test command runs Vitest once and exits with its result; coverage output is ignored by Git.
