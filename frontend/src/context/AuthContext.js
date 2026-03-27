import React, { createContext, useState, useCallback, useContext } from "react";

const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  token: null,
  pincode: "600042",
  userData: null,
  login: () => {},
  logout: () => {},
  updatePincode: () => {},
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [pincode, setPincode] = useState(
    localStorage.getItem("pincode") || "600042",
  );
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData")) || null,
  );

  const login = useCallback((id, authToken, user) => {
    setToken(authToken);
    setUserId(id);
    setUserData(user);
    localStorage.setItem("token", authToken);
    localStorage.setItem("userId", id);
    localStorage.setItem("userData", JSON.stringify(user));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setUserData(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userData");
  }, []);

  const updatePincode = useCallback((code) => {
    setPincode(code);
    localStorage.setItem("pincode", code);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        userId,
        token,
        pincode,
        userData,
        login,
        logout,
        updatePincode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
