# Certificate reader for travel industry

The certificate reader for the travel industry is a application that gathers data of travel industry certificates in Finland under one roof.

The target group for the reader includes regional travel organisations, companies in the industry and travelers interested in responsible travel.

## Features

Users can search for travel industry companies by their name, vat-number, municipality or by the certificates they have.

The application allows the user to save the data either by saving the link to the company / certificate page or by printing the search results.

## Tech Stack

The application is built with [TypeScript](https://www.typescriptlang.org/), [React](https://reactjs.org/) and [Next.js](https://nextjs.org/).

The user interface of the application is styled using [MUI](https://mui.com/) components.

The data is fetched by scraping certificate provider websites with [Node.js](https://nodejs.org/en/) functions and saved to a [PostgreSQL](https://www.postgresql.org/) database.


## How to run

### Installation

Clone the repository

```bash
  git clone https://github.com/Dataatti/sertifikaattilukija.git
```

Change to the project directory

```bash
  cd sertifikaattilukija
```

### Application

Install project dependencies based on lockfile

```bash
  npm ci
```

Run the development server

```bash
  npm run dev
```

Open http://localhost:3000 with your browser to see the result.

### Cypress E2E tests
Cypress tests are run against all pull requests by [a quality check Github action](/.github/workflows/quality_check.yml).

Run E2E tests headlessly

```bash
  npm run cypress
```

Open Cypress for developing E2E tests

```bash
  npm run cypress:open
```

## Data scraping and database

Data scraping and database are found in a separate repository in [sertifikaattilukija-api](https://github.com/Dataatti/sertifikaattilukija-api).

The list of scraped certificate websites is based on the certificates that are part of Business Finland's [Sustainable Travel Finland](https://www.businessfinland.fi/suomalaisille-asiakkaille/palvelut/matkailun-edistaminen/vastuullisuus/sertifioinnit--ohjelmat) program.
