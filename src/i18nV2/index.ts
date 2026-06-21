/**
国际化相关代码。

从业务上，包括国别地区、语言、货币、数字、时区时间。
从技术说，包括utils, hooks, constants, components。

// TODO 目前只支持国别，其他的语言、货币等等，都应该迁移到这边来。

// TODO 移除项目中其他所有的国际化代码，在此收口。
// TODO 移除原来的i18n后，此模块改名为i18n
 */

export type { CurrencyCode, RegionCode } from './services/constant';
export { regionConfigs } from './services/constant';
export { I18nEffect } from './services/effect';
export { useI18nStore, useRegionCode, useRegionConfig } from './store';
export type { TranslationFunction, TranslationKey, TranslationNamespace } from './types';
