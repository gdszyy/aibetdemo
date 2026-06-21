/** Módulo de apostas */
export default {
    /** Abas */
    tabs: {
        slip: 'Carrinho',
        open: 'Abertas',
        settled: 'Encerradas',
    },

    /** Modo */
    mode: {
        single: 'Simples',
        parlay: 'Múltipla',
        tooltip:
            'Alterne entre fazer apostas simples independentes ou combiná-las em uma aposta múltipla para obter odds maiores.',
    },

    /** Botões */
    button: {
        placeBet: 'Apostar',
        deposit: 'Recarregar',
        goDeposit: 'Ir recarregar',
        cancel: 'Cancelar',
        clearAll: 'Limpar tudo',
        remove: 'Remover',
        clearException: 'Limpar exceções',
    },

    banner: {
        insufficientBalance: 'Saldo insuficiente — faltam <amount></amount>',
    },

    modal: {
        title: 'Saldo insuficiente',
        currentBalance: 'Saldo atual',
        body: 'Esta aposta é de {total}.<br></br>Faltam {difference} para apostar.',
    },

    /** Rótulos */
    label: {
        toReturn: 'Retorno',
        betOnAll: 'Apostar em tudo',
        totalStake: 'Aposta total',
        payout: 'Pagamento',
        noSelections: 'Carrinho vazio',
        noOpenBets: 'Sem apostas abertas',
        noSettledBets: 'Sem apostas encerradas',
    },

    /** Resumo fixo no mobile */
    summary: {
        odds: 'COTÁ',
        stake: 'MIZÁ',
        potentialWin: 'CÂSTIG POTENTIAL',
    },

    /** Painel de configuração */
    settings: {
        title: 'Configuração',
        oddsChange: 'Alterações de odds',
        showMoreOptions: 'Mostrar mais opções',
        oddsFormat: 'Formato de odds',
        quickBuyAmountConfiguration: 'Configuração de valores de compra rápida',
        amountConfigHints: {
            quickBuy: 'Adicionar valor ao bilhete',
        },
        oddsPolicy: {
            acceptAll: 'Aceitar todas as alterações de odds automaticamente',
            acceptHigher: 'Aceitar apenas odds melhores',
            acceptNone: 'Não aceitar alterações de odds',
            hints: {
                acceptAll:
                    'Aceita automaticamente qualquer alteração nas odds (para mais ou menos) para confirmar a aposta o mais rápido possível.',
                acceptHigher:
                    'O sistema prosseguirá automaticamente se as odds melhorarem. Se caírem, será solicitado que confirme antes de apostar.',
                acceptNone:
                    'Controle total: você deverá reconfirmar manualmente sua aposta caso haja qualquer alteração nas odds.',
            },
        },
        format: {
            decimal: 'Decimal',
            american: 'Americano',
            fractional: 'Fracionário',
        },
    },

    guide: {
        quickBuy: {
            tooltip: 'Defina seus valores favoritos aqui para aplicar em todos os bilhetes de uma vez.',
            cta: 'Configurar Padrão',
        },
        betOnAll: {
            tooltip: 'Toque para somar! Personalize estes botões para adicionar seus valores preferidos rapidamente.',
            cta: 'Personalizar',
        },
    },

    /** Progresso de boost de múltipla */
    parlayBoost: {
        unlock: {
            prefix: 'Adicione',
            middle: ' {count, plural, one {seleção} other {seleções}} para liberar',
            suffix: 'de boost!',
        },
        nextTier: {
            prefix: 'Adicione',
            middle: ' {count, plural, one {seleção} other {seleções}} para liberar',
            suffix: 'de boost!',
        },
        maxTier: {
            prefix: 'Boost máximo',
            suffix: 'liberado!',
        },
        minOdds: 'Odd mín.: {odds}',
        rules: 'Uma múltipla de {minLegs}-{maxLegs} seleções, todas elegíveis e vencedoras, libera boost extra. Cada seleção deve ter odd mínima de {minOdds}.',
        payoutCapTooltip: 'Pagamento extra máximo: {cap}',
        payoutCapSheetClose: 'Fechar',
    },

    /** Mensagens */
    message: {
        insufficientBalance: 'Saldo insuficiente para esta aposta',
        bettingUnavailable: 'As apostas estão temporariamente indisponíveis. Tente novamente mais tarde.',
        waitOrderComplete: 'Aguarde a conclusão da ordem atual.',
        invalidStake: 'Insira um valor de aposta válido.',
        orderPlacedSuccessfully: 'Ordem realizada com sucesso',
        orderRejected: 'Ordem rejeitada',
        minParlaySelections: 'Selecione pelo menos 2 resultados para uma múltipla.',
        gotoSetting: 'Ir para Configurações',
    },

    toast: {
        removed_single: 'Removido: {part}',
        removed_two: 'Removido: {part1} e {part2}',
        removed_three: 'Removido: {part1}, {part2} e {part3}',
        conflicts_plural: '{count, plural, one {{count} conflito} other {{count} conflitos}}',
        locked_plural: '{count, plural, one {{count} bloqueado} other {{count} bloqueados}}',
        invalid_plural: '{count, plural, one {{count} inválido} other {{count} inválidos}}',
        inactive_plural: '{count, plural, one {{count} inativo} other {{count} inativos}}',
        non_compliant_plural: '{count, plural, one {{count} não compatível} other {{count} não compatíveis}}',
        tooManySelectionsWarning: 'Apostas em excesso podem ser rejeitadas',
        maxSelectionsReached: 'Máximo de {count} seleções atingido',
    },

    /** Ticket */
    ticket: {
        single: 'Simples',
        accumulator: 'Acumulada de {count}',
        settledProgress: '{settled}/{total} liquidadas',
        showMore: 'Mostrar mais {count}',
        showLess: 'Mostrar menos',
        settleTime: 'Liquidação:',
        stake: 'Aposta',
        payout: 'Pagamento',
        maxPayout: 'Pagamento Máx.',
        status: {
            won: 'Ganhou',
            lost: 'Perdeu',
            halfWon: 'Meio Ganho',
            halfLost: 'Meio Perdido',
            pending: 'Pendente',
            crediting: 'Creditando...',
            void: 'Anulada',
        },
    },
};
