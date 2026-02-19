const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');

// Middleware to ensure user is authenticated (you might want to use your auth middleware here)
// For now, assuming request comes with userId or email to identify user
// In a real app, use verifyToken middleware

router.post('/create-checkout-session', async (req, res) => {
  try {
    const { priceId, userId } = req.body;
    
    if (!priceId || !userId) {
        return res.status(400).json({ error: 'Missing priceId or userId' });
    }

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: user.email, // Auto-fill customer email
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
      metadata: {
          userId: userId
      },
      subscription_data: {
          metadata: {
              userId: userId
          }
      }
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook handler
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // If req.body is already parsed JSON, we need the raw buffer for signature verification.
    // In index.js, we should capture the raw body.
    // If we used the "verify" trick in index.js, req.rawBody should be available.
    // If not, and body is JSON, constructEvent might fail if it expects a string/buffer.
    // Passing req.body if it's a buffer works. If it's an object, we need the raw buffer.
    
    const payload = req.rawBody || req.body;
    
    event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object;
          await handleCheckoutSessionCompleted(session);
          break;
        case 'customer.subscription.updated':
          const subscription = event.data.object;
          await handleSubscriptionUpdated(subscription);
          break;
        case 'customer.subscription.deleted':
            const deletedSubscription = event.data.object;
            await handleSubscriptionDeleted(deletedSubscription);
            break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
  } catch (error) {
      console.error('Error handling webhook event:', error);
      return res.status(500).send('Webhook handler error');
  }

  res.send();
});

async function handleCheckoutSessionCompleted(session) {
    const userId = session.metadata.userId;
    const subscriptionId = session.subscription;
    const customerId = session.customer;

    if (userId) {
        await User.findByIdAndUpdate(userId, {
            stripeCustomerId: customerId,
            subscriptionId: subscriptionId,
            subscriptionStatus: 'active',
            // You might want to map priceId to plan name here if needed
            // plan: 'pro' // Example
        });
        console.log(`User ${userId} subscribed successfully.`);
    }
}

async function handleSubscriptionUpdated(subscription) {
     const subscriptionId = subscription.id;
     const status = subscription.status;
     // Find user by subscriptionId and update status
     await User.findOneAndUpdate({ subscriptionId: subscriptionId }, {
         subscriptionStatus: status
     });
}

async function handleSubscriptionDeleted(subscription) {
    const subscriptionId = subscription.id;
    await User.findOneAndUpdate({ subscriptionId: subscriptionId }, {
        subscriptionStatus: 'canceled',
        plan: 'free' // Revert to free
    });
}

// NOTE: Since we need express.raw for webhook, but this router handles both JSON and raw,
// we need to be careful how it's mounted in index.js or handle body parsing carefully.
// The cleanest way in a sub-router is to apply parsing on specific routes or ensure global parsing doesn't consume the stream for the webhook.
// If index.js has global express.json(), the webhook route here might receive an empty body if already parsed.
// Strategy: In index.js, mount the webhook route BEFORE global json parser, or use the "verify" trick.

module.exports = router;
