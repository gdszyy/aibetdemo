'use client';

import { createContext, type FC, type PropsWithChildren, useContext } from 'react';
import type { TimePickerConfig } from './types';

const defaultConfig: TimePickerConfig = {
    use24Hour: true,
    showSeconds: false,
};

export const TimePickerConfigContext = createContext<TimePickerConfig>(defaultConfig);

export const useTimePickerConfig = () => useContext(TimePickerConfigContext);

export const TimePickerConfigProvider: FC<PropsWithChildren<{ config?: Partial<TimePickerConfig> }>> = ({
    config,
    children,
}) => (
    <TimePickerConfigContext.Provider value={{ ...defaultConfig, ...config }}>
        {children}
    </TimePickerConfigContext.Provider>
);
