/** Depósito */
export default {
    title: 'Depositar',
    subTitle: 'Adicione fundos à sua conta',
    channelLabel: 'Canal de deposito',
    channelMaintenance: 'Canal em manutencao',
    amountLabel: 'Valor',
    inputPlaceholder: '{currency} {min}-{max}',
    inputEmptyError: 'Por favor, insira o valor do pagamento',
    inputInvalidError: 'Limite de depósito: {min}~{max}',
    agreement: 'Autorizo salvar meus dados bancários para futuras transações após concluir esta operação.',
    agreementError: 'Aceite o Acordo de Depósito e Saque para continuar.',

    confirmBtnText: 'Confirmar',

    depositPendingToast: 'Ordem realizada. Processando depósito.',
    depositSuccessToast: 'Sucesso! Verifique seu saldo.',
    depositFailedToast: 'Falha! Verifique os dados e tente novamente.',
    modal: {
        payWithMethod: 'Pagar com {method}',
        paymentFrameTitle: 'Página de pagamento do depósito',
        processingPayment: 'Processando pagamento. Atualizaremos seu saldo após a confirmação.',
        cancel: 'Cancelar',
    },
    infoPanel: {
        availableMethods: 'Métodos de depósito disponíveis',
        questionsTitle: 'Perguntas sobre depósitos',
    },

    promoCode: {
        placeholder: 'Insira o código promocional (Opcional)',
        codeApplied:
            'Código aplicado. Valor do Bônus: {bonus_amount}. Requisito de movimentação: {turnover_requirement}. Odds mínimas ≥ 1.6.',
        amountRange: 'Requisitos não atendidos. Válido para depósitos de {min}-{max} {currencySymbol}.',
        orderConflict: 'Requisitos não atendidos. Use os cupons do Primeiro, Segundo e Terceiro Depósito em ordem.',
        alreadyUsed: 'Já utilizado.',
        invalidCode: 'Código inválido.',
        code: 'Código: {code}',
        codeLabel: 'Código',
    },
};
