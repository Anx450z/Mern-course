import React, { useState } from "react";
import axios, { AxiosResponse } from "axios";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  function login() {
    axios
      .post(
        "http://localhost:4000/login",
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      )
      .then(
        (res: AxiosResponse) => {
          if (res.data === "login success") {
            window.location.href = "/";
          }
        },
        () => {
          console.log("failure");
        }
      );
  }

  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login}>Login</button>
    </div>
  );
}
