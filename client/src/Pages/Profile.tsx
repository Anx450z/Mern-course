import React, { useContext } from "react";
import { myContext } from "./Context";

export default function Profile() {
  const ctx = useContext(myContext);

  return (
    <div>
      <h1>Profile</h1>
      <p>Logged in as : {ctx.username}</p>
    </div>
  );
}
