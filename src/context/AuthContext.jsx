import React, { createContext, useState, useContext, useEffect } from "react";
import axios from 'axios'
export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [user, setUser] = useState(() =>{    
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  });
  const [isAuthenticated, setIsAuthenticated] = useState( () => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? true : false
  }
  );
  const urlProd = "https://jarvis-ai.eu"
  const urlDev = "http://127.0.0.1:5000"

  const getUserData = async (userAddress) => {
    try {
      const response = await axios({
        method: 'post',
        url: urlProd + '/api/jarvis/user/info' ,
        headers: {'Content-Type': 'application/json'},
        data: {
          address : userAddress ? userAddress : 'Unknown-address',
        }
      });
      return response.data;
    } catch (error) {
      console.log(error)
      return null;
    }
  }




  const login = async (userData) => {
    const response = await getUserExistence(userData);
    if (response === 'User_exists') {
      simpleLogin(userData);
      setUserInfo( await getUserData(userData))
    } else {
      console.error('Utilisateur inconnu');
      return null
    }
  };

  const simpleLogin = async (userData) => {
    setUser(userData.uuid);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
    return userData
  }


  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user) {
        const userInfo = await getUserData(user);
        setUserInfo(userInfo);
      }
    };

    fetchUserInfo();
    
  }, []);



  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');  // On enlève l'utilisateur du localStorage
  };



  return (
    <AuthContext.Provider value={{ isAuthenticated, user,  login, logout,  userInfo, setUserInfo, simpleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
