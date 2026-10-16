import {
  createContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { jwtDecode } from "jwt-decode";
type AuthContextType = {
  userLogin: string | null;
  setuserLogin: Dispatch<SetStateAction<string | null>>; // A function that can be used to update the state of a useState or useReducer hook.
  userId: string;
};
export const AuthContext = createContext<AuthContextType>({
  userLogin: null, // in start be null
  setuserLogin: () => {},
  userId: "",
});

export default function AuthContextProvider({
  children,
}: {
  children: ReactNode; // ReactNode يشمل
}) {
  const [userLogin, setuserLogin] = useState(() =>
    localStorage.getItem("userToken"),
  );

  const [userId, setuserId] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      const { user }: { user: string } = jwtDecode(token);
      setuserId(user);
    }
  }, [userLogin]);

  return (
    <AuthContext.Provider value={{ userLogin, setuserLogin, userId }}>
      {children}
    </AuthContext.Provider>
  );
}
