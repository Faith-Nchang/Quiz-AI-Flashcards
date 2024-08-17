import { loadStripe } from '@stripe/stripe-js'
import 'dotenv/config';

let stripePromise

const getStripe = () => {
  if (!stripePromise) {
    console.log(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  }
  return stripePromise
}

export default getStripe