import { createNavigation } from 'next-intl/navigation';
import type { ComponentProps, FunctionComponent } from 'react';
import { routing } from './config';

const navigationInstance = createNavigation(routing);
const { Link: OriginLink } = navigationInstance;

type LinkProps = ComponentProps<typeof OriginLink>;

const shouldPrefetchByDefault = (href: LinkProps['href']): boolean => {
    if (typeof href !== 'string') {
        return true;
    }

    if (href === '#' || /^(https?:|mailto:|tel:)/.test(href)) {
        return false;
    }

    const pathname = href.split('?')[0];
    return !pathname.includes('/matches/') && !pathname.includes('/casino/game/');
};

const Link: FunctionComponent<ComponentProps<typeof OriginLink>> = (props) => {
    return <OriginLink {...props} prefetch={props.prefetch ?? shouldPrefetchByDefault(props.href)} />;
};

export { Link };
export const { redirect, usePathname, useRouter } = navigationInstance;
