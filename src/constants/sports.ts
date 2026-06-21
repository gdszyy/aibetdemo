/** Sports used by product-facing business rules. */
export enum SportType {
    Football = 'football',
    Basketball = 'basketball',
    Baseball = 'baseball',
    Tennis = 'tennis',
    Rugby = 'rugby',
    AmericanFootball = 'american-football',
    TableTennis = 'table-tennis',
    Cricket = 'cricket',
    Volleyball = 'volleyball',
    Futsal = 'futsal',
    BeachVolleyball = 'beach-volleyball',
    Boxing = 'boxing',
    Handball = 'handball',
    Darts = 'darts',
    IceHockey = 'ice-hockey',
    Badminton = 'badminton',
}

/** Product sport type -> LSports sport_id. */
export const LSPORTS_SPORT_ID_BY_TYPE = {
    [SportType.Football]: '6046',
    [SportType.Basketball]: '48242',
    [SportType.Baseball]: '154914',
    [SportType.Tennis]: '54094',
    [SportType.Rugby]: '274792',
    [SportType.AmericanFootball]: '131506',
    [SportType.TableTennis]: '265917',
    [SportType.Cricket]: '452674',
    [SportType.Volleyball]: '154830',
    [SportType.Futsal]: '687887',
    [SportType.BeachVolleyball]: '621569',
    [SportType.Boxing]: '154919',
    [SportType.Handball]: '35709',
    [SportType.Darts]: '154923',
    [SportType.IceHockey]: '35232',
    [SportType.Badminton]: '1149093',
} as const satisfies Record<SportType, string>;

/** Product sport type -> LSports sport_code. */
export const LSPORTS_SPORT_CODE_BY_TYPE = {
    [SportType.Football]: '1',
    [SportType.Basketball]: '2',
    [SportType.Baseball]: '3',
    [SportType.Tennis]: '5',
    [SportType.Rugby]: '12',
    [SportType.TableTennis]: '20',
    [SportType.Cricket]: '21',
    [SportType.Volleyball]: '23',
} as const;

/** Product sport type -> optional LSports sport_code. */
const LSPORTS_SPORT_CODE_MAP: Partial<Record<SportType, string>> = LSPORTS_SPORT_CODE_BY_TYPE;

/** Known LSports sport_id values used by product-facing business rules. */
export type LSportsSportId = (typeof LSPORTS_SPORT_ID_BY_TYPE)[SportType];

/** LSports sport_id -> product sport type. */
export const SPORT_TYPE_BY_LSPORTS_SPORT_ID = Object.fromEntries(
    Object.entries(LSPORTS_SPORT_ID_BY_TYPE).map(([sportType, sportId]) => [sportId, sportType]),
) as Record<LSportsSportId, SportType>;

/** LSports sport_code -> product sport type. */
export const SPORT_TYPE_BY_LSPORTS_SPORT_CODE = Object.fromEntries(
    Object.entries(LSPORTS_SPORT_CODE_BY_TYPE).map(([sportType, sportCode]) => [sportCode, sportType]),
) as Record<string, SportType>;

const LSPORTS_SPORT_IDS = new Set<string>(Object.values(LSPORTS_SPORT_ID_BY_TYPE));

/** Whether a sport_id is one of the known LSports sport IDs. */
export const isLSportsSportId = (sportId?: string): sportId is LSportsSportId => {
    return Boolean(sportId && LSPORTS_SPORT_IDS.has(sportId));
};

/** Get the product sport type for a backend sport_id. */
export const getSportTypeBySportId = (sportId?: string): SportType | null => {
    if (!isLSportsSportId(sportId)) return null;
    return SPORT_TYPE_BY_LSPORTS_SPORT_ID[sportId];
};

/** Get the product sport type for a backend sport_code. */
export const getSportTypeBySportCode = (sportCode?: string): SportType | null => {
    if (!sportCode) return null;
    return SPORT_TYPE_BY_LSPORTS_SPORT_CODE[sportCode] ?? null;
};

/** Get LSports sport_code for a backend sport_id. */
export const getSportCodeBySportId = (sportId?: string): string | null => {
    const sportType = getSportTypeBySportId(sportId);
    if (!sportType) return null;

    return LSPORTS_SPORT_CODE_MAP[sportType] ?? null;
};
