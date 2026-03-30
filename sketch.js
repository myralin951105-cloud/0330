let upperPoints = [];
let lowerPoints = [];
let gameState = "WAITING"; // WAITING, PLAYING, GAMEOVER, WIN

function setup() {
  createCanvas(windowWidth, windowHeight);
  noCursor(); // 隱藏預設游標
  initGame();
}

function initGame() {
  upperPoints = [];
  lowerPoints = [];
  gameState = "WAITING";

  let margin = 50;
  let spacing = (windowWidth - margin * 2) / 4;
  let x = margin;

  for (let i = 0; i < 5; i++) {
    let uy = random(height * 0.3, height * 0.6);
    let gap = random(30, 60); 
    upperPoints.push({x: x, y: uy});
    lowerPoints.push({x: x, y: uy + gap});
    x += spacing;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(30); // 深色背景更有電流氛圍

  // 繪製路徑背景與邊界
  stroke(0, 255, 255); // 電光藍邊界
  strokeWeight(2);
  fill(50); // 路徑內部深灰色
  
  beginShape();
  for (let p of upperPoints) vertex(p.x, p.y);
  for (let i = lowerPoints.length - 1; i >= 0; i--) vertex(lowerPoints[i].x, lowerPoints[i].y);
  endShape(CLOSE);

  // 繪製起點與終點標示
  noStroke();
  fill(0, 255, 100, 150); // 起點綠色
  rect(upperPoints[0].x - 10, upperPoints[0].y, 20, lowerPoints[0].y - upperPoints[0].y);
  
  fill(255, 50, 50, 150); // 終點紅色
  rect(upperPoints[4].x - 10, upperPoints[4].y, 20, lowerPoints[4].y - upperPoints[4].y);

  // 遊戲邏輯處理
  if (gameState === "WAITING") {
    fill(255);
    textAlign(CENTER);
    textSize(20);
    text("請將滑鼠移至綠色起點開始", width / 2, height * 0.2);
    
    // 檢查是否進入起點
    if (dist(mouseX, mouseY, upperPoints[0].x, (upperPoints[0].y + lowerPoints[0].y)/2) < 30) {
      gameState = "PLAYING";
    }
  } 
  else if (gameState === "PLAYING") {
    if (!checkInside(mouseX, mouseY)) {
      gameState = "GAMEOVER";
    } else if (mouseX > upperPoints[4].x) {
      gameState = "WIN";
    }
  }

  // 顯示結果文字
  if (gameState === "GAMEOVER") {
    showOverlay("遊戲失敗", color(255, 50, 50));
  } else if (gameState === "WIN") {
    showOverlay("恭喜過關！", color(50, 255, 100));
  }

  // 繪製自定義滑鼠點
  fill(255, 255, 0); // 黃色亮點
  noStroke();
  ellipse(mouseX, mouseY, 10, 10);
}

function showOverlay(msg, col) {
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);
    noStroke();
    fill(col);
    textSize(40);
    textAlign(CENTER, CENTER);
    text(msg, width / 2, height / 2);
    textSize(20);
    text("點擊滑鼠重新開始", width / 2, height / 2 + 50);
}

function mousePressed() {
  if (gameState === "GAMEOVER" || gameState === "WIN") {
    initGame();
  }
}

function checkInside(mx, my) {
  // 在起點之前不判定失敗（讓玩家有準備空間）
  if (mx < upperPoints[0].x) return true;
  
  // 超過終點
  if (mx > upperPoints[upperPoints.length - 1].x) {
    // 檢查是否是在終點的 Y 範圍內出去的
    let lastIdx = upperPoints.length - 1;
    if (my >= upperPoints[lastIdx].y && my <= lowerPoints[lastIdx].y) return true;
    return false;
  }
  
  // 線段插值碰撞偵測
  for (let i = 0; i < upperPoints.length - 1; i++) {
    if (mx >= upperPoints[i].x && mx <= upperPoints[i+1].x) {
      let t = (mx - upperPoints[i].x) / (upperPoints[i+1].x - upperPoints[i].x);
      let currentUpperY = lerp(upperPoints[i].y, upperPoints[i+1].y, t);
      let currentLowerY = lerp(lowerPoints[i].y, lowerPoints[i+1].y, t);
      
      // 回傳滑鼠是否在上下邊界內
      return (my >= currentUpperY && my <= currentLowerY);
    }
  }
  return false;
}
