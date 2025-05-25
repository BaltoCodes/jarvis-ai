import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import socket from "./socket";

function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [resultText, setResultText] = useState(null)
  const [newRecording, setNewRecording] = useState(false)
  const [output, setOutput] = useState("");
  let mediaRecorder;


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

  // Détection du mobile
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

  // Gestion des boutons
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
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);

      const formData = new FormData();
      console.log('Type : ', audioBlob.mimeType)
      formData.append("audio", audioBlob, "message.webm");
      const resultText = await fetch("http://127.0.0.1:5000/understand-message-google", {
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
        setNewRecording(false);
        setResultText(data.text);
      }
    };
    mediaRecorderRef.current.start();
    setRecording(true)
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setNewRecording(true)
    mediaRecorderRef.current.stop();
    setRecording(false);
    setRecording(false)
    setIsRecording(false);
  };

  // Gestion du bouton mobile (appui long)
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
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);

      const formData = new FormData();
      formData.append("audio", audioBlob, "message.webm");
      const resultText = await fetch("http://127.0.0.1:5000/understand-message-google", {   //35.173.186.121
        method: "POST",
        body: formData,
      });
      const data = await resultText.json();
      console.log(data['text']);
      setNewRecording(false)
      setResultText(data.text);
    };
    mediaRecorderRef.current.start();
    setRecording(true)
    setIsRecording(true);
    setIsRecording(true);
  };

  const handleTouchEnd = () => {
    setNewRecording(true)
    mediaRecorderRef.current.stop();
    setRecording(false);
    setRecording(false)
    setIsRecording(false);
  };

  return (
    <>
    <div className="min-h-screen min-w-screen bg-[#0f172a] text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Conteneur principal */}
      <div className="z-10 flex flex-col items-center justify-center p-6 rounded-lg backdrop-blur-sm bg-opacity-20 bg-black">
        {/* Titre */}
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center glow">
          Jarvis is {isRecording ? 'listening' : 'waiting'}
        </h1>

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
              className={`px-6 py-3 rounded-lg text-lg font-medium transition-all duration-300 ${
                isRecording ? 'bg-green-600 hover:bg-green-700' : 'bg-[#9f0f0f] hover:bg-blue-700'
              }`}
            >
             {isRecording ? 'Enregistrement en cours...' : 'Enregistrer'}
            </button>
            <button
              onClick={handleStopRecording}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-lg font-medium transition-all duration-300"
            >
              Arrêter
            </button>
          </div>
        )}
      </div>
      {output && <p className="text-xl font-italic">{output}</p>}
      {resultText && <p className="text-xl font-italic">{resultText}</p>}

      {/* Vagues animées en arrière-plan */}
      <div className="absolute bottom-0 left-0 right-0 h-64 overflow-hidden">
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
    </div>
    </>
  );
}

export default App;
