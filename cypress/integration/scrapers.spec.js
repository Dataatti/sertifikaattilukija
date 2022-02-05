import * as processors from '../../services/scrapers';
import configs from '../../services/scrapers/scrapers.json';

for (const config of configs) {
  let input;
  let target;
  const processor = processors[config.scraper];

  describe(`${config.id} - scraping`, function () {
    before(() => {
      // check if the import worked correctly
      expect(processor, config.scraper).to.be.a('function');

      // load data
      cy.fixture(config.testInput).then((output) => (input = output));
      cy.fixture(config.testOutput).then((output) => (target = output));
    });

    context('Scrape certificates', () => {
      it(`Uses ${config.scraper} to scrape data source "${config.id}" correctly`, () => {
        const scrapedData = processor(input);
        expect(scrapedData?.length, 'Correct number of companies are read').to.eq(target?.length);

        target.forEach((t) => {
          const foundData = scrapedData.find((d) => d.companyName === t.companyName);
          expect(t?.companyName).to.eq(foundData?.companyName);
        });
      });
    });
  });
}
