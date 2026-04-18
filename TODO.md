# Fix MongoDB Namespace Error & Prevent Test DB Creation

## Goal
- Fix "Invalid namespace: ecommerce_app_db/ecommerce_app_db.users" (duplicated DB name in URI)
- Prevent accidental connection to &#39;test&#39; database

## Steps
1. [x] Create `.env.example` with correct `MONGODB_URI_BASE` and `DB_NAME=ecommerce_app_db`
2. [x] Edit `config/db.ts`: 
   - Construct URI dynamically: `${MONGODB_URI_BASE}/${DB_NAME}`
   - Validate DB_NAME not contains &#39;test&#39;
   - Log URI (masked) for debug
3. [x] Edit `scripts/makeAdmin.ts`: Remove duplicate `await connectDB()`
4. [ ] Update `.env` based on `.env.example`
5. [ ] Test: `npm run server`, check no error, MongoDB `show dbs` (no test DB)

Progress marked after each step.

