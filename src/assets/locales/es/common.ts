/** General */
export default {
    /** Mensajes generales */
    message: {
        networkError: 'Error de red, intenta de nuevo',
        networkSignalWeakTitle: 'Señal débil',
        networkSignalWeakDesc:
            'Señal débil actual, puede afectar operaciones como poner apuestas. Por favor, comprueba tu red e intenta de nuevo.',
        coming: 'Próximamente 🚀',
        TBC: 'Próximamente.',
        success: 'Éxito',
        error: 'Error',
        copySuccess: 'Copiado con éxito',
        copyFailed: 'Error al copiar',
        /** 空数据默认文案 */
        emptyDesc: 'No hay información disponible',
    },

    /** Acciones */
    action: {
        all_delete: 'Eliminar todo',
        all_read: 'Marcar todo leído',
        close: 'Cerrar',
        viewAll: 'Ver todos',
        all: 'Todos',
        search: 'Buscar',
    },

    /** Diálogo */
    dialog: {
        confirmBtnText: 'Confirmar',
        cancelBtnText: 'Cancelar',
        ariaTitle: 'Diálogo',
        ariaDescription: 'Contenido del diálogo.',
    },

    /** Menú principal */
    mainMenu: {
        home: 'Inicio',
        sport: 'Deportes',
        live: 'En vivo',
        casino: 'Casino',
        betSlip: 'Apuestas',
        profile: 'Perfil',
        transmision: 'Transmisión',
        myBets: 'Mis Apuestas',
    },

    /** Navegación */
    navigation: {
        home: 'Inicio',
        back: 'Volver',
        menuTitle: 'Menú de navegación',
        menuDescription: 'Navega por secciones y abre la barra lateral de partidos.',
    },

    /** Estado de lista */
    list: {
        loading: 'Cargando...',
        loadMore: 'Desliza para cargar más',
    },

    /** Metadatos (títulos de página) */
    metadata: {
        matchDetail: 'Detalle del Partido',
        tournament: 'Torneo',
    },

    /** Nivel de página */
    page: {
        notFound: 'No encontrado.',
        somethingWentWrong: 'Algo salió mal',
        tryAgain: 'Reintentar',
    },

    /** Modal de idioma */
    languageModal: {
        title: 'Idioma',
        search: 'Buscar',
        selectedLabel: 'Idioma seleccionado:',
    },

    /** Parlay boost badge labels (recommend card, bet history, bet slip ticket). */
    parlayBoostBadge: {
        boost: 'BOOST COMBO',
    },
    recommendCardBadge: {
        superOdd: 'SUPERODD',
    },

    /** Parlay boost rules modal */
    parlayBoostModal: {
        sheetTitle: 'Reglas de la actividad y pago',
        close: 'Cerrar',
        detailError: 'No se pudieron cargar los detalles del Boost Combo. Inténtalo de nuevo.',
        hero: {
            status: 'Activa',
            title: 'Fase de grupos de la Copa del Mundo - Boost Combo',
            period: '01/06/2026 - 30/06/2026',
            currentBoost: 'Boost actual',
        },
        howItWorks: {
            title: 'Cómo funciona',
            subtitle: 'Combinada 3-6 · todas las selecciones deben ganar',
            subtitleDynamic: 'Combinada {minLegs}-{maxLegs} · todas las selecciones deben ganar',
            tierLegs: '{legs} selecciones',
            yourHit: 'Tu nivel',
            noteTitle: 'Selección de nivel',
            note: ' - el nivel se define por las selecciones elegibles dentro de la actividad. Las selecciones fuera de alcance no cuentan.',
            noteDynamic:
                ' - selecciones fuera de alcance: {excludedLegs}/{totalLegs}. Se aplica el nivel de {countedLegs} selecciones.',
            noteNoTier:
                ' - añade más selecciones elegibles para desbloquear un nivel de boost. Cada selección debe cumplir la cuota mínima y el alcance de la actividad.',
            activityNote:
                ' - el nivel se define por las selecciones elegibles dentro de la actividad. Todas las selecciones elegibles deben ganar para desbloquear el boost.',
            tiers: {
                three: {
                    legs: '3 selecciones',
                    boost: '+10%',
                },
                four: {
                    legs: '4 selecciones',
                    boost: '+15%',
                },
                five: {
                    legs: '5 selecciones',
                    boost: '+25%',
                },
                six: {
                    legs: '6 selecciones',
                    boost: '+50%',
                },
            },
        },
        scope: {
            title: 'Alcance aplicable',
            subtitle: 'Deportes - ligas - período de la actividad',
            eligible: 'Elegible',
            ineligible: 'No elegible',
            sportId: 'Deporte {sportId}',
            categoryId: 'Categoría {categoryId}',
            tournamentId: 'Torneo {tournamentId}',
            eventId: 'Evento {eventId}',
            all: 'Todos',
        },
        markets: {
            title: 'Mercados incluidos en el boost',
            subtitle: 'condiciones por selección',
            rows: {
                threeLegs: {
                    label: '3 selecciones',
                    value: '+10%',
                },
                marketTypes: {
                    label: 'Tipos de mercado',
                    value: '1x2/Hándicap/Más-Menos',
                },
                minOdds: {
                    label: 'Cuota mínima por selección',
                    value: '≥ 1.60',
                    dynamicValue: '≥ {odds}',
                },
                activityPeriod: {
                    label: 'Período de la actividad',
                    value: 'Dentro del período de la actividad',
                },
                cap: {
                    label: 'Límite por apuesta',
                },
                excluded: {
                    label: 'Excluidos',
                    valueBase: 'Ganador/Futuros',
                    inPlay: 'En vivo',
                    preMatch: 'Prepartido',
                },
            },
            noCap: 'Sin límite',
        },
        contribution: {
            title: 'Contribución de tu apuesta',
            subtitleDynamic: '{totalLegs} selecciones - {countedLegs} contabilizadas',
            countedLegs: 'Selecciones contabilizadas',
        },
        calculation: {
            title: 'Cómo se calcula el pago del boost',
            subtitle: 'Combinada 3-6 · todas las selecciones deben ganar',
            rows: {
                basePayout: {
                    label: 'Pago base',
                    dynamicValue: 'apuesta × cuotas totales = {stake} × {totalOdds} = {basePayout}',
                },
                hitTier: {
                    label: 'Nivel alcanzado',
                    dynamicValue: '{legs} selecciones · {boost} ({multiplier})',
                    locked: 'Aún no desbloqueado',
                },
                boostAmount: {
                    label: 'Monto del boost',
                    dynamicValue: 'base × {boostPercent} = {basePayout} × {boostRate} = {boostAmount}',
                    empty: 'Sin boost hasta desbloquear un nivel',
                },
                cap: {
                    label: 'Límite por apuesta',
                    notTruncated: 'Boost {boostAmount} ≤ límite {cap} · sin recorte',
                    truncated: 'Boost {rawBoost} supera el límite {cap} · ajustado a {boostAmount}',
                    noCap: 'Boost {boostAmount} · sin límite',
                },
            },
            final: {
                label: 'Pago final',
                dynamicPrefix: '{basePayout} + {boostAmount} =',
            },
            noteTitle: 'Nota',
            note: ' - el boost se añade solo a las ganancias; tu apuesta no cambia. Si alguna selección se anula al liquidar, las selecciones elegibles restantes pueden mover la apuesta a un nivel menor. El nivel final se confirma en la liquidación.',
        },
    },

    /** Etiquetas de fecha relativa */
    date: {
        today: 'Hoy',
        tomorrow: 'Mañana',
        dateRange: 'Rango de fechas',
        dateRangePlaceholder: 'Seleccionar rango de fechas',
        previousMonth: 'Mes anterior',
        nextMonth: 'Mes siguiente',
        previousYear: 'Año anterior',
        nextYear: 'Año siguiente',
    },

    /** Barra lateral */
    sidebar: {
        topSports: 'Deportes destacados',
        allSports: 'Todos los deportes (A-Z)',
        top: 'Top',
        az: '(A-Z)',
        lobby: 'Lobby',
        promotions: 'Promociones',
        vip: 'VIP',
        favorite: 'Favoritos',
        hotTournament: 'Ligas populares',
    },

    /** Pie de página */
    footer: {
        brand: '{appName}',
        licenseTitle1: 'Operator & Licensing',
        licenseText1:
            'This website is operated by SAFEPLAY TECHNOLOGY LTD, a company incorporated in Belize under registration number 000041280, with its registered address at Sea Urchin Street, San Pedro, Ambergris Caye, Belize (the "Company").\n' +
            'The Company is duly licensed and regulated in the State of Anjouan under the Computer Gaming Licensing Act 007 of 2005, holding License No. ALSI-152496042-F14, authorizing the provision of online gaming services.',
        licenseTitle2: 'Eligibility & Jurisdiction',
        licenseText2:
            'Access to and use of this website is restricted to individuals who are 18 years of age or older (or the legal age in their jurisdiction, if higher).\n' +
            'It is the responsibility of the user to ensure that participation in online gaming activities is lawful in their jurisdiction.\n' +
            'The Company does not accept players from jurisdictions where online gaming is prohibited or restricted by applicable law.\n' +
            'Responsible Gaming\n' +
            'The Company is committed to promoting responsible gaming and encourages users to play responsibly.\n' +
            'Gaming should be undertaken for entertainment purposes only and not as a means of generating income.\n' +
            'If you believe that you may have a gambling problem, please seek assistance from relevant support organizations.\n' +
            'Risk Disclosure\n' +
            'Participation in online gaming involves financial risk.\n' +
            'Players may lose funds, and outcomes are determined by chance and/or skill depending on the nature of the game.\n' +
            'No guarantees of winnings are provided.',
        columns: {
            sports: 'Deportes',
            casino: 'Casino',
            legal: 'Legal',
            support: 'Soporte',
        },
        links: {
            liveSports: 'Deportes en vivo',
            sportHome: 'Inicio de deportes',
            sportsRules: 'Reglas de deportes',
            casinoHome: 'Inicio de casino',
            slots: 'Tragamonedas',
            promotions: 'Promociones',
            termsOfService: 'Términos de servicio',
            privacyPolicy: 'Política de privacidad',
            amlKycPolicy: 'Política AML / KYC',
            responsibleGaming: 'Juego responsable',
            faq: 'Preguntas frecuentes',
            contactUs: 'Contáctanos',
            depositWithdrawal: 'Depósito y retiro',
        },
    },

    /** Promociones */
    promotions: {
        title: 'Promociones',
    },
};
