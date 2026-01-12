# fragments

| Category | Item | Command / Detail | Description |
|--------|------|------------------|-------------------------------|
| Scripts | Start Server | `npm start` | Runs the server once using Node. No auto-reload when I change code. |
|  | Dev Mode | `npm run dev` | Runs the server in watch mode. Requires `.env.debug` or it crashes. |
|  | Debug Mode | `npm run debug` | Starts Node with the debugger open on port `9229` for VS Code. |
|  | Lint | `npm run lint` | Checks my JavaScript files for errors and bad patterns. |
| Config | Env File | `.env.debug` | Stores local environment variables for dev and debug mode. |
|  | Log Level | `FRAGMENTS_LOG_LEVEL=debug` | Makes logs readable while I’m developing. |
|  | Port | `PORT=8080` | The port my server listens on. Defaults to 8080 if not set. |
| Server | Graceful Shutdown | `stoppable()` | Lets the server shut down cleanly without killing connections. |
| Logging | App Logger | `pino` | Main logging library. Must be installed or the app crashes. |
|  | HTTP Logger | `pino-http` | Logs HTTP requests. Not included with `pino` by default. |
| Debugging | Missing Module Error | `Cannot find module 'X'` | Means I forgot to install a dependency with npm. |
|  | Debug Port | `9229` | VS Code needs this port to attach the debugger. |
| Testing | PowerShell curl | `curl` | PowerShell alias, not real curl (can be misleading). |
|  | Real curl | `curl.exe` | Use this to properly test API responses. |
|  | Headers Check | `curl.exe -i http://localhost:8080` | Shows response headers like Helmet and CORS. |
