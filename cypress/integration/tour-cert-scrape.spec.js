import { processTourCert } from '../../services/scrapers';

let html;
let data;

describe('Tour Cert HTML scraping', function () {
  before(() => {
    // check if the import worked correctly
    expect(processTourCert, 'processTourCert').to.be.a('function');
    // load data
    cy.fixture('scrapedData/tour-cert.json').then((output) => (data = output));
    cy.fixture('html/tour-cert.html').then((output) => (html = output));
  });

  context('scrapeCertificates', () => {
    it('Scrapes html correctly', () => {
      const scrapedData = processTourCert(html);
      expect(scrapedData?.length, 'Correct number of companies are read').to.eq(data?.length);
      scrapedData.forEach((scraped) => {
        const foundData = data.find((d) => d.companyName === scraped.companyName);
        expect(scraped?.companyName).to.eq(foundData?.companyName);
      });
    });
  });
});
