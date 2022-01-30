import * as cheerio from 'cheerio';
import { write, writeFile } from 'fs';

export const processWWFGreenOffice = (html: string): ApiCompanyCertificate[] => {
  const $ = cheerio.load(html);
  const output: ApiCompanyCertificate[] = [];
  $(
    '#content .container-fluid.text-block.go-pillar .text-block__text > p:nth-of-type(-n+2) > a'
  ).each((index, node) => {
    // Trim whitespace and trailing comma
    const companyName = $(node).text().trim().replace(/(,$)/g, '');
    if (companyName) {
      output.push({ companyName, certificateId: 'wwf-green-office' });
    }
  });
  return output;
};

type GEOGolfDataType = {
  id: number;
  club_name: string;
  lat: string;
  lng: string;
  category: string;
  certified: number;
  certF: number;
  certT: number;
  certD: number;
  feature_img: string;
  country_name: string;
  country: string;
  region: string;
  city: string;
  uri: string;
};

export const processGEOGolf = (json: GEOGolfDataType[]): ApiCompanyCertificate[] => {
  const data = json?.filter((company) => company.certified === 1 && company.country === 'Finland');
  const output: ApiCompanyCertificate[] = data.map((d) => ({
    companyName: d.club_name,
    certificateId: 'geo-golf',
  }));
  return output;
};

export const processEkokompassi = (html: string): ApiCompanyCertificate[] => {
  const $ = cheerio.load(html);
  const output: ApiCompanyCertificate[] = [];
  const nodes = $('.customers-list > li.customer > p.name');

  nodes.each((index, node) => {
    const name = $(node)
      .text()
      .trim()
      .replace(/(\r\n|\n)/gm, '')
      // Replace spaces if there is multiple sequentially
      .replace(/ +(?= )/g, '');

    if (name) {
      output.push({ companyName: name, certificateId: 'ekokompassi' });
    }
  });

  return output;
};
