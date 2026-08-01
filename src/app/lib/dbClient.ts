import postgres from 'postgres';

const globalForSql = globalThis as unknown as {
  sql: postgres.Sql | undefined;
};

const createSql = () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not configured');
  }

  return postgres(databaseUrl, {
    prepare: false,
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });
};

if (globalForSql.sql) {
  console.log('Reusing existing Postgres client');
}

const sql =
  globalForSql.sql ??
  (() => {
    console.log('Creating new Postgres client');
    return createSql();
  })();

// Production reuses this module-scoped client. Development also stores it on
// globalThis so Next.js hot reloads do not create another connection pool.
if (process.env.NODE_ENV !== 'production') {
  globalForSql.sql = sql;
}

export default sql;
