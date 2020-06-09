import 'normalize.css'
import 'concrete.css'
import '../styles/global.css'
import Footer from '../components/footer'

export default ({ Component, pageProps }) => (
  <>
    <Component {...pageProps} />
    <Footer />
  </>
)
