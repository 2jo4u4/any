import { Equalizer, EqualizerUIComponent } from "./equalizer";
import mp4 from "./River Flows in You.mp4";

declare global {
  interface Window {
    equaizer: Equalizer;
  }
}
const container = document.querySelector("#container");

const video = document.createElement("video");
video.src = mp4;
video.controls = true;
video.autoplay = true;

container.append(video);

const equalizerBoard = document.querySelector("#equalizer");
const equaizer = new Equalizer(video);
equaizer
  .addFilterToQueueByParam("peaking", 60, 0.7, 0)
  .addFilterToQueueByParam("peaking", 230, 0.7, 0)
  .addFilterToQueueByParam("peaking", 910, 0.7, 0)
  .addFilterToQueueByParam("peaking", 4000, 0.7, 0)
  .addFilterToQueueByParam("peaking", 14000, 0.7, 0);

equaizer.queue.forEach((node) => {
  const input = sliderInput(12, -12, 0.5, node);
  equalizerBoard.append(input);
});

window.equaizer = equaizer;

function sliderInput(
  max: number,
  min: number,
  step: number,
  filter: BiquadFilterNode
) {
  const input = document.createElement("input");
  input.type = "range";
  input.style.writingMode = "vertical-lr";
  input.style.direction = "rtl";
  input.style.height = "180px";
  input.style.width = "32px";

  input.max = max + "";
  input.min = min + "";
  input.step = step + "";
  input.value = filter.gain.value + "";
  input.oninput = function () {
    filter.gain.value = parseFloat(input.value);
  };

  return input;
}
