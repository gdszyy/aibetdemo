'use client';

import { toast as sonnerToast, Toaster } from 'sonner';

/** Toast provider — mount once in layout. Overlay is CSS-driven via :has() selector. */
export const ToastProvider: React.FC = () => {
    return (
        <>
            <Toaster
                position="top-center"
                offset="33vh"
                visibleToasts={10}
                style={{ zIndex: 70 }}
                toastOptions={{
                    unstyled: true,
                    className: 'inset-x-0 mx-auto w-fit',
                }}
            />
            {/* Overlay: visibility controlled by CSS :has() — shown when toaster has visible toasts */}
            {/* Prevent Radix DismissableLayer from detecting this as an "outside click" on modal */}
            <button
                type="button"
                className="toast-overlay fixed inset-0 bg-black/42 z-[69]"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                    e.stopPropagation();
                    sonnerToast.dismiss();
                }}
            />
        </>
    );
};
