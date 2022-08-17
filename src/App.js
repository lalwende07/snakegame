import React, { useState, useRef, useEffect } from 'react';
//import GameContext, { useGameState } from "./App/gameContext";
import { useInterval } from './Utils/useInterval';
//A revoir reduce useReduce
//import { gameInitialState, gameReducer } from "./Store/gameState";

import "./App.css";

//constantes du jeu
import { CANVAS_SIZE, SNAKE_START, FRUIT_START, DIRECTIONS, SPEED, SCALE } from "./Utils/gameUtils"


function App() {

    //affectation des tuples
    const canvasRef = useRef(null);
    const [snake, setSnake] = useState(SNAKE_START);
    const [fruit, setFruit] = useState(FRUIT_START);
    const [dir, setDir] = useState([0,1]);
    const [speed, setSpeed] = useState(null);
    const [scale, setScale] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [currentMove, setCurentMove] = useState(null);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);

    //A REVOIR - méthode useInterval
    useInterval(() => loopGame(), speed);


    const endGame = () => {
        setSpeed(null);
        setGameOver(true);
        setHighScore(score);
    }

    //Contrôle si le user retourne en arriere - il ne doit rien se passer
    const moveSnake = ({ keyCode }) =>{
        //console.log({currentMove})
        //keyCode >= 37 && keyCode <= 40 && setDir(DIRECTIONS[keyCode]);
        if (currentMove === 37 && keyCode === 39 || currentMove == 39 && keyCode === 37 || currentMove == 38 && keyCode === 40 || currentMove == 40 && keyCode === 38){  
            console.log("stop move", currentMove, keyCode)
        } else if (keyCode >= 37 && keyCode <= 40){
            setDir(DIRECTIONS[keyCode]);
            setCurentMove(keyCode);
        }
    }
    

    const createFruit = () => 
        fruit.map((a, i) => Math.floor(Math.random() * (CANVAS_SIZE[i] / SCALE)));
    

    const detectCollision = (emplacement) => {

        //console.log("je suis l'emplacement[0]: " + emplacement[0])
        //console.log("je suis l'emplacement[1]: " + emplacement[1])

        //Contrôle si le snake ne sort pas du canvas
        if(
            emplacement[0] * SCALE >= CANVAS_SIZE[0] ||  
            emplacement[0] < 0 ||
            emplacement[1] * SCALE >= CANVAS_SIZE[1] ||
            emplacement[1] < 0
        ) 
        return true;
        
        //contrôle pour le retour sur lui meme
        //console.log({snake})
        for (const section of snake) {
            if(emplacement[0] === section[0] && emplacement[1] === section[1]) 
            return true;
        }
        return false;
        
    };

    const detectEatFruit = newSnake => {
        if (newSnake[0][0] === fruit[0] && newSnake[0][1] === fruit[1]) {
            let newFruit = createFruit()
            while (detectCollision(newFruit)) {
                newFruit = createFruit();
            }
            setFruit(newFruit);
            return true; 
        }
        return false;
    };

    //A revoir avec redux et useInterval
    const loopGame = () => {
        const snakeCp = JSON.parse(JSON.stringify(snake));
        //console.log(snakeCp)
        const newSnakeHead = [snakeCp[0][0] + dir[0], snakeCp[0][1] + dir[1]];
        //ajoute au debut du tableau
        snakeCp.unshift(newSnakeHead);
        if (detectCollision(newSnakeHead)) endGame();
        //add si eat fruit
        if(!detectEatFruit(snakeCp)) snakeCp.pop();
        if(detectEatFruit(snakeCp)) setScore(score +10);
        //on renvoit le new snake a letat
        setSnake(snakeCp);
    }

    /*
    //test insertion dans localstorage
    console.log('je suis le highScore après le gameOver: ' + highScore)
    const handleScore = (highScore) => {
        window.localStorage.setItem('highScore', highScore);
    }
    */

    //test si le localstorage renvoit la data
    /*
    const getMeScore = () => {
        const toto = localStorage.getItem('highScore')
    }
    console.log('Je suis ton père luc: ' + getMeScore.toto)
    */

    //
    const startGame = () => {
        setSnake(SNAKE_START);
        setFruit(FRUIT_START);
        setDir([0, -1]);
        setSpeed(SPEED);
        setGameOver(false);
        setCurentMove(null);
        setScore(0);
    };
    //console.log(startGame)

    useEffect(() => {
        const context = canvasRef.current.getContext("2d");
        //console.log(context)

        //https://developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D/setTransform
        context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        context.fillStyle = "blue";

        snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1));
        context.fillStyle = "Yellow";
        //revoir fillRect
        context.fillRect(fruit[0], fruit[1], 1, 1)

    }, [snake, fruit, gameOver])

//test localstorage
const textForStorage = highScore
// setter
localStorage.setItem('highScore', textForStorage);
// getter
const textFromStorage = localStorage.getItem('highScore');
console.log("je teste le getItem du localStorage: " + textFromStorage)

    //entete de notre jeu
    const Header = () => {
      return (
        <>
        <header className='header'>
        <h1>Snake Game: </h1>
        <p>High Score:{localStorage.getItem('highScore')}</p>
            <p>
                <strong>{gameOver && <div>PERDU !</div>}</strong>

                Score: {score}

                
            </p>
        </header>
        </>
      );
    };

/* a recharger 
 <GameContext gameInitialState={gameInitialState} gameReducer={gameReducer}>
</GameContext>
*/
    return (
        <>
            <Header />
            <div role="button" tabIndex="0" onKeyDown={e => moveSnake(e)}>
            <main className='main'> 
            <button onClick={startGame}>Play</button>
                <div className='board'>
                        
                        <canvas
                            style={{border: "1px solid black"}}
                            ref={canvasRef}
                            width={`${CANVAS_SIZE[0]}px`}
                            height={`${CANVAS_SIZE[1]}px`}
                        />
                        
                </div>
            </main>
        </div>
        </>
    );
};

export default App;