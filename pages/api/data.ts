import { CorsOptions, CorsOptionsDelegate } from 'cors';
import type { NextApiRequest, NextApiResponse } from 'next';
import { checkCors, corsOptions } from 'utils/cors';
import { dbClient } from 'utils/database';
import { getErrorMessage } from 'utils/utils';

type Data = {
  companyId: number;
  name: string;
  vatNumber: string;
  address: string;
  postCode: string;
  city: string;
  certificateId: string[];
};

type ResponseData = {
  totalResults: number;
  resultsFrom: number;
  data: Data[];
};

/**
 * Route for fetching company information
 * @param req Next.js request
 * @param res Next.js response
 */
export const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | { msg: string }>
) => {
  try {
    await checkCors(req, res, corsOptions);
    const { name, city, certificate, limit, offset } = req.query;
    const _city = city ? (city as string).split(',') : undefined;
    const _certificate = certificate ? (certificate as string).split(',') : undefined;
    const _limit = limit ? parseInt(limit as string) : undefined;
    const _offset = offset ? parseInt(offset as string) : 0;

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
        if (_city) {
          builder.whereRaw('company.city ILIKE ANY (?)', [_city]);
        }
      })
      .andWhere((builder) => {
        if (_certificate) {
          builder.whereRaw('company_certificate.certificate_id ILIKE ANY (?)', [_certificate]);
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
      .offset(_offset);

    if (_limit) {
      query.limit(_limit);
    }

    const results = await query;
    const resultObject = {
      totalResults: total ? parseInt(total as string) : 0,
      resultsFrom: _offset ? _offset : 0,
      data: results,
    };

    res.status(200).json(resultObject);
  } catch (error) {
    res.status(500).json({ msg: getErrorMessage(error) });
  }
};

export default handler;
