/**
 * This is where we map the configurator choices to real Shopify Variant IDs.
 * In a production Shopify environment, this data can be passed from Liquid 
 * into the React app as a JSON object.
 */

export const VARIANT_MAPPINGS = {
  'free-standing': {
    '3x3': { id: '445566778899', price: 1200 },
    '3x4': { id: '445566779900', price: 1500 },
    '4x4': { id: '445566770011', price: 1800 }
  },
  'wall-mounted': {
    '3x3': { id: '556677889900', price: 1000 },
    '3x4': { id: '556677880011', price: 1300 },
    '4x4': { id: '556677881122', price: 1600 }
  }
};

// Pricing for extra features
export const FEATURES_PRICING = {
  blind: 150 // Cost per side blind
};

/**
 * Utility to calculate total price based on state
 */
export const calculatePrice = (type, size, blinds) => {
  const basePrice = VARIANT_MAPPINGS[type]?.[size]?.price || 0;
  
  // Count how many blinds are toggled
  const blindCount = Object.values(blinds).filter(Boolean).length;
  const blindsTotal = blindCount * FEATURES_PRICING.blind;
  
  return basePrice + blindsTotal;
};

/**
 * Utility to get Variant ID
 */
export const getVariantId = (type, size) => {
  return VARIANT_MAPPINGS[type]?.[size]?.id || null;
};
