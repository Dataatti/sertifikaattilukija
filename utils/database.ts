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
export const upsertCompanyCertificates = async (companyCertificates: CompanyCertificate[]) => {
  const companyNames = companyCertificates.map((cert) => cert.companyName?.toLowerCase());
  const companies = await dbClient('company').whereRaw('name ILIKE ANY (?)', [companyNames]);

  const upsertableCompanyCertificates = companies?.map((company) => {
    const cert = companyCertificates.find(
      (cCert) => cCert?.companyName?.toLowerCase() === company?.name?.toLowerCase()
    );
    return { certificate_id: cert?.certificateId, company_id: company?.id };
  });

  await dbClient('company_certificate')
    .insert(upsertableCompanyCertificates)
    .onConflict(['certificate_id', 'company_id'])
    .ignore();
};

export const getCompanies = async (
  limit?: number,
  offset?: number,
  name?: string | string[],
  certificate?: string[],
  city?: string[]
) => {
  const query = dbClient('company')
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
    })
    .andWhere((builder) => {
      if (certificate) {
        builder.whereRaw('company_certificate.certificate_id ILIKE ANY (?)', [certificate]);
      }
    });

  // Get total count ignoring limit
  const totalQuery = await query.clone().count();
  const total = totalQuery?.[0]?.count;

  query
    .select([
      'company.id as companyId',
      'company.name as name',
      'company.vat_number as vatNumber',
      'company.address as address',
      'company.post_code as postCode',
      'company.city as city',
      dbClient.raw(
        'ARRAY_REMOVE(ARRAY_AGG(company_certificate.certificate_id), NULL) as certificateId'
      ),
    ])
    .groupBy('company.id', 'company.name')
    .orderBy('company.name', 'asc')
    .offset(offset ?? 0);

  if (limit) {
    query.limit(limit);
  }

  const companies: Company[] = await query;

  return { companies, total };
};
