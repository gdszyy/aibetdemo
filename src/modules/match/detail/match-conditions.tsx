'use client';

import { useTranslations } from 'next-intl';
import { type FC, useMemo } from 'react';
import { cn } from '@/utils/common';

/**
 * 比赛天气 / 场馆信息头（温度、风速、湿度、气压 + 体育场、容量、裁判）。
 *
 * ⚠️ MOCK：GTB 赛事详情接口目前不返回天气/场馆字段，这里按 event_id 生成稳定假数据。
 * 后端就绪后，把 useMockConditions 换成真实字段（match.venue / match.weather），
 * 组件结构与样式保持不变。
 */

/** 天气类型，用于本地化文案与配色。 */
type WeatherType = 'sunny' | 'cloudy' | 'rain';

/** 一场比赛的环境信息。 */
interface MatchConditions {
    /** 温度（摄氏度） */
    temperature: number;
    /** 风速（m/s） */
    windSpeed: number;
    /** 湿度（%） */
    humidity: number;
    /** 气压（mmHg） */
    pressure: number;
    /** 体育场名 */
    stadium: string;
    /** 容量 */
    capacity: number;
    /** 裁判 */
    referee: string;
    /** 天气类型 */
    weather: WeatherType;
}

// ─── ⚠️ MOCK 数据源 begin（后端就绪后整体替换） ───
const MOCK_STADIUMS = ['MetLife Stadium', 'Estadio Azteca', 'Camp Nou', 'Maracanã', 'Wembley Stadium', 'Allianz Arena'];
const MOCK_REFEREES = ['A. Faghani', 'C. Ramos', 'B. Nyberg', 'S. Marciniak', 'D. Orsato', 'F. Rapallini'];
const WEATHER_TYPES: WeatherType[] = ['sunny', 'cloudy', 'rain'];

/** 字符串散列，保证同一 event_id 产出稳定数值。 */
const hashString = (value: string): number =>
    [...value].reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 7);

/** 按 event_id 推导稳定的环境信息。 */
const useMockConditions = (eventId: string): MatchConditions =>
    useMemo(() => {
        const h = hashString(eventId || 'fallback');
        return {
            temperature: 8 + (h % 23),
            windSpeed: Math.round((1 + (h % 40) / 10) * 10) / 10,
            humidity: 30 + (h % 55),
            pressure: 740 + (h % 40),
            stadium: MOCK_STADIUMS[h % MOCK_STADIUMS.length],
            capacity: 20000 + (h % 60) * 1000,
            referee: MOCK_REFEREES[(h >> 3) % MOCK_REFEREES.length],
            weather: WEATHER_TYPES[h % WEATHER_TYPES.length],
        };
    }, [eventId]);
// ─── ⚠️ MOCK 数据源 end ───

const iconProps = {
    viewBox: '0 0 16 16',
    fill: 'none',
    width: '1em',
    height: '1em',
    xmlns: 'http://www.w3.org/2000/svg',
} as const;

/** 温度计图标。 */
const IconTemperature: FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}>
        <path d="M8 9.3V3.2a1.2 1.2 0 0 1 2.4 0v6.1a2.6 2.6 0 1 1-2.4 0Z" stroke="currentColor" strokeWidth="1.3" />
    </svg>
);

/** 风速图标。 */
const IconWind: FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}>
        <path
            d="M2 5.5h7.5A1.75 1.75 0 1 0 7.75 3.75M2 10.5h9.5A1.75 1.75 0 1 1 9.75 12.25"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
        />
    </svg>
);

/** 湿度（水滴）图标。 */
const IconHumidity: FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}>
        <path
            d="M8 2.2 4.8 6.6a4 4 0 1 0 6.4 0L8 2.2Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
        />
    </svg>
);

/** 气压（仪表）图标。 */
const IconPressure: FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}>
        <path d="M2.5 11a5.5 5.5 0 1 1 11 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M8 11 10.5 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
);

/** 体育场图标。 */
const IconStadium: FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}>
        <ellipse cx="8" cy="6" rx="6" ry="2.6" stroke="currentColor" strokeWidth="1.3" />
        <path d="M2 6v3.4C2 10.8 4.7 12 8 12s6-1.2 6-2.6V6" stroke="currentColor" strokeWidth="1.3" />
    </svg>
);

/** 裁判（口哨）图标。 */
const IconWhistle: FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}>
        <path
            d="M6.5 6h7V8a3.5 3.5 0 1 1-7 0V6ZM6.5 7H3l1.5-1.5"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
        />
    </svg>
);

/** 单个数据项（图标 + 文本）。 */
const ConditionItem: FC<{ icon: FC<{ className?: string }>; children: string }> = ({ icon: Icon, children }) => (
    <span className="inline-flex items-center gap-1 whitespace-nowrap text-auxiliary-md text-filltext-ft-h">
        <Icon className="size-3.5 text-filltext-ft-h/75" />
        {children}
    </span>
);

interface MatchConditionsBarProps {
    /** 比赛 event_id（mock 种子，后端就绪后改用真实字段） */
    eventId: string;
    className?: string;
}

/** 比赛环境信息条。 */
export const MatchConditionsBar: FC<MatchConditionsBarProps> = ({ eventId, className }) => {
    const t = useTranslations('matches');
    const c = useMockConditions(eventId);
    // 显式映射，避免 next-intl 动态 key 的类型问题
    const weatherLabels: Record<WeatherType, string> = {
        sunny: t('conditions.sunny'),
        cloudy: t('conditions.cloudy'),
        rain: t('conditions.rain'),
    };
    const weatherLabel = weatherLabels[c.weather];

    return (
        <div
            className={cn(
                'flex flex-wrap items-center gap-x-4 gap-y-1 rounded-sm bg-[#245d3a] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]',
                className,
            )}
        >
            {/* 场馆信息 */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <ConditionItem icon={IconStadium}>{c.stadium}</ConditionItem>
                <ConditionItem icon={IconWhistle}>{c.referee}</ConditionItem>
                <span className="whitespace-nowrap text-auxiliary-md text-filltext-ft-h/75">
                    {t('conditions.capacity')}: {c.capacity.toLocaleString()}
                </span>
            </div>
            <span className="hidden h-3 w-px bg-filltext-ft-h/20 md:inline-block" />
            {/* 天气信息 */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <ConditionItem icon={IconTemperature}>{`${c.temperature}°C`}</ConditionItem>
                <ConditionItem icon={IconWind}>{`${c.windSpeed} m/s`}</ConditionItem>
                <ConditionItem icon={IconHumidity}>{`${c.humidity}%`}</ConditionItem>
                <ConditionItem icon={IconPressure}>{`${c.pressure} mmHg`}</ConditionItem>
                <span className="whitespace-nowrap text-auxiliary-md font-medium text-filltext-ft-h">
                    {weatherLabel}
                </span>
            </div>
        </div>
    );
};
