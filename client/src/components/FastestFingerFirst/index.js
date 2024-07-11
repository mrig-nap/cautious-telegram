import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import Box from '@mui/material/Box';
import { useEffect, useRef, useState } from 'react';
import questions from '../../../data/questions.json';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

export default function BasicModal({socket, allPlayers}) {
	const [name, setName] = useState("")
	const [open, setOpen] = useState(true);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
  const [seconds, setSeconds] = useState(0);
  const [responseTime, setResponseTime] = useState(0);
  const audioRef = useRef(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [modalBody, setModalBody] = useState("Are you ready ?")
  const [isRunning, setIsRunning] = useState(false);
  const [questionCount, setQuestionCount] = useState(1);
  const [result, setResult] = useState(null)
  const currentPlayer = allPlayers.find(player => player.socketId === socket.id) || null;
  console.log(currentPlayer)

	const handleSubmit = () => {
		socket.emit("player-joined", name)
		handleClose()
		setOpenLobby(true)
	}

  socket.on("game-started", () => {
    document.getElementById("game-screen").style.display = "flex";
    startGame()
  })

  socket.on("fff-response-update", newResponse => {
    console.log(newResponse, "newResponse")
    setResult(newResponse.find(res => res.player.socketId === socket.id))
  })

  console.log(result)

  const startGame = () => {
    setCurrentQuestion(questions[Math.floor(Math.random() * questions.length)])
    setSeconds(10)
    setResponseTime(0)
    startTimer()
  }

  useEffect(() => {
    // Exit early when timer reaches 0
    if (seconds === 0){
      return;
    }

    // Decrease seconds by 1 after 1 second
    const timer = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds - 1);
    }, 1000);

    // Clean up the interval on component unmount or when seconds reach 0
    return () => clearInterval(timer);
  }, [seconds]); // Re-run the effect when seconds state changes

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        setResponseTime(prevSeconds => prevSeconds + 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isRunning]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const nextQuestion = () => {
    setQuestionCount(prevCount => prevCount + 1)
    startGame()
  }

  const resetOptions = (i) => {
    document.getElementById("option"+i).classList.remove("bg-red-500")
    document.getElementById("option"+i).classList.remove("bg-green-500")
    document.getElementById("option"+i).classList.add("bg-purple-700")
    document.getElementById("option"+i).classList.add("hover:bg-purple-500")
  }

  const handleOptionClick = (option, question) => {
    stopTimer()
    if(option.split(":")[0] === question.correct_answer){
      document.getElementById("option"+option.split(":")[0]).classList.remove("hover:bg-purple-500")
      document.getElementById("option"+option.split(":")[0]).classList.remove("bg-purple-700")
      document.getElementById("option"+option.split(":")[0]).classList.add("bg-green-500")
      socket.emit("fff-response", currentPlayer, responseTime, true, questionCount)
    } else {
      document.getElementById("option"+option.split(":")[0]).classList.remove("hover:bg-purple-500")
      document.getElementById("option"+option.split(":")[0]).classList.add("bg-red-500")
      document.getElementById("option"+option.split(":")[0]).classList.remove("bg-purple-700")
      document.getElementById("option"+question.correct_answer).classList.add("bg-green-700")
      socket.emit("fff-response", currentPlayer, responseTime, false, questionCount)
    }
    resetOptions(option.split(":")[0])
    if(questionCount === 10){
      setModalBody("Round Over! Check Leaderboard for your score. Do try our exclusive CHAT feature.")
      setPopupVisible(true);
      setSeconds(0)
    } else {
      nextQuestion()
    }
  }

	return (
		<div id="game-screen" className="flex min-h-screen bg-gray-100 hidden">
      <div className="w-64 p-4 bg-purple-700 text-white">
        <div className="flex mb-4">
          <LeaderboardIcon />
          <h2 className="ml-4">Leaderboard</h2>
        </div>
          <div>
            {allPlayers.length > 0 && allPlayers.map((player, index) => (
              <Box
                key={index}
                sx={{
                  width: 500,
                  maxWidth: '100%',
                  display: 'flex',
                  justifyContent: 'start',
                  alignItems: "center",
                  marginBottom: "10px"
                }}
              >
                <div className='w-2 h-2 rounded-full bg-green-500 mr-6 ml-2'></div>
                <div>{player.name}</div>
                <div className='ml-10'>{player.correct +"/" + player.totalQuestions}</div>
                <div className='ml-auto'>{player.responseTime}s</div>
              </Box>
            ))}
          </div>
        
      </div>
      <div id="question-screen" className="flex-1 p-4">
        <div className="flex justify-center mb-4">
          <div className="relative flex items-center justify-center w-16 h-16 bg-purple-700 rounded-full">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-red-400" />
            <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-red-400 to-green-400" />
            <span className="text-2xl font-bold text-white">{seconds}</span>
          </div>
        </div>
        
        <audio
          style={{display: "none"}}
          ref={audioRef}
          controls
          src="/audio/kbc_intro_audio.mp3">
              Your browser does not support the
              <code>audio</code> element.
      </audio>
        {currentQuestion !== null && <>
          <div className="p-4 mb-4 text-center text-white bg-purple-700 rounded-lg">
            {currentQuestion.question}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {currentQuestion.options.map((option, index) => (
              <button key={index} id={"option"+option.split(":")[0]} className="p-4 text-left text-white bg-purple-700 rounded-lg hover:bg-purple-500" onClick={() => handleOptionClick(option, currentQuestion)}>
                <span className="font-bold">{option.split(":")[0]}:</span> {option.split(":")[1]}
              </button>
            ))}
          </div>
        </>}
      </div>
      {isPopupVisible && <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">{modalBody}</h2>
        
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setPopupVisible(false)}
        >
          Okay
        </button>
      </div>
    </div>}
    </div>
	);
}