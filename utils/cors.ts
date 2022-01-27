import cors, { CorsOptions, CorsOptionsDelegate } from 'cors';

import { NextApiRequest, NextApiResponse } from 'next';

const whitelist = ['*'];

export const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin || '') !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

// - Helper method to wait for a middleware to execute before continuing
// - And to throw an error when an error happens in a middleware
function initMiddleware(middleware: typeof cors) {
  return (req: NextApiRequest, res: NextApiResponse, options?: CorsOptions | CorsOptionsDelegate) =>
    new Promise((resolve, reject) => {
      middleware(options)(req, res, (result: Error | unknown) => {
        if (result instanceof Error) {
          return reject(result);
        }

        return resolve(result);
      });
    });
}

export const checkCors = initMiddleware(cors);
