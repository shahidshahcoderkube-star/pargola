import { useConfigStore } from '../store/useConfigStore';
import { getVariantId, VARIANT_MAPPINGS } from '../utils/pricing';
import { addToCart, redirectToCart, SHOPIFY_DOMAIN } from '../utils/shopify';

const Controls = () => {
  const { type, size, color, blinds, setType, setSize, setColor, toggleBlind, resetConfig, triggerCameraReset, totalPrice } = useConfigStore();

  const handleAddToCart = async () => {
    const variantId = getVariantId(type, size);

    if (!variantId) {
      alert("Error: Variant not found for this configuration.");
      return;
    }

    const payload = {
      id: variantId,
      quantity: 1,
      properties: {
        Type: type,
        Size: size,
        Color: color,
        "Blind A": blinds.A ? "Yes" : "No",
        "Blind B": blinds.B ? "Yes" : "No",
        "Blind C": blinds.C ? "Yes" : "No",
        "Blind D": blinds.D ? "Yes" : "No",
        "_config_id": `pergola_${Date.now()}` // Internal reference
      }
    };

    try {
      const properties = {
        "Base Price": `£${VARIANT_MAPPINGS[type][size].price}`,
        "Total Configured Price": `£${totalPrice.toLocaleString()}`,
        Type: type,
        Size: size,
        Color: color,
        "Blind A": blinds.A ? "Yes" : "No",
        "Blind B": blinds.B ? "Yes" : "No",
        "Blind C": blinds.C ? "Yes" : "No",
        "Blind D": blinds.D ? "Yes" : "No",
      };

      // If running on Vercel/External, we must redirect to the Shopify store
      console.log("Current Hostname:", window.location.hostname);
      console.log("Shopify Domain:", SHOPIFY_DOMAIN);

      if (window.location.hostname !== SHOPIFY_DOMAIN) {
        console.log("Redirecting to Shopify Cart...");
        redirectToCart(variantId, 1, properties);
        return;
      }

      console.log("Adding to cart via AJAX...");
      const cartData = await addToCart(variantId, 1, properties);
      console.log("Added to cart:", cartData);
      alert("Product added to cart successfully!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert(`Error: ${err.message || 'Failed to add to cart'}`);
    }
  };


  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="controls-wrapper">
      <div className="controls-header">
        <h2>Customise Your Pergola</h2>
        <p className="controls-subtitle">Select your preferences below to build your perfect outdoor space.</p>
      </div>

      <div className="control-section">
        <h3>1. Pergola Type</h3>
        <div className="btn-group">
          {['free-standing', 'wall-mounted'].map(t => (
            <button
              key={t}
              className={`opt-btn ${type === t ? 'active' : ''}`}
              onClick={() => setType(t)}
            >
              {t.replace('-', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="control-section">
        <h3>Size</h3>
        <div className="btn-group">
          {['3x3', '3x4', '4x4'].map(s => (
            <button
              key={s}
              className={`opt-btn ${size === s ? 'active' : ''}`}
              onClick={() => setSize(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="control-section">
        <h3>Color</h3>
        <div className="btn-group">
          {[
            { id: 'white', name: 'White', hex: '#ffffff' },
            { id: 'anthracite', name: 'Anthracite', hex: '#3a3c3e' }
          ].map(c => (
            <button
              key={c.id}
              className={`opt-btn color-btn ${color === c.id ? 'active' : ''}`}
              onClick={() => setColor(c.id)}
            >
              <span className="color-swatch" style={{ background: c.hex, border: c.id === 'white' ? '1px solid #ccc' : 'none' }}></span>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="control-section">
        <h3>Side Blinds</h3>
        <div className="btn-group blinds-group">
          {['A', 'B', 'C', 'D'].map(side => (
            <button
              key={side}
              className={`opt-btn ${blinds[side] ? 'active' : ''}`}
              onClick={() => toggleBlind(side)}
            >
              Side {side}
            </button>
          ))}
        </div>
      </div>

      <div className="cart-section">
        <div className="price-display">
          <span>Total Price:</span>
          <span className="price-amount">£{totalPrice.toLocaleString()}</span>
        </div>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Controls;
