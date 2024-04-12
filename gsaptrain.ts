import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fromEvent } from "rxjs";

gsap.registerPlugin(ScrollTrigger);

class ScrollCtrlVideo extends HTMLElement {
  showRoot;
  container;
  video;
  tl;
  stylestr = `
      <style>
        :host video {
          width: 100%;
          position: sticky;
          top: 0;
          left: 0;
        }
        :host div {
          width: 100%;
          height: 500vh;
          position: relative;
        }
      </style>
    `;

  constructor() {
    super();
    this.showRoot = this.attachShadow({ mode: "open" });

    this.container = document.createElement("div");
    this.video = document.createElement("video");
    this.video.src = this.getAttribute("src");
    this.tl = gsap.timeline({
      defaults: { duration: 1 },
      scrollTrigger: {
        trigger: this.container,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });
    fromEvent(this.video, "loadedmetadata").subscribe((event) => {
      this.tl.fromTo(
        this.video,
        { currentTime: 0 },
        { currentTime: this.video.duration || 1 }
      );
    });
    this.showRoot.innerHTML = this.stylestr;

    this.showRoot.appendChild(this.container).appendChild(this.video);
  }
}

window.customElements.define("scroll-ctrl-video", ScrollCtrlVideo);
