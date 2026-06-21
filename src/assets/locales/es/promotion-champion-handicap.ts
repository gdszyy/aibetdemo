export default {
    common: {
        brazil: 'Brasil',
        mexico: 'México',
    },
    metadata: {
        title: 'Handicap de Campeón',
        description:
            'Únete a la promoción del Mundial y corona tu pasión\nSi {teamName} gana el campeonato, reembolsaremos un porcentaje de su pérdida neta durante el torneo.',
    },
    hero: {
        badge: 'Handicap de Campeón',
        title: 'Si {teamName} gana, cubrimos tus pérdidas',
        exclusive: 'Exclusivo de la Copa Mundial FIFA 2026',
        planName: 'Plan de Garantía del Campeón · Reembolso Milagro de {teamName}',
        maximumPayout: 'Pago Máximo',
        amount: '{maximumPayout}',
        currency: '{currency}',
        subtitle: 'Apoya a {teamName} en la Copa Mundial de la FIFA 2026 y activa tu protección milagrosa.',
        description:
            'Únete a la promoción del Mundial y corona tu pasión\nSi {teamName} gana el campeonato, reembolsaremos un porcentaje de su pérdida neta durante el torneo.',
        validityLabel: 'Período de la promoción',
    },
    cta: {
        joinNow: 'Únete ahora',
        deposit: 'Depositar',
        viewSports: 'Ir a Deportes',
        goToBet: 'Ir a apostar',
        joined: 'Ya participaste',
        loginToJoin: 'Inicia sesión para unirte',
    },
    rewards: {
        title: 'Recompensas',
        subtitle: 'La compensación por pérdidas se emite como bono deportivo después de la liquidación.',
        compensation: {
            title: 'Compensación por pérdidas',
            value: 'Bono de cashback',
            description:
                'Las pérdidas netas elegibles se convierten en bono de acuerdo con las reglas de la promoción.',
        },
        minimumLoss: {
            title: 'Pérdida neta mínima',
            value: '{minimumNetLoss} {currency}',
            description: 'Pérdida neta < {minimumNetLoss} {currency} no es elegible para reembolso.',
        },
        wagering: {
            title: 'Requisito de apuesta',
            value: '10x',
            description: 'Los bonos emitidos deben cumplir un requisito de apuesta de 10x antes del retiro.',
        },
    },
    calculation: {
        title: 'Sistema de cálculo justo y transparente',
        claimRecords: {
            title: 'Historial de reclamación',
            netLossRange: 'Rango de pérdida neta',
            cashbackRate: 'Porcentaje de reembolso',
            rows: {
                loss0_1000: { range: '0 – 1,000', rate: '60%' },
                loss1001_5000: { range: '1,001 – 5,000', rate: '50%', rateTooltip: 'Solo sobre el excedente' },
                loss5001_20000: { range: '5,001 – 20,000', rate: '40%', rateTooltip: 'Solo sobre el excedente' },
                loss20001Plus: {
                    range: '> 20,000',
                    rate: '30%',
                    rateTooltip: 'Límite: {maximumPayout} {currency} · solo excedente',
                },
            },
        },
        oddsWeighting: {
            title: 'Regla de ponderación de cuotas',
            oddsRange: 'Rango de cuotas',
            contributionRate: 'Tasa de contribución',
            rows: {
                under1_2: { range: '≤ 1.2', rate: '0%' },
                r1_2_1_5: { range: '1.2 – 1.5 (=1.5)', rate: '10%' },
                r1_5_2_5: { range: '1.5 – 2.5 (=2.5)', rate: '30%' },
                r2_5Plus: { range: '> 2.5', rate: '50%' },
            },
        },
    },
    steps: {
        title: '¿Cómo obtener el reembolso?',
        subtitle: 'Solo 3 pasos para asegurar tu protección milagro',
        signUp: {
            title: 'Registrarse',
            description:
                'Haz clic en "Únete ahora" para activar tu garantía de campeón. Solo las apuestas después del registro serán elegibles.',
        },
        bet: {
            title: 'Apostar en el Mundial',
            description: 'Realiza apuestas con dinero real durante el Mundial 2026 y disfruta cada partido',
        },
        cashback: {
            title: 'Activar reembolso milagro',
            description:
                'Si {teamName} gana, el sistema calculará automáticamente su pérdida neta y la devolverá como bono proporcional.',
        },
    },
    terms: {
        title: 'Términos',
        termsAndConditions: {
            title: 'Términos y condiciones',
            registration: {
                title: 'Es necesario registrarse para participar.',
                description: 'Haz clic en "Únete ahora". Solo las apuestas posteriores al registro serán consideradas.',
            },
            matches: {
                title: 'Solo válido para partidos oficiales del Mundial 2026.',
                description: 'Solo se consideran apuestas liquidadas durante el período.',
            },
            settlement: {
                title: 'Tras la final, si {teamName} gana, el sistema calculará automáticamente.',
                description:
                    'Después de la final de la Copa Mundial de la FIFA 2026, si {teamName} gana el campeonato, el sistema calculará automáticamente tus pérdidas netas. Si hay retrasos o cancelaciones de partidos, la liquidación se ajustará según corresponda.',
            },
            eligibleBets: {
                title: 'Criterios de apuestas válidas.',
                description:
                    'Solo se consideran apuestas con dinero real realizadas y liquidadas durante el período en el Mundial. No se incluyen apuestas canceladas, anuladas, reembolsadas o inválidas, ni apuestas gratuitas, con bono o cupones. Las apuestas con retiro anticipado (Cash Out) se calcularán según el pago real.',
            },
            netLoss: {
                title: 'Regla de cálculo de pérdida neta.',
                description:
                    'Pérdida neta ≤ {minimumNetLoss} {currency} no es elegible para reembolso. La pérdida neta se calculará según el monto ajustado por ponderación de cuotas.',
            },
            minimumBets: {
                title: 'El usuario debe tener al menos 1 apuesta relacionada con {teamName}.',
            },
        },
        rewardTerms: {
            title: 'Términos de recompensa',
            compensation: {
                title: 'Forma de compensación',
                description: 'La recompensa se otorgará en forma de bono de compensación de pérdidas.',
            },
            deadline: {
                title: 'Fecha límite de entrega de recompensas',
                description: 'El bono será acreditado hasta las {deadline}.',
            },
            wagering: {
                title: 'Requisito de apuesta',
                description:
                    'El bono debe cumplir 10x de apuesta antes del retiro.\nPérdida neta ≥ {minimumNetLoss} {currency} para elegibilidad.\nSi la pérdida neta es < {minimumNetLoss} {currency}, tampoco se otorgará devolución.',
            },
            odds: {
                title: 'Requisito de cuota para apuestas con bono',
                description: 'Las apuestas con bono deben tener cuota mínima de 1.6',
            },
            hedging: {
                title: 'Prohibido cobertura',
                description: 'El bono no puede usarse para cobertura en el mismo mercado',
            },
            validity: {
                title: 'Uso y validez',
                description: 'El bono es válido solo para apuestas deportivas y debe usarse en 14 días',
            },
            cap: {
                title: 'Reglas de reclamación y límite',
                description:
                    'El bono debe reclamarse en esta página. El monto máximo no puede exceder el 30% del total depositado.',
            },
            platformLimit: {
                title: 'Límites de pago de la plataforma',
                description:
                    'Límite total de pago de la plataforma: {platformTotalPayout} {currency}\nLímite máximo por usuario: {maximumPayout} {currency}',
            },
            betRestriction: {
                title: 'Restricción de tipo de apuesta',
                description:
                    'Solo participan en esta promoción las apuestas simples y dobles (2 en 1). Las apuestas en el mercado de campeón no participan en esta actividad.',
            },
            oddsAbuse: {
                title: 'Apuestas anormales',
                description:
                    'La plataforma se reserva el derecho de reducir la proporción de devolución en apuestas con cuotas anormalmente bajas, y de reevaluar la pérdida efectiva y la elegibilidad final de la recompensa ante apuestas irregulares, arbitraje, coberturas de bajo riesgo o cualquier comportamiento de juego no natural.',
            },
        },
        importantTerms: {
            title: 'Cláusulas importantes',
            eligibility: {
                title: 'Limitación de elegibilidad',
                description:
                    'Cada CPF, cuenta, dispositivo, IP, cuenta bancaria y correo electrónico puede participar solo una vez.',
            },
            personalUse: {
                title: 'Uso personal únicamente',
                description:
                    'El bono es solo para uso personal y no puede transferirse, regalarse o revenderse.\nGOTOBET se reserva el derecho de monitorear todas las actividades de apuestas. Participe responsablemente.',
            },
            compliance: {
                title: 'Juego justo y cumplimiento',
                description:
                    'Todas las apuestas deben cumplir con estándares de juego justo. GOTOBET revisará actividades sospechosas según políticas AML y antifraude.',
            },
            acceptance: {
                title: 'Aceptación de términos',
                description:
                    'Participar implica aceptar los términos y la política de privacidad. Las violaciones pueden resultar en cancelación del bono y bloqueo de la cuenta.',
            },
            maximumPrize: {
                title: 'Activación del premio máximo',
                description:
                    'Cuando se alcance el número requerido de participantes, el nivel máximo se activará automáticamente.',
            },
            abuse: {
                title: 'Abuso y arbitraje',
                description:
                    'Fraude o abuso de bonos puede resultar en revisión, ajuste, cancelación y sanciones adicionales.',
            },
            finalRights: {
                title: 'Derecho final y modificaciones',
                description:
                    'GOTOBET se reserva el derecho final de interpretación. Puede modificar, suspender o finalizar la promoción sin previo aviso.',
            },
        },
        safetyNotice: {
            title: 'Aviso de seguridad',
            item0: 'Prohibido menores de 18 años',
            item1: 'El juego puede ser adictivo, juegue responsablemente',
            item2: 'No garantiza ganancias',
            item3: 'Toda apuesta implica riesgo. Para ayuda, contacte soporte',
        },
    },
};
