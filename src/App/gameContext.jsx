import React, { useReducer, useContext, useEffect } from "react";


//initialisation du context
const GameState = React.createContext();
const GameDispatch = React.createContext();

//export de notre hook useGameState - useContext
export const useGameState = () => useContext(GameState);

//creation de notre gameContext
export default function GameContext({ reducer, initialState, children }) {
    const [gameState, gameDispatch] = useReducer(reducer, initialState);

    //a faire
    //affecter le onKeyPress


    //utiliser le useInterval et le useEffect ici

    return (
        <GameState.Provider value={gameState}>
            <GameDispatch.Provider value={gameDispatch}>{children}</GameDispatch.Provider>
        </GameState.Provider>
    )
}

