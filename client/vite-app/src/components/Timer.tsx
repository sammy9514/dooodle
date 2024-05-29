import { FC, useState } from "react";

interface time {
  socket: any;
}

export const Timer: FC<time> = ({ socket }) => {
  const [time, setTime]: any = useState(60000);

  socket.on("time", (data: any) => {
    setTime(timer(data.remainingTime));
  });
  const timer = (time: any) => {
    const seconds = Math.floor((time % 60000) / 1000);
    return `${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="w-[50px] h-[50px] rounded-full border-[3px] border-blue-600 flex justify-center items-center text-[18px] font-bold mb-3 ">
      {time === 60000 ? "60" : time}
    </div>
  );
};
