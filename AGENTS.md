# AGENTS instructions

- Refer to `README.md` for installation, build/start commands, and environment variable setup.
- Run `npm run build` after modifying source files in `src/`.
- Run `npm run lint` before committing.
- Commit both the source files and the generated `main.js` artifact.
- Use 2 spaces for indentation.
- Check server logs for startup/runtime errors and ensure request and server errors are properly handled.
- Guard against missing critical configuration values at server startup, logging warnings on the backend so participants don't see them.
- Use `npm start` to launch the Node server and monitor logs for warnings or errors.
- Do not commit `.env`, `*.log`, or `.DS_Store` files; these are ignored.
- Upload metrics expect file sizes in kilobytes.
- Centralize Apps Script error handling with `handleError`, wrapping spreadsheet operations in try/catch.

## TODO
- [ ] Split `src/main.js` into smaller modules to simplify maintenance.
