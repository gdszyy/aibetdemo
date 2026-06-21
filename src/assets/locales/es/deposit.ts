/** Depósito */
export default {
    title: 'Depositar',
    subTitle: 'Agrega fondos a tu cuenta',
    channelLabel: 'Canal de deposito',
    channelMaintenance: 'Canal en mantenimiento',
    amountLabel: 'Monto',
    inputPlaceholder: '{currency} {min}-{max}',
    inputEmptyError: 'Por favor, ingresa el monto del depósito',
    inputInvalidError: 'Límite de depósito: {min}~{max}',
    agreement: 'Autorizo guardar mis datos bancarios para futuras transacciones tras completar esta operación.',
    agreementError: 'Acepta el Acuerdo de Depósito y Retiro para continuar.',

    confirmBtnText: 'Confirmar',

    depositPendingToast: 'Orden exitosa. Procesando depósito.',
    depositSuccessToast: '¡Éxito! Revisa tu saldo.',
    depositFailedToast: '¡Error! Revisa los datos e intenta de nuevo.',
    modal: {
        payWithMethod: 'Pagar con {method}',
        paymentFrameTitle: 'Página de pago del depósito',
        processingPayment: 'Procesando pago. Actualizaremos tu saldo después de la confirmación.',
        cancel: 'Cancelar',
    },
    infoPanel: {
        availableMethods: 'Métodos de depósito disponibles',
        questionsTitle: 'Preguntas sobre depósitos',
    },

    promoCode: {
        placeholder: 'Ingresa código promocional (Opcional)',
        codeApplied:
            'Código aplicado. Monto del bono: {bonus_amount}. Requisito de facturación: {turnover_requirement}. Cuota mínima ≥ 1.6.',
        amountRange: 'Requisitos no cumplidos. Válido en depósitos de {min}-{max} {currencySymbol}.',
        orderConflict: 'Requisitos no cumplidos. Usa los cupones de Primer, Segundo y Tercer Depósito en orden.',
        alreadyUsed: 'Ya utilizado.',
        invalidCode: 'Código inválido.',
        code: 'Código: {code}',
        codeLabel: 'Código',
    },
};
