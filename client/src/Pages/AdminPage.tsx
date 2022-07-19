import React, { useEffect, useState, useContext } from "react";
import Axios, { AxiosResponse } from "axios";
import { myContext } from "./Context";
import { UserInterface } from "../Interfaces/Interfaces";

export default function AdminPage() {
  const ctx = useContext(myContext);

  const [data , setData] = useState<UserInterface[]>(); //array of type UserInterfaces
  const [selectedUser, setSelectedUser] = useState<string>();

  useEffect(() => {
    Axios.get("http://localhost:4000/users", {
      withCredentials: true,
    }).then((res: AxiosResponse) => {
      setData(
        res.data.filter((item: UserInterface) => {
         return item.username !== ctx.username;
        })
      );
    });
  }, [ctx]);
  if (!data) {
    return null;
  }

  function deleteUser() {
    let userid: string;
    data!.forEach((item: UserInterface) => { //suppress TS error using !
      if (item.username === selectedUser) {
        userid = item.id;
      }
    });

    Axios.post(
      "http://localhost:4000/delete",
      {
        id: userid!, //suppress TS error using !
      },
      {
        withCredentials: true,
      }
    );
  }

  return (
    <div>
      <h1>Admin Page</h1>
      <select
        onChange={(e) => setSelectedUser(e.target.value)}
        id="select"
        name="deleteUser">
        <option id="select a username">Select Username</option>
        {data.map((item: UserInterface) => {
          return <option id={item.username}>{item.username}</option>;
        })}
      </select>
      <button onClick={deleteUser}>Delete user</button>
    </div>
  );
}
