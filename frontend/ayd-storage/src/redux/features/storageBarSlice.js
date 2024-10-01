import { createSlice } from '@reduxjs/toolkit';

export const storageBarSlice = createSlice({
  name: 'updateStorageBar',
  initialState: {
    actionTriggered: false, // Estado que se alterna
  },
  reducers: {
    triggerAction: (state) => {
      state.actionTriggered = true; // Activa el estado
    },
    resetAction: (state) => {
      state.actionTriggered = false; // Resetea el estado a falso
    },
  },
});

export const { triggerAction, resetAction } = storageBarSlice.actions;

export default storageBarSlice.reducer;