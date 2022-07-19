import Axios, { AxiosResponse } from "axios";
import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { UserInterface } from "../Interfaces/Interfaces";

export const myContext = createContext<Partial<UserInterface>>({}); // used Partial to initialize default value
export default function Context(props: PropsWithChildren<any>) {
  const [user, setUser] = useState<UserInterface>();
  useEffect(() => {
    Axios.get("http://localhost:4000/user", { withCredentials: true }).then(
      (res : AxiosResponse) => {
        setUser(res.data);
      }
    );
  }, []);

  return <myContext.Provider value={user!}>{props.children}</myContext.Provider>;
}
