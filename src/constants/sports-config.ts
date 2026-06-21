import {
    SportBaseballActive,
    SportBasketballActive,
    SportCricketActive,
    SportRugbyActive,
    SportSoccerActive,
    SportTennisActive,
    SportVolleyballActive,
} from '@/components/icons';
import { SportAmericanFootballOutlined } from '@/components/icons2/SportAmericanFootballOutlined';
import { SportBadmintonFilled } from '@/components/icons2/SportBadmintonFilled';
import { SportBadmintonOutlined } from '@/components/icons2/SportBadmintonOutlined';
import { SportBaseballOutlined } from '@/components/icons2/SportBaseballOutlined';
import { SportBasketballOutlined } from '@/components/icons2/SportBasketballOutlined';
import { SportBeachVolleyballFilled } from '@/components/icons2/SportBeachVolleyballFilled';
import { SportBeachVolleyballOutlined } from '@/components/icons2/SportBeachVolleyballOutlined';
import { SportBoxingFilled } from '@/components/icons2/SportBoxingFilled';
import { SportBoxingOutlined } from '@/components/icons2/SportBoxingOutlined';
import { SportCricketOutlined } from '@/components/icons2/SportCricketOutlined';
import { SportDartsFilled } from '@/components/icons2/SportDartsFilled';
import { SportDartsOutlined } from '@/components/icons2/SportDartsOutlined';
import { SportFootballOutlined } from '@/components/icons2/SportFootballOutlined';
import { SportFutsalFilled } from '@/components/icons2/SportFutsalFilled';
import { SportFutsalOutlined } from '@/components/icons2/SportFutsalOutlined';
import { SportHandballFilled } from '@/components/icons2/SportHandballFilled';
import { SportHandballOutlined } from '@/components/icons2/SportHandballOutlined';
import { SportIceHockeyFilled } from '@/components/icons2/SportIceHockeyFilled';
import { SportIceHockeyOutlined } from '@/components/icons2/SportIceHockeyOutlined';
import { SportRugbyOutlined } from '@/components/icons2/SportRugbyOutlined';
import { SportTableTennisFilled } from '@/components/icons2/SportTableTennisFilled';
import { SportTableTennisOutlined } from '@/components/icons2/SportTableTennisOutlined';
import { SportTennisOutlined } from '@/components/icons2/SportTennisOutlined';
import { SportVolleyballOutlined } from '@/components/icons2/SportVolleyballOutlined';
import { isLSportsSportId, LSPORTS_SPORT_ID_BY_TYPE, type LSportsSportId } from '@/constants/sports';

type SportIconConfig = {
    /** 线条图标 */
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    /** 仿真图标 */
    shadowIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

/** Sport icon mapping: sport_id -> icon config */
const SPORT_ICON_MAP: Record<LSportsSportId, SportIconConfig> = {
    [LSPORTS_SPORT_ID_BY_TYPE.football]: { icon: SportFootballOutlined, shadowIcon: SportSoccerActive },
    [LSPORTS_SPORT_ID_BY_TYPE.basketball]: { icon: SportBasketballOutlined, shadowIcon: SportBasketballActive },
    [LSPORTS_SPORT_ID_BY_TYPE.baseball]: { icon: SportBaseballOutlined, shadowIcon: SportBaseballActive },
    [LSPORTS_SPORT_ID_BY_TYPE.tennis]: { icon: SportTennisOutlined, shadowIcon: SportTennisActive },
    [LSPORTS_SPORT_ID_BY_TYPE.rugby]: { icon: SportRugbyOutlined, shadowIcon: SportRugbyActive },
    [LSPORTS_SPORT_ID_BY_TYPE['american-football']]: {
        icon: SportAmericanFootballOutlined,
        shadowIcon: SportRugbyActive,
    },
    [LSPORTS_SPORT_ID_BY_TYPE['table-tennis']]: {
        icon: SportTableTennisOutlined,
        shadowIcon: SportTableTennisFilled,
    },
    [LSPORTS_SPORT_ID_BY_TYPE.cricket]: { icon: SportCricketOutlined, shadowIcon: SportCricketActive },
    [LSPORTS_SPORT_ID_BY_TYPE.volleyball]: { icon: SportVolleyballOutlined, shadowIcon: SportVolleyballActive },
    [LSPORTS_SPORT_ID_BY_TYPE.futsal]: { icon: SportFutsalOutlined, shadowIcon: SportFutsalFilled },
    [LSPORTS_SPORT_ID_BY_TYPE['beach-volleyball']]: {
        icon: SportBeachVolleyballOutlined,
        shadowIcon: SportBeachVolleyballFilled,
    },
    [LSPORTS_SPORT_ID_BY_TYPE.boxing]: { icon: SportBoxingOutlined, shadowIcon: SportBoxingFilled },
    [LSPORTS_SPORT_ID_BY_TYPE.handball]: { icon: SportHandballOutlined, shadowIcon: SportHandballFilled },
    [LSPORTS_SPORT_ID_BY_TYPE.darts]: { icon: SportDartsOutlined, shadowIcon: SportDartsFilled },
    [LSPORTS_SPORT_ID_BY_TYPE['ice-hockey']]: { icon: SportIceHockeyOutlined, shadowIcon: SportIceHockeyFilled },
    [LSPORTS_SPORT_ID_BY_TYPE.badminton]: { icon: SportBadmintonOutlined, shadowIcon: SportBadmintonFilled },
};

/** Get sport icon config by sport_id */
export const getSportConfig = (id?: string): SportIconConfig | null => {
    if (!isLSportsSportId(id)) return null;
    return SPORT_ICON_MAP[id];
};
