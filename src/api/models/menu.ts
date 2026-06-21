/** Menu sport item (shared by /v1/menu/sports and /v1/menu/sports/top) */
export interface MenuSport {
    /** Sport ID */
    sport_id: string;
    /** Sport name */
    name: string;
    /** Child data (categories or tournaments) */
    children?: (MenuCategory | MenuTournament)[];
}

/** Menu category */
export interface MenuCategory {
    /** Primary key (sequential) */
    id: number;
    /** Category ID */
    category_id: string;
    /** Parent sport ID */
    sport_id: string;
    /** Category name */
    name: string;
    /** Match count */
    match_count: number;
    /** Child tournament list */
    children: MenuTournament[];
}

/** Menu tournament */
export interface MenuTournament {
    /** Primary key (sequential) */
    id: number;
    /** Tournament name */
    name: string;
    /** Tournament ID */
    tournament_id: string;
    /** Parent sport ID */
    sport_id: string;
    /** Parent category ID */
    category_id: string;
    /** Match count */
    match_count: number;
    /** Whether this is a hot tournament */
    is_top: boolean;
}
