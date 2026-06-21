import championHandicap from './promotion-champion-handicap';

export default {
    hero: {
        title: 'Bônus triplo nos seus primeiros depósitos',
    },
    championHandicap,
    list: {
        title: 'Promoções',
        subtitle:
            'Desbloqueie recompensas incríveis com nossas últimas promoções!\nParticipe agora e aproveite bônus por tempo limitado, ofertas especiais e benefícios exclusivos.',
        tabs: {
            all: 'Todos',
            sport: 'Esportes',
            casino: 'Casino',
        },
        joinNow: 'Cadastre-se agora',
        hot: 'Super popular',
        joined: 'Já participou',
        empty: 'Em breve — Prepare-se para promoções incríveis!',
        status: {
            active: 'Em curso',
            upcoming: 'Em breve',
            ended: 'Encerrado',
        },
        cards: {
            firstDeposit: {
                title: '{appName} 5° Aniversário',
                description: 'Bônus triplo de primeiro depósito, até {amount} em recompensas',
            },
            WorldCupPass: {
                title: 'Imersão na Copa',
                description: 'Ative o Passe da Copa do Mundo FIFA 2026™ e ganhe até {amount}!',
            },
            championHandicap: {
                title: 'Handicap de Campeão do {countryName}',
                description: 'Apoie o {countryName} na Copa e desbloqueie proteção de cashback milagrosa',
            },
            luckyBetCode: {
                title: 'Lucky Bet Já Está no Ar !',
                description: 'Ganhe até 777 BRL todos os dias!',
            },
            parlayBoost: {
                title: 'Mais Múltiplas, Mais Ganhos',
                description: 'Faça múltiplas elegíveis e aumente o pagamento em até {multiplier}',
            },
        },
        countryNames: {
            BR: 'Brasil',
            MX: 'México',
        },
    },
};
