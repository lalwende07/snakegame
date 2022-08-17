
//Status possibles: " GAMENEW | GAMESTART | GAMERUN | GAMEOVER
export const gameInitialState = { status: "GAMENEW", interval: 1000};

//Construction du reducer
export const gameReducer = (state, action) => {
    console.log(`Type: ${action.type}`);

    switch (action.type) {
        case "GAME_START":
            return { ...gameInitialState, status: "GAMESTART"};
        case "GAME_RUN":
            return {...state, status: "GAMERUN"};
        case "GAME_OVER":
            return {...state, status: "GAMEOVER"};
        default:
            return state;

    }
}