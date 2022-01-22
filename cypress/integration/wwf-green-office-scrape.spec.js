/// <reference types="cypress" />

import { scrapeCertificates } from '../../services/scrapers/wwf-green-office';

let html;
let data;

describe('WWF Green Office HTML scraping', function () {
  before(() => {
    // check if the import worked correctly
    expect(scrapeCertificates, 'scrapeCertificates').to.be.a('function');
    // load data
    cy.fixture('scrapedData/wwf-green-office.json').then((output) => (data = output));
    cy.fixture('html/wwf-green-office.html').then((output) => (html = output));
  });

  context('scrapeCertificates', () => {
    it('scrapes html correctly', () => {
      expect(scrapeCertificates(html)).to.deep.eq(data);
    });
  });
});
