export default {
    common: {
        brazil: 'Brasil',
        mexico: 'México',
    },
    metadata: {
        title: 'Handicap de Campeão',
        description:
            'Participe da promoção da Copa do Mundo e leve sua paixão ao topo!\nSe o {teamName} for campeão, devolveremos uma porcentagem das suas perdas líquidas durante o torneio.',
    },
    hero: {
        badge: 'Handicap de Campeão',
        title: 'Se o {teamName} vencer, cobrimos suas perdas',
        exclusive: 'Exclusivo da Copa do Mundo FIFA 2026',
        planName: 'Plano de Proteção ao Campeão · Cashback Milagre {teamName}',
        maximumPayout: 'Pagamento Máximo',
        amount: '{maximumPayout}',
        currency: '{currency}',
        subtitle: 'Apoie o {teamName} na Copa do Mundo FIFA 2026 e ative sua proteção milagrosa.',
        description:
            'Participe da promoção da Copa do Mundo e leve sua paixão ao topo!\nSe o {teamName} for campeão, devolveremos uma porcentagem das suas perdas líquidas durante o torneio.',
        validityLabel: 'Período da promoção',
    },
    cta: {
        joinNow: 'Participar agora',
        deposit: 'Depositar',
        viewSports: 'Ir para Esportes',
        goToBet: 'Ir para apostar',
        joined: 'Já participou',
        loginToJoin: 'Entre para participar',
    },
    rewards: {
        title: 'Recompensas',
        subtitle: 'A compensação por perdas é emitida como bônus esportivo após a liquidação.',
        compensation: {
            title: 'Compensação por perdas',
            value: 'Bônus de cashback',
            description: 'As perdas líquidas elegíveis são convertidas em bônus de acordo com as regras da promoção.',
        },
        minimumLoss: {
            title: 'Perda líquida mínima',
            value: '{minimumNetLoss} {currency}',
            description: 'Perda líquida < {minimumNetLoss} {currency} não é elegível para cashback.',
        },
        wagering: {
            title: 'Requisito de aposta',
            value: '10x',
            description: 'Os bônus emitidos devem cumprir um requisito de rollover de 10x antes do saque.',
        },
    },
    calculation: {
        title: 'Sistema de cálculo justo e transparente',
        claimRecords: {
            title: 'Histórico de resgate',
            netLossRange: 'Faixa de perda líquida',
            cashbackRate: 'Percentual de cashback',
            rows: {
                loss0_1000: { range: '0 – 1.000', rate: '60%' },
                loss1001_5000: { range: '1.001 – 5.000', rate: '50%', rateTooltip: 'Apenas sobre o excedente' },
                loss5001_20000: { range: '5.001 – 20.000', rate: '40%', rateTooltip: 'Apenas sobre o excedente' },
                loss20001Plus: {
                    range: '> 20.000',
                    rate: '30%',
                    rateTooltip: 'Limite: {maximumPayout} {currency} · apenas excedente',
                },
            },
        },
        oddsWeighting: {
            title: 'Regra de ponderação de odds',
            oddsRange: 'Faixa de odds',
            contributionRate: 'Taxa de contribuição',
            rows: {
                under1_2: { range: '≤ 1.2', rate: '0%' },
                r1_2_1_5: { range: '1.2 – 1.5 (=1.5)', rate: '10%' },
                r1_5_2_5: { range: '1.5 – 2.5 (=2.5)', rate: '30%' },
                r2_5Plus: { range: '> 2.5', rate: '50%' },
            },
        },
    },
    steps: {
        title: 'Como obter o cashback?',
        subtitle: 'Apenas 3 passos para garantir sua proteção milagrosa',
        signUp: {
            title: 'Inscrever-se',
            description:
                'Clique em "Participar agora" para ativar sua garantia de campeão. Apenas apostas após o registro serão qualificadas',
        },
        bet: {
            title: 'Apostar na Copa do Mundo',
            description: 'Faça apostas com dinheiro real durante a Copa do Mundo FIFA 2026 e aproveite cada jogo',
        },
        cashback: {
            title: 'Ativar cashback milagre',
            description:
                'Se o {teamName} for campeão, o sistema calculará automaticamente suas perdas líquidas e reembolsará uma porcentagem em forma de bônus.',
        },
    },
    terms: {
        title: 'Termos',
        termsAndConditions: {
            title: 'Termos e condições',
            registration: {
                title: 'É necessário se inscrever para participar.',
                description:
                    'Clique em "Participar agora". Apenas apostas após o registro serão consideradas no cálculo',
            },
            matches: {
                title: 'Válido apenas para jogos oficiais da Copa do Mundo FIFA 2026.',
                description: 'Apenas apostas liquidadas durante o período serão consideradas.',
            },
            settlement: {
                title: 'Apenas apostas liquidadas no mercado da Copa do Mundo durante o período da promoção serão consideradas.',
                description:
                    'Liquidação final: após o término da final da Copa do Mundo FIFA 2026, caso o {teamName} seja campeão, o sistema calculará automaticamente suas perdas líquidas.\nEm caso de adiamento ou cancelamento de partidas, a liquidação será ajustada conforme necessário.',
            },
            eligibleBets: {
                title: 'Critérios de apostas qualificadas.',
                description:
                    'Apenas apostas com dinheiro real feitas e liquidadas durante o período da promoção na Copa do Mundo serão consideradas. Não serão contabilizadas apostas canceladas, anuladas, reembolsadas ou inválidas, bem como apostas gratuitas, com bônus ou vouchers. Apostas com Cash Out antecipado serão calculadas com base no valor efetivamente pago.',
            },
            netLoss: {
                title: 'Regra de cálculo da perda líquida.',
                description:
                    'Perda líquida ≤ {minimumNetLoss} {currency} não é elegível para cashback. A perda líquida será calculada com base no valor das apostas ajustado pela ponderação das odds.',
            },
            minimumBets: {
                title: 'O usuário deve ter pelo menos 1 aposta relacionada ao {teamName}.',
            },
        },
        rewardTerms: {
            title: 'Termos de recompensa',
            compensation: {
                title: 'Forma de compensação',
                description: 'A recompensa será concedida na forma de bônus de compensação de perda.',
            },
            deadline: {
                title: 'Prazo Final para Entrega das Recompensas',
                description: 'O bônus será creditado até às {deadline}.',
            },
            wagering: {
                title: 'Requisito de rollover',
                description:
                    'O bônus deve cumprir 10x de rollover antes do saque.\nPerda líquida ≥ {minimumNetLoss} {currency} para elegibilidade.\nSe a perda líquida for < {minimumNetLoss} {currency}, o reembolso também não será pago.',
            },
            odds: {
                title: 'Requisito de odds para apostas com bônus',
                description: 'Apostas com bônus devem ter odds mínimas de 1.6',
            },
            hedging: {
                title: 'Proibido hedge',
                description: 'O bônus não pode ser usado para hedge no mesmo mercado',
            },
            validity: {
                title: 'Uso e validade',
                description: 'O bônus é válido apenas para apostas esportivas e deve ser usado em 14 dias',
            },
            cap: {
                title: 'Regras de resgate e limite',
                description:
                    'O bônus deve ser resgatado nesta página. O valor máximo não pode exceder 30% do total depositado.',
            },
            platformLimit: {
                title: 'Limites de pagamento da plataforma',
                description:
                    'Limite total de pagamento da plataforma: {platformTotalPayout} {currency}\nLimite máximo por usuário: {maximumPayout} {currency}',
            },
            betRestriction: {
                title: 'Restrição de tipo de aposta',
                description:
                    'Apenas apostas simples e duplas (2 em 1) participam desta promoção. Apostas no mercado de campeão não são válidas para esta atividade.',
            },
            oddsAbuse: {
                title: 'Apostas anormais',
                description:
                    'A plataforma reserva-se o direito de reduzir a proporção de reembolso em apostas com odds anormalmente baixas, e de reavaliar a perda efetiva e a elegibilidade da recompensa em casos de apostas irregulares, arbitragem, hedge de baixo risco ou qualquer comportamento de jogo não natural.',
            },
        },
        importantTerms: {
            title: 'Cláusulas importantes',
            eligibility: {
                title: 'Limitação de elegibilidade',
                description:
                    'Cada CPF, conta, dispositivo, IP, conta bancária e e-mail pode participar apenas uma vez.',
            },
            personalUse: {
                title: 'Uso pessoal apenas',
                description:
                    'O bônus é apenas para uso pessoal e não pode ser transferido, oferecido ou revendido.\nGOTOBET reserva-se o direito de monitorar todas as atividades de apostas. Participe com responsabilidade.',
            },
            compliance: {
                title: 'Jogo justo e conformidade',
                description:
                    'Todas as apostas devem cumprir os padrões de jogo justo. GOTOBET revisará atividades suspeitas conforme políticas AML e antifraude.',
            },
            acceptance: {
                title: 'Aceitação dos termos',
                description:
                    'Participar implica aceitar os termos e política de privacidade. Violações podem levar à perda de bônus e bloqueio da conta.',
            },
            maximumPrize: {
                title: 'Ativação do prêmio máximo',
                description:
                    'Quando o número de participantes atingir o limite, o nível máximo será ativado automaticamente.',
            },
            abuse: {
                title: 'Abuso e arbitragem',
                description:
                    'Fraude ou abuso de bônus pode resultar em revisão, ajuste, cancelamento e outras medidas disciplinares.',
            },
            finalRights: {
                title: 'Direito final e alterações',
                description:
                    'GOTOBET reserva o direito final de interpretação. Pode modificar, suspender ou encerrar a promoção sem aviso prévio.',
            },
        },
        safetyNotice: {
            title: 'Aviso de segurança',
            item0: 'Proibido menores de 18 anos',
            item1: 'Jogo pode causar vício, jogue com responsabilidade',
            item2: 'Não garante lucro',
            item3: 'Toda aposta envolve risco. Para ajuda, contate o suporte',
        },
    },
};
