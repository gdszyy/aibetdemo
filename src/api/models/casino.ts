/**
 * Casino API models — aligned with backend.
 */

/** Casino game merchant/provider option */
export interface CasinoGameMerchant {
    id: number;
    name: string;
    oc_platform: string;
}

/** Lobby (L1) — top-level game hall */
export interface CasinoGameLobby {
    id: number;
    lobby_name: string;
    lobby_code: string;
}

/** Tag (L2) — game category within a lobby */
export interface CasinoGameTag {
    id: number;
    tag_name: string;
    tag_code: string;
}

/** Casino game type option */
export interface CasinoGameType {
    id: number;
    game_type: string;
}

/** Game (L3) — individual game */
export interface CasinoGame {
    id: number;
    /** Unique game ID (used for launch API) */
    game_id: string;
    /** Unique game code (used for URL routing) */
    game_code: string;
    /** Game display name */
    name: string;
    /** Game description */
    description: string;
    /** Game type name for display (e.g. "SLOT") */
    game_type: string;
    /** Preview image URL */
    logo_url: string;
    /** Base game play URL (launch API returns full URL with token) */
    game_url: string;
    /** Operator code (passed to launch API) */
    oc_platform: string;
    /** Game language code (e.g. "en") */
    language: string;
    tag_ids: number[];
}
