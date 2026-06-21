import { DEFAULT_MAX_STAKE } from '../../_constants/constants';
// import { useSlipSettingsStore } from '@/stores/slip-settings-store';

/**
 * Get maximum stake amount.
 *
 * Current: returns default constant.
 * Future: fetch from slipSettingsStore API config.
 *
 * @example
 * const maxStake = useMaxStake();
 * <StakeInput max={maxStake} />
 */
export const useMaxStake = (): number => {
    // TODO: Fetch from API later
    // const apiMaxStake = useSlipSettingsStore((s) => s.maxStake);
    // return apiMaxStake ?? DEFAULT_MAX_STAKE;

    return DEFAULT_MAX_STAKE;
};
