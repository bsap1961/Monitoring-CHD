# Sales Monitoring - Full Version (Ready to Deploy)

This is the *complete* frontend React (Vite) app scaffold that connects to Supabase.
You asked for the **version lengkap** — Admin login, targets, product focus, programs, data import/export.

## Quick steps to deploy (summary)
1. Create a Supabase project (done) and run the SQL you already ran (tables created).
2. In Supabase, ensure admin users exist (you already inserted 2 default admins via SQL).
3. In Vercel, create a new project from this ZIP or from a Git repo.
4. Set Environment Variables in Vercel (Project -> Settings -> Environment Variables):
   - `VITE_SUPABASE_URL` = https://gfieeenshshnskupbxdj.supabase.co
   - `VITE_SUPABASE_ANON_KEY` = (your anon public key)
5. Deploy. Visit `/login` to sign in as admin (bsap@admin.com or dwi.utomo@admin.com, password admin123).

## Notes
- This project uses client-side Supabase JS; service_role key must NOT be used here.
- Admin UI includes paste import and export excel. Additional CRUD UIs were scaffolded and can be extended.
