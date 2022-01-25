import { CorsOptions } from 'cors';
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { ApiCors } from 'utils/cors';
import { getErrorMessage } from 'utils/utils';

var whitelist = ['http://localhost'];

var corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin || '') !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

export async function middleware(req: NextApiRequest) {
  try {
    const response = NextResponse.next();
    await ApiCors(req, response, corsOptions);

    return response;
  } catch (error) {
    console.log(error);
    return new Response(getErrorMessage(error), {
      status: 401,
    });
  }
}
