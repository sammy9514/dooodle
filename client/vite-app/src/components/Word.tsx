import { FC, useEffect, useState } from "react";

interface WordProps {
  socket: any;
  isDrawer: boolean;
}

export const Word: FC<WordProps> = ({ socket, isDrawer }) => {
  const [words, setWords] = useState<string[]>([]);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const handleSelectWord = (data: string[]) => {
      setWords(data);
      setClicked(false);
    };

    socket.on("select-word", handleSelectWord);

    return () => {
      socket.off("select-word", handleSelectWord);
    };
  }, [socket]);

  const handleWordSelect = (word: string) => {
    socket.emit("word-selected", word);
    setClicked(true);
  };

  return (
    <>
      {isDrawer && !clicked && (
        <div
          className="w-full h-full  absolute flex justify-center items-center gap-5 "
          style={{
            background: " rgba(255, 255, 255, 0.18)",
            borderRadius: " 16px",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(7.8px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          {words.map((word, i) => (
            <button
              key={i}
              onClick={() => handleWordSelect(word)}
              className="border-[2px] border-black rounded-md text-[19px] font-semibold px-5 py-1"
            >
              {word}
            </button>
          ))}
        </div>
      )}
    </>
  );
};
