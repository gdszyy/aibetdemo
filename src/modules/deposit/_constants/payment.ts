/** 充值页面支付承载方式。 */
export enum DepositPaymentMode {
    /** 完整路由页提交后跳转第三方支付页。 */
    Redirect = 'redirect',
    /** 弹窗内提交后通过 iframe 加载第三方支付页。 */
    Iframe = 'iframe',
}

/** 充值订单支付视图数据。 */
export interface DepositPaymentView {
    /** 商户订单号。 */
    orderNo: string;
    /** 第三方支付链接。 */
    payUrl: string;
    /** 订单过期时间戳。 */
    orderExpired: number;
    /** 支付渠道。 */
    payPlatform: string;
    /** 充值金额。 */
    amount: number;
}
