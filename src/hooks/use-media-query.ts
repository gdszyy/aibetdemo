import { useEnvContext } from '@/components/env-provider';

export const useIsMobile = () => useEnvContext().isMobile;

export const useIsDesktop = () => useEnvContext().isDesktop;
