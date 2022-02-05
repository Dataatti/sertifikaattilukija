import * as cheerio from 'cheerio';

export const processGreenKeyAland = (html: string): ApiCompanyCertificate[] => {
  const $ = cheerio.load(html);
  const output: ApiCompanyCertificate[] = [];

  $('.entry-content > ul > li a, .entry-content > ul > li span').each((index, node) => {
    // Trim and collapse whitespace
    const companyName = $(node).text().trim().replace(/\s\s+/g, ' ');

    if (companyName) {
      output.push({ companyName, certificateId: 'green-key' });
    }
  });
  const uniqueOutput = output.filter(
    (value, index, self) => index === self.findIndex((t) => t.companyName === value.companyName)
  );

  console.log(uniqueOutput.find(n => n.companyName === "Café Hjorten/Matverket"))

  return uniqueOutput;
};

export const processGreenKeyMain = (html: string): ApiCompanyCertificate[] => {
  const $ = cheerio.load(html);
  const output: ApiCompanyCertificate[] = [];

  $('.fusion-portfolio-content-wrapper > .fusion-portfolio-content > .fusion-post-title > a').each(
    (index, node) => {
      // Trim and collapse whitespace
      const companyName = $(node).text().trim().replace(/\s\s+/g, ' ');
      if (companyName) {
        output.push({ companyName, certificateId: 'green-key' });
      }
    }
  );

  return output;
};

export const processTourCert = (html: string): ApiCompanyCertificate[] => {
  const $ = cheerio.load(html);
  const output: ApiCompanyCertificate[] = [];
  $('.ajax_posts > .community-card .community-card-content h4.red.centered').each((index, node) => {
    // Trim whitespace
    const companyName = $(node).text().trim();
    if (companyName) {
      output.push({ companyName, certificateId: 'tour-cert' });
    }
  });
  return output;
};

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
      // Replace extra spaces if there is multiple spaces sequentially
      .replace(/ +(?= )/g, '');

    if (name) {
      output.push({ companyName: name, certificateId: 'ekokompassi' });
    }
  });

  return output;
};
