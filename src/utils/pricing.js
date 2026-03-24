/**
 * This file handles the pricing logic.
 * It now relies entirely on dynamic data fetched from the Shopify Storefront API.
 */

// Pricing for extra features (these stay for now as they are not in the Shopify Variants)
export const FEATURES_PRICING = {
  blind: 150 // Cost per side blind
};

/**
 * Utility to calculate total price based on state. 
 * Relies on dynamicVariants from Storefront API.
 */
export const calculatePrice = (type, size, blinds, dynamicVariants = []) => {
  let basePrice = 0;

  if (dynamicVariants && dynamicVariants.length > 0) {
    // Search for a variant that matches the size (e.g., '3X3')
    const match = dynamicVariants.find(v => v.title.toLowerCase() === size.toLowerCase());
    if (match) {
      basePrice = parseFloat(match.price.amount);
    }
  }
  
  // Count how many blinds are toggled
  const blindCount = Object.values(blinds).filter(Boolean).length;
  const blindsTotal = blindCount * FEATURES_PRICING.blind;
  
  return basePrice + blindsTotal;
};

/**
 * Utility to get Variant ID from dynamicVariants.
 */
export const getVariantId = (type, size, dynamicVariants = []) => {
  if (dynamicVariants && dynamicVariants.length > 0) {
    const match = dynamicVariants.find(v => v.title.toLowerCase() === size.toLowerCase());
    return match ? match.id : null;
  }
  return null;
};
