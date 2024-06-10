import React from 'react';
import { create } from 'zustand';

interface ModalState {
  isOpen: boolean;
  content: React.ReactNode;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
}

const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  content: null,
  openModal: (content) => set({ isOpen: true, content }),
  closeModal: () => set({ isOpen: false, content: null }),
}));

export const openModal = (content: React.ReactNode) => useModalStore.getState().openModal(content);
export const closeModal = () => useModalStore.getState().closeModal();

export default useModalStore;
