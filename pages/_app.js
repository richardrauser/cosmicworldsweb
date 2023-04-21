import '@styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from '../components/Layout';
import { Analytics } from '@vercel/analytics/react';

function Application({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />      
      <Analytics />
    </Layout>
  );
}

export default Application;
