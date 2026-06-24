import type { SchemeBrand, SchemeMeta } from '@/components/theme-provider/scheme-meta';

export type BetSlipSkinStyle = Record<`--${string}`, string>;

export interface BetSlipSkin {
    brand: SchemeBrand;
    style: BetSlipSkinStyle;
}

const SUPERBET_SLIP_STYLE: BetSlipSkinStyle = {
    '--slip-shell-bg': '#070708',
    '--slip-panel-bg': '#2b2f31',
    '--slip-header-bg': '#181a1b',
    '--slip-footer-bg': '#181a1b',
    '--slip-card-bg': '#181a1b',
    '--slip-card-border': 'rgba(255, 255, 255, 0.08)',
    '--slip-card-remove-bg': '#101213',
    '--slip-panel-border': '#34393b',
    '--slip-tab-active-bg': '#c21e1c',
    '--slip-tab-active-text': '#ffffff',
    '--slip-tab-idle-bg': '#101213',
    '--slip-tab-idle-text': '#cbd0d2',
    '--slip-chip-bg': '#101213',
    '--slip-chip-text': '#f5f5f5',
    '--slip-accent': '#c21e1c',
    '--slip-profit': '#ffffff',
    '--slip-cta-bg': '#c21e1c',
    '--slip-cta-hover-bg': '#d72825',
    '--slip-cta-text': '#ffffff',
    '--slip-input-bg': '#101213',
    '--slip-input-active-bg': '#181a1b',
    '--slip-input-border': '#34393b',
    '--slip-quick-bg': '#101213',
    '--slip-quick-hover-bg': '#321415',
    '--slip-quick-hover-text': '#ffffff',
    '--slip-dock-bg': '#c21e1c',
    '--slip-dock-hover-bg': '#d72825',
    '--slip-dock-icon-bg': 'rgba(0, 0, 0, 0.18)',
    '--slip-dock-action-bg': 'rgba(0, 0, 0, 0.18)',
    '--slip-dock-action-hover-bg': 'rgba(0, 0, 0, 0.24)',
    '--slip-dock-value-text': '#ffffff',
    '--slip-summary-border': 'rgba(255, 255, 255, 0.14)',
    '--slip-summary-shadow': '0 -14px 30px -18px rgba(0, 0, 0, 0.8)',
};

const SUPERBET_LIGHT_SLIP_STYLE: BetSlipSkinStyle = {
    ...SUPERBET_SLIP_STYLE,
    '--slip-shell-bg': '#f6f7f9',
    '--slip-panel-bg': '#ffffff',
    '--slip-header-bg': '#ffffff',
    '--slip-footer-bg': '#ffffff',
    '--slip-card-bg': '#fffafa',
    '--slip-card-border': '#ead8d8',
    '--slip-card-remove-bg': '#f6f7f9',
    '--slip-panel-border': '#ead8d8',
    '--slip-tab-idle-bg': '#f2f4f7',
    '--slip-tab-idle-text': '#303947',
    '--slip-chip-bg': '#fff0f0',
    '--slip-chip-text': '#8e1615',
    '--slip-profit': '#151923',
    '--slip-input-bg': '#ffffff',
    '--slip-input-active-bg': '#fff7f7',
    '--slip-input-border': '#ead8d8',
    '--slip-quick-bg': '#f2f4f7',
    '--slip-quick-hover-bg': '#fff0f0',
    '--slip-quick-hover-text': '#8e1615',
    '--slip-summary-border': 'rgba(194, 30, 28, 0.22)',
    '--slip-summary-shadow': '0 -14px 30px -18px rgba(58, 14, 14, 0.34)',
};

const BETANO_DARK_SLIP_STYLE: BetSlipSkinStyle = {
    '--slip-shell-bg': 'var(--page-bg)',
    '--slip-panel-bg': 'var(--surface-1)',
    '--slip-header-bg': 'var(--surface-shell)',
    '--slip-footer-bg': 'var(--surface-1)',
    '--slip-card-bg': 'var(--surface-selected)',
    '--slip-card-border': 'var(--border-subtle)',
    '--slip-card-remove-bg': 'var(--surface-muted)',
    '--slip-panel-border': 'var(--border-subtle)',
    '--slip-tab-active-bg': '#c83200',
    '--slip-tab-active-text': '#ffffff',
    '--slip-tab-idle-bg': 'var(--surface-2)',
    '--slip-tab-idle-text': 'var(--content-secondary)',
    '--slip-chip-bg': 'rgba(255, 90, 31, 0.14)',
    '--slip-chip-text': '#ff9a3d',
    '--slip-accent': 'var(--brand-primary-0)',
    '--slip-profit': 'var(--status-success-text)',
    '--slip-cta-bg': 'var(--odds-selected-bg)',
    '--slip-cta-hover-bg': 'var(--odds-selected-hover-bg)',
    '--slip-cta-text': 'var(--odds-selected-text)',
    '--slip-input-bg': 'var(--surface-muted)',
    '--slip-input-active-bg': 'var(--surface-2)',
    '--slip-input-border': 'var(--border-strong)',
    '--slip-quick-bg': 'var(--surface-2)',
    '--slip-quick-hover-bg': 'rgba(255, 90, 31, 0.16)',
    '--slip-quick-hover-text': '#ff9a3d',
    '--slip-dock-bg': 'var(--dock-bar-bg)',
    '--slip-dock-hover-bg': 'var(--dock-bar-hover-bg)',
    '--slip-dock-icon-bg': 'rgba(14, 15, 34, 0.38)',
    '--slip-dock-action-bg': 'var(--mobile-dock-action-bg)',
    '--slip-dock-action-hover-bg': 'var(--mobile-dock-action-hover-bg)',
    '--slip-dock-value-text': 'var(--neutral-white-h)',
    '--slip-summary-border': 'var(--mobile-summary-bar-border)',
    '--slip-summary-shadow': 'var(--mobile-summary-bar-shadow)',
};

const BETANO_LIGHT_SLIP_STYLE: BetSlipSkinStyle = {
    '--filltext-ft-a': '#f6f7fb',
    '--filltext-ft-b': '#eef0f8',
    '--filltext-ft-c': '#dde1ef',
    '--filltext-ft-d': '#bac1d6',
    '--filltext-ft-e': '#7b849c',
    '--filltext-ft-f': '#5b647e',
    '--filltext-ft-g': '#303852',
    '--filltext-ft-h': '#101426',
    '--border-subtle': '#dde1ef',
    '--border-strong': '#cfd5e8',
    '--surface-muted': '#f6f7fb',
    '--surface-selected': '#fffaf7',
    '--slip-shell-bg': '#fff8f4',
    '--slip-panel-bg': '#ffffff',
    '--slip-header-bg': '#ffffff',
    '--slip-footer-bg': '#ffffff',
    '--slip-card-bg': '#fffaf7',
    '--slip-card-border': '#ffd4c1',
    '--slip-card-remove-bg': '#f6f7fb',
    '--slip-panel-border': '#ffd4c1',
    '--slip-tab-active-bg': '#c83200',
    '--slip-tab-active-text': '#ffffff',
    '--slip-tab-idle-bg': '#f1f3fb',
    '--slip-tab-idle-text': '#101426',
    '--slip-chip-bg': '#fff0e8',
    '--slip-chip-text': '#9d2a00',
    '--slip-accent': '#ff5a1f',
    '--slip-profit': '#007a43',
    '--slip-cta-bg': '#007a43',
    '--slip-cta-hover-bg': '#006b3b',
    '--slip-cta-text': '#ffffff',
    '--slip-input-bg': '#ffffff',
    '--slip-input-active-bg': '#fff8f4',
    '--slip-input-border': '#ffd4c1',
    '--slip-quick-bg': '#f1f3fb',
    '--slip-quick-hover-bg': 'rgba(255, 90, 31, 0.14)',
    '--slip-quick-hover-text': '#9d2a00',
    '--slip-dock-bg': 'linear-gradient(110deg, #b42d00 0%, #181a2f 86%)',
    '--slip-dock-hover-bg': 'linear-gradient(110deg, #963000 0%, #222640 86%)',
    '--slip-dock-icon-bg': 'rgba(14, 15, 34, 0.38)',
    '--slip-dock-action-bg': '#007a43',
    '--slip-dock-action-hover-bg': '#006b3b',
    '--slip-dock-value-text': '#ffffff',
    '--slip-summary-border': 'rgba(255, 90, 31, 0.26)',
    '--slip-summary-shadow': '0 -14px 30px -18px rgba(82, 48, 32, 0.36)',
};

const BETBUS_DARK_SLIP_STYLE: BetSlipSkinStyle = {
    '--slip-shell-bg': '#121212',
    '--slip-panel-bg': '#161616',
    '--slip-header-bg': '#010101',
    '--slip-footer-bg': '#252525',
    '--slip-card-bg': '#252525',
    '--slip-card-border': '#313131',
    '--slip-card-remove-bg': '#121212',
    '--slip-panel-border': '#313131',
    '--slip-tab-active-bg': '#d93642',
    '--slip-tab-active-text': '#ffffff',
    '--slip-tab-idle-bg': '#252525',
    '--slip-tab-idle-text': '#f2f2f2',
    '--slip-chip-bg': '#1f1f1f',
    '--slip-chip-text': '#f0c289',
    '--slip-accent': '#fa434e',
    '--slip-profit': '#ff6c75',
    '--slip-cta-bg': '#d93642',
    '--slip-cta-hover-bg': '#c70003',
    '--slip-cta-text': '#ffffff',
    '--slip-input-bg': '#121212',
    '--slip-input-active-bg': '#1f1f1f',
    '--slip-input-border': '#444444',
    '--slip-quick-bg': '#1f1f1f',
    '--slip-quick-hover-bg': '#321016',
    '--slip-quick-hover-text': '#ffffff',
    '--slip-dock-bg': 'linear-gradient(110deg, #2f2f2f 0%, #0f0f0f 92%)',
    '--slip-dock-hover-bg': 'linear-gradient(110deg, #3a3a3a 0%, #1f1f1f 92%)',
    '--slip-dock-icon-bg': '#d93642',
    '--slip-dock-action-bg': '#d93642',
    '--slip-dock-action-hover-bg': '#c70003',
    '--slip-dock-value-text': '#ffffff',
    '--slip-summary-border': 'rgba(255, 255, 255, 0.1)',
    '--slip-summary-shadow': '0 -14px 28px -18px rgba(0, 0, 0, 0.78)',
};

const BETBUS_LIGHT_SLIP_STYLE: BetSlipSkinStyle = {
    ...BETBUS_DARK_SLIP_STYLE,
    '--slip-shell-bg': '#f4f8f6',
    '--slip-panel-bg': '#ffffff',
    '--slip-header-bg': '#ffffff',
    '--slip-footer-bg': '#ffffff',
    '--slip-card-bg': '#f8fbf9',
    '--slip-card-border': '#d8e2dd',
    '--slip-card-remove-bg': '#edf4f0',
    '--slip-panel-border': '#d8e2dd',
    '--slip-tab-idle-bg': '#edf4f0',
    '--slip-tab-idle-text': '#17251f',
    '--slip-chip-bg': '#dff3ea',
    '--slip-chip-text': '#075d3b',
    '--slip-profit': '#075d3b',
    '--slip-input-bg': '#edf4f0',
    '--slip-input-active-bg': '#ffffff',
    '--slip-input-border': '#c7d6cf',
    '--slip-quick-bg': '#edf4f0',
    '--slip-dock-bg': 'linear-gradient(110deg, #0f7f50 0%, #174533 92%)',
    '--slip-dock-hover-bg': 'linear-gradient(110deg, #169c63 0%, #1f5c43 92%)',
};

const MATCH_SLIP_STYLE: BetSlipSkinStyle = {
    '--slip-shell-bg': 'var(--page-bg)',
    '--slip-panel-bg': 'var(--surface-1)',
    '--slip-header-bg': 'var(--surface-shell-gradient)',
    '--slip-footer-bg': 'var(--surface-1)',
    '--slip-card-bg': 'var(--surface-selected)',
    '--slip-card-border': 'var(--border-subtle)',
    '--slip-card-remove-bg': 'var(--surface-muted)',
    '--slip-panel-border': 'var(--border-subtle)',
    '--slip-tab-active-bg': 'var(--brand-primary-0)',
    '--slip-tab-active-text': 'var(--on-brand)',
    '--slip-tab-idle-bg': 'var(--surface-selected)',
    '--slip-tab-idle-text': 'var(--content-primary)',
    '--slip-chip-bg': 'var(--brand-primary-1)',
    '--slip-chip-text': 'var(--content-primary)',
    '--slip-accent': 'var(--brand-primary-0)',
    '--slip-profit': 'var(--brand-primary-0)',
    '--slip-cta-bg': 'var(--odds-selected-bg)',
    '--slip-cta-hover-bg': 'var(--odds-selected-hover-bg)',
    '--slip-cta-text': 'var(--odds-selected-text)',
    '--slip-input-bg': 'var(--surface-muted)',
    '--slip-input-active-bg': 'var(--surface-2)',
    '--slip-input-border': 'var(--border-strong)',
    '--slip-quick-bg': 'var(--surface-muted)',
    '--slip-quick-hover-bg': 'var(--brand-primary-1)',
    '--slip-quick-hover-text': 'var(--content-primary)',
    '--slip-dock-bg': 'var(--dock-bar-bg)',
    '--slip-dock-hover-bg': 'var(--dock-bar-hover-bg)',
    '--slip-dock-icon-bg': 'var(--mobile-dock-icon-bg)',
    '--slip-dock-action-bg': 'var(--mobile-dock-action-bg)',
    '--slip-dock-action-hover-bg': 'var(--mobile-dock-action-hover-bg)',
    '--slip-dock-value-text': 'var(--neutral-white-h)',
    '--slip-summary-border': 'var(--mobile-summary-bar-border)',
    '--slip-summary-shadow': 'var(--mobile-summary-bar-shadow)',
};

const MATCH_LIGHT_SLIP_STYLE: BetSlipSkinStyle = {
    ...MATCH_SLIP_STYLE,
    '--slip-shell-bg': '#eef8f4',
    '--slip-panel-bg': '#ffffff',
    '--slip-header-bg': '#ffffff',
    '--slip-footer-bg': '#ffffff',
    '--slip-card-bg': '#f8fbf9',
    '--slip-card-border': '#cdeee1',
    '--slip-card-remove-bg': '#eef8f4',
    '--slip-panel-border': '#cdeee1',
    '--slip-tab-active-bg': '#dff3ea',
    '--slip-tab-active-text': '#075d3b',
    '--slip-tab-idle-bg': '#eef8f4',
    '--slip-tab-idle-text': '#0e1726',
    '--slip-chip-bg': '#eef8f4',
    '--slip-chip-text': '#075d3b',
    '--slip-profit': '#075d3b',
    '--slip-cta-bg': '#087348',
    '--slip-cta-hover-bg': '#075d3b',
    '--slip-cta-text': '#ffffff',
    '--slip-input-bg': '#ffffff',
    '--slip-input-active-bg': '#eef8f4',
    '--slip-input-border': '#cdeee1',
    '--slip-quick-bg': '#eef8f4',
    '--slip-quick-hover-bg': '#dff3ea',
    '--slip-quick-hover-text': '#075d3b',
};

/**
 * iOS26 液态玻璃：投注单沿用 match 的「全变量驱动」皮肤。所有 token（--surface-*、
 * --brand-primary-0、--odds-selected-* 等）都在 glass-light / glass-dark scheme 内被
 * 覆盖为紫→粉玻璃色，故亮暗共用同一份变量映射即可，无需各写一份硬编码色。
 * 不接此分支时 glass 会落到 superbet 默认（红色），即购物车「还是红的」的根因。
 */
const GLASS_SLIP_STYLE: BetSlipSkinStyle = {
    ...MATCH_SLIP_STYLE,
};

export const getBetSlipSkin = (schemeMeta: SchemeMeta): BetSlipSkin => {
    if (schemeMeta.brand === 'glass') {
        return {
            brand: 'glass',
            style: GLASS_SLIP_STYLE,
        };
    }

    if (schemeMeta.brand === 'betano') {
        return {
            brand: 'betano',
            style: schemeMeta.mode === 'light' ? BETANO_LIGHT_SLIP_STYLE : BETANO_DARK_SLIP_STYLE,
        };
    }

    if (schemeMeta.brand === 'betbus') {
        return {
            brand: 'betbus',
            style: schemeMeta.mode === 'light' ? BETBUS_LIGHT_SLIP_STYLE : BETBUS_DARK_SLIP_STYLE,
        };
    }

    if (schemeMeta.brand === 'match') {
        return {
            brand: 'match',
            style: schemeMeta.mode === 'light' ? MATCH_LIGHT_SLIP_STYLE : MATCH_SLIP_STYLE,
        };
    }

    return {
        brand: 'superbet',
        style: schemeMeta.mode === 'light' ? SUPERBET_LIGHT_SLIP_STYLE : SUPERBET_SLIP_STYLE,
    };
};
