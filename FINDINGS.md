# Findings:

#### Add testing command for CI

``vitest run`` Should work well and return status code.

#### parseFloat(value)

`parseFloat('1,000')` converts to 1, because of `,`. So we filter everything except numbers and dot with RegEx and cover with tests.

#### formatMoney(value)

Using round and multiply by 100 gives gives more accurate number. Uses Intl.NumberFormat instance which created outside the function to avoid recreating it on every call.
