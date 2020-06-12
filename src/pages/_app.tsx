import 'normalize.css'
import 'concrete.css'
import '../styles/global.css'
import Header from '../components/header'
import Footer from '../components/footer'

export default ({ Component, pageProps }) => (
  <>
    <Header />
    <Component {...pageProps} />
    <Footer />
  </>
)
