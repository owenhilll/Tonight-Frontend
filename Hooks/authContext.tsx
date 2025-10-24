import { request } from '../utils/axios';
import { createContext, PropsWithChildren, use, useEffect, useState } from 'react';

const AuthContext = createContext<{
  login: (inputs: any) => void;
  currentUser?: any | null;
}>({
  login: (inputs: any) => null,
  currentUser: null,
});

export function AuthContextProvider({ children }: PropsWithChildren) {
  const [currentUser, setCurrentUser] = useState<any>(
    JSON.parse(localStorage.getItem('user') || null) || null
  );

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext
      value={{
        currentUser,
        login: async (inputs: any) => {
          const res = await request.post('http://localhost:8800/api/auth/login', inputs, {
            withCredentials: true,
          });
          console.log(res);
          setCurrentUser(res.data);
        },
      }}>
      {children}
    </AuthContext>
  );
}

export default function useAuth() {
  return use(AuthContext);
}
