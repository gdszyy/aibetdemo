'use client';

import { useEffect } from 'react';
import { reportError } from '@/utils/error';

/**
 * App-wide error boundary — replaces the entire page (including <html>/<body>).
 * This is the single runtime UI fallback layer kept in the app.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        reportError(error, { level: 'fatal' });
    }, [error]);

    return (
        <html lang="en">
            <body style={{ margin: 0, padding: 0 }}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '100vh',
                        fontFamily: 'Poppins, system-ui, sans-serif',
                        backgroundColor: '#F5F7F8', // filltext-ft-a
                        color: '#2E2E2E', // neutral-black-h
                        textAlign: 'center',
                        padding: '20px',
                    }}
                >
                    <div
                        style={{
                            fontSize: '64px',
                            marginBottom: '16px',
                        }}
                    >
                        ⚠️
                    </div>
                    <h1
                        style={{
                            fontSize: '24px',
                            fontWeight: '600',
                            margin: '0 0 8px 0',
                        }}
                    >
                        Oops! Something went wrong
                    </h1>
                    <p
                        style={{
                            fontSize: '14px',
                            color: '#A0A8B4', // filltext-ft-e
                            maxWidth: '400px',
                            lineHeight: '1.5',
                            margin: '0 0 24px 0',
                        }}
                    >
                        An unexpected error occurred. We've been notified and are working to fix it.
                    </p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            type="button"
                            onClick={reset}
                            style={{
                                padding: '12px 24px',
                                fontSize: '14px',
                                fontWeight: '600',
                                backgroundColor: '#E80104', // brand-primary-0
                                color: 'white',
                                border: 'none',
                                borderRadius: '9999px',
                                cursor: 'pointer',
                                transition: 'opacity 0.2s',
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.opacity = '0.8';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.opacity = '1';
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.opacity = '0.8';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.opacity = '1';
                            }}
                        >
                            Try Again
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                // Extract locale from current URL (e.g., /es/sports → es)
                                const pathLocale = window.location.pathname.split('/')[1];
                                const locale = ['pt', 'es', 'en'].includes(pathLocale) ? pathLocale : 'es';
                                window.location.href = `/${locale}/sports`;
                            }}
                            style={{
                                padding: '12px 24px',
                                fontSize: '14px',
                                fontWeight: '600',
                                backgroundColor: 'transparent',
                                color: '#E80104', // brand-primary-0
                                border: '1px solid #E80104', // brand-primary-0
                                borderRadius: '9999px',
                                cursor: 'pointer',
                            }}
                        >
                            Back to Home
                        </button>
                    </div>
                    {error.digest && (
                        <p style={{ marginTop: '32px', fontSize: '10px', color: '#A0A8B4' }}>
                            Error ID: {error.digest}
                        </p>
                    )}
                </div>
            </body>
        </html>
    );
}
