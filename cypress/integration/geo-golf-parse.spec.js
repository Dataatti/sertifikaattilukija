import { processGEOGolf } from '../../services/scrapers';

let json;
let data;

describe('GEO Golf json parse', function () {
  before(() => {
    // check if the import worked correctly
    expect(processGEOGolf, 'processGEOGolf').to.be.a('function');
    // load data
    cy.fixture('scrapedData/geo-golf.json').then((output) => (data = output));
    cy.fixture('json/geo-golf-raw.json').then((output) => (json = output));
  });

  context('scrapeCertificates', () => {
    it('Scrapes json correctly', () => {
      const scrapedData = processGEOGolf(json);
      expect(scrapedData?.length, 'Correct number of companies are read').to.eq(data?.length);
      scrapedData.forEach((scraped) => {
        const foundData = data.find((d) => d.companyName === scraped.companyName);
        expect(scraped?.companyName).to.eq(foundData?.companyName);
      });
    });
  });
});
