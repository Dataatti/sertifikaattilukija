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
        table.string('name').unique({ indexName: 'name_unique_id' });
        table.string('vat_number');
        table.string('address');
        table.string('city');
        table.string('post_code');
        table.boolean('blacklisted');
        table.timestamps(false, true);
      });
    }
    const hasTableCertificate = await dbClient.schema.hasTable('company_certificate');
    if (!hasTableCertificate) {
      await dbClient.schema.createTable('company_certificate', (table) => {
        table.increments('id').primary();
        table.increments('company_id', { primaryKey: false });
        table.foreign('company_id').references('company.id');
        table.timestamps(false, true);
      });
    }
  } catch (error) {
    console.error(error);
  }
};
