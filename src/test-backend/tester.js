const sendData = async () => {
    const urlDev = "http://127.0.0.1:5000/understand-message-google-test";
    const formData = {
        text: "Génères moi un PDF sur la puissance de l'IA dans le domaine de la santé, de la robotique et de l'éducation. Sois précis et sors des chiffres et exemples."
    };

    try {
        const result = await fetch(urlDev, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const data = await result.json();
        console.log(data);
    } catch (error) {
        console.error("Erreur lors de l'envoi :", error);
    }
};


await sendData();