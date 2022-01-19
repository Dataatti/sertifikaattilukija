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
        table.increments('id');
        table.string('name');
        table.string('vat-number');
        table.string('address');
        table.string('city');
        table.specificType('certificates', 'text[]');
      });
    }
  } catch (error) {
    console.error(error);
  }
};
