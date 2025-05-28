import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import Google from "./Google";

export default function UserPopup({ userPopUp, setUserPopUp, user, setErrorPopUp }) {
  const ref = useRef();
  const [showGoogle, setShowGoogle] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setUserPopUp(false);
      }
    };
    if (userPopUp) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userPopUp]);
  

  const handleLogin = async () => {
    try {
      setShowGoogle(true);
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        }
    }

  if (!userPopUp) return null;

  return (
    <div className="flex fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        ref={ref}
        className="relative w-[90%] max-w-md rounded-2xl bg-zinc-900 text-white shadow-2xl p-6 border border-zinc-700"
      >
        <button
          className="absolute top-3 right-3 text-zinc-400 hover:text-white"
          onClick={() => setUserPopUp(false)}
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-2">Utilisateur inconnu</h2>
        <p className="text-sm text-zinc-400">
          Vous voulez interagir avec l'utilisateur {user}. Je ne connais pas cet utilisateur, mais vous pouvez l'ajouter à la liste des utilisateurs connus. 
        </p>
        <div className="flex flex-col items-center justify-center gap-y-4 ">
        <button className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-indigo-400 transition duration-300 
        ease-out border border-indigo-500 rounded-xl shadow-lg group hover:shadow-indigo-500/40 hover:bg-indigo-600 hover:text-white mt-3"
          onClick={() => {handleLogin();}}>
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 opacity-20 group-hover:opacity-40 blur-sm"></span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 transition-all duration-300 group-hover:h-full group-hover:opacity-30"></span>
            <span className="relative z-10">S'inscrire / login</span>
        </button>
        {showGoogle && <Google setCloseSignUpForm={setUserPopUp} setErrorPopup={setErrorPopUp}/>}
        </div>
      </div>
      
    </div>
  );
}
