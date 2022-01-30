import { processEkokompassi } from '../../services/scrapers';

let html;
let data;

describe('Ekokompassi HTML scraping', function () {
  before(() => {
    // check if the import worked correctly
    expect(processEkokompassi, 'processEkokompassi').to.be.a('function');
    // load data
    cy.fixture('scrapedData/ekokompassi.json').then((output) => (data = output));
    cy.fixture('html/ekokompassi.html').then((output) => (html = output));
  });

  context('scrapeCertificates', () => {
    it('Scrapes html correctly', () => {
      const scrapedData = processEkokompassi(html);
      expect(scrapedData?.length, 'Correct number of companies are read').to.eq(data?.length);
      scrapedData.forEach((scraped) => {
        const foundData = data.find((d) => d.companyName === scraped.companyName);
        expect(scraped?.companyName).to.eq(foundData?.companyName);
      });
    });
  });
});
