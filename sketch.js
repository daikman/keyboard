let whiteKeys = ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"];
let whitePressed = [];
let whiteTones = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25]
let blackKeys = ["w", "e", "t", "y", "u", "o", "p"];
let blackTones = [277.18, 311.13, 369.99, 415.30, 466.16, 554.37, 622.25]
let blackPressed = [];

let tones = [];

function setup() {
  let c = createCanvas(600, 400);
  c.parent("canvas")
  for (let i = 0; i < 10; i++) {
    whitePressed[i] = false;
  }
  for (let i = 0; i < 7; i++) {
    blackPressed[i] = false;
  }
}

function draw() {
  clear()
  fill(220, 200, 170);
  noStroke()
  rect(0, 0, width, height, 20)
  drawKeyboard(50, 180, 500, 200);
  vis(0, 0, width, 180);
  handleTones();
}

function drawKeyboard(x, y, width, height) {
  push()
  textAlign(CENTER)
  textSize(20)
  translate(x, y)
  noStroke()
  // draw white keys
  for (i = 0; i < 10; i++) {
    let keyWidth = width/10
    let xPos = i*keyWidth
    if (whitePressed[i]) {
      fill(200)
    } else {
      fill(255)
    }
    rect(xPos, 32, keyWidth - 2, height - 32, 16)
    fill(0)
    text(whiteKeys[i], xPos + (keyWidth - 2)/2, height-10)
  }
  // draw black keys
  for (i = 0; i < 7; i++) {
    let keyWidth = width/10
    let xPos = i*keyWidth + keyWidth/2
    if (i >= 2) {
      xPos += keyWidth
    }
    if (i >= 5) {
      xPos += keyWidth
    }
    if (blackPressed[i]) {
      fill(55)
    } else {
      fill(20)
    }
    rect(xPos, 0, keyWidth - 2, height/1.5, 16)
    fill(255)
    text(blackKeys[i], xPos + (keyWidth - 2)/2, height/1.5-10)
  }
  pop()
}

function vis(x, y, width, height) {
  push()
  translate(x, y)
  noFill()
  let amps = [];
  let freqs = [];
  let maxAmp, maxFreq
  for (let tone of tones) {
    amps.push(tone.l)
    freqs.push(tone.t.value)
  }
  if (tones.length == 0) {
    maxAmp = 1
    maxFreq = 0
  } else {
    maxAmp = max(amps)
    maxFreq = max(freqs)
  }
  translate(width/2, height/2)
  rotate(map(sin(frameCount/25)*maxAmp, -100, 100, TWO_PI, 0))
  
  let rad = map(maxAmp, 0, 100, 16, height/2 - 8) + random(-2, 2)
  let sides = tones.length + 3
  stroke(0)
  polygon(0, 0, rad, sides)

  pop()
}

function keyTyped() {
  for (let i in whiteTones) {
    if (key == whiteKeys[i]) {
      addTone(whiteTones[i])
      whitePressed[whiteKeys.indexOf(key)] = true
    }
  }
  
  for (let i in blackTones) {
    if (key == blackKeys[i]) {
      addTone(blackTones[i])
      blackPressed[blackKeys.indexOf(key)] = true
    }
  }
}

function keyReleased() {
  for (let i in whiteTones) {
    if (key == whiteKeys[i]) {
      whitePressed[whiteKeys.indexOf(key)] = false
    }
  }
  for (let i in blackTones) {
    if (key == blackKeys[i]) {
      blackPressed[blackKeys.indexOf(key)] = false
    }
  }
  return false; // prevent any default behavior
}

function addTone(freq) {
  let toneExists = false
  for (let tone of tones) {
    if (tones.indexOf(tone.t.f) > -1) {
      toneExists = true
    }
  }
  
  if (!toneExists) {
    let tone = new p5.Oscillator()
    tone.freq(freq) 
    tones.push({t: tone, l: 100})
  }
}

function handleTones() {
  for (let i in tones) {
    let tone = tones[i]
    //let currentFreq = tone.t.freq().value
    //tone.t.freq(currentFreq + sin(frameCount)*2)
    if (tone.l == 100 & !tone.t.started) {
      tone.t.start()
    }
    
    let amp = map(tone.l, 0, 100, 0, 1)
    tone.t.amp(amp)
    
    if (tone.l <= 0) {
      tone.t.stop()
    }
    
    // is tone black or white
    let blackIndex = blackTones.indexOf(tone.t.f) 
    let whiteIndex = whiteTones.indexOf(tone.t.f)
    
    let isPressed = blackPressed[blackIndex] | whitePressed[whiteIndex]
    if (!isPressed) {
      let reduce = round(map(tone.l, 0, 100, 3, 1))
      tone.l -= reduce;
    }
  
  }
  
  for (let i in tones) {
    if (!tones[i].t.started) {
      tones.splice(i, 1)
    }
  }
}

function polygon(x, y, radius, npoints) {
  let angle = TWO_PI / npoints;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
