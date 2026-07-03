# Tools Setup Guide — RHUFT v13 Engine

## GitHub CLI (`gh`)

### Option 1 — Install via winget (Windows)
Open PowerShell as Administrator and run:

```powershell
winget install --id GitHub.cli
```

Then authenticate:

```powershell
gh auth login
```

### Option 2 — Manual Download
Download from https://cli.github.com/ and run the installer.

### Option 3 — Use Git Directly (No `gh` required)
The repository remote is already configured:

```bash
git remote -v
# origin  https://github.com/brojasonbrown-dotcom/BrainV12Toroidal.git
```

To push, use either HTTPS with a PAT or SSH:

```bash
# HTTPS with PAT
git push https://YOUR_TOKEN@github.com/brojasonbrown-dotcom/BrainV12Toroidal.git main

# Or SSH (after adding your key to GitHub)
git push origin main
```

## Wolfram / Mathematica Tools

### WolframAlpha API
1. Get an App ID from https://products.wolframalpha.com/api/
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Fill in `WOLFRAM_ALPHA_APP_ID=your_key_here`
4. Run a test query:
   ```bash
   npx ts-node scripts/wolfram-query.ts "kuramoto model order parameter"
   ```

### Wolfram Cloud / Wolfram Language
For heavy symbolic computation, use the Wolfram Cloud API or a local Mathematica kernel:

1. Create a Wolfram Cloud account at https://www.wolframcloud.com/
2. Deploy an API function or use `CloudEvaluate`.
3. Add your cloud API key to `.env`:
   ```env
   WOLFRAM_CLOUD_API_KEY=your_key
   WOLFRAM_CLOUD_BASE_URL=https://www.wolframcloud.com
   ```

## API Key Security

- **Never commit `.env` to git.** It is already in `.gitignore`.
- **Never paste keys into chat.** Use the `.env` file or a secrets manager.
- **Rotate keys regularly.**
- For GitHub Actions, add keys as repository secrets under **Settings → Secrets and variables → Actions**.

## Other Recommended Tools

- **Node.js LTS** (already used by the engine)
- **Docker Desktop** (for Dev Container)
- **VS Code** with Dev Containers extension
- **Python 3** with `py7zr` for archive extraction
