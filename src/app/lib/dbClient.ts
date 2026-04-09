import postgres from 'postgres';

// useful to test db stuff in local docker postgres
// const sql = postgres(process.env.POSTGRES_URL!);

const sql = postgres(process.env.SUPABASE_DB_URL_DEV!);

export default sql;
