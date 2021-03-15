import Prismic from 'prismic-javascript'
import { useCart } from '../components/CartContext'
import Header from '../components/Header'
import Product from '../components/Product'
import Head from 'next/head'

const Index = ({ products }) => {
  const cart = useCart()
  return (
    <>
      <Head>
        <title>TrufaShop</title>
      </Head>
      <Header />
      <div className='mt-6'>
        <main className='grid grid-flow-col grid-cols-3 gap-2'>
          {products.map((product) => (
            <Product product={product} />
          ))}
        </main>
      </div>
      <pre>{JSON.stringify(cart.cart, null, 2)}</pre>
    </>
  )
}
export async function getServerSideProps({ res }) {
  const client = Prismic.client('https://trufashop.cdn.prismic.io/api/v2')
  const products = await client.query(
    Prismic.Predicates.at('document.type', 'product')
  )
  return {
    props: {
      date: Date.now(),
      products: products.results,
    },
  }
}
export default Index
