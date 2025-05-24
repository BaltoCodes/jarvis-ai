import { useEffect, useState } from 'react';
import '../App.css';

function GetMessageNewVersion() {
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const waves = document.querySelectorAll('.wave');
    waves.forEach(wave => {
      wave.style.animationDuration = isRecording
        ? parseFloat(getComputedStyle(wave).animationDuration) * 0.5 + 's'
        : parseFloat(getComputedStyle(wave).animationDuration) * 2 + 's';
    });
  }, [isRecording]);

  return (
    <div class="wave-container">
        <div class="wave wave-one"></div>
        <div class="wave wave-two"></div>
        <div class="wave wave-three"></div>
        
        <div class="flex flex-col items-center justify-center h-full button-container">
            <h1 class="text-4xl font-bold text-white mb-12 drop-shadow-lg">Enregistrement Audio</h1>
            
            <div class="flex flex-col sm:flex-row gap-6">
                <button id="recordBtn" class="record-btn pulse bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-full text-lg flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    Enregistrer
                </button>
                
                <button id="stopBtn" class="record-btn bg-gray-700 hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-full text-lg flex items-center opacity-0 transition-opacity duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                    </svg>
                    Arrêter
                </button>
            </div>
            
            <div id="status" class="mt-8 text-white text-lg font-medium"></div>
        </div>
    </div>
  );
}

export default GetMessageNewVersion;