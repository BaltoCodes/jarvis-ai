import { useState, useRef, useEffect } from "react";
import WaveBackground from './WaveBackground';
import socket from "../socket";


export default function VoiceRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [resultText, setResultText] = useState(null)
  const [newRecording, setNewRecording] = useState(false)
  let mediaRecorder;


  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connecté au serveur WebSocket");
    });

    socket.on("transcript", () => {
      console.log("Receiving packets");
    });

    return () => {
      socket.off("transcript");
      socket.off("connect");
    };
  }, []);


  const startRecordingNoSocket = async () => {
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
      console.log(data);
      setNewRecording(false)
      setResultText(data.text);
    };
    mediaRecorderRef.current.start();
    setRecording(true)
  };

  const stopRecordingNotSocket = () => {
    setNewRecording(true)
    mediaRecorderRef.current.stop();
    setRecording(false);
    setRecording(false)
    //socket.disconnect();
  };


  const startRecording = async () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start(1000);
      mediaRecorder.ondataavailable = e => {
        console.log('Type : ', e.data.mimeType)
        socket.emit("audio_data", e.data);
        //const reader = new FileReader();
        //console.log(reader.mimeType)
        //reader.onloadend = () => {
          //socket.emit("audio_data", reader.result);
        //};
        //reader.readAsDataURL(e.data);
      };
    });
    setRecording(true);
  };

  const stopRecording = () => {
    setNewRecording(true)
    setRecording(false)
    socket.disconnect();
  };

  return (
    <>
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Jarvis is listening</h2>
      <div className="space-x-2">
        <button
          onClick={startRecordingNoSocket}
          disabled={recording}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          🎙️ Démarrer
        </button>
        <button
          onClick={stopRecordingNotSocket}
          disabled={!recording}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
        >
          🛑 Arrêter
        </button>
      </div>
    {newRecording && <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
    </div>}

      {resultText && newRecording &&<p className="text-xl font-italic">{resultText}</p>}
    </div>
    </>
  );
}
