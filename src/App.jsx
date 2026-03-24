import React, { useEffect, useState } from 'react';
import Scene from './components/Scene';
import Controls from './components/Controls';
import OverlayControls from './components/OverlayControls';
import { useConfigStore } from './store/useConfigStore';
import { fetchProductByHandle } from './utils/shopify';
import './App.css';

function App() {
  const { setProductData, isLoading } = useConfigStore();
  const [error, setError] = useState(null);

  useEffect(() => {
    // Listen for product data from the Shopify parent page (Liquid)
    const handleShopifyMessage = (event) => {
      // SECURITY: In production, you should check event.origin to ensure it's your Shopify store
      if (event.data && event.data.type === 'SHOPIFY_PRODUCT_DATA') {
        console.log("Received product data from Shopify:", event.data.product);
        setProductData(event.data.product);
      }
    };

    window.addEventListener('message', handleShopifyMessage);

    // Timeout to show error if no data is received within 5 seconds
    const timeout = setTimeout(() => {
      if (isLoading && !error) {
        // setError("Timed out waiting for product data from Shopify. Make sure the Liquid script is added to your theme.");
      }
    }, 5000);

    return () => {
      window.removeEventListener('message', handleShopifyMessage);
      clearTimeout(timeout);
    };
  }, [setProductData, isLoading, error]);

  if (error) {
    return (
      <div className="error-screen">
        <h2>Connection Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading Configurator...</p>
      </div>
    );
  }

  return (
    <div className="configurator-container">
      <div className="canvas-container">
        <Scene />
        <OverlayControls />
      </div>
      <div className="controls-container">
        <Controls />
      </div>
    </div>
  );
}

export default App;
