import knex, { Knex } from 'knex';
import { NextApiRequest, NextApiResponse } from 'next';

export interface NextRequestWithDb extends NextApiRequest {
  db: Knex<any, unknown[]>;
}

const dbConfig = {
  client: 'pg',
  connection: process.env.DATABASE_CONNECTION_URL,
  searchPath: ['knex', 'public'],
};

/**
 * Higher-order database client function
 * creates a new knex instance every time and destroys it,
 * to ensure that we don't have multiple connections
 * db is put into request to ensure
 * that we destroy the exact instance
 *
 * @example
 * // /api/example
 * export const handler = async (req: NextRequestWithDb, res: NextApiResponse) => {
 *    ...
 * }
 *
 * export default databaseHoc()(handler)
 */
export const databaseHoc = () => {
  return (fn: (req: NextRequestWithDb, res: NextApiResponse) => Promise<void>) =>
    async (req: NextRequestWithDb, res: NextApiResponse) => {
      const db = knex(dbConfig);
      req.db = db;
      await fn(req, res);
      await req.db.destroy();
      return;
    };
};

/**
 * Function for initializing database tables
 */
export const initDatabase = async (db: Knex<any, unknown[]>) => {
  try {
    const hasTableCompany = await db.schema.hasTable('company');
    if (!hasTableCompany) {
      await db.schema.createTable('company', (table) => {
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
    const hasTableCertificate = await db.schema.hasTable('company_certificate');
    if (!hasTableCertificate) {
      await db.schema.createTable('company_certificate', (table) => {
        table.increments('id').primary();
        table.increments('company_id', { primaryKey: false });
        table.foreign('company_id').references('company.id');
        table.string('certificate_id');
        table.unique(['company_id', 'certificate_id']);
        table.timestamps(false, true);
      });
    }
  } catch (error) {
    console.error(error);
  }
};

/**
 * Upsert company certificates to database. If company name not found, don't insert.
 * @param companyCertificates company certificate data to be upserted into database
 */
export const upsertCompanyCertificates = async (
  companyCertificates: CompanyCertificate[],
  db: Knex<any, unknown[]>
) => {
  const companyNames = companyCertificates.map((cert) => cert.companyName?.toLowerCase());
  const companies = await db('company').whereRaw('name ILIKE ANY (?)', [companyNames]);

  const upsertableCompanyCertificates = companies?.map((company) => {
    const cert = companyCertificates.find(
      (cCert) => cCert?.companyName?.toLowerCase() === company?.name?.toLowerCase()
    );
    return { certificate_id: cert?.certificateId, company_id: company?.id };
  });

  await db('company_certificate')
    .insert(upsertableCompanyCertificates)
    .onConflict(['certificate_id', 'company_id'])
    .ignore();
};
