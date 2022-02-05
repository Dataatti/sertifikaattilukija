import { processGreenKeyMain, processGreenKeyAland } from '../../services/scrapers';

let htmlMain;
let htmlAland;
let dataMain;
let dataAland;

describe('Green Key HTML scraping', function () {
  before(() => {
    // check if the import worked correctly
    expect(processGreenKeyMain, 'processGreenKeyMain').to.be.a('function');
    expect(processGreenKeyAland, 'processGreenKeyAland').to.be.a('function');

    // load data
    cy.fixture('scrapedData/green-key-main.json').then((output) => (dataMain = output));
    cy.fixture('html/green-key-main.html').then((output) => (htmlMain = output));
    cy.fixture('scrapedData/green-key-aland.json').then((output) => (dataAland = output));
    cy.fixture('html/green-key-aland.html').then((output) => (htmlAland = output));
  });

  context('scrapeCertificates', () => {
    it('Scrapes main html correctly', () => {
      const scrapedData = processGreenKeyMain(htmlMain);
      expect(scrapedData?.length, 'Correct number of companies are read').to.eq(dataMain?.length);
      scrapedData.forEach((scraped) => {
        const foundData = dataMain.find((d) => d.companyName === scraped.companyName);
        expect(scraped?.companyName).to.eq(foundData?.companyName);
      });
    });

    it('Scrapes Åland html correctly', () => {
      const scrapedData = processGreenKeyAland(htmlAland);
      //expect(scrapedData?.length, 'Correct number of companies are read').to.eq(dataAland?.length);
      scrapedData.forEach((scraped) => {
        const foundData = dataAland.find((d) => d.companyName === scraped.companyName);
        expect(scraped?.companyName).to.eq(foundData?.companyName);
      });
    });
  });
});
