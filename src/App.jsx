import { useState, useRef, useEffect, use } from 'react';
import './App.css';
import socket from "./socket";
import PrivacyPopup from './components/PrivacyPopUp';
import UserPopup from './components/UserPopUp';

function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [resultText, setResultText] = useState(null)
  const [output, setOutput] = useState("");
  const [showUserPopup, setShowUserPopup] = useState(true);
  const [errorPopUp, setErrorPopUp] = useState("");
  const urlProd = "http://35.173.186.121:5000/understand-message-google"
  const urlDev = "http://127.0.0.1:5000/understand-message-google"

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connecté au serveur WebSocket");
    });

    socket.on("transcript", () => {
      console.log("Receiving packets");
    });
    socket.on("stream_data", (message) => {
      let chunk = message.data.content;
      const unwantedPatterns = [
        /oyer"/g,
        /:/g,
        /"/g,
        /fon(ction)?/g,
        /oyer/g
      ];

      unwantedPatterns.forEach(pattern => {
        chunk = chunk.replace(pattern, '');
      });

      setOutput((prev) => {
        if (prev.endsWith(chunk) || chunk.trim() === '') {
          return prev;
        }
        return prev + chunk;
      });
    });

    return () => {
      socket.off("transcript");
      socket.off("connect");
    };
  }, []);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const handleStartRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (e) => {
      audioChunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      console.log('Sending data')
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const formData = new FormData();
      console.log('Type : ', audioBlob.mimeType)
      formData.append("audio", audioBlob, "message.webm");
      const resultText = await fetch(urlProd, {
        method: "POST",
        body: formData,
      });

      const data = await resultText.json();
      if (data.status_code === 422) {
        setResultText("Message was not properly understood, please try again");
      } 
      else if (data.message === "No user detected"){
        setShowUserPopup(true);
        setUserUndetected(data.user)
      }
      else if (data.message) {
        setResultText(data.message)
      }else {
        console.log(data.message);
        setResultText(data.text);
      }
    };
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const handleTouchStart = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (e) => {
      audioChunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      console.log('Sending data')
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });

      const formData = new FormData();
      formData.append("audio", audioBlob, "message.webm");
      const resultText = await fetch(urlProd, {   //35.173.186.121
        method: "POST",
        body: formData,
      });
      const data = await resultText.json();
      if (data.status_code === 422) {
        setResultText("Message was not properly understood, please try again");
      } 
      else if (data.message) {
        setResultText(data.message)
      }else {
        console.log(data.message);
        setResultText(data.text);
      }
    };
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const handleTouchEnd = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };


  return (
    <>
    <div className="min-h-screen min-w-screen bg-[#0f172a] text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Conteneur principal */}
      <div className="z-10 flex flex-col items-center justify-center p-6 rounded-lg backdrop-blur-sm bg-opacity-20 bg-black">
        {/* Titre */}
        <h1 className="text-3xl md:text-4xl font-bold mb-1 text-center glow">
          Jarvis is {isRecording ? 'listening' : 'waiting'}
        </h1>
        <h4 className='font-italic text-gray-700 mb-7 text-center'>Ask him anything</h4>

        {/* Boutons adaptés selon le device */}
        {isMobile ? (
          // Version mobile - un seul bouton avec appui long
          <button
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
            onMouseUp={handleTouchEnd}
            onMouseLeave={handleTouchEnd}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-lg font-medium transition-all duration-300 ${
              isRecording 
                ? 'bg-red-600 scale-110 pulse' 
                : 'bg-[#9f0f0f] hover:bg-blue-700'
            }`}
          >
            {isRecording ? 'Release' : 'Hold'}
          </button>
        ) : (
          // Version desktop - deux boutons
        <div className="flex space-x-6">
          <button
            onClick={handleStartRecording}
            className={`relative px-6 py-3 rounded-xl text-lg font-medium overflow-hidden transition-all duration-300 border ${
              isRecording
                ? 'bg-green-600 border-green-400 hover:bg-green-700 hover:shadow-lg hover:shadow-green-500/40'
                : 'bg-[#1a1a1a] border-red-500 hover:bg-[#2a2a2a] hover:shadow-lg hover:shadow-red-500/40'
            } text-white`}
          >
            <span className="absolute inset-0 bg-gradient-to-tr from-transparent to-red-500 opacity-10 group-hover:opacity-20 blur-md"></span>
            <span className="relative z-10">
              {isRecording ? 'Enregistrement en cours...' : 'Enregistrer'}
            </span>
          </button>

          <button
            onClick={handleStopRecording}
            className="relative px-6 py-3 rounded-xl text-lg font-medium text-white bg-zinc-800 border border-zinc-600 hover:bg-zinc-700 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/40"
          >
            <span className="absolute inset-0 bg-gradient-to-tr from-transparent to-cyan-500 opacity-10 group-hover:opacity-20 blur-md"></span>
            <span className="relative z-10">Arrêter</span>
          </button>
        </div>

        )}
      </div>
      {output && <p className="text-xl font-italic">{output}</p>}
      {resultText && <p className="text-xl font-italic">{resultText}</p>}
      {showUserPopup && <UserPopup userPopUp={showUserPopup} setUserPopUp={setShowUserPopup} setErrorPopUp={setErrorPopUp}/>}
      {errorPopUp && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 bg-red-600 text-white shadow-lg border rounded-xl p-4 max-w-md w-full z-50">
          <p className="text-sm">{errorPopUp}</p>
          <button
            onClick={() => setErrorPopUp("")}
            className="mt-2 px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-gray-200 transition"
          >
            Fermer
          </button>
        </div>
      )}

      {/* Vagues animées en arrière-plan */}
      <div className="absolute bottom-0 left-0 right-0 h-64 overflow-hidden">
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
    </div>
    <PrivacyPopup />
    </>
  );
}

export default App;
