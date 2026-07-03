# SECURITY_CHECKLIST.md — RHUFT v6.0 Security Baseline

> **Purpose:** Mandatory security audit reference. Apply before and after every code change.

---

## 1. Pre-Change Security Audit

Before writing code, verify:

- [ ] No secrets, API keys, or credentials are visible in the existing code being modified.
- [ ] The change does not require storing secrets in source files.
- [ ] The change does not introduce new external dependencies without vetting.
- [ ] The change does not increase the attack surface unnecessarily.

## 2. Code-Level Security Checks

### 2.1 Injection Prevention
- [ ] All user/external inputs are validated against schemas.
- [ ] No string concatenation into commands, queries, or paths.
- [ ] No `eval()`, `new Function()`, or `setTimeout(string)`.
- [ ] No `innerHTML` with unsanitized content.

### 2.2 Secrets Management
- [ ] Secrets loaded from environment variables or a secrets manager.
- [ ] No `.env` files committed (verify `.gitignore`).
- [ ] No secret logging (tokens, passwords, keys).
- [ ] No secret in error messages returned to users.

### 2.3 Dependency Security
- [ ] Run `npm audit` after adding dependencies.
- [ ] Pin dependency versions in `package.json`.
- [ ] Prefer well-maintained packages with clear governance.

### 2.4 Network & Integration
- [ ] HTTPS only for external APIs.
- [ ] Timeouts and retries configured.
- [ ] No disabled TLS verification in production.
- [ ] Webhook signatures verified if applicable.

### 2.5 File System
- [ ] No path traversal from user input.
- [ ] No arbitrary file read/write.
- [ ] Temporary files cleaned up.

## 3. Post-Change Security Audit

After writing code:

- [ ] Re-scan the diff for secrets and unsafe patterns.
- [ ] Verify new inputs have validation.
- [ ] Verify new dependencies are audited.
- [ ] Verify error messages do not leak internals.
- [ ] Verify logs do not contain secrets or PII.

## 4. Documentation Labels

Mark security-critical code with `[SECURITY]` in comments.

---

**Last updated:** 2026-07-01
