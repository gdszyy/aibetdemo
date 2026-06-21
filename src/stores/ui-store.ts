import { create } from 'zustand';

interface UIState {
    // Login Modal
    loginModalOpen: boolean;
    openLoginModal: () => void;
    closeLoginModal: () => void;

    // BetSlip Drawer
    betSlipDrawerOpen: boolean;
    openBetSlipDrawer: () => void;
    closeBetSlipDrawer: () => void;
    toggleBetSlipDrawer: () => void;

    // Add Account Modal
    addAccountModalOpen: boolean;
    openAddAccountModal: () => void;
    closeAddAccountModal: () => void;

    // Language Modal
    languageModalOpen: boolean;
    openLanguageModal: () => void;
    closeLanguageModal: () => void;

    // 充值弹窗
    depositModalOpen: boolean;
    openDepositModal: () => void;
    closeDepositModal: () => void;

    // Sidebar
    sidebarCollapsed: boolean;
    toggleSidebar: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
    loginModalOpen: false,
    openLoginModal: () => set({ loginModalOpen: true, betSlipDrawerOpen: false }),
    closeLoginModal: () => set({ loginModalOpen: false }),

    betSlipDrawerOpen: false,
    openBetSlipDrawer: () => set({ betSlipDrawerOpen: true }),
    closeBetSlipDrawer: () => set({ betSlipDrawerOpen: false }),
    toggleBetSlipDrawer: () => set((state) => ({ betSlipDrawerOpen: !state.betSlipDrawerOpen })),

    addAccountModalOpen: false,
    openAddAccountModal: () => set({ addAccountModalOpen: true }),
    closeAddAccountModal: () => set({ addAccountModalOpen: false }),

    languageModalOpen: false,
    openLanguageModal: () => set({ languageModalOpen: true }),
    closeLanguageModal: () => set({ languageModalOpen: false }),

    depositModalOpen: false,
    openDepositModal: () => set({ depositModalOpen: true, betSlipDrawerOpen: false }),
    closeDepositModal: () => set({ depositModalOpen: false }),

    sidebarCollapsed: false,
    toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
}));
