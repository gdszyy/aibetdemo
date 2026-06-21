import championHandicap from './promotion-champion-handicap';

export default {
    hero: {
        title: 'Triple bono en tus primeros depósitos',
    },
    championHandicap,

    list: {
        title: 'Promociones',
        subtitle:
            'Desbloquea increíbles recompensas con nuestras últimas promociones.\nÚnete ahora y aprovecha bonos por tiempo limitado, ofertas especiales y beneficios exclusivos.',
        tabs: {
            all: 'Todos',
            sport: 'Deportes',
            casino: 'Casino',
        },
        joinNow: 'Únete ahora',
        hot: 'Súper popular',
        joined: 'Ya participaste',
        empty: 'Próximamente — ¡Prepárate para increíbles promociones!',
        status: {
            active: 'Activa',
            upcoming: 'Próximamente',
            ended: 'Finalizada',
        },
        cards: {
            firstDeposit: {
                title: '{appName} 5.º Aniversario',
                description: 'Triple bono en tus primeros depósitos, hasta {amount} en recompensas',
            },
            WorldCupPass: {
                title: 'Inmersión a la Copa',
                description: 'Activa el Pase de la Copa del Mundo FIFA 2026™ y gana hasta {amount}!',
            },
            championHandicap: {
                title: 'Handicap de Campeón de {countryName}',
                description: 'Apoya a {countryName} en el Mundial y desbloquea protección de cashback milagrosa',
            },
            luckyBetCode: {
                title: '¡Lucky Bet Ya Está Disponible!',
                description: '¡Gana hasta 777 MXN todos los días!',
            },
            parlayBoost: {
                title: 'Más Combinadas, Más Ganancias',
                description: 'Haz combinadas elegibles y aumenta tu pago hasta {multiplier}',
            },
        },
        countryNames: {
            BR: 'Brasil',
            MX: 'México',
        },
    },
};
