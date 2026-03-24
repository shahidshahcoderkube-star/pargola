/**
 * Shopify Cart API Utilities
 * 
 * These functions use the standard Shopify AJAX API to interact with the cart
 * from the browser. This approach is "global" as it works with any theme
 * and persists data on the Shopify platform level.
 */

/**
 * Add an item to the Shopify cart with line item properties.
 * 
 * @param {number|string} variantId - The Shopify Variant ID.
 * @param {number} quantity - Number of items to add.
 * @param {Object} properties - Custom data (Line Item Properties) to attach.
 * @returns {Promise<Object>} - The updated cart item data.
 */
export const addToCart = async (variantId, quantity = 1, properties = {}) => {
  const payload = {
    id: variantId,
    quantity,
    properties: {
      ...properties,
      '_config_timestamp': Date.now() // Internal reference
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
