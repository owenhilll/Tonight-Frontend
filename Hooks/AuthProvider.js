import { useEffect, useState, createContext, useContext } from "react";
import * as Google from 'expo-auth-session/providers/google';

const AuthContext = createContext({});

export const GetAuthProvider = ({ children }) => {

    const [token, setToken] = useState("");
    const [userInfo, setUserInfo] = useState(null);

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        androidClientId: '453837494402-3vm4kri0fiugqfnik3is5gt1bk94mmqd.apps.googleusercontent.com',
        //hidestream
        iosClientId: '453837494402-hdph8gj1hn1jm56ugk0b403pl89g8pjj.apps.googleusercontent.com',

        expoClientId: '6033273538-lremjotnp5l3o1pfctvrgf5ql9as3qej.apps.googleusercontent.com'
        //hidestream 
    });

    useEffect(() => {
        if (response?.type === "success") {
            setToken(response.authentication.accessToken);
            getUserInfo();
        }
    }, [response, token]);

    const getUserInfo = async () => {
        try {
            const response = await fetch(
                "https://www.googleapis.com/userinfo/v2/me",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const user = await response.json();
            setUserInfo(user);
        } catch (error) {
            // Add your own error handler here

        }
    };

    return (
        <AuthContext.Provider
            value={{
                user: null,
                promptAsync
            }}>
            {children}
        </AuthContext.Provider>
    )
}

export default function AuthenticationProvider() {
    return useContext(AuthContext);
}
