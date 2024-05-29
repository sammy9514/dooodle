import { useEffect, useRef, useState } from "react";
import { DrawVal } from "./interface";

export const useDraw = (
  onDraw: ({ currentPoint, previousPoint, ctx }: DrawVal) => void
) => {
  const canvasRef: any = useRef<HTMLCanvasElement>(null);
  const canvas: any = canvasRef.current;
  const previousPoint: any = useRef(null);
  const [mouseDown, setMouseDown] = useState(false);
  const onMouseDown = () => setMouseDown(true);

  const clear = () => {
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    const canvas: any = canvasRef.current;
    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseDown) return;
      const currentPoint = getCoordinate(e);
      const ctx = canvas.getContext("2d");
      if (!ctx || !currentPoint) return;
      onDraw({ currentPoint, previousPoint: previousPoint.current, ctx });
      previousPoint.current = currentPoint;
    };

    const getCoordinate = (e: MouseEvent) => {
      const x = e.offsetX;
      const y = e.offsetY;
      return { x, y };
    };

    const handleMouseUp = () => {
      setMouseDown(false);
      previousPoint.current = null;
    };

    canvas?.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => canvas?.removeEventListener("mousemove", handleMouseMove);
  }, [onDraw]);

  return { canvasRef, onMouseDown, clear };
};
