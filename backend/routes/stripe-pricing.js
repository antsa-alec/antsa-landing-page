import { Router } from 'express';
import Stripe from 'stripe';

const router = Router();

/**
 * GET /api/stripe/pricing
 *
 * Fetches active products and their prices from Stripe, then maps them
 * into the shape the frontend PricingSection expects.
 *
 * Products in Stripe should have metadata to control display:
 *   - featured: "true" / "false"
 *   - order:    "1", "2", "3" (sort order)
 *   - cta_text: custom CTA label  (defaults to "Get Started" or "Contact Us")
 *   - cta_url:  custom CTA link   (optional override)
 *
 * Features are stored as a newline-separated list in the product description,
 * or as a JSON array in metadata.features.
 */
router.get('/pricing', async (_req, res) => {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    console.warn('⚠️  STRIPE_SECRET_KEY not configured – falling back to DB pricing');
    return res.status(503).json({ error: 'Stripe not configured', fallback: true });
  }

  try {
    const stripe = new Stripe(secretKey);

    // Fetch all active products and their active prices in parallel
    const [products, prices] = await Promise.all([
      stripe.products.list({ active: true, limit: 100 }),
      stripe.prices.list({ active: true, limit: 100, expand: ['data.product'] }),
    ]);

    // Build a map of product ID → best price (prefer recurring monthly, then yearly, then one-time)
    const priceMap = new Map();
    for (const price of prices.data) {
      const productId = typeof price.product === 'string' ? price.product : price.product?.id;
      if (!productId) continue;

      const existing = priceMap.get(productId);
      // Prefer monthly recurring > yearly recurring > one-time
      const rank = (p) => {
        if (p.type === 'recurring' && p.recurring?.interval === 'month') return 3;
        if (p.type === 'recurring' && p.recurring?.interval === 'year') return 2;
        return 1;
      };

      if (!existing || rank(price) > rank(existing)) {
        priceMap.set(productId, price);
      }
    }

    // Transform into frontend-friendly plans
    const plans = products.data
      .filter((product) => {
        // Only include products that have a price or are marked as "contact us"
        return priceMap.has(product.id) || product.metadata?.contact === 'true';
      })
      .map((product) => {
        const price = priceMap.get(product.id);
        const meta = product.metadata || {};

        // Parse features: prefer metadata.features (JSON array), fall back to description lines
        let features = [];
        if (meta.features) {
          try {
            features = JSON.parse(meta.features);
          } catch {
            features = meta.features.split('\n').map((f) => f.trim()).filter(Boolean);
          }
        } else if (product.description) {
          features = product.description.split('\n').map((f) => f.trim()).filter(Boolean);
        }

        // Format price display
        let displayPrice = 'Contact Us';
        let period = '';

        if (meta.contact === 'true') {
          displayPrice = 'Contact Us';
          period = '';
        } else if (price) {
          const amount = price.unit_amount / 100;
          const currency = (price.currency || 'aud').toUpperCase();
          const symbol = currency === 'AUD' ? '$' : currency === 'USD' ? '$' : currency === 'GBP' ? '£' : '$';
          displayPrice = `${symbol}${amount % 1 === 0 ? amount.toFixed(0) : amount.toFixed(2)}`;

          if (price.type === 'recurring') {
            period = `/${price.recurring.interval}`;
          }
        }

        // Determine CTA
        const isContact = displayPrice === 'Contact Us';
        const defaultCtaUrl = isContact
          ? 'mailto:admin@antsa.com.au?subject=ANTSA%20Pricing%20Enquiry&body=Hi%20ANTSA%20team%2C%0A%0AI%E2%80%99d%20like%20to%20learn%20more%20about%20your%20pricing%20options.%0A%0AThanks!'
          : 'https://au.antsa.ai/sign-in';

        return {
          id: product.id,
          name: product.name,
          price: displayPrice,
          period,
          features,
          featured: meta.featured === 'true',
          cta_text: meta.cta_text || (isContact ? 'Contact Us' : 'Get Started'),
          cta_url: meta.cta_url || defaultCtaUrl,
          order: parseInt(meta.order || '99', 10),
          stripe_price_id: price?.id || null,
        };
      })
      .sort((a, b) => a.order - b.order);

    res.json({ plans });
  } catch (error) {
    console.error('❌ Stripe pricing fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch pricing from Stripe', fallback: true });
  }
});

export default router;
