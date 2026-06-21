import { createNavigation } from 'next-intl/navigation';
import type { ComponentProps, FunctionComponent } from 'react';
import { routing } from './config';

const navigationInstance = createNavigation(routing);
const { Link: OriginLink } = navigationInstance;

const Link: FunctionComponent<ComponentProps<typeof OriginLink>> = (props) => {
    return <OriginLink {...props} prefetch={props.prefetch ?? false} />;
};

export { Link };
export const { redirect, usePathname, useRouter } = navigationInstance;
