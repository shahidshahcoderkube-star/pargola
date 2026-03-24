import { create } from 'zustand';
import { calculatePrice } from '../utils/pricing';

export const useConfigStore = create((set) => ({
  type: 'free-standing', // 'free-standing' or 'wall-mounted'
  size: '3x3', // '3x3', '3x4', '4x4'
  color: 'white', // 'white', 'anthracite'
  blinds: {
    A: false,
    B: false,
    C: false,
    D: false,
  },
  cameraResetSignal: 0,
  totalPrice: calculatePrice('free-standing', '3x3', { A: false, B: false, C: false, D: false }),
  
  // Actions
  setType: (type) => set((state) => ({ 
    type, 
    totalPrice: calculatePrice(type, state.size, state.blinds) 
  })),
  setSize: (size) => set((state) => ({ 
    size, 
    totalPrice: calculatePrice(state.type, size, state.blinds) 
  })),
  setColor: (color) => set({ color }),
  triggerCameraReset: () => set((state) => ({ cameraResetSignal: state.cameraResetSignal + 1 })),
  toggleBlind: (side) => set((state) => {
    const newBlinds = { ...state.blinds, [side]: !state.blinds[side] };
    return {
      blinds: newBlinds,
      totalPrice: calculatePrice(state.type, state.size, newBlinds)
    };
  }),
  resetConfig: () => set({
    type: 'free-standing',
    size: '3x3',
    color: 'white',
    blinds: { A: false, B: false, C: false, D: false },
    totalPrice: calculatePrice('free-standing', '3x3', { A: false, B: false, C: false, D: false })
  })
}));
