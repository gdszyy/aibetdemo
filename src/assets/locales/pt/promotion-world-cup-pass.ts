export default {
    hero: {
        // title: 'Pass do Mundial FIFA 2026™',
        subtitlePrefix: 'Recompensas e bônus exclusivos, Ganhe até',
        subtitleAmount: '{amount}',
    },
    level: {
        current: 'Atual',
        weeklyLimit: 'Limite semanal',
        weeklyLimitRemoved: 'A partir de {time}, o limite semanal de EXP será removido',
    },
    progress: {
        title: 'Trilha de recompensas',
        claimAll: 'Resgatar tudo',
        rewards: 'Recompensas',
        freePass: 'Passe gratuito',
        premiumPass: 'Passe premium',
        backToCurrentLevel: 'Voltar ao nível atual',
    },
    claimSuccess: {
        title: 'Prêmios Resgatados!',
        description: 'Adicionado com sucesso à sua carteira',
        levelReward: 'Recompensa NV{level}',
        rewardValue: '{amount} {type}{count, plural, =1 {} other { x{count}}}',
        confirm: 'CONFIRMAR',
    },
    eventEnded: {
        title: 'EVENTO ENCERRADO',
        description: 'Lamentamos, mas este evento já foi encerrado. Fique atento à nossa próxima promoção emocionante!',
        confirm: 'OK, ENTENDI',
    },
    eventNotStarted: {
        title: 'Campanha Indisponível',
        description:
            'Esta campanha não está disponível no momento. Explore nossas outras promoções para encontrar a oferta ideal para você.',
        confirm: 'OK, ENTENDI',
    },
    unlock: {
        title: 'Atualizar para Premium',
        description: 'Desbloqueie bônus exclusivos, limites maiores e recompensas avançadas',
        unlockFor: 'Desbloqueie agora por',
        unlockPremium: 'Desbloquear Premium',
        modalDescription:
            'Desbloqueie <highlight>o Passe Premium</highlight> e comece a resgatar recompensas exclusivas imediatamente.',
        currentBalance: 'Saldo atual',
        payNow: 'PAGAR {amount} AGORA',
        processingPayment: 'Processando pagamento...',
        successTitle: 'Compra realizada com sucesso!',
        successDescription: 'Parabéns! Você desbloqueou <highlight>o Passe Premium</highlight> com sucesso.',
        startClaimingRewards: 'Começar a resgatar recompensas',
        insufficientBalancePrompt: 'SALDO INSUFICIENTE?',
        depositHere: 'DEPOSITAR AQUI',
        insufficientBalanceHint: 'Saldo insuficiente? Clique para depositar',
        insufficientBalanceTitle: 'Saldo insuficiente',
        depositToUnlock: 'Depositar e desbloquear',
    },
    missions: {
        title: 'Tarefas do evento',
        dailyTitle: 'Tarefas diárias',
        weeklyTitle: 'Tarefas semanais',
        fallbackDailyTitle: 'Tarefa diária #{missionType}',
        fallbackWeeklyTitle: 'Tarefa semanal #{missionType}',
        fallbackCondition: 'Condição: {condition}',
        units: {
            bets: 'apostas',
            times: 'vezes',
            days: 'dias',
        },
        daily: {
            completeSportsBet: {
                title: 'Concluir 1 aposta esportiva',
                description: 'Aposta única ≥ {amount}',
            },
            sportsTurnover: {
                title: 'Volume válido diário',
                description: 'Volume diário ≥ {amount}',
            },
            highTurnoverBonus: {
                title: 'Tarefa de alto volume diário',
                description: 'Volume diário ≥ {amount}',
            },
            login: {
                title: 'Missão de login diário',
                description: 'Login diário',
            },
            betsTarget: {
                title: 'Número de apostas diárias',
                description: '≥ {count} apostas esportivas',
            },
            depositTarget: {
                title: 'Tarefa de depósito diário',
                description: 'Depósito diário ≥ {amount}',
            },
        },
        weekly: {
            turnover: {
                title: 'Volume semanal',
                description: 'Volume semanal ≥ {amount}',
            },
            betsTarget: {
                title: 'Número de apostas',
                description: '≥ {count} apostas esportivas',
            },
            consecutiveDailyTasks: {
                title: 'Completar tarefas diárias consecutivas',
                description: 'Completar todas as tarefas por ≥ {count} dias',
            },
            consecutiveBettingDays: {
                title: 'Dias consecutivos de aposta',
                description: 'Aposte por pelo menos {days} dias consecutivos com volume diário mínimo de {amount}',
            },
            consecutiveLogins: {
                title: 'Login consecutivo',
                description: 'Login ≥ {count} dias',
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
        title: 'Regras da promoção',
        sections: {
            guidelines: {
                title: 'Diretrizes da promoção',
                item1: 'Ao adquirir o Passe Premium, você desbloqueia a trilha de recompensas premium. Complete tarefas para ganhar EXP, subir o nível do passe e desbloquear recompensas em cada nível.',
                item2: 'EXP necessário por nível: 200 EXP',
                item3: 'EXP total necessário para o nível máximo (nível 50): 10.000 EXP',
                item4: 'Limite semanal de EXP: 2.000 EXP',
                item5: 'A partir da 5ª semana da promoção, o limite semanal de EXP será removido.',
                // item6: 'Após atingir o nível máximo, os usuários do Passe Premium recebem {amount} por cada nível adicional, até o nível 100.',
                // item7: 'O Passe Premium custa {amount} e pode ser adquirido por meio de depósito ou saldo da conta.',
                item8: 'Esta promoção é válida apenas para usuários com pelo menos 1 aposta registrada anteriormente.',
                item9: 'As tarefas são contabilizadas automaticamente desde o início da promoção. Apostas irregulares resultarão na desqualificação da participação.',
            },
            rewardDetails: {
                title: 'Descrição das recompensas',
                item1: 'A aposta grátis esportiva é válida apenas para apostas esportivas, utilizável uma única vez, com validade de 7 dias e não pode ser sacada diretamente. As odds devem estar entre ≥1,60 e ≤2,50. Apenas apostas liquidadas contam para o rollover; apostas não liquidadas não contam. Somente apostas com dinheiro real são consideradas; apostas grátis não contam.',
                item2: 'Os giros grátis são válidos apenas para jogos selecionados. O valor apostado com giros grátis não conta para o rollover, é utilizável uma vez, com validade de 7 dias e não pode ser sacado diretamente.',
                item3: 'Os bônus recebidos exigem 5x de rollover para saque, são válidos apenas para apostas esportivas e expiram em 7 dias.',
                item4: 'Todas as recompensas devem ser resgatadas manualmente na página da promoção. Recompensas não resgatadas serão removidas após o término. Verifique sua lista antes do fim.',
            },
            importantTerms: {
                title: 'Termos importantes',
                item1: 'Cada {identityDocument}, conta, dispositivo, IP, conta bancária e e-mail só pode participar uma vez.',
                item2: 'Os bônus são pessoais e intransferíveis. A GOTO.BET monitora continuamente as apostas. Jogue com responsabilidade.',
                item3: 'Comporte-se de forma adequada. A GOTO.BET analisará atividades suspeitas conforme políticas AML e antifraude.',
                item4: 'Ao participar, você concorda com os Termos e Condições e Política de Privacidade. Violações podem resultar em cancelamento de bônus e bloqueio da conta.',
                item5: 'Ao atingir o número pré-definido de participantes na plataforma, o maior prêmio será ativado automaticamente.',
                item6: 'Contra qualquer conduta irregular com intenção de má-fé ou arbitragem maliciosa, a plataforma reserva-se o direito de revisar e ajustar a atividade, revogar os prêmios já distribuídos e aplicar medidas rigorosas contra as violações, conforme a análise da situação.',
                item7: 'A plataforma reserva-se o direito de interpretar, modificar ou encerrar a promoção a qualquer momento.',
            },
            safetyStatement: {
                title: 'Aviso de segurança',
                item1: 'Proibido para menores de 18 anos.',
                item2: 'O jogo pode causar dependência. Jogue com responsabilidade.',
                item3: 'Não há garantia de lucro.',
            },
        },
    },
    rewardCard: {
        claimed: 'Resgatado',
        claimable: 'Disponível',
        locked: 'Bloqueado',
        gear: 'Recompensa',
        premiumGear: 'Recompensa premium',
        rewardTypes: {
            cash: 'DINHEIRO',
            sportBonus: 'BÔNUS ESPORTIVO',
            freeSport: 'APOSTA GRÁTIS',
            casinoBonus: 'BÔNUS CASINO',
            freeSpin: 'GIRO GRÁTIS',
        },
    },
};
