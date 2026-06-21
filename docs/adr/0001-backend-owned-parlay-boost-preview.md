# Backend-Owned Parlay Boost Preview

Parlay boost preview and post-submit display are both decided by backend-owned rules, while the frontend only renders the preview result and order state it receives. This avoids creating a second rule engine in the browser for scope matching, user visibility, odds thresholds, settlement timing, and payout semantics, all of which affect user expectation and money movement.
