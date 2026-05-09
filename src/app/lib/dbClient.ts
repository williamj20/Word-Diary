import postgres from 'postgres';

const globalForSql = globalThis as unknown as {
  sql: postgres.Sql | undefined;
};

if (globalForSql.sql) {
  console.log('Reusing existing postgres connection');
}

const sql =
  globalForSql.sql ??
  (() => {
    console.log('Creating new postgres connection');
    return postgres(process.env.DATABASE_URL!);
  })();

if (process.env.NODE_ENV !== 'production') {
  globalForSql.sql = sql;
}

export default sql;
