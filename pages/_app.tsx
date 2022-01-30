import Head from 'next/head';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import createCache from '@emotion/cache';
import { CacheProvider, EmotionCache } from '@emotion/react';
import theme from 'theme';
import Header from 'components/Header';
import { Container } from '@mui/material';
import Footer from 'components/Footer';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createCache({ key: 'css' });
interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function MyApp({ Component, emotionCache = clientSideEmotionCache, pageProps }: MyAppProps) {
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Sertifikaattilukija</title>
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        <Container sx={{ minHeight: 'calc(100vh - 80px - 220px)' }}>
          <Component {...pageProps} />
        </Container>
        <Footer />
      </ThemeProvider>
    </CacheProvider>
  );
}

export default MyApp;
