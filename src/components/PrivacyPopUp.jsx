import { useEffect, useState } from "react";
import Google from "./Google.jsx";
export default function PrivacyPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("privacyAccepted");
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const sendConsentToServer = async () => {
    try {
      await fetch("http://35.173.186.121/api/jarvis/activity/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accepted: true,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        }),
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi du consentement :", error);
    }
  };

  const handleAccept = async () => {
    localStorage.setItem("privacyAccepted", "true");
    await sendConsentToServer();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 bg-white shadow-lg border rounded-xl p-4 max-w-md w-full z-50">
      <p className="text-sm text-gray-800 mb-3">
        Ce site utilise des cookies et technologies similaires pour améliorer votre expérience.
        En poursuivant votre navigation, vous acceptez notre politique de confidentialité.
      </p>
      <div className="flex justify-end gap-x-3">
        <button
          onClick={handleAccept}
          className="px-4 py-2 text-white bg-red-600 hover:bg-red-800 rounded-lg text-sm transition"
        >
          Je refuse
        </button>
        <button
          onClick={handleAccept}
          className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition"
        >
          J'accepte
        </button>
      </div>
    </div>
  );
}
