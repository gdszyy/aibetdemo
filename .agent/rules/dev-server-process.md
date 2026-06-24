---
trigger: always_on
description: Dev server / 本地服务进程管理规范，避免重复启动和遗留后台进程
---

# Dev Server / 本地服务进程管理

- 启动任何 `pnpm dev`、`npm run dev`、`vite`、`serve`、`http-server` 或类似本地服务前，必须先检查目标端口是否已有进程占用，例如 `netstat -ano | findstr :3000` 和 `Get-Process node`。
- 如果已有可用服务，优先复用，不得为同一项目、同一预览目标重复启动新服务；如需更换端口，必须说明原因并记录新端口。
- 纯 HTML 项目可以直接打开文件运行时，优先提供本地 HTML 路径；只有模块加载、路由、CORS、构建产物预览等明确需求才启动本地服务。
- Agent 启动 dev server 时必须记录启动命令、工作目录、端口、PID 或可用于关闭的进程信息，并在任务总结中说明服务是否仍在运行。
- 仅用于验证或截图的服务，任务结束前应主动关闭；如需保留给用户预览，必须告知服务 URL、端口和关闭方式。
- 关闭服务优先使用 `Stop-Process -Id <PID>` 精准关闭，禁止随意杀死所有 `node` 进程，除非用户明确同意。
- 除非用户明确要求打开预览、启动服务或运行 dev server，否则 Agent 不应自动启动长期运行的本地服务；确需启动时应先检查端口、复用现有服务，并在完成验证后关闭自己启动的进程。

完整规范见 `docs/agents/dev-server-process.md`。
