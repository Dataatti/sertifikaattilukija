import { processWWFGreenOffice } from '../../services/scrapers';

let html;
let data;

describe('WWF Green Office HTML scraping', function () {
  before(() => {
    // check if the import worked correctly
    expect(processWWFGreenOffice, 'processWWFGreenOffice').to.be.a('function');
    // load data
    cy.fixture('scrapedData/wwf-green-office.json').then((output) => (data = output));
    cy.fixture('html/wwf-green-office.html').then((output) => (html = output));
  });

  context('scrapeCertificates', () => {
    it('Scrapes html correctly', () => {
      const scrapedData = processWWFGreenOffice(html);
      expect(scrapedData?.length, 'Correct number of companies are read').to.eq(data?.length);
      scrapedData.forEach((scraped) => {
        const foundData = data.find((d) => d.companyName === scraped.companyName);
        expect(scraped?.companyName).to.eq(foundData?.companyName);
      });
    });
  });
});
