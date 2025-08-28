# AGENTS instructions

- Run `npm run build` after modifying source files in `src/`.
- Commit both the source files and the generated `main.js` artifact.
- Use 2 spaces for indentation.
- Check server logs for startup/runtime errors and ensure request and server errors are properly handled.
- Guard against missing critical configuration values at server startup, logging warnings on the backend so participants don't see them.
- Use `npm start` to launch the Node server and monitor logs for warnings or errors.

## TODO
- [ ] Split `src/main.js` into smaller modules to simplify maintenance.
