import knex, { Knex } from 'knex';
import { NextApiRequest, NextApiResponse } from 'next';
import companies from 'data/company_dump_09022022.json';

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
  return (fn: (req: NextRequestWithDb, res: NextApiResponse) => Promise<any>) =>
    async (req: NextRequestWithDb, res: NextApiResponse) => {
      const db = knex(dbConfig);
      req.db = db;
      const result = await fn(req, res);
      await req.db.destroy();
      return result;
    };
};

/**
 * Function for initializing database tables
 */
export const initDatabase = async (db: Knex<any, unknown[]>) => {
  try {
    const hasTableCompany = await db.schema.hasTable('company');
    if (!hasTableCompany) {
      // Create company table
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

      // Insert initial company data
      const chunkSize = 500;
      let index = 0;
      while (index <= (companies as Array<any>)?.length) {
        const chunk = (companies as Array<any>)?.slice(index, index + chunkSize);
        await db('company').insert(chunk);
        index += chunkSize;
      }
    }

    const hasTableCertificate = await db.schema.hasTable('company_certificate');
    if (!hasTableCertificate) {
      // Create company_certificate table
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
  companyCertificates: ApiCompanyCertificate[],
  db: Knex<any, unknown[]>
) => {
  const companyNames = companyCertificates.map((cert) => cert.companyName?.toLowerCase());
  const companies = await db('company').where((query) => {
    companyNames.forEach((company) =>
      query.orWhere('name', 'ilike', `${company} oy`).orWhere('name', 'ilike', company)
    );
    return query;
  });

  // If no matches, don't bother sending request to database
  if (companies.length === 0) return;

  const upsertableCompanyCertificates = companies
    ?.map((company) => {
      const cert = companyCertificates.find(
        (cCert) =>
          cCert?.companyName?.toLowerCase()?.replace(/ oy$| oy ab$| ab$| tmi$| ky$/, '') ===
          company?.name?.toLowerCase()?.replace(/ oy$| oy ab$| ab$| tmi$| ky$/, '')
      );
      return { certificate_id: cert?.certificateId, company_id: company?.id };
    })
    .filter((n) => n.company_id && n.certificate_id);

  await db('company_certificate')
    .insert(upsertableCompanyCertificates)
    .onConflict(['certificate_id', 'company_id'])
    .ignore();
};

export const getCompanies = async (
  db: Knex<any, unknown[]>,
  limit?: number,
  offset?: number,
  name?: string | string[],
  certificate?: string[],
  city?: string[]
) => {
  const query = db('company')
    .leftJoin('company_certificate', 'company.id', 'company_certificate.company_id')
    .where((builder) => {
      builder.whereNull('company.blacklisted').orWhere('company.blacklisted', false);
    })
    .andWhere((builder) => {
      if (name) {
        builder
          .whereRaw('company.name ILIKE ?', [`%${name}%`])
          .orWhereRaw('company.vat_number ILIKE ?', [`%${name}%`]);
      }
    })
    .andWhere((builder) => {
      if (city) {
        builder.whereRaw('company.city ILIKE ANY (?)', [city]);
      }
    });

  if (certificate && certificate.length !== 0) {
    // Get fields where there is an intersection between company's certificate_id:s and searched certificate_id:s
    query.havingRaw('ARRAY_REMOVE(ARRAY_AGG(company_certificate.certificate_id), NULL) && (?)', [
      certificate,
    ]);
  }

  query
    .select([
      'company.id as companyId',
      'company.name as name',
      'company.vat_number as vatNumber',
      'company.address as address',
      'company.post_code as postCode',
      'company.city as city',
      db.raw(
        'ARRAY_REMOVE(ARRAY_AGG(company_certificate.certificate_id), NULL) as "certificateId"'
      ),
    ])
    .groupBy('company.id', 'company.name')
    .orderBy('company.name', 'asc');

  const counter = db.count().from(query.clone().as('a')).first();

  // Get total count ignoring limit and offset
  const totalQuery = await counter;
  const total = totalQuery?.count;

  query.offset(offset ?? 0);

  if (limit) {
    query.limit(limit);
  }

  const companies: Company[] = await query;

  return { companies, total };
};
