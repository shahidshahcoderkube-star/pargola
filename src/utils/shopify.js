// Dynamically detect Shopify domain from URL query parameter or Environment Variable
export const getShopifyDomain = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const shop = urlParams.get('shop');

  // Priority: 1. URL Parameter (?shop=...)  2. Environment Variable  3. Default Fallback
  return shop || import.meta.env.VITE_SHOPIFY_DOMAIN || 'your-default-store.myshopify.com';
};

export const SHOPIFY_DOMAIN = getShopifyDomain();
export const STOREFRONT_ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

/**
 * Fetch Product data (variants, prices, options) from Shopify Storefront API.
 */
export const fetchProductByHandle = async (handle) => {
  const query = `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        variants(first: 20) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN
    },
    body: JSON.stringify({ query, variables: { handle } })
  });

  if (!response.ok) {
    throw new Error('Storefront API request failed');
  }

  const result = await response.json();
  if (result.errors) {
    console.error('GraphQL Errors:', result.errors);
    throw new Error(result.errors[0].message);
  }

  return result.data.product;
};
/**
 * Add an item to the Shopify cart with line item properties.
 * 
 * NOTE: This works only when the app is running ON your Shopify domain.
 * If running on Vercel, use `redirectToCart` instead.
 */
export const addToCart = async (variantId, quantity = 1, properties = {}) => {
  const payload = {
    id: variantId,
    quantity,
    properties: {
      ...properties,
      '_config_timestamp': Date.now()
    }
  };

  const response = await fetch('/cart/add.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.description || 'Failed to add to cart');
  }

  return response.json();
};

/**
 * Generates a Shopify Permalink URL to add items from Vercel/External domains.
 * This is the fix for the 404 error on Vercel.
 * It uses window.top to ensure it breaks out of iframes on Shopify.
 */
export const redirectToCart = (variantId, quantity = 1, properties = {}) => {
  const baseUrl = `https://${SHOPIFY_DOMAIN}/cart/${variantId}:${quantity}`;

  // Convert properties to URL parameters
  const params = new URLSearchParams();
  Object.entries(properties).forEach(([key, value]) => {
    // Note: permalinks use attributes[] or specific app-compatible params
    params.append(`attributes[${key}]`, value);
  });

  const finalUrl = `${baseUrl}?${params.toString()}`;
  
  // Break out of the iframe
  if (window.top !== window.self) {
    window.top.location.href = finalUrl;
  } else {
    window.location.href = finalUrl;
  }
};

/**
 * Update global Cart Attributes (not tied to a specific item).
 * 
 * @param {Object} attributes - Object containing attribute keys and values.
 * @returns {Promise<Object>} - The updated cart object.
 */
export const updateCartAttributes = async (attributes) => {
  const response = await fetch('/cart/update.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ attributes })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.description || 'Failed to update cart attributes');
  }

  return response.json();
};

/**
 * Get the current cart state.
 * @returns {Promise<Object>}
 */
export const getCart = async () => {
  const response = await fetch('/cart.js');
  return response.json();
};
