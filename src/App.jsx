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
    const initProduct = async () => {
      try {
        const product = await fetchProductByHandle('customize-pergola');
        if (product) {
          setProductData(product);
        } else {
          setError("Product 'customize-pergola' not found in Shopify.");
        }
      } catch (err) {
        console.error("Failed to fetch dynamic product data:", err);
        setError("Unable to connect to Shopify. Please check your Storefront Access Token and Domain in the .env file.");
      }
    };
    initProduct();
  }, [setProductData]);

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
