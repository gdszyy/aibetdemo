export default {
    hero: {
        // title: 'Pase Mundial FIFA 2026™',
        subtitlePrefix: 'Recompensas y bonos exclusivos, Gana hasta',
        subtitleAmount: '{amount}',
    },
    level: {
        current: 'Actual',
        weeklyLimit: 'Límite semanal',
        weeklyLimitRemoved: 'Desde {time}, se eliminará el límite semanal de EXP',
    },
    progress: {
        title: 'Ruta de recompensas',
        claimAll: 'Recoger todo',
        rewards: 'Recompensas',
        freePass: 'Pase gratuito',
        premiumPass: 'Pase premium',
        backToCurrentLevel: 'Volver al nivel actual',
    },
    claimSuccess: {
        title: '¡Recompensas Reclamadas!',
        description: 'Agregado con éxito a tu billetera',
        levelReward: 'Recompensa NV{level}',
        rewardValue: '{amount} {type}{count, plural, =1 {} other { x{count}}}',
        confirm: 'CONFIRMAR',
    },
    eventEnded: {
        title: 'EVENTO FINALIZADO',
        description: 'Lo sentimos, este evento ya ha concluido. ¡Mantente al tanto de nuestra próxima gran promoción!',
        confirm: 'OK, ENTENDIDO',
    },
    eventNotStarted: {
        title: 'Campaña no disponible',
        description:
            'Esta campaña no está disponible por el momento. Explora nuestras otras promociones para encontrar la oferta ideal para ti.',
        confirm: 'OK, ENTENDIDO',
    },
    unlock: {
        title: 'Actualizar a Premium',
        description: 'Desbloquea bonos exclusivos, mayores límites y recompensas avanzadas',
        unlockFor: 'Desbloquea ahora por',
        unlockPremium: 'Desbloquear Premium',
        modalDescription:
            'Desbloquea <highlight>el Pase Premium</highlight> y empieza a reclamar recompensas exclusivas de inmediato.',
        currentBalance: 'Saldo actual',
        payNow: 'PAGAR {amount} AHORA',
        processingPayment: 'Procesando pago...',
        successTitle: '¡Compra exitosa!',
        successDescription: '¡Felicidades! Has desbloqueado <highlight>el Pase Premium</highlight> con éxito.',
        startClaimingRewards: 'Comenzar a recoger recompensas',
        insufficientBalancePrompt: '¿SALDO INSUFICIENTE?',
        depositHere: 'DEPOSITAR AQUÍ',
        insufficientBalanceHint: '¿Saldo insuficiente? Haz clic para depositar',
        insufficientBalanceTitle: 'Saldo insuficiente',
        depositToUnlock: 'Depositar y desbloquear',
    },
    missions: {
        title: 'Tareas del evento',
        dailyTitle: 'Tareas diarias',
        weeklyTitle: 'Tareas semanales',
        fallbackDailyTitle: 'Tarea diaria #{missionType}',
        fallbackWeeklyTitle: 'Tarea semanal #{missionType}',
        fallbackCondition: 'Condición: {condition}',
        units: {
            bets: 'apuestas',
            times: 'veces',
            days: 'días',
        },
        daily: {
            completeSportsBet: {
                title: 'Completar 1 apuesta deportiva',
                description: 'Apuesta única ≥ {amount}',
            },
            sportsTurnover: {
                title: 'Volumen válido diario',
                description: 'Volumen diario ≥ {amount}',
            },
            highTurnoverBonus: {
                title: 'Tarea de alto volumen diario',
                description: 'Volumen diario ≥ {amount}',
            },
            login: {
                title: 'Misión de inicio diario',
                description: 'Inicio de sesión diario',
            },
            betsTarget: {
                title: 'Número de apuestas diarias',
                description: '≥ {count} apuestas deportivas',
            },
            depositTarget: {
                title: 'Tarea de depósito diario',
                description: 'Depósito diario ≥ {amount}',
            },
        },
        weekly: {
            turnover: {
                title: 'Volumen semanal',
                description: 'Volumen semanal ≥ {amount}',
            },
            betsTarget: {
                title: 'Número de apuestas',
                description: '≥ {count} apuestas deportivas',
            },
            consecutiveDailyTasks: {
                title: 'Completar tareas diarias consecutivas',
                description: 'Completar todas las tareas ≥ {count} días',
            },
            consecutiveBettingDays: {
                title: 'Días consecutivos de apuesta',
                description:
                    'Apuesta durante al menos {days} días consecutivos con un volumen diario mínimo de {amount}',
            },
            consecutiveLogins: {
                title: 'Inicio de sesión consecutivo',
                description: 'Inicio de sesión ≥ {count} días',
            },
            depositTarget1: {
                title: 'Meta de depósito I',
                description: 'Depósito semanal ≥ {amount}',
            },
            depositTarget2: {
                title: 'Meta de depósito II',
                description: 'Depósito semanal ≥ {amount}',
            },
        },
    },
    rules: {
        title: 'Reglas de la promoción',
        sections: {
            guidelines: {
                title: 'Normas de la promoción',
                item1: 'Al adquirir el Pase Premium, desbloqueas la ruta de recompensas premium. Completa tareas para ganar EXP, subir el nivel del pase y desbloquear recompensas en cada nivel.',
                item2: 'EXP necesario por nivel: 200 EXP',
                item3: 'EXP total necesario para el nivel máximo (nivel 50): 10,000 EXP',
                item4: 'Límite semanal de EXP: 2,000 EXP',
                item5: 'A partir de la semana 5 de la promoción, se eliminará el límite semanal de EXP.',
                // item6: 'Después de alcanzar el nivel máximo, los usuarios del Pase Premium reciben {amount} por cada nivel adicional, hasta el nivel 100.',
                // item7: 'El Pase Premium cuesta {amount} y puede adquirirse mediante depósito o saldo de la cuenta.',
                item8: 'Esta promoción es válida solo para usuarios con al menos 1 apuesta registrada previamente.',
                item9: 'Las tareas se contabilizan automáticamente desde el inicio de la promoción. Las apuestas irregulares resultarán en la descalificación de la participación.',
            },
            rewardDetails: {
                title: 'Descripción de recompensas',
                item1: 'La apuesta gratis deportiva solo es válida para apuestas deportivas, utilizable una sola vez, con validez de 7 días y no es retirable directamente. Las cuotas deben estar entre ≥1,60 y ≤2,50. Solo las apuestas liquidadas cuentan para el rollover; las no liquidadas no cuentan. Solo se consideran apuestas con dinero real; las apuestas gratis no cuentan.',
                item2: 'Los giros gratis solo son válidos para juegos seleccionados. El valor apostado con giros gratis no cuenta para el rollover, es utilizable una vez, con validez de 7 días y no es retirable directamente.',
                item3: 'Los bonos recibidos requieren 5x de rollover para retiro, son válidos solo para apuestas deportivas y expiran en 7 días.',
                item4: 'Todas las recompensas deben reclamarse manualmente en la página de la promoción. Las no reclamadas serán retiradas al finalizar. Verifica tu lista antes del cierre.',
            },
            importantTerms: {
                title: 'Términos importantes',
                item1: 'Cada {identityDocument}, cuenta, dispositivo, IP, cuenta bancaria y correo electrónico solo puede participar una vez.',
                item2: 'Los bonos son personales e intransferibles. GOTO.BET monitorea continuamente la actividad. Juega responsablemente.',
                item3: 'Mantén un comportamiento adecuado. GOTO.BET revisará actividades sospechosas según políticas AML y antifraude.',
                item4: 'Al participar, aceptas los Términos y Condiciones y la Política de Privacidad. Las infracciones pueden resultar en cancelación de bonos y bloqueo de cuenta.',
                item5: 'Al alcanzar el número preestablecido de participantes en la plataforma, se activará automáticamente la recompensa máxima.',
                item6: 'Ante cualquier conducta irregular destinada a un arbitraje malicioso o explotación indebida, la plataforma se reserva el derecho de revisar y ajustar la actividad, revocar las recompensas ya otorgadas y tomar medidas serias contra las infracciones, según las circunstancias reales.',
                item7: 'La plataforma se reserva el derecho de interpretar, modificar o finalizar la promoción en cualquier momento.',
            },
            safetyStatement: {
                title: 'Aviso de seguridad',
                item1: 'Prohibido para menores de 18 años.',
                item2: 'El juego puede causar adicción. Juega responsablemente.',
                item3: 'No se garantiza ganancia.',
            },
        },
    },
    rewardCard: {
        claimed: 'Reclamado',
        claimable: 'Disponible',
        locked: 'Bloqueado',
        gear: 'Recompensa',
        premiumGear: 'Recompensa premium',
        rewardTypes: {
            cash: 'EFECTIVO',
            sportBonus: 'BONO DEPORTIVO',
            freeSport: 'APUESTA GRATIS',
            casinoBonus: 'BONO CASINO',
            freeSpin: 'GIRO GRATIS',
        },
    },
};
