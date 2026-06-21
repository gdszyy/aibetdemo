/** Módulo de apuestas */
export default {
    /** Pestañas */
    tabs: {
        slip: 'Boleto',
        open: 'Abiertas',
        settled: 'Liq.',
    },

    /** Modo */
    mode: {
        single: 'Simple',
        parlay: 'Combinada',
        tooltip:
            'Alterna entre apuestas simples independientes o combínalas en una apuesta múltiple (parlay) para obtener mejores cuotas.',
    },

    /** Botones */
    button: {
        placeBet: 'Apostar',
        deposit: 'Recargar',
        goDeposit: 'Ir a recargar',
        cancel: 'Cancelar',
        clearAll: 'Limpiar todo',
        remove: 'Eliminar',
        clearException: 'Limpiar excepciones',
    },

    banner: {
        insufficientBalance: 'Saldo insuficiente: te faltan <amount></amount>',
    },

    modal: {
        title: 'Saldo insuficiente',
        currentBalance: 'Saldo actual',
        body: 'Esta apuesta es de {total}.<br></br>Te faltan {difference} para apostar.',
    },

    /** Etiquetas */
    label: {
        toReturn: 'Retorno',
        betOnAll: 'Apostar en todo',
        totalStake: 'Apuesta total',
        payout: 'Pago',
        noSelections: 'Carrito vacío',
        noOpenBets: 'Sin apuestas abiertas',
        noSettledBets: 'Sin apuestas liquidadas',
    },

    /** Resumen fijo en mobile */
    summary: {
        odds: 'CUOTA',
        stake: 'APUESTA',
        potentialWin: 'GANANCIA POT.',
    },

    /** Panel de configuración */
    settings: {
        title: 'Configuración',
        oddsChange: 'Cambios de cuotas',
        showMoreOptions: 'Mostrar más opciones',
        oddsFormat: 'Formato de cuotas',
        quickBuyAmountConfiguration: 'Configuración de montos de compra rápida',
        amountConfigHints: {
            quickBuy: 'Añadir monto al boleto',
        },
        oddsPolicy: {
            acceptAll: 'Aceptar todos los cambios de cuotas automáticamente',
            acceptHigher: 'Solo aceptar cuotas mejores',
            acceptNone: 'No aceptar cambios de cuotas',
            hints: {
                acceptAll:
                    'Acepta automáticamente cualquier cambio en las cuotas (al alza o a la baja) para confirmar la apuesta lo más rápido posible.',
                acceptHigher:
                    'El sistema procederá automáticamente si las cuotas mejoran. Si bajan, se te pedirá confirmar antes de realizar la apuesta.',
                acceptNone:
                    'Control total: deberás reconfirmar manualmente tu apuesta ante cualquier cambio de cuotas.',
            },
        },
        format: {
            decimal: 'Decimal',
            american: 'Americano',
            fractional: 'Fraccionario',
        },
    },

    guide: {
        quickBuy: {
            tooltip: 'Configura tus montos favoritos aquí para aplicarlos a todos los boletos a la vez.',
            cta: 'Configurar Predeterminados',
        },
        betOnAll: {
            tooltip: '¡Toca para sumar! Personaliza estos botones para añadir tus montos preferidos rápidamente.',
            cta: 'Personalizar',
        },
    },

    /** Progreso de boost de combinada */
    parlayBoost: {
        unlock: {
            prefix: 'Añade',
            middle: ' {count, plural, one {selección} other {selecciones}} más para desbloquear',
            suffix: 'de boost!',
        },
        nextTier: {
            prefix: 'Añade',
            middle: ' {count, plural, one {selección} other {selecciones}} más para desbloquear',
            suffix: 'de boost!',
        },
        maxTier: {
            prefix: 'Boost máximo',
            suffix: 'desbloqueado!',
        },
        minOdds: 'Cuota mín.: {odds}',
        rules: 'Una combinada de {minLegs}-{maxLegs} selecciones, todas elegibles y ganadoras, desbloquea boost extra. Cada selección debe tener cuota mínima de {minOdds}.',
        payoutCapTooltip: 'Pago extra máximo: {cap}',
        payoutCapSheetClose: 'Cerrar',
    },

    /** Mensajes */
    message: {
        insufficientBalance: 'Saldo insuficiente para esta apuesta',
        bettingUnavailable: 'Las apuestas no están disponibles temporalmente. Inténtalo de nuevo más tarde.',
        waitOrderComplete: 'Espera a que se complete la orden actual.',
        invalidStake: 'Ingresa un monto de apuesta válido.',
        orderPlacedSuccessfully: 'Orden realizada con éxito',
        orderRejected: 'Orden rechazada',
        minParlaySelections: 'Selecciona al menos 2 resultados para una combinada.',
        gotoSetting: 'Ir a Configuración',
    },

    toast: {
        removed_single: 'Eliminado: {part}',
        removed_two: 'Eliminado: {part1} y {part2}',
        removed_three: 'Eliminado: {part1}, {part2} y {part3}',
        conflicts_plural: '{count, plural, one {{count} conflicto} other {{count} conflictos}}',
        locked_plural: '{count, plural, one {{count} bloqueado} other {{count} bloqueados}}',
        invalid_plural: '{count, plural, one {{count} inválido} other {{count} inválidos}}',
        inactive_plural: '{count, plural, one {{count} inactivo} other {{count} inactivos}}',
        non_compliant_plural: '{count, plural, one {{count} no válido} other {{count} no válidos}}',
        tooManySelectionsWarning: 'Demasiadas apuestas a la vez pueden ser rechazadas',
        maxSelectionsReached: 'Máximo de {count} selecciones alcanzado',
    },

    /** Ticket */
    ticket: {
        single: 'Simple',
        accumulator: 'Acumulada de {count}',
        settledProgress: '{settled}/{total} liquidadas',
        showMore: 'Ver {count} más',
        showLess: 'Ver menos',
        settleTime: 'Liquidación:',
        stake: 'Apuesta',
        payout: 'Pago',
        maxPayout: 'Pago máx.',
        status: {
            won: 'Ganada',
            lost: 'Perdida',
            halfWon: 'Media Ganada',
            halfLost: 'Media Perdida',
            pending: 'Pendiente',
            crediting: 'Acreditando...',
            void: 'Anulada',
        },
    },
};
