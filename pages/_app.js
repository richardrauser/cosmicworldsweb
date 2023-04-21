import '@styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from '../components/Layout';

function Application({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />      
    </Layout>
  );
}

export default Application;
