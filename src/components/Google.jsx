import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from 'axios'
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";


export default function Google({setCloseSignUpForm, setErrorPopup}) {
    const {isAuthenticated, login, setUserInfo, simpleLogin} = useContext(AuthContext);
    const urlProd = "https://jarvis-ai.eu"
    const urlDev = "http://127.0.0.1:5000"
    const handleCredentialResponse = async (credentialResponse) => {
        try {
          const jwtCredential = jwtDecode(credentialResponse.credential)
          const response = await axios({
            method: 'post',
            url: urlProd + '/api/post/jarvis/users' ,
            headers: {'Content-Type': 'application/json'},
            data: {
              email : jwtCredential.email,
              name : jwtCredential.given_name,
              family_name : jwtCredential.family_name,
              authentication_method : 'Google',
              token : jwtCredential.aud,
              picture : jwtCredential.picture,
              email_verified : jwtCredential.email_verified,
              language : jwtCredential.locale
            }
            
        });
        if (['User_exists', 'User_inserted'].includes(response.data.status)) {
            setCloseSignUpForm(false);
            setUserInfo(response.data.user);
            simpleLogin(response.data.user.uuid);
        } else {
            setErrorPopup('Unexpected response from server. Please try again later.');
        }
        } catch (error) {
            console.error("Erreur", error)
            setErrorPopup('Unknown error occurred during Google login. Please try again later. \n Error : ' + error.message);
        }    
    }
    return (
        <>
            <GoogleLogin
            onSuccess={(credentialResponse) => {
              handleCredentialResponse(credentialResponse)                
            }
            }
            onError={() => {
                setErrorPopup('Unknown error occurred during Google login. Please try again later.');
            }}
            auto_select={true}
            cancel_on_tap_outside={true}
            />
        </>
    )
}