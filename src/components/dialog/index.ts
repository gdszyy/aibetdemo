'use client';

import type { DialogItem } from './constant';

/** Base dialog options */
type BaseOptions = {
    /**
     * Whether to auto-close
     * @default true
     * @description If false, must be closed manually (ignored if no corresponding callback is provided)
     */
    autoClose?: boolean;
    /** Title — styled as bold body text, left-aligned */
    title?: DialogItem['title'];
    confirmText?: DialogItem['confirmText'];
    onConfirm?: DialogItem['onConfirm'];
};

/** Confirmation dialog */
type ConfirmOptions = BaseOptions & {
    /** Content — styled as body text, center-aligned */
    content?: DialogItem['content'];
    cancelText?: DialogItem['cancelText'];
    onCancel?: DialogItem['onCancel'];
};

/** Info dialog */
type InfoOptions = BaseOptions & {
    /** Content — styled as body text, center-aligned */
    content?: DialogItem['content'];
};

/** Error dialog */
type ErrorOptions = BaseOptions & {
    /** Content — styled as body text, center-aligned */
    content: DialogItem['content'];
};

// --- Store (pub-sub) ---
type Listener = (dialog: DialogItem | null) => void;
const listeners = new Set<Listener>();
let currentDialog: DialogItem | null = null;

function setDialog(dialog: DialogItem | null) {
    currentDialog = dialog;
    for (const listener of listeners) {
        listener(currentDialog);
    }
}

/** Subscribe to dialog state changes (used by DialogProvider) */
export function subscribeDialog(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

/** Get current dialog snapshot (used by DialogProvider) */
export function getDialogSnapshot() {
    return currentDialog;
}

/** Close the current dialog */
export function closeDialog() {
    setDialog(null);
}

// --- Public API ---
function showDialog(config: Omit<DialogItem, 'id'>) {
    const id = crypto.randomUUID();
    setDialog({ id, ...config });
}

/**
 * Global Dialog service
 *
 * Usage: Dialog.confirm({ title, content, onConfirm })
 */
export const Dialog = {
    /** Two-button confirmation dialog */
    confirm: (options: ConfirmOptions) => {
        showDialog({ type: 'confirm', autoClose: options.autoClose ?? true, ...options });
    },
    /** Single-button info dialog */
    info: (options: InfoOptions) => {
        showDialog({ type: 'info', autoClose: options.autoClose ?? true, ...options });
    },
    /** Single-button error dialog with icon */
    error: (options: ErrorOptions) => {
        showDialog({ type: 'error', autoClose: options.autoClose ?? true, ...options });
    },
};
