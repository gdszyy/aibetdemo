/** Convert byte to two-digit hex string */
const byteToHex = (byte: number) => {
    return byte.toString(16).padStart(2, '0');
};

/** Generate n-byte hex string using pseudo-random (length = 2n) */
const randomHex = (bytes: number) => {
    const buf = new Uint8Array(bytes);
    // Use Math.random() for pseudo-random generation, better compatibility
    for (let i = 0; i < bytes; i++) {
        buf[i] = Math.floor(Math.random() * 256);
    }
    return Array.from(buf, (b) => byteToHex(b)).join('');
};

/** Check if hex string is all zeros (invalid value) */
const isAllZero = (hex: string) => {
    return /^0+$/.test(hex);
};

/**
 * Generate standard OpenTelemetry tracecontext for backend data tracing
 * @returns trace_id
 */
export const generateTraceHeaders = () => {
    const version = '00';
    const traceFlags = '00'; // 01=sampled, 00=not-sampled

    // Spec: trace-id = 16 bytes (32 hex), span-id = 8 bytes (16 hex)
    let traceId = randomHex(16);
    let spanId = randomHex(8);

    // Guard against all-zero invalid values (extremely rare)
    if (isAllZero(traceId)) {
        traceId = randomHex(16);
    }
    if (isAllZero(spanId)) {
        spanId = randomHex(8);
    }

    const trace_id = `${version}-${traceId}-${spanId}-${traceFlags}`;
    return {
        traceparent: trace_id,
        // tracestate: '', // Optional: set when vendor info is available
    };
};
