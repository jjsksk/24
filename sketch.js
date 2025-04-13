let shapes = [];
let maxShapes = 30; // 限制總數為 30
let baseSize = 1;// 基本大小
let animations = {};// 動畫物件
let currentImage = null;// 當前圖片
let currentFrame = 0;// 當前幀
let lastFrameTime = 0;// 上一幀時間
let authorized = false;// 是否授權

function preload() {// 預加載圖片
  loadAnimations();
}

function setup() {//
  createCanvas(windowWidth, windowHeight);

  if (!authorized) {
    noLoop();
    passwordPrompt();
    return;
  }

  // 初始化圖形
  for (let i = 0; i < maxShapes; i++) {
    shapes.push(new RandomShape());
  }

  setupAnimations();
}

function draw() {
  if (!authorized) return; // 如果未授權，停止繪製

  background('#faedcd');

  // 更新並顯示圖形
  for (let s of shapes) {
    s.update();
    s.display();
  }

  // 更新並顯示動畫
  updateAndDisplayAnimation();
}

function mouseMoved() {
  if (!authorized) return; // 如果未授權，禁止互動

  if (mouseX > pmouseX) {
    baseSize += 0.1;
  } else if (mouseX < pmouseX) {
    baseSize = max(0.1, baseSize - 0.1);
  }
}

class RandomShape {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(5, 50); // 限制大小範圍在 5到 50
    this.type = random(['circle', 'diamond', 'star']);
    this.color = color(random(150, 255), random(150, 255), random(150, 255), 180);// 隨機顏色
    this.dx = random(-1, 1);// 隨機速度
    this.dy = random(-1, 1);// 隨機速度
  }

  update() {// 更新位置
    this.x += this.dx;
    this.y += this.dy;
    if (this.x < 0 || this.x > width) this.dx *= -1;
    if (this.y < 0 || this.y > height) this.dy *= -1;
  }

  display() {// 顯示圖形
    push();
    translate(this.x, this.y);
    fill(this.color);
    noStroke();

    let s = this.size * baseSize;
    switch (this.type) {
      case 'circle':
        ellipse(0, 0, s, s);
        break;
      case 'diamond':
        rotate(PI / 4);
        rectMode(CENTER);
        rect(0, 0, s, s);
        break;
      case 'star':
        drawStar(0, 0, s / 2, s, 5);
        break;
    }
    pop();
  }
}

function drawStar(x, y, radius1, radius2, npoints) {// 畫星形
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function passwordPrompt() {// 密碼提示函式
  let input = prompt('請輸入四位數密碼：');
  if (input === '2025') {
    authorized = true;
    loop(); // 啟動動畫
    setup(); // 重新初始化
  } else {
    alert('密碼錯誤，請重新輸入。');
    noLoop(); // 停止動畫
    passwordPrompt(); // 再次提示輸入密碼
  }
}

// 動畫處理模組
function loadAnimations() {
  const filenames = ['菲瑪.png', '黑馬.png', '白馬.png', '宗馬.png', '騎馬.png'];
  for (let name of filenames) {
    let img = loadImage('img/' + name);
    animations[name] = { img, slices: [], current: 0 };
  }
}

function setupAnimations() {
  for (let key in animations) {
    let anim = animations[key];
    let totalHeight = anim.img.height;
    let frameCount = 12;
    let sliceHeight = Math.floor(totalHeight / frameCount);

    for (let i = 0; i < frameCount; i++) {
      let y = i * sliceHeight;
      let h = (i === frameCount - 1) ? (totalHeight - y) : sliceHeight;
      let frame = createImage(anim.img.width, h);
      frame.copy(anim.img, 0, y, anim.img.width, h, 0, 0, anim.img.width, h);
      anim.slices.push(frame);
    }
  }
}

function updateAndDisplayAnimation() {
  if (currentImage && millis() - lastFrameTime > 166) {
    currentFrame = (currentFrame + 1) % 12;
    lastFrameTime = millis();
  }

  if (currentImage) {
    let anim = animations[currentImage];
    let img = anim.slices[currentFrame];
    if (img) {
      image(img, 10, 10, img.width, img.height);
    }
  }
}

function setHoverEffect() {
  const menus = [
    { name: '自我介紹', img: '菲瑪.png' },
    { name: '作品集', img: '黑馬.png' },
    { name: '測驗卷', img: '白馬.png' },
    { name: '教學影片', img: '宗馬.png' },
    { name: '回到首頁', img: '騎馬.png' }
  ];

  for (let m of menus) {
    const btn = Array.from(document.querySelectorAll('.dropbtn')).find(el => el.textContent === m.name);
    if (btn) {
      btn.addEventListener('mouseenter', () => {
        currentImage = m.img;
        currentFrame = 0;
        lastFrameTime = millis();
      });
      btn.addEventListener('mouseleave', () => {
        currentImage = null;
      });
    }
  }
}

window.addEventListener('DOMContentLoaded', setHoverEffect);

// DOM 操作函式
function showURL(url) {
  const frame = document.getElementById('content-frame');
  frame.innerHTML = `<iframe src="${url}"></iframe>`;
  frame.style.display = 'block';
}

function showImage(src) {
  const frame = document.getElementById('content-frame');
  frame.innerHTML = `<img src="${src}" alt="圖片內容">`;
  frame.style.display = 'block';
}

function showVideo(src) {
  const frame = document.getElementById('content-frame');
  frame.innerHTML = `<video controls src="${src}"></video>`;
  frame.style.display = 'block';
}

function goHome() {
  const frame = document.getElementById('content-frame');
  frame.innerHTML = '';
  frame.style.display = 'none';
}