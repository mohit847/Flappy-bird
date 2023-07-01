import styled from "styled-components";
import { useEffect, useState } from "react";

const BIRD_HEIGHT = 28;
const BIRD_WIDTH = 33;
const WALL_HEIGHT = 600;
const WALL_WIDTH = 400;
const GRAVITY = 8;
const OBJ_WIDTH = 52;
const OBJ_SPEED = 6;
const OBJ_GAP = 200;

function App() {
  const [isStart, setIsStart] = useState(false);
  const [birdpos, setBirdpos] = useState(300);
  const [objHeight, setObjHeight] = useState(0);
  const [objPos, setObjPos] = useState(WALL_WIDTH);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    let intVal;

    if (isStart && !gameOver && birdpos < WALL_HEIGHT - BIRD_HEIGHT) {
      intVal = setInterval(() => {
        setBirdpos((birdpos) => birdpos + GRAVITY);
      }, 24);
    }

    return () => clearInterval(intVal);
  }, [isStart, gameOver, birdpos]);

  useEffect(() => {
    let objval;

    if (isStart && !gameOver && objPos >= -OBJ_WIDTH) {
      objval = setInterval(() => {
        setObjPos((objPos) => objPos - OBJ_SPEED);
      }, 24);
    } else {
      setObjPos(WALL_WIDTH);
      setObjHeight(Math.floor(Math.random() * (WALL_HEIGHT - OBJ_GAP)));

      if (isStart && !gameOver) {
        setScore((score) => score + 1);
      }
    }

    return () => clearInterval(objval);
  }, [isStart, gameOver, objPos]);

  useEffect(() => {
    let topObj = birdpos >= 0 && birdpos < objHeight;
    let bottomObj =
      birdpos <= WALL_HEIGHT &&
      birdpos >= WALL_HEIGHT - (WALL_HEIGHT - OBJ_GAP - objHeight) - BIRD_HEIGHT;

    if (
      objPos >= OBJ_WIDTH &&
      objPos <= OBJ_WIDTH + 80 &&
      (topObj || bottomObj)
    ) {
      endGame();
    }

    if (birdpos >= WALL_HEIGHT - BIRD_HEIGHT) {
      endGame();
    }
  }, [birdpos, objHeight, objPos]);

  const endGame = () => {
    setIsStart(false);
    setBirdpos(300);
    setScore(0);
    setGameOver(true);
  };

  const handleClick = () => {
    if (gameOver) {
      setIsStart(true);
      setGameOver(false);
    } else if (!isStart) {
      setIsStart(true);
    } else if (birdpos < BIRD_HEIGHT) {
      setBirdpos(0);
    } else {
      setBirdpos((birdpos) => birdpos - 50);
    }
  };

  return (
    <Home onClick={handleClick}>
      <ScoreShow>Score: {score}</ScoreShow>
      <Background height={WALL_HEIGHT} width={WALL_WIDTH}>
        {!isStart && !gameOver && <Startboard>Click To Start</Startboard>}
        {gameOver && (
          <GameOver>
            Game Over! Score: {score}
            <PlayAgain>Click to Play Again</PlayAgain>
          </GameOver>
        )}
        <Obj
          height={objHeight}
          width={OBJ_WIDTH}
          left={objPos}
          top={0}
          deg={180}
        />
        <Bird height={BIRD_HEIGHT} width={BIRD_WIDTH} top={birdpos} left={100} />
        <Obj
          height={WALL_HEIGHT - OBJ_GAP - objHeight}
          width={OBJ_WIDTH}
          left={objPos}
          top={
            WALL_HEIGHT - (objHeight + (WALL_HEIGHT - OBJ_GAP - objHeight))
          }
          deg={0}
        />
      </Background>
    </Home>
  );
}

export default App;

const Home = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Background = styled.div`
  background-image: url("./images/background-day.png");
  background-repeat: no-repeat;
  background-size: ${(props) => props.width}px ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  position: relative;
  overflow: hidden;
  border: 2px solid black;
`;

const Bird = styled.div`
  position: absolute;
  background-image: url("./images/yellowbird-upflap.png");
  background-repeat: no-repeat;
  background-size: ${(props) => props.width}px ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
`;

const Obj = styled.div`
  position: relative;
  background-image: url("./images/pipe-green.png");
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  transform: rotate(${(props) => props.deg}deg);
`;

const Startboard = styled.div`
  position: relative;
  top: 49%;
  background-color: black;
  padding: 10px;
  width: 100px;
  left: 50%;
  margin-left: -50px;
  text-align: center;
  font-size: 20px;
  border-radius: 10px;
  color: #fff;
  font-weight: 600;
`;

const GameOver = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: black;
  padding: 10px;
  width: 200px;
  text-align: center;
  font-size: 24px;
  border-radius: 10px;
  color: #fff;
  font-weight: 600;
`;

const PlayAgain = styled.div`
  font-size: 14px;
  margin-top: 10px;
`;

const ScoreShow = styled.div`
  text-align: center;
  background: transparent;
`;
