# Findings:

#### Add testing command for CI

``vitest run`` Should work well and return status code.

#### parseFloat(value)

`parseFloat('1,000')` converts to 1, because of `,`. So we filter everything except numbers and dot with RegEx and cover with tests.

#### formatMoney(value)

Using round and multiply by 100 gives gives more accurate number. Uses Intl.NumberFormat instance which created outside the function to avoid recreating it on every call.

#### React Routing

Current implementation has no routing, so will add react-router and use DataRouter approach. Keeping index route for existing version of app and creating Pages for Exchange, History and NotFound. Also adding Layout for new pages.

#### Keypad effect

While trying to put a number I noticed that events are triggered twice its because of  `<StrictMode>`. In development, React runs effects through an extra setup/cleanup cycle. Your keypad effect adds a native click listener but never removes it, so both listeners remain attached and each click runs the handler twice. Solution here will be to add `return () => table.removeEventListener("click", handler);`
