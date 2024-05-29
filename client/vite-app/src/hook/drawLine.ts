import { DrawVal } from "./interface";

interface DrawValue extends DrawVal {
  color: string;
  size: number;
  isFilled: boolean;
}

export function drawLine({
  currentPoint,
  previousPoint,
  ctx,
  color,
  size,
  isFilled,
}: DrawValue) {
  const { x, y } = currentPoint;
  let startPoint = previousPoint ?? currentPoint;

  let sizes = size;
  let lineColor = color;

  ctx.beginPath();
  ctx.arc(startPoint.x, startPoint.y, sizes, 0, Math.PI * 2);
  ctx.fillStyle = lineColor;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(startPoint.x, startPoint.y);
  ctx.lineTo(x, y);
  ctx.lineWidth = sizes * 2;
  ctx.strokeStyle = lineColor;
  ctx.stroke();

  if (isFilled) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  } else {
    return;
  }
}
