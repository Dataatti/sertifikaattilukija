import type { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <div>
      <main>
        <h1>Matkailualan sertifikaattilukija</h1>

        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="search"
            placeholder="Yrityksen nimi / y-tunnus tai sertifikaatti tai kunta"
          />
          <button type="submit">Hae</button>
        </form>

        <footer>
          <p>
            Business Finlandin mukaan sertifiointi on laadun tae kansainvälisessä kaupassa.
            Matkailualan monimuotoisuus on kuitenkin mahdollistanut sen, että myös sertifikaatin
            tarjoajia on hyvin paljon. Ideana on tuottaa nyt hankalasti ja pirstoutuneena oleva
            tieto yhteen paikkaan kaikkien toimijoiden avoimesti saataville.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Home;
