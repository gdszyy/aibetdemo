// @ts-nocheck — LiveChat 官方 install snippet，勿改逻辑
/** biome-ignore-all lint: 官方第三方 snippet */
import type { LiveChatConfig } from './types';

export function installLiveChatSnippet(licenseNumber: number, groupId: number): void {
    const lc = (window.__lc || {}) as LiveChatConfig;
    lc.license = licenseNumber;
    lc.group = groupId;
    lc.asyncInit = true;
    lc.integration_name = 'manual_channels';
    lc.product_name = 'livechat';
    window.__lc = lc;

    (function (n, t, c) {
        function i(n) {
            return e._h ? e._h.apply(null, n) : e._q.push(n);
        }
        var e = {
            _q: [],
            _h: null,
            _v: '2.0',
            on: function () {
                i(['on', c.call(arguments)]);
            },
            once: function () {
                i(['once', c.call(arguments)]);
            },
            off: function () {
                i(['off', c.call(arguments)]);
            },
            get: function () {
                if (!e._h) throw new Error("[LiveChatWidget] You can't use getters before load.");
                return i(['get', c.call(arguments)]);
            },
            call: function () {
                i(['call', c.call(arguments)]);
            },
            init: function () {
                var s = t.createElement('script');
                s.async = true;
                s.type = 'text/javascript';
                s.src = 'https://cdn.livechatinc.com/tracking.js';
                t.head.appendChild(s);
            },
        };
        !n.__lc.asyncInit && e.init();
        n.LiveChatWidget = n.LiveChatWidget || e;
    })(window, document, [].slice);
}
