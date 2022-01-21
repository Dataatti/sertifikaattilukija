import knex from 'knex';
/**
 * Database client using knex
 */
export const dbClient = knex({
  client: 'pg',
  connection: process.env.DATABASE_CONNECTION_URL,
  searchPath: ['knex', 'public'],
});

/**
 * Function for initializing database tables
 */
export const initDatabase = async () => {
  try {
    const hasTableCompany = await dbClient.schema.hasTable('company');
    if (!hasTableCompany) {
      await dbClient.schema.createTable('company', (table) => {
        table.increments('id').primary();
        table.string('name');
        table.string('vat_number');
        table.string('address');
        table.string('city');
        table.boolean('blacklisted');
      });
    }
    const hasTableCertificate = await dbClient.schema.hasTable('certificate');
    if (!hasTableCertificate) {
      await dbClient.schema.createTable('certificate', (table) => {
        table.increments('id').primary();
        table.increments('company_id', { primaryKey: false });
        table.foreign('company_id').references('company.id');
      });
    }
  } catch (error) {
    console.error(error);
  }
};
