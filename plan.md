# Generator Studi Kasus MySQL untuk Database Administrator, Data Engineer & Data Analyst

## What it is

A web app that generates realistic, ready-to-run MySQL practice case studies in Indonesian for three data roles — Database Administrator, Data Engineer and Data Analyst — set in Indonesian industries. Every case is executed against a real, throwaway MySQL database before it is shown, so the SQL, sample data and expected results are known to match.

## Who it's for

Instructors, bootcamps and self-learners preparing for DBA, data engineering or data analyst work who want SQL practice built around real on-the-job tasks rather than generic syntax drills.

## Core features and experience

- **The interface is fully in Indonesian.** Generated cases are always in Indonesian too.
- **Generator form** with these inputs:
- role: **Database Administrator**, **Data Engineer** or **Data Analyst**, plus an editable "tanggung jawab" field pre-filled for each role
- level: easy, middle, advance or portfolio
- industry and its business/data guidance, with quick-fill industry presets (e.g. perbankan, e-commerce, logistik, rumah sakit, telekomunikasi)
- number of tasks: 3–15
- MySQL version: 8.0 by default, 8.4 also offered
- random seed: optional, auto-filled
- Inputs are validated with clear messages, including length limits and the task range.
- **The role shapes the work being practiced**, replacing the "administrative role" in the original spec. The rest of the spec's prompt rules and JSON shape are kept.
- **Database Administrator:** schema and constraint design, indexing and `EXPLAIN`-based query tuning, data integrity checks (orphan rows, duplicates, constraint violations), and safe changes using transactions.
- **Data Engineer:** staging and target tables, data cleaning and standardisation, deduplication, upsert (`INSERT ... ON DUPLICATE KEY UPDATE`), incremental loads by date or ID, and reconciling source totals against target totals.
- **Data Analyst:** KPI summaries, trends over time, segmentation, ranking and running totals with window functions, cohort and retention analysis, and management-ready findings.
- The level controls how much SQL difficulty applies on top of the role, as defined in the spec.
- **Tasks that change data or structure are allowed.** This mainly applies to DBA and Data Engineer cases: ALTER, CREATE INDEX, UPDATE, INSERT and upserts.
- They use a safe transaction pattern and end with a verification query. The expected result is the output of that verification query.
- User accounts and privilege commands (`CREATE USER`, `GRANT`) are excluded, because they affect the whole server rather than the practice database.
- **Progress steps are shown while it runs:** "Membuat studi kasus → Memeriksa struktur → Menjalankan SQL → Selesai".
- **The "no mistake" guarantee** has two layers of checks before anything is marked as a success:
1. **Structural checks.** The output is valid JSON in the required shape. Level, role, industry, MySQL version and task count match the inputs. Tasks are numbered 1..N. Every table, column and foreign key is consistent across the schema, the sample rows, `setupSql`, the tasks and the results. The portfolio fields are empty for non-portfolio levels. No PostgreSQL- or SQL Server-only syntax appears.
2. **Execution checks.** The app runs `setupSql`, then every task in order, on a temporary isolated MySQL database that is wiped after each run. It then replaces each `expectedResult` with the real output, so the answers always match the data.
- **Handling failures.** If a query fails, the AI gets one automatic repair attempt that includes the MySQL error. If the case still fails, the app shows a clear Indonesian error and offers "Coba lagi". A failed case is never shown as a success. AI timeouts, rate limits and broken JSON each get their own clear message, with limited retries.
- **Result view** shows the scenario, learning goals, a schema table per table with sample rows, and the setup SQL with syntax highlighting. Each task appears as a card with its instruction and hint; the answer SQL, explanation and expected result table are hidden behind a "Lihat jawaban" toggle, so learners can try first. Data quality notes come after the tasks. Portfolio cases also show the rubric, client brief, deliverables and README template.
- **Export:** copy the JSON, download it as `.json`, and download `setupSql` as a `.sql` file.
- **Stateless:** no accounts and no history. Nothing is saved after the page closes.
- **Abuse protection:** a simple per-IP limit on generations, to protect AI credits and the Groq free tier.

## AI provider decision

- **In this preview:** Gemini 3 Flash through the Emergent LLM key. No key is needed.
- **On Vercel:** the backend switches to **Groq** when a `GROQ_API_KEY` is set as a Vercel environment variable. The Groq model is set by a `GROQ_MODEL` variable. The key stays on the server and never reaches the browser.
- **Execution checks on Vercel:** Vercel has no MySQL server of its own, so the execution checks there need a separate MySQL connection set as an environment variable, for example a free hosted MySQL instance. If none is configured, the app still runs the structural checks and labels the result "Belum diuji eksekusi" instead of claiming it was verified.
- **Generation time:** a full generate-and-verify run can take 30–90 seconds. On Vercel this may need a plan or function setting that allows longer runtimes.

## Phase 1: what gets built now

- The Indonesian generator form, with the three roles, role-specific default responsibilities, industry presets and validation.
- An adapted generation prompt for DBA, Data Engineer and Data Analyst work, keeping the spec's JSON shape.
- AI generation with Gemini 3 Flash in this preview, plus the Groq switch ready for Vercel.
- The full validation pipeline: structural checks plus execution on a throwaway MySQL 8 database, with expected results auto-corrected and one AI repair attempt.
- The result view with "Lihat jawaban" toggles, and copy/download for JSON and SQL.
- Clear error states for every failure path, plus per-IP rate limiting.
- **Not in phase 1:** accounts, saved history, running learners' own SQL in the app, user/privilege tasks, and the actual Vercel deployment. The app will be Vercel/Groq-ready, but deploying it is a separate step.