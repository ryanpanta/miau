import React from "react";
import { tokenPost, tokenValidatePost, userGet } from "./api";
import { useNavigate } from "react-router-dom";

export const UserContext = React.createContext();

export function UserStorage({ children }) {
    const [data, setData] = React.useState(null);
    const [login, setLogin] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const navigate = useNavigate();

    const userLogout = React.useCallback(
        async function () {
            setData(null);
            setError(null);
            setLoading(false);
            setLogin(false);
            window.localStorage.removeItem("token");
        },
        [],
    );

    async function getUser() {
        try {
          const userData = await userGet();
          setData(userData);
          setLogin(true);
        } catch (err) {
          throw new Error("Erro ao buscar usuário: " + err.message);
        }
      }

      async function userLogin(username, password) {
        try {
          setError(null);
          setLoading(true);
          const response = await tokenPost({ username, password });
          const { token } = response; 
          window.localStorage.setItem("token", token);
          await getUser();
          navigate("/conta"); 
        } catch (err) {
          console.log(err)
          setError(err || "Erro ao fazer login");
          setLogin(false);
        } finally {
          setLoading(false);
        }
      }

      React.useEffect(() => {
        async function autoLogin() {
          const token = localStorage.getItem("token");
          if (token) {
            try {
              setLoading(true);
              setError(null);
              await tokenValidatePost(token); 
              await getUser(); 
            } catch (error) {
              userLogout();
            } finally {
              setLoading(false);
            }
          } else {
            setLogin(false);
          }
        }
        autoLogin();
      }, [userLogout]);

    return (
        <UserContext.Provider
            value={{ userLogin, userLogout, data, error, loading, login }}
        >
            {children}
        </UserContext.Provider>
    );
}
