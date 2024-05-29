import { useEffect, useRef, useState } from "react";
import { DrawVal } from "../hook/interface";
import { useDraw } from "../hook/useDraw";
import { drawLine } from "../hook/drawLine";
import { io } from "socket.io-client";
import { LoginUser } from "./LoginUser";
import { Timer } from "./Timer";
import { Word } from "./Word";

export const Draw = () => {
  const { canvasRef, onMouseDown, clear } = useDraw(createLine);
  const [color, setColor] = useState("black");
  const [isFilled, setIsFilled] = useState(false);
  const [isDrawer, setIsDrawer] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [userId, setUserId] = useState("");
  const socket = useRef(io("http://localhost:7777")).current;

  // const page = window.location.pathname;

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");

    socket.emit("client-ready");

    socket.on("get-canvas-state", () => {
      if (canvasRef.current) {
        socket.emit("canvas-state", canvasRef.current.toDataURL());
      }
    });

    socket.on("canvas-state-from-server", (state) => {
      const img = new Image();
      img.src = state;
      img.onload = () => {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(img, 0, 0);
      };
    });

    socket.on("select-drawer", (drawerId) => {
      setIsDrawer(userId === drawerId);
      console.log(userId === drawerId, drawerId, userId);
    });

    socket.on("draw", (data) => {
      const { currentPoint, previousPoint, color, size, isFilled } = data;
      if (ctx) {
        drawLine({ currentPoint, previousPoint, color, size, isFilled, ctx });
      }
    });

    socket.on("user-id", (data) => {
      setUserId(data);
      setIsLogin(true);
    });

    socket.on("clear", () => {
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    });

    return () => {
      socket.off("draw");
      socket.off("get-canvas-state");
      socket.off("canvas-state-from-server");
      socket.off("clear");
      socket.off("select-drawer");
      socket.off("user-id");
    };
  }, [canvasRef, userId]);

  function createLine({ currentPoint, previousPoint, ctx }: DrawVal) {
    if (!isDrawer) return;
    drawLine({ currentPoint, previousPoint, ctx, color, size, isFilled });

    socket.emit("draw", {
      currentPoint,
      previousPoint,
      color,
      size,
      isFilled,
    });
  }

  const size = 5;
  const colors = [
    "red",
    "yellow",
    "blue",
    "green",
    "black",
    "orange",
    "pink",
    "purple",
    "grey",
    "brown",
  ];

  return (
    <div className=" h-screen w-full  relative">
      {isLogin ? (
        <div>
          <Word socket={socket} isDrawer={isDrawer} />
          <div className="flex justify-end w-full h-full px-9">
            <div className="mt-[10rem]">
              <Timer socket={socket} />
              <canvas
                ref={canvasRef}
                width={750}
                height={650}
                className="border-[4px] border-black"
                onMouseDown={onMouseDown}
              ></canvas>
              {isDrawer && (
                <div className="mt-[30px] flex justify-center">
                  <div className="w-[206px] flex flex-wrap border-[3px] border-black">
                    {colors.map((color, i) => (
                      <button
                        key={i}
                        className="w-[40px] h-[40px]"
                        style={{ backgroundColor: color }}
                        value={color}
                        onClick={(e: any) => {
                          setColor(e.target.value);
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-4 pl-2">
                    <button
                      onClick={() => {
                        socket.emit("clear");
                        clear();
                      }}
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => {
                        setIsFilled(!isFilled);
                      }}
                    >
                      {isFilled ? "Filled" : "Fill"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <LoginUser socket={socket} />
      )}
    </div>
  );
};
