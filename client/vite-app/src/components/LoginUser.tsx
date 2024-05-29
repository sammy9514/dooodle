import { FC, useEffect, useState } from "react";

interface soc {
  socket: any;
}

export const LoginUser: FC<soc> = ({ socket }) => {
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [clicked, setClicked] = useState(false);

  const generateUserId = () => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "123456789";
    const alpnum = alphabet + numbers;
    let id = "";
    for (let i = 0; i < 6; i++) {
      const rand = Math.floor(Math.random() * alpnum.length);
      id += alpnum[rand];
    }
    return id;
  };

  useEffect(() => {
    if (clicked) {
      if (name && userId) {
        const data = { name, userId };
        socket.emit("user-info", data);
        console.log(data);
      }
    }
  }, [clicked, name, userId]);

  const handleLoginClick = () => {
    if (name) {
      const id = generateUserId();
      setUserId(id);
      setClicked(true);
    }
  };

  return (
    <>
      {!clicked ? (
        <div className="w-full h-screen flex justify-center items-center flex-col">
          <input
            type="text"
            placeholder="ENTER USERNAME"
            className="border-[3px] border-black px-6 py-2"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <button onClick={handleLoginClick}>login</button>
        </div>
      ) : (
        clicked
      )}
    </>
  );
};
