import { create } from 'zustand';
import { calculatePrice } from '../utils/pricing';

export const useConfigStore = create((set) => ({
  type: 'free-standing', // 'free-standing' or 'wall-mounted'
  size: '3x3', // '3x3', '4x4', '5x5'
  color: 'white', // 'white', 'anthracite'
  blinds: {
    A: false,
    B: false,
    C: false,
    D: false,
  },
  cameraResetSignal: 0,
  variants: [], // Dynamic variants from Shopify
  isLoading: true,
  totalPrice: 0,
  
  // Actions
  setProductData: (product) => set((state) => {
    const variants = product.variants.edges.map(e => e.node);
    return {
      variants,
      isLoading: false,
      totalPrice: calculatePrice(state.type, state.size, state.blinds, variants)
    };
  }),

  setType: (type) => set((state) => ({ 
    type, 
    totalPrice: calculatePrice(type, state.size, state.blinds, state.variants) 
  })),
  setSize: (size) => set((state) => ({ 
    size, 
    totalPrice: calculatePrice(state.type, size, state.blinds, state.variants) 
  })),
  setColor: (color) => set({ color }),
  triggerCameraReset: () => set((state) => ({ cameraResetSignal: state.cameraResetSignal + 1 })),
  toggleBlind: (side) => set((state) => {
    const newBlinds = { ...state.blinds, [side]: !state.blinds[side] };
    return {
      blinds: newBlinds,
      totalPrice: calculatePrice(state.type, state.size, newBlinds, state.variants)
    };
  }),
  resetConfig: () => set((state) => ({
    type: 'free-standing',
    size: '3x3',
    color: 'white',
    blinds: { A: false, B: false, C: false, D: false },
    totalPrice: calculatePrice('free-standing', '3x3', { A: false, B: false, C: false, D: false }, state.variants)
  }))
}));
