import "./App.css";
import React, { useEffect, useRef, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import pomodoro from "./images/pomodoro.jpg";


function App() {


  // State variables to manage time, timer status, and audio reference
  const [displayTime, setDisplayTime] = useState(1500); // Time remaining in seconds
  const [breakTime, setBreakTime] = useState(5); // Break time in minutes
  const [sessionTime, setSessionTime] = useState(25); // Session time in minutes
  const [timerOn, setTimerOn] = useState(false); // Timer running status
  const [timerId, setTimerId] = useState("Session"); // Current timer (Session or Break)


  // Reference to the audio element
  const audioElement = useRef(null);

  // Placeholder for loop variable
  let loop = undefined; 


  // Helper function to format time in MM:SS format
  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return `${minutes}:${seconds}`;
  };

  // Function to adjust session or break time based on user input
  const changeTime = (amount, type) => {
    let newCount; // Variable to store the new time value

    // Check if the exchange rate is for the session or break time
    if (type === "Session") {
      newCount = sessionTime + amount; // Calculate the new session time by adding the provided value
    } else {
      newCount = breakTime + amount; // Calculate the new break time by adding the provided value
    }

    // Check if the new time is within bounds and the timer is not running
    if (newCount > 0 && newCount <= 60 && !timerOn) {
      // Update session or break time as appropriate
      type === "Session" ? setSessionTime(newCount) : setBreakTime(newCount);

      // If the change was for the session time, update the time displayed on the screen
      if (type === "Session") {
        setDisplayTime(newCount * 60); // Update screen time if session time is changed
      }
    }
  };

  // Function to start/pause the timer
  const setActive = () => {
    setTimerOn(!timerOn);
  };

  // useEffect hook to handle the timer logic
  useEffect(() => {
    // Check if the timer is running and there is time left to display
    if (timerOn && displayTime > 0) {
      // Set an interval to update the displayed time every second
      const interval = setInterval(() => {
        setDisplayTime(displayTime - 1); // Subtract 1 second from the displayed time
      }, 1000); // 1000 ms interval (1 second)

      // Cleanup function to stop interval when component unmounts or timer stops
      return () => clearInterval(interval);
    } else if (displayTime === 0) {
      // Play alarm sound when time reaches zero
      audioElement.current.play(); // Play the audio element
      audioElement.current.currentTime = 0; // restart the audio at the beginning

      // Switch between Session and Break based on the current timer (timerId)
      if (timerId === "Session") {
        setDisplayTime(breakTime * 60); // Set the break time in seconds to display
        setTimerId("Break"); // Change the timer to rest mode
      }
      if (timerId === "Break") {
        setDisplayTime(sessionTime * 60); // Set session time in seconds to display
        setTimerId("Session"); // Change the timer to session mode
      }
    }
  }, [breakTime, sessionTime, displayTime, timerId, timerOn]); // Dependencias para el hook useEffect

  // Function to reset the timer and session/break lengths
  const resetTime = () => {
    setBreakTime(5);
    setSessionTime(25);
    setDisplayTime(1500);
    setTimerId("Session");
    setTimerOn(false);
    clearInterval(loop); // Clear loop variable (not used in the code)
    audioElement.current.load(); // Reset the audio element
  };


  

  //Function for percentage of circular react progressbar
  const porcentID = (timerId) =>{
    const porcentSession = Math.round(((displayTime * 100)/ (sessionTime * 60)));
    const porcentBreak = Math.round(((displayTime * 100)/ (breakTime * 60)));

    if(timerId === "Session"){
      return porcentSession
    }else{
      return porcentBreak
    }
  }

  // JSX code for the user interface

  return (
  
        <div className="App">
            <h1 className="title">Pomodoro Clock</h1>
            <img src= { pomodoro } alt="Pomodoro clock" />
            <div className="pomodoro-container">
                <h2 id="timer-label">{timerId}</h2>
                <div className="circular-time"  >
                    <CircularProgressbar
                        value={porcentID(timerId)}
                        text={`${formatTime(displayTime)}`}
                        styles={buildStyles({
                            trailColor: "black", // Color del fondo de la barra
                            pathColor: "rgb(210, 210, 5)", // Color de la barra de progreso
                            textColor: "#f88", // Color del texto
                            textSize: "20px", // Tamaño del texto
                            pathTransitionTimingFunction: "linear", // Función de temporización de la animación
                        })}
                    />
                </div>
                <div id="time-left">
                    {formatTime(displayTime)}
                </div>
                <button className="star" id="start_stop" onClick={setActive}>
                    {timerOn ? "Pause" : "Start"}
                </button>
                <button id="reset" onClick={resetTime}>
                    Reset
                </button>
                <audio id="beep" ref={audioElement}>
                    <source src='https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav' type='audio/mpeg'/>
                </audio>
                <div className="container">
                    <div className="session" id="session-label">
                        <h5>Session Length</h5>
                        <div id="session-length">
                            {sessionTime}
                        </div>
                        <div className="session-buttons">
                            <button
                                id="session-increment"
                                onClick={() => changeTime(1, "Session")}
                            >
                                +
                            </button>
                            <button
                                id="session-decrement"
                                onClick={() => changeTime(-1, "Session")}
                            >
                                -
                            </button>
                        </div>
                    </div>
                
                    <div className="break">
                        <h5 id="break-label">Break Length</h5>
                        <div id="break-length">
                            {breakTime}
                        </div>
                        <div className="break-buttons">
                            <button id="break-increment" onClick={() => changeTime(1, "Break")}>
                                +
                            </button>
                            <button
                                id="break-decrement"
                                onClick={() => changeTime(-1, "Break")}
                            >
                                -
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="author">
                Designed and Coded by
                <br/>
                <a href="https://www.linkedin.com/in/lucianoalessi/" target="_blank" rel="noopener noreferrer">Luciano A. Alessi</a>
            </div>  
        </div>
    );
}

export default App;
