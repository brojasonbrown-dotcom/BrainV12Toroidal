# INSTALL_GUIDE — RHUFT v6.0 Workflow Kit

> This kit contains the complete foolproof workflow configuration for VS Code + Docker + GitHub + Lovable.

---

## What Is Included

```
RHUFT_Workflow_Kit/
├── AGENTS.md                          → Universal mandatory agent rules
├── WORKFLOW.md                        → Human-readable workflow guide
├── package.json                       → Node.js project manifest
├── tsconfig.json                      → TypeScript configuration
├── docker-compose.yml                 → Local Docker services
├── Dockerfile                         → Dev/runtime container
├── .gitignore                         → Git ignore rules
├── .kimi/
│   ├── AGENTS.md                      → Kimi-specific rules
│   ├── config.json                    → Machine-readable workflow config
│   ├── context/                       → Persistent memory files
│   │   ├── PROJECT_BRAINMAP.md
│   │   ├── ARCHITECTURE_AUDIT.md
│   │   ├── SECURITY_CHECKLIST.md
│   │   ├── UI_UX_RULES.md
│   │   └── TRUTH_SOURCES.md
│   └── tasks/
│       └── TEMPLATE.md                → Task tracking template
├── .vscode/
│   ├── settings.json                  → VS Code workspace settings
│   └── extensions.json                → Recommended extensions
├── .devcontainer/
│   └── devcontainer.json              → Reproducible dev container
├── .github/
│   └── workflows/
│       └── daily-sync.yml             → Automated daily sync
└── scripts/
    └── daily-sync.sh                  → Local daily sync script
```

---

## How to Install Into Your Project

### Option A — Extract Directly Over Your Project Root

1. Copy `RHUFT_Workflow_Kit.zip` to your project root.
2. Extract the zip **directly** into the project root (not into a subfolder).
   - On Windows: right-click → "Extract All..." → choose the project root folder.
   - On macOS/Linux: `unzip RHUFT_Workflow_Kit.zip -d /path/to/project`
3. This will create/overwrite the files in their correct locations:
   - `AGENTS.md`, `WORKFLOW.md`, `package.json`, etc. at root
   - `.kimi/`, `.vscode/`, `.devcontainer/`, `.github/`, `scripts/` folders

### Option B — Copy Files Manually from `RHUFT_Workflow_Kit/`

If you prefer manual control, copy each file/folder from `RHUFT_Workflow_Kit/` into your project root, preserving the folder structure.

---

## Step-by-Step Setup

### 1. Install VS Code

Download and install from: https://code.visualstudio.com/

### 2. Install VS Code Extensions

The file `.vscode/extensions.json` lists the recommended extensions. VS Code will prompt you to install them when you open the project. To install manually:

1. Open the project in VS Code.
2. Press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (macOS) to open Extensions.
3. Search for and install each of these:
   - **ESLint** — `dbaeumer.vscode-eslint`
   - **Prettier - Code: formatter** — `esbenp.prettier-vscode`
   - **TypeScript Next** — `ms-vscode.vscode-typescript-next`
   - **Docker** — `ms-azuretools.vscode-docker`
   - **GitHub Copilot** — `github.copilot`
   - **GitHub Copilot Chat** — `github.copilot-chat`
   - **GitLens** — `eamodio.gitlens`
   - **Markdown All in One** — `yzhang.markdown-all-in-one`
   - **markdownlint** — `davidanson.vscode-markdownlint`
   - **Tailwind CSS IntelliSense** — `bradlc.vscode-tailwindcss`
   - **EditorConfig for VS Code** — `editorconfig.editorconfig`

Or open the terminal in VS Code and run:

```bash
# Install all recommended extensions at once
cat .vscode/extensions.json | grep -o '"[a-z.-]*"' | tr -d '"' | xargs -n1 code --install-extension
```

On Windows PowerShell, use:

```powershell
$exts = (Get-Content .vscode/extensions.json | ConvertFrom-Json).recommendations
$exts | ForEach-Object { code --install-extension $_ }
```

### 3. Install Docker

1. Download Docker Desktop: https://www.docker.com/products/docker-desktop
2. Install and start Docker Desktop.
3. Verify in terminal:

```bash
docker --version
docker-compose --version
```

### 4. Open in Dev Container

1. In VS Code, open the command palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).
2. Type and run: **"Dev Containers: Reopen in Container"**
3. VS Code will build the container using `.devcontainer/devcontainer.json` and `Dockerfile`.
4. Inside the container, run:

```bash
npm install
```

### 5. Verify the Setup

Inside the Dev Container, run:

```bash
npm run typecheck
npm run test
npm run lint
```

> **Note:** The existing RHUFT TypeScript files currently have broken import paths (they reference `../../core/constants` and `../types.ts` which do not exist). The `typecheck` command will fail until those imports are fixed in a separate refactor task.

### 6. Connect to GitHub

1. Ensure your project is a Git repository:

```bash
git init
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

2. The GitHub Actions workflow in `.github/workflows/daily-sync.yml` will activate automatically once pushed to GitHub.

### 7. Enable Automated Daily Sync

#### GitHub Actions (Recommended)

The workflow already exists at `.github/workflows/daily-sync.yml`. After pushing to GitHub:

1. Go to **Settings → Actions → General** in your GitHub repo.
2. Ensure **Workflow permissions** has "Read and write permissions" enabled.
3. The workflow runs daily at 06:00 UTC.
4. You can also trigger it manually from **Actions → Daily Sync → Run workflow**.

#### Local Cron (Alternative)

1. Make the script executable (already done if extracted from zip):

```bash
chmod +x scripts/daily-sync.sh
```

2. Add to crontab to run daily at 06:00:

```bash
crontab -e
```

Add this line:

```cron
0 6 * * * /path/to/project/scripts/daily-sync.sh >> /path/to/project/.daily-sync.log 2>&1
```

---

## How to Use the Workflow

### For Every New Task

1. Copy `.kimi/tasks/TEMPLATE.md` to `.kimi/tasks/{task-slug}.md`.
2. Fill in the goal, scope, and subtasks.
3. Set status to `in_progress`.
4. Work through the 12-step state machine documented in `WORKFLOW.md` and `AGENTS.md`.
5. Update the task file after each step.
6. When complete, set status to `done` and move to `.kimi/tasks/archive/`.

### Context Files the Agent Must Read

Before editing, the agent loads:

- `AGENTS.md`
- `.kimi/AGENTS.md`
- `.kimi/context/PROJECT_BRAINMAP.md`
- `.kimi/context/ARCHITECTURE_AUDIT.md`
- `.kimi/context/SECURITY_CHECKLIST.md`
- `.kimi/context/UI_UX_RULES.md`
- `.kimi/context/TRUTH_SOURCES.md`
- Any active `.kimi/tasks/*.md`

### Non-Negotiable Rules

- No subtask may be skipped once a plan starts.
- Verification (typecheck, tests, lint) must pass before completion.
- No git mutations unless explicitly asked (except the authorized daily sync).
- No mock truth sources in production code.
- UI options must be discoverable; panels must be modular.

---

## Important Notes

1. **Existing TypeScript imports are broken.** Files like `base_framework.ts` import from `../../core/constants` which does not exist. This requires a separate refactor task.
2. **No secrets in source.** Ensure `.env` and `.last-auto-sync` are ignored by `.gitignore`.
3. **Daily sync only commits a marker file.** It will not auto-commit your unfinished work.
4. **Backup before extracting.** If your project already has `AGENTS.md`, `.vscode/settings.json`, etc., the zip will overwrite them.

---

## Need Help?

Read `WORKFLOW.md` for the full deep-dive operating manual.
