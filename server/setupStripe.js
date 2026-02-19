require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function setup() {
  console.log('Starting Stripe setup...');
  try {
    const products = await stripe.products.list({ limit: 10 });
    console.log('Existing Products:', products.data.map(p => p.name));

    const plans = [
      { name: 'Essential Clarity', amount: 600 },
      { name: 'Pro Insight', amount: 1900 }
    ];

    for (const plan of plans) {
      let product = products.data.find(p => p.name === plan.name);
      if (!product) {
        console.log('Creating product:', plan.name);
        product = await stripe.products.create({ name: plan.name });
      } else {
        console.log('Found product:', plan.name);
      }

      const prices = await stripe.prices.list({ product: product.id, limit: 5 });
      let price = prices.data.find(p => p.unit_amount === plan.amount && p.recurring?.interval === 'month');
      
      if (!price) {
        console.log('Creating price for:', plan.name);
        price = await stripe.prices.create({
          product: product.id,
          unit_amount: plan.amount,
          currency: 'usd',
          recurring: { interval: 'month' },
        });
      } else {
         console.log('Found price for:', plan.name);
      }
      
      console.log(`PRODUCT_ID_${plan.name.split(' ')[0].toUpperCase()}: ${product.id}`);
      console.log(`PRICE_ID_${plan.name.split(' ')[0].toUpperCase()}: ${price.id}`);
    }
    console.log('Setup complete.');
  } catch (e) {
    console.error('Error:', e);
  }
}

if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY not found in environment');
} else {
    setup();
}
