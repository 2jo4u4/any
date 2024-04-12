import { concatAll, fromEvent, map, takeUntil, withLatestFrom } from "rxjs";

const size = 300;
const dragableBlock = document.createElement("div");
dragableBlock.style.height = `${size}px`;
dragableBlock.style.width = `${size}px`;
dragableBlock.style.background = "red";
dragableBlock.style.position = "absolute";
dragableBlock.style.top = "0px";
dragableBlock.style.left = "0px";

document.body.style.height = "100vh";
document.body.append(dragableBlock);

const start = fromEvent(dragableBlock, "mousedown");
const move = fromEvent(document.body, "mousemove");
const over = fromEvent(document.body, "mouseup");
const cancel = fromEvent(document.body, "mouseleave");

start
  .pipe(
    map(() => move.pipe(takeUntil(over), takeUntil(cancel))),
    concatAll(),
    withLatestFrom(start, (...evts) => {
      const [curr, first] = evts as [MouseEvent, MouseEvent];
      return {
        x: validValue(
          curr.clientX - first.offsetX,
          window.innerWidth - size,
          0
        ),
        y: validValue(
          curr.clientY - first.offsetY,
          window.innerHeight - size,
          0
        ),
      };
    })
  )
  .subscribe({
    next: (pos) => {
      dragableBlock.style.top = `${pos.y}px`;
      dragableBlock.style.left = `${pos.x}px`;
    },
    complete: () => {
      console.log("complete");
    },
  });

function validValue(value: number, max: number, min: number) {
  return Math.min(Math.max(value, min), max);
}
