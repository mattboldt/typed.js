# Callback regression checks

Run with Node.js 24 (no additional dependencies):

```sh
node --test tests/pre-string-typed.test.js
```

The tests use the built-in mock timers and a minimal text element to exercise
the full string sequence. They check callback ordering for shared prefixes,
identical strings, longer and shorter next strings, looping, no common prefix,
and disabled smart backspacing. They do not replace the browser demos.

After `npm run build`, serve the repository over HTTP and open
`tests/pre-string-typed.html` for the browser regression. The result should be
`PASS`, with callbacks for positions `[0,1,2]`.
