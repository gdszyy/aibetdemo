/** Geral */
export default {
    /** Mensagens gerais */
    message: {
        networkError: 'Erro de rede, tente novamente',
        networkSignalWeakTitle: 'Sinal fraco',
        networkSignalWeakDesc:
            'Sinal fraco atual, pode afetar operações como colocar apuestas, por favor, verifique sua rede e tente novamente.',
        coming: 'Em breve 🚀',
        TBC: 'Em breve.',
        success: 'Sucesso',
        error: 'Erro',
        copySuccess: 'Copiado com sucesso',
        copyFailed: 'Erro ao copiar',
        /** 空数据默认文案 */
        emptyDesc: 'Nenhuma informação disponível',
    },

    /** Ações */
    action: {
        all_delete: 'Excluir tudo',
        all_read: 'Marcar tudo lido',
        close: 'Fechar',
        viewAll: 'ver tudo',
        all: 'Todos',
        search: 'Buscar',
    },

    /** Diálogo */
    dialog: {
        confirmBtnText: 'Confirmar',
        cancelBtnText: 'Cancelar',
        ariaTitle: 'Diálogo',
        ariaDescription: 'Conteúdo do diálogo.',
    },

    /** Menu principal */
    mainMenu: {
        home: 'Início',
        sport: 'Esportes',
        live: 'Ao vivo',
        casino: 'Cassino',
        betSlip: 'Apostas',
        profile: 'Perfil',
        transmision: 'TV ao vivo',
        myBets: 'Minhas Apostas',
    },

    /** Navegação */
    navigation: {
        home: 'Início',
        back: 'Voltar',
        menuTitle: 'Menu de navegação',
        menuDescription: 'Navegue pelas seções e abra a barra lateral de partidas.',
    },

    /** Estado da lista */
    list: {
        loading: 'Carregando...',
        loadMore: 'Deslize para carregar mais',
    },

    /** Metadados (títulos de página) */
    metadata: {
        matchDetail: 'Detalhe da Partida',
        tournament: 'Torneio',
    },

    /** Nível de página */
    page: {
        notFound: 'Não encontrado.',
        somethingWentWrong: 'Algo deu errado',
        tryAgain: 'Tentar novamente',
    },

    /** Modal de idioma */
    languageModal: {
        title: 'Idioma',
        search: 'Pesquisar',
        selectedLabel: 'Idioma selecionado:',
    },

    /** Parlay boost badge labels (recommend card, bet history, bet slip ticket). */
    parlayBoostBadge: {
        boost: 'BOOST MÚLTIPLA',
    },
    recommendCardBadge: {
        superOdd: 'SUPERODD',
    },

    /** Parlay boost rules modal */
    parlayBoostModal: {
        sheetTitle: 'Regras da atividade e pagamento',
        close: 'Fechar',
        detailError: 'Falha ao carregar os detalhes do Boost de Múltipla. Tente novamente.',
        hero: {
            status: 'Ativo',
            title: 'Fase de Grupos da Copa do Mundo - Boost de Múltipla',
            period: '01/06/2026 - 30/06/2026',
            currentBoost: 'Boost atual',
        },
        howItWorks: {
            title: 'Como funciona',
            subtitle: 'Múltipla 3-6 · todas as seleções devem vencer',
            subtitleDynamic: 'Múltipla {minLegs}-{maxLegs} · todas as seleções devem vencer',
            tierLegs: '{legs} seleções',
            yourHit: 'Seu nível',
            noteTitle: 'Seleção do nível',
            note: ' - o nível é definido pelas seleções elegíveis dentro da atividade. Seleções fora do escopo não contam.',
            noteDynamic:
                ' - seleções fora do escopo: {excludedLegs}/{totalLegs}. O nível de {countedLegs} seleções será aplicado.',
            noteNoTier:
                ' - adicione mais seleções elegíveis para liberar um nível de boost. Cada seleção deve cumprir a odd mínima e o escopo da atividade.',
            activityNote:
                ' - o nível é definido pelas seleções elegíveis dentro da atividade. Todas as seleções elegíveis devem vencer para liberar o boost.',
            tiers: {
                three: {
                    legs: '3 seleções',
                    boost: '+10%',
                },
                four: {
                    legs: '4 seleções',
                    boost: '+15%',
                },
                five: {
                    legs: '5 seleções',
                    boost: '+25%',
                },
                six: {
                    legs: '6 seleções',
                    boost: '+50%',
                },
            },
        },
        scope: {
            title: 'Escopo aplicável',
            subtitle: 'Esportes - ligas - período da atividade',
            eligible: 'Elegível',
            ineligible: 'Não elegível',
            sportId: 'Esporte {sportId}',
            categoryId: 'Categoria {categoryId}',
            tournamentId: 'Torneio {tournamentId}',
            eventId: 'Evento {eventId}',
            all: 'Todos',
        },
        markets: {
            title: 'Mercados incluídos no boost',
            subtitle: 'condições por seleção',
            rows: {
                threeLegs: {
                    label: '3 seleções',
                    value: '+10%',
                },
                marketTypes: {
                    label: 'Tipos de mercado',
                    value: '1x2/Handicap/Mais-Menos',
                },
                minOdds: {
                    label: 'Odd mínima por seleção',
                    value: '≥ 1.60',
                    dynamicValue: '≥ {odds}',
                },
                activityPeriod: {
                    label: 'Período da atividade',
                    value: 'Dentro do período da atividade',
                },
                cap: {
                    label: 'Limite por aposta',
                },
                excluded: {
                    label: 'Excluídos',
                    valueBase: 'Campeão/Futuros',
                    inPlay: 'Ao vivo',
                    preMatch: 'Pré-jogo',
                },
            },
            noCap: 'Sem limite',
        },
        contribution: {
            title: 'Contribuição da sua aposta',
            subtitleDynamic: '{totalLegs} seleções - {countedLegs} contabilizadas',
            countedLegs: 'Seleções contabilizadas',
        },
        calculation: {
            title: 'Como o pagamento do boost é calculado',
            subtitle: 'Múltipla 3-6 · todas as seleções devem vencer',
            rows: {
                basePayout: {
                    label: 'Pagamento base',
                    dynamicValue: 'aposta × odds totais = {stake} × {totalOdds} = {basePayout}',
                },
                hitTier: {
                    label: 'Nível atingido',
                    dynamicValue: '{legs} seleções · {boost} ({multiplier})',
                    locked: 'Ainda não liberado',
                },
                boostAmount: {
                    label: 'Valor do boost',
                    dynamicValue: 'base × {boostPercent} = {basePayout} × {boostRate} = {boostAmount}',
                    empty: 'Sem boost até liberar um nível',
                },
                cap: {
                    label: 'Limite por aposta',
                    notTruncated: 'Boost {boostAmount} ≤ limite {cap} · sem corte',
                    truncated: 'Boost {rawBoost} excede o limite {cap} · ajustado para {boostAmount}',
                    noCap: 'Boost {boostAmount} · sem limite',
                },
            },
            final: {
                label: 'Pagamento final',
                dynamicPrefix: '{basePayout} + {boostAmount} =',
            },
            noteTitle: 'Observação',
            note: ' - o boost é adicionado apenas aos ganhos; sua aposta permanece inalterada. Se alguma seleção for anulada na liquidação, as seleções elegíveis restantes podem mover a aposta para um nível menor. O nível final é confirmado na liquidação.',
        },
    },

    /** Rótulos de data relativa */
    date: {
        today: 'Hoje',
        tomorrow: 'Amanhã',
        dateRange: 'Intervalo de datas',
        dateRangePlaceholder: 'Selecionar intervalo de datas',
        previousMonth: 'Mês anterior',
        nextMonth: 'Próximo mês',
        previousYear: 'Ano anterior',
        nextYear: 'Próximo ano',
    },

    /** Barra lateral */
    sidebar: {
        topSports: 'Esportes em destaque',
        allSports: 'Todos os esportes (A-Z)',
        top: 'Top',
        az: '(A-Z)',
        lobby: 'Lobby',
        promotions: 'Promoções',
        vip: 'VIP',
        favorite: 'Favoritos',
        hotTournament: 'Ligas Populares',
    },

    /** Rodapé */
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
            sports: 'Esportes',
            casino: 'Cassino',
            legal: 'Legal',
            support: 'Suporte',
        },
        links: {
            liveSports: 'Esportes ao vivo',
            sportHome: 'Início de esportes',
            sportsRules: 'Regras de esportes',
            casinoHome: 'Início do cassino',
            slots: 'Slots',
            promotions: 'Promoções',
            termsOfService: 'Termos de serviço',
            privacyPolicy: 'Política de privacidade',
            amlKycPolicy: 'Política AML / KYC',
            responsibleGaming: 'Jogo responsável',
            faq: 'FAQ',
            contactUs: 'Fale conosco',
            depositWithdrawal: 'Depósito e saque',
        },
    },

    /** Promoções */
    promotions: {
        title: 'Promoções',
    },
};
