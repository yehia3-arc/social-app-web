import { createContext, useState, type ReactNode } from "react";

export const CounterContext = createContext<any>(null);

export function CounterContextProvider({ children }: { children: ReactNode }) {
  const [counter, setCounter] = useState(0);
  function sayHello() {
    console.log("hello");
  }
  return (
    <CounterContext.Provider value={{ counter, setCounter, sayHello }}>
      {children}
    </CounterContext.Provider>
  );
}
