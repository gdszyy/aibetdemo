import type { MessageKeys, NamespaceKeys, NestedKeyOf, NestedValueOf, useTranslations } from 'next-intl';

/** 基于全局 IntlMessages 推导的命名空间集合。 */
export type TranslationNamespace = NamespaceKeys<IntlMessages, NestedKeyOf<IntlMessages>>;

type NamespaceTranslationFunction<Namespace extends TranslationNamespace> = ReturnType<
    typeof useTranslations<Namespace>
>;

/**
 * 复用 next-intl 内部的 namespaced key 推导方式。
 *
 * 这里额外包了一层 `{ '!': IntlMessages }`，其中 `!` 只是类型计算用的占位根节点，
 * 没有业务含义，也不会对应任何真实多语言 key。
 *
 * 团队约定这里的 `Namespace` 必须显式传入某个模块，例如 `user`、`common`、`vip`，
 * 不支持空 namespace。因此这里只保留 `!.${Namespace}` 这一种路径形式，
 * 用来统一通过 `NestedValueOf` 读取对应模块的 message 子树。
 */
type NamespacedMessageKeys<Namespace extends TranslationNamespace> = MessageKeys<
    NestedValueOf<{ '!': IntlMessages }, `!.${Namespace}`>,
    NestedKeyOf<NestedValueOf<{ '!': IntlMessages }, `!.${Namespace}`>>
>;

/** 指定命名空间下可传给 t() 的相对翻译 key，可选按前缀进一步收窄。 */
export type TranslationKey<Namespace extends TranslationNamespace, Prefix extends string | undefined = undefined> = [
    Prefix,
] extends [undefined]
    ? NamespacedMessageKeys<Namespace>
    : Extract<NamespacedMessageKeys<Namespace>, `${Prefix & string}.${string}`>;

/** 指定命名空间的 next-intl 翻译函数类型。 */
export type TranslationFunction<Namespace extends TranslationNamespace> = NamespaceTranslationFunction<Namespace>;
