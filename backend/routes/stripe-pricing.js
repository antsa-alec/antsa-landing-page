import { Router } from 'express';
import Stripe from 'stripe';

const router = Router();

/**
 * GET /api/stripe/pricing
 *
 * Fetches active products and prices from Stripe, then intelligently
 * consolidates them into display tiers:
 *
 *   1. Solo Practitioner  — single practitioner plan
 *   2. Clinic / Practice  — volume-based clinic plans (shows "From $XX")
 *   3. Enterprise         — contact-us tier (from metadata or hardcoded)
 *
 * Stripe products are named like "Solo 59AUD", "Clinic 59", "Clinic 118", etc.
 * Clinic products represent per-practitioner volume pricing tiers.
 */
router.get('/pricing', async (_req, res) => {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    console.warn('⚠️  STRIPE_SECRET_KEY not configured – falling back to DB pricing');
    return res.status(503).json({ error: 'Stripe not configured', fallback: true });
  }

  try {
    const stripe = new Stripe(secretKey);

    const [products, prices] = await Promise.all([
      stripe.products.list({ active: true, limit: 100 }),
      stripe.prices.list({ active: true, limit: 100 }),
    ]);

    // Build product ID → monthly AUD price map (prefer AUD monthly recurring)
    const priceMap = new Map();
    for (const price of prices.data) {
      const productId = typeof price.product === 'string' ? price.product : price.product?.id;
      if (!productId) continue;
      if (price.currency !== 'aud') continue;
      if (price.type !== 'recurring' || price.recurring?.interval !== 'month') continue;

      const existing = priceMap.get(productId);
      if (!existing) {
        priceMap.set(productId, price);
      }
    }

    // Classify products into Solo vs Clinic buckets
    const soloProducts = [];
    const clinicProducts = [];

    for (const product of products.data) {
      const name = (product.name || '').toLowerCase();
      const price = priceMap.get(product.id);
      if (!price) continue;

      const amount = price.unit_amount / 100;

      if (name.startsWith('solo')) {
        soloProducts.push({ product, price, amount });
      } else if (name.startsWith('clinic')) {
        clinicProducts.push({ product, price, amount });
      }
    }

    // --- Solo Practitioner tier ---
    // Pick the highest-priced solo product (the current plan, e.g. $79)
    const soloPlan = soloProducts.length > 0
      ? soloProducts.sort((a, b) => b.amount - a.amount)[0]
      : null;

    // --- Clinic tier ---
    // Find the price range across clinic products; show "From $lowest/practitioner"
    let clinicLowest = null;
    let clinicHighest = null;
    const clinicFeatureSet = new Set();

    for (const cp of clinicProducts) {
      if (!clinicLowest || cp.amount < clinicLowest.amount) clinicLowest = cp;
      if (!clinicHighest || cp.amount > clinicHighest.amount) clinicHighest = cp;

      // Collect features from descriptions
      if (cp.product.description) {
        cp.product.description.split('\n').map(f => f.trim()).filter(Boolean).forEach(f => clinicFeatureSet.add(f));
      }
    }

    // Build the three display plans
    const plans = [];

    // 1. Solo Practitioner
    if (soloPlan) {
      const meta = soloPlan.product.metadata || {};
      let features = [];
      if (meta.features) {
        try { features = JSON.parse(meta.features); } catch { features = meta.features.split('\n').map(f => f.trim()).filter(Boolean); }
      } else if (soloPlan.product.description) {
        features = soloPlan.product.description.split('\n').map(f => f.trim()).filter(Boolean);
      }
      if (features.length === 0) {
        features = [
          'Full platform access',
          'AI chatbot (jAImee)',
          'AI Scribe & Templates',
          'Telehealth & Session Summaries',
          'Mood & Distress Tracking',
          'Secure Messaging',
          'Homework Task Assignment',
          'Psychoeducation Library',
          'Automated Reminders',
          'Psychometric Measures',
        ];
      }

      plans.push({
        id: soloPlan.product.id,
        name: 'Solo Practitioner',
        price: `$${soloPlan.amount % 1 === 0 ? soloPlan.amount.toFixed(0) : soloPlan.amount.toFixed(2)}`,
        period: '/month',
        features,
        featured: true,
        cta_text: meta.cta_text || 'Start Free Trial',
        cta_url: meta.cta_url || 'https://au.antsa.ai/sign-in',
        order: 1,
        stripe_price_id: soloPlan.price.id,
        badge: 'Most Popular',
      });
    }

    // 2. Clinic / Practice
    if (clinicLowest) {
      let clinicFeatures = [...clinicFeatureSet];
      if (clinicFeatures.length === 0) {
        clinicFeatures = [
          'Everything in Solo Practitioner',
          'Reduced per-licence pricing',
          'Multi-practitioner management',
          'Practice-level reporting',
          'Encrypted practitioner communication',
          'Real-time reporting of practitioner usage',
        ];
      }

      plans.push({
        id: 'clinic-consolidated',
        name: 'Clinic / Practice',
        price: `From $${clinicLowest.amount % 1 === 0 ? clinicLowest.amount.toFixed(0) : clinicLowest.amount.toFixed(2)}`,
        period: '/practitioner/month',
        features: clinicFeatures,
        featured: false,
        cta_text: 'Contact Us',
        cta_url: 'mailto:admin@antsa.com.au?subject=ANTSA%20Clinic%20Pricing%20Enquiry&body=Hi%20ANTSA%20team%2C%0A%0AI%E2%80%99d%20like%20to%20learn%20more%20about%20your%20clinic%20pricing%20options.%0A%0AThanks!',
        order: 2,
        stripe_price_id: null,
        badge: null,
      });
    }

    // 3. Enterprise
    plans.push({
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Contact Us',
      period: '',
      features: [
        'Everything in Clinic / Practice',
        'Custom integrations',
        'Dedicated support',
        'Service-level agreements',
        'Custom deployment options',
      ],
      featured: false,
      cta_text: 'Contact Us',
      cta_url: 'mailto:admin@antsa.com.au?subject=ANTSA%20Enterprise%20Enquiry&body=Hi%20ANTSA%20team%2C%0A%0AI%E2%80%99d%20like%20to%20learn%20more%20about%20your%20enterprise%20options.%0A%0AThanks!',
      order: 3,
      stripe_price_id: null,
      badge: null,
    });

    // Sort by order
    plans.sort((a, b) => a.order - b.order);

    console.log(`✅ Stripe pricing: ${soloProducts.length} solo, ${clinicProducts.length} clinic products → ${plans.length} display tiers`);
    res.json({ plans });
  } catch (error) {
    console.error('❌ Stripe pricing fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch pricing from Stripe', fallback: true });
  }
});

export default router;
