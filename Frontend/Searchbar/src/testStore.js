import {create} from 'zustand';

const useTestsStore = create((set) => ({
  testsAll: [],
  setTests: (tests) => set({ tests }),
  addTest: (newTest) => set((state) => ({ testsAll: [...state.testsAll, newTest] })),
}));

export default useTestsStore;