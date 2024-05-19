//这里是AD的word-shift.js
function predictableRandom(x) {
  let start = Math.pow(x % 97, 4.3) * 232344573;
  const a = 15485863;
  const b = 521791;
  start = (start * a) % b;
  for (let i = 0; i < (x * x) % 90 + 90; i++) {
    start = (start * a) % b;
  }
  return start / b;
}

function randomSymbol() {
  return String.fromCharCode(Math.floor(Math.random() * 50) + 192);
}

function mergeColor(color1, color2, frac) {
  if (frac < 0) return `rgb(${color1.join(",")})`;

  if (frac > 1) return `rgb(${color2.join(",")})`
  return `rgb(${color1.map((c, i) => c * (1 - frac) + color2[i] * frac).join(",")})`
}

const wordShift = {
  // Word cycling uses two diffrent effects to smoothly ease between words in the randomized set
  // - The randomization effect eases in and out smoothly, with about 62% in the time in the middle being
  //   completely unrandomized (randomCrossWords is passed frac <= 0). The randomization parameter goes well above 1
  //   in order to have a good chance of properly randomizing the entire input in the middle
  // - Near the "edges" (12% on each side) of each word's randomization time, it's blended with the previous or next
  //   word. This mostly serves to smoothly ease between strings of different lengths, and only occurs between
  //   strings which already have a high randomization fraction (frac > 1.3)
  wordCycle(list, noBuffer = false) {
    const len = list.length;
    const tick = Math.floor(Date.now() / 250) % (len * 5);
    const mod5 = ((Date.now() / 250) % (len * 5)) % 5;
    const largeTick = Math.floor(tick / 5);
    let v = list[largeTick].text;
    // Blend with adjacent words, in such a way that mod5 being 0 or 5 corresponds with a 0.5 blend parameter
    if (mod5 < 0.6) {
      v = this.blendWords(list[(largeTick + list.length - 1) % list.length].text, list[largeTick].text, (mod5 + 0.6) / 1.2);
    } else if (mod5 > 4.4) {
      v = this.blendWords(list[largeTick].text, list[(largeTick + 1) % list.length].text, (mod5 - 4.4) / 1.2);
    }

    v = this.randomCrossWords(v, 0.1 * Math.pow(mod5 - 2.5, 4) - 0.6);
    if (noBuffer) return v;
    const maxWordLen = Math.max(...list.map(x => x.text.length));
    const bufferSpace = (maxWordLen - v.length) / 2;
    //console.log(mod5)
    // Buffer the result with ALT+255 on either side to prevent the ui from twitching.
    // Spaces do not work due to being automatically collapsed, and css fixing this causes other issues.
    //v = " ".repeat(Math.ceil(bufferSpace)) + v + " ".repeat(Math.floor(bufferSpace));
    return {
      text: v,
      color: mergeColor(list[(largeTick + len - 1) % len].color, list[largeTick].color, mod5)
    }
  },
  // Note that while frac may appear to specify the proportion of letters randomized, it may end up being slightly less
  // depending on the specific string length and random output sometimes giving outputs which aren't coprime
  randomCrossWords(str, frac = 0.7) {
    if (frac <= 0) return str;
    const x = str.split("");
    for (let i = 0; i < x.length * frac; i++) {
      const randomIndex = Math.floor(predictableRandom(Math.floor(Date.now() / 500) % 964372 + 1.618 * i) * x.length);
      x[randomIndex] = randomSymbol();
    }
    return x.join("");
  },
  // This should only be used on words which will end up being completely randomized, because the unscrambled appearance
  // of the output may look bad. Blends two strings together to produce a string of intermediate length, taking a
  // specifed fraction (param, 0 to 1) from the first word and the rest (1 - param) from the second
  blendWords(first, second, param) {
    if (param <= 0) return first;
    if (param >= 1) return second;
    return first.substring(0, first.length * (1 - param)) +
      second.substring(second.length * (1 - param), second.length);
  }
};
//画布
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const stream = canvas.captureStream();
const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' })
const data = [];
let stoped = false;
let started = false;

recorder.ondataavailable = function(event) {
  if (event.data && event.data.size) {
    data.push(event.data);
  }
};

recorder.onstop = () => {
  const url = URL.createObjectURL(new Blob(data, { type: 'video/webm' }));
  stoped = true;
  const video = document.createElement("video")
  video.src = url;
  document.body.appendChild(video)
};
const width = canvas.width;
const height = canvas.height;
let lastText = "";

const cycleContent = [
  {
    text: "Teresa",
    color: getColor("teresa--base")
    },
  {
    text: "Effarig",
    color: getColor("effarig--base")
    },
  {
    text: "Nameless",
    color: getColor("enslaved--base")
    },
  {
    text: "V",
    color: getColor("v--base")
    },
  {
    text: "Ra",
    color: getColor("ra--base")
    },
  {
    text: "Lai'tela",
    color: getColor("laitela--base")
    },
  {
    text: "Pelle",
    color: getColor("pelle--base")
    },
  {
    text: "Archemede",
    color: getColor("archemede--base")
    },
  {
    text: "Einstein",
    color: getColor("einstein--base")
    },
  {
    text: "Newton",
    color: getColor("newton--base")
    },
  {
    text: "Joule",
    color: getColor("joule--base")
    },
  {
    text: "Planck",
    color: getColor("planck--base")
    },
  {
    text: "Kelvin",
    color: getColor("kelvin--base")
    },
  {
    text: "Boltzmann",
    color: getColor("boltzmann--base")
    },
  {
    text: "Poincare",
    color: getColor("poincare--base")
    },
  {
    text: "Pascal",
    color: getColor("pascal--base")
    },
  {
    text: "Gauss",
    color: getColor("gauss--base")
    },
  {
    text: "Ellep",
    color: getColor("ellep--base")
    },
  {
    text: "Reinahitomi",
    color: getColor("reinahitomi--base")
    },
  {
    text: "Relitus",
    color: getColor("relitus--base")
    },
  {
    text: "Mandelbrot",
    get color() {
        return getUndulatingColor()
      }
    },
  ]

function frame() {
  
  const _data = wordShift.wordCycle(cycleContent);
  if (_data.text !== lastText) {
    lastText = _data.text;
    //开始和停止
    //TODO: 这里十分不优雅，需要改进
    if (lastText === cycleContent[0].text) {
      if (!started) {
        started = true;
      } else {

      }
    }
  }
  ctx.reset()
  //背景颜色
  ctx.fillStyle = "#EEEDF1"
  ctx.fillRect(0, 0, width, height);
  //90px是大小，RonotoMono是字体
  ctx.font = "90px MonospaceTypewriter";
  //居中
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  
  //设置颜色
  ctx.fillStyle = _data.color;
  //写字
  ctx.fillText(_data.text, width / 2, height / 2);
  //结束后停止更新
  requestAnimationFrame(frame);
}

//这里是从css获取颜色值
function getColor(name) {
  const textHexCode = getComputedStyle(document.body).getPropertyValue(`--color-${name}`).split("#")[1];
  return [
    parseInt(textHexCode.substring(0, 2), 16),
    parseInt(textHexCode.substring(2, 4), 16),
    parseInt(textHexCode.substring(4), 16)
  ]
}

frame()

//刚开始卡顿是正常现象
//显示Teresa时开始录制
//录制时不会卡顿
//在第二次出现Teresa时结束
//结束后会在html中添加一个video元素
//下载视频后到[视频转gif]相关网站转换
function getUndulatingColor(period = Math.sqrt(20.24)) {
  let t = new Date().getTime()
  let a = Math.sin(t / 1e3 / period * 2 * Math.PI + 0)
  let b = Math.sin(t / 1e3 / period * 2 * Math.PI + 2)
  let c = Math.sin(t / 1e3 / period * 2 * Math.PI + 4)
  return [a*128+128,b*128+128,c*128+128]
}