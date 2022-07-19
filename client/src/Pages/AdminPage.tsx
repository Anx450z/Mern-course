import React, { useEffect, useState, useContext } from "react";
import Axios, { AxiosResponse } from "axios";
import { myContext } from "./Context";

export default function AdminPage() {
  const ctx = useContext(myContext);

  const [data, setData] = useState<any>();
  const [selectedUser, setSelectedUser] = useState<string>();

  useEffect(() => {
    Axios.get("http://localhost:4000/users", {
      withCredentials: true,
    }).then((res: AxiosResponse) => {
      setData(
        res.data.filter((item: any) => {
         return item.username !== ctx.username;
        })
      );
    });
  }, []);
  if (!data) {
    return null;
  }

  function deleteUser() {
    let userid: any;
    data.forEach((item: any) => {
      if (item.username === selectedUser) {
        userid = item._id;
      }
    });

    Axios.post(
      "http://localhost:4000/delete",
      {
        id: userid,
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
        {data.map((item: any) => {
          return <option id={item.username}>{item.username}</option>;
        })}
      </select>
      <button onClick={deleteUser}>Delete user</button>
    </div>
  );
}
