import { Router } from 'express';
import Stripe from 'stripe';
import db from '../config/database.js';

const router = Router();

/**
 * Reads editable feature dot-points from the pricing_plans DB table.
 * Returns a map of plan name → features array.
 */
function getDbFeatures() {
  const featureMap = {};
  try {
    const sectionStmt = db.prepare('SELECT id FROM sections WHERE name = ?');
    const section = sectionStmt.get('pricing');
    if (section) {
      const plansStmt = db.prepare('SELECT name, features FROM pricing_plans WHERE section_id = ? ORDER BY order_index');
      const rows = plansStmt.all(section.id);
      for (const row of rows) {
        try {
          featureMap[row.name] = JSON.parse(row.features);
        } catch {
          featureMap[row.name] = [];
        }
      }
    }
  } catch (err) {
    console.warn('⚠️  Could not read pricing features from DB:', err.message);
  }
  return featureMap;
}

/**
 * GET /api/stripe/pricing
 *
 * Price comes from Stripe (Solo only). Feature dot-points come from the
 * pricing_plans DB table so they can be edited in the admin panel.
 * Clinic / Practice and Enterprise tiers have no displayed price.
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

    // Build product ID → monthly AUD price map
    const priceMap = new Map();
    for (const price of prices.data) {
      const productId = typeof price.product === 'string' ? price.product : price.product?.id;
      if (!productId) continue;
      if (price.currency !== 'aud') continue;
      if (price.type !== 'recurring' || price.recurring?.interval !== 'month') continue;

      if (!priceMap.has(productId)) {
        priceMap.set(productId, price);
      }
    }

    // Find Solo products to get the price
    const soloProducts = [];
    for (const product of products.data) {
      const name = (product.name || '').toLowerCase();
      const price = priceMap.get(product.id);
      if (!price) continue;
      if (name.startsWith('solo')) {
        soloProducts.push({ product, price, amount: price.unit_amount / 100 });
      }
    }

    const soloPlan = soloProducts.length > 0
      ? soloProducts.sort((a, b) => b.amount - a.amount)[0]
      : null;

    // Read editable features from DB
    const dbFeatures = getDbFeatures();

    const defaultFeatures = {
      'Solo Practitioner': [
        'Full platform access',
        'Clinician-Overseen AI Chatbot',
        'Practitioner AI Assistant',
        'AI Scribe & Templates',
        'Telehealth & Session Summaries',
        'Mood & Distress Tracking',
        'Secure Messaging',
        'Homework Task Assignment',
        'Psychoeducation Library',
        'Automated Reminders',
        'Psychometric Measures',
      ],
      'Clinic / Practice': [
        'Everything in Solo Practitioner',
        'Reduced per-licence pricing',
        'Multi-practitioner management',
        'Practice-level reporting',
        'Encrypted practitioner communication',
        'Real-time reporting of practitioner usage',
      ],
      'Enterprise': [
        'Everything in Clinic / Practice',
        'Custom integrations',
        'Dedicated support',
        'Service-level agreements',
        'Custom deployment options',
      ],
    };

    const plans = [];

    // 1. Solo Practitioner — price from Stripe, features from DB
    const soloFeatures = dbFeatures['Solo Practitioner'] || defaultFeatures['Solo Practitioner'];
    plans.push({
      id: soloPlan?.product.id || 'solo',
      name: 'Solo Practitioner',
      price: soloPlan
        ? `$${soloPlan.amount % 1 === 0 ? soloPlan.amount.toFixed(0) : soloPlan.amount.toFixed(2)}`
        : '$79',
      period: '/month',
      features: soloFeatures,
      featured: true,
      cta_text: 'Start Free Trial',
      cta_url: 'https://au.antsa.ai/sign-in',
      order: 1,
      stripe_price_id: soloPlan?.price.id || null,
      badge: 'Most Popular',
    });

    // 2. Clinic / Practice — no price, features from DB
    const clinicFeatures = dbFeatures['Clinic / Practice'] || defaultFeatures['Clinic / Practice'];
    plans.push({
      id: 'clinic-consolidated',
      name: 'Clinic / Practice',
      price: '',
      period: '',
      features: clinicFeatures,
      featured: false,
      cta_text: 'Contact Us',
      cta_url: 'mailto:admin@antsa.com.au?subject=ANTSA%20Clinic%20Pricing%20Enquiry&body=Hi%20ANTSA%20team%2C%0A%0AI%E2%80%99d%20like%20to%20learn%20more%20about%20your%20clinic%20pricing%20options.%0A%0AThanks!',
      order: 2,
      stripe_price_id: null,
      badge: null,
    });

    // 3. Enterprise — no price, features from DB
    const enterpriseFeatures = dbFeatures['Enterprise'] || defaultFeatures['Enterprise'];
    plans.push({
      id: 'enterprise',
      name: 'Enterprise',
      price: '',
      period: '',
      features: enterpriseFeatures,
      featured: false,
      cta_text: 'Contact Us',
      cta_url: 'mailto:admin@antsa.com.au?subject=ANTSA%20Enterprise%20Enquiry&body=Hi%20ANTSA%20team%2C%0A%0AI%E2%80%99d%20like%20to%20learn%20more%20about%20your%20enterprise%20options.%0A%0AThanks!',
      order: 3,
      stripe_price_id: null,
      badge: null,
    });

    plans.sort((a, b) => a.order - b.order);

    console.log(`✅ Stripe pricing: Solo $${soloPlan?.amount || '?'} + DB features → ${plans.length} tiers`);
    res.json({ plans });
  } catch (error) {
    console.error('❌ Stripe pricing fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch pricing from Stripe', fallback: true });
  }
});

export default router;
