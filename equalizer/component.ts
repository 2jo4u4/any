import { AudioContextWithMethod, Equalizer } from "./core";

/**
 * UI組件
 */
export class EqualizerUIComponent {
  static dashboard() {
    const dashboard = document.createElement("div");
    dashboard.style.border = "1px #929292 solid";
    dashboard.style.margin = "8px";
    dashboard.style.padding = "8px";
    dashboard.style.borderRadius = "8px";
    dashboard.style.background = "#81adff3b";
    dashboard.style.width = "fit-content";
    dashboard.style.display = "flex";
    dashboard.style.gap = "10px";
    return dashboard;
  }
  static sliderInput() {
    const input = document.createElement("input");
    input.type = "range";
    input.style.writingMode = "vertical-lr";
    input.style.direction = "rtl";
    input.style.height = "180px";
    input.style.width = "32px";
    return input;
  }
  static sliderContiner() {
    const block = document.createElement("div");
    block.style.display = "flex";
    block.style.flexDirection = "column";
    block.style.alignItems = "center";
    block.style.width = "fit-content";
    return block;
  }

  core: AudioContextWithMethod;
  equalizer: Equalizer;
  dashboardEl: HTMLDivElement;
  sliderList: { container: HTMLDivElement; input: HTMLInputElement }[];
  constructor(el: HTMLMediaElement, contextOptions?: AudioContextOptions) {
    this.equalizer = new Equalizer(el, contextOptions);
    this.core = this.equalizer.audio;
    this.dashboardEl = EqualizerUIComponent.dashboard();
    this.sliderList = [];
    this.stream = this.equalizer.stream.bind(this.equalizer);
  }
  /** 串接佇列上的濾波器，推薦串流前先暫停，結束後再播放。 (reference `this.equalizer.stream`) */
  stream;
  reset() {
    this.sliderList.forEach(({ input }) => {
      input.value = input.dataset.init;
      input.dispatchEvent(
        new InputEvent("input", { data: input.dataset.init })
      );
    });
  }

  /**
   * @param init 初始值
   * @param max 最大值
   * @param min 最小值
   * @param step 步進值
   * @param {Object} option 可選參數，若無指定則需自行將濾波器與input元素介接
   * @param option.target 指定調整濾波器的參數，預設調整'gain'
   * @param option.addToDashBoard 是否添加到 `dashboardEl`(default: true)
   * @param option.filter 提供濾波器(提供之濾波器將會被存儲於`Equalizer.queue`)
   * @param option.fliterType 濾波器類型
   * @returns
   */
  addSilder(
    init: number,
    max: number,
    min: number,
    step: number,
    option?: {
      target?: "frequency" | "Q" | "gain";
      addToDashBoard?: boolean;
    } & (
      | {
          filter: BiquadFilterNode;
        }
      | {
          fliterType: BiquadFilterType;
          f?: number;
          q?: number;
          g?: number;
        }
    )
  ) {
    const initStr = init.toString(),
      maxStr = max.toString(),
      minStr = min.toString(),
      stepStr = step.toString(),
      input = EqualizerUIComponent.sliderInput(),
      container = EqualizerUIComponent.sliderContiner();

    input.max = maxStr;
    input.min = minStr;
    input.step = stepStr;
    input.value = initStr;
    input.dataset.init = initStr;

    const { target, filter, addToDashBoard, fliterType, f, q, g } =
      Object.assign(
        {
          target: "gain",
          addToDashBoard: true,
          filter: undefined as BiquadFilterNode | undefined,
          fliterType: undefined as BiquadFilterType | undefined,
          f: 350,
          q: 1,
          g: 0,
        },
        option
      );
    let targetFilter: BiquadFilterNode;
    if (filter !== undefined) {
      targetFilter = filter;
    } else if (fliterType !== undefined) {
      targetFilter = this.core[fliterType]({ f, q, g });
    }

    if (targetFilter) {
      input.addEventListener("input", function () {
        const newVal = parseFloat(this.value);
        targetFilter[target].value = newVal;
      });

      this.equalizer.addFilterToQueue(targetFilter);
    }

    const titleText = document.createElement("span"),
      maxText = document.createElement("span"),
      minText = document.createElement("span");

    maxText.innerText = maxStr;
    minText.innerText = minStr;
    titleText.innerHTML = `${targetFilter.frequency.value} HZ`;
    titleText.style.marginBottom = "4px";

    container.append(titleText, maxText, input, minText);
    this.sliderList.push({ container, input });
    if (addToDashBoard) {
      this.dashboardEl.append(container);
    }
    return this;
  }
}

export class ComponentForEqualizer {
  static dashboard() {
    const dashboard = document.createElement("div");
    dashboard.style.border = "1px #929292 solid";
    dashboard.style.margin = "8px";
    dashboard.style.padding = "8px";
    dashboard.style.borderRadius = "8px";
    dashboard.style.background = "#81adff3b";
    dashboard.style.width = "fit-content";
    dashboard.style.display = "flex";
    dashboard.style.gap = "10px";
    return dashboard;
  }
  static sliderInput() {
    const input = document.createElement("input");
    input.type = "range";
    input.style.writingMode = "vertical-lr";
    input.style.direction = "rtl";
    input.style.height = "180px";
    input.style.width = "32px";
    return input;
  }
  static sliderContiner() {
    const block = document.createElement("div");
    block.style.display = "flex";
    block.style.flexDirection = "column";
    block.style.alignItems = "center";
    block.style.width = "fit-content";
    return block;
  }
}
