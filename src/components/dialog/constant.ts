import type { ReactNode } from 'react';

/** Dialog type definition */
export interface DialogItem {
    id: string;
    type: 'confirm' | 'info' | 'error';
    /**
     * Whether to auto-close — if false, must manually call close
     * @default true
     */
    autoClose?: boolean;
    /** Title */
    title?: ReactNode | (() => ReactNode);
    /** Content */
    content?: ReactNode | (() => ReactNode);
    /** Confirm button text */
    confirmText?: string;
    /** Cancel button text */
    cancelText?: string;
    /** Confirm callback */
    onConfirm?: (onClose: () => void) => void | Promise<void>;
    /** Cancel callback */
    onCancel?: (onClose: () => void) => void | Promise<void>;
}
