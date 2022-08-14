canvas = document.querySelector("canvas");
ctx = canvas.getContext("2d");
box = document.querySelector(".box");
bg = document.querySelector(".bg");
home = document.querySelector(".home");
currentscore = document.querySelector(".currentscore");
current_life = document.querySelector(".life");
scorecard = document.querySelector(".scorecard");
var jumpsound = new Audio("jump.wav");
var collide = new Audio("jump2.wav");
var health = new Audio("healthpickup.wav");
var bgsound = new Audio("background sound.mp3");

canvas.width = window.screen.width;
canvas.height = innerHeight;
let points = 0;
highscore = 0;
platformwidth = 90;
movespeed = 2;
if (canvas.width > 900) {
  platformwidth = 170;
  movespeed = 3.5;
}

your_score = document.querySelector("#your_score");
high_score = document.querySelector("#high_score");
touch = false;
// tryagain button
tryagain = document.querySelector(".tryagain");
//start button
start = document.querySelector(".start");

try {
  console.log(window.localStorage.getItem("highscore"));
} catch (e) {
  window.localStorage.setItem("highscore", 0);
}

life = 1;
gamestart = false;
gameover = true;

function game_start() {
  canvas.classList.toggle("blur");
  bg.classList.toggle("blur");
  gamestart = true;
  home.style.zIndex = -1;
  scorecard.style.display = "none";
  currentscore.innerText = `Score: ${points}`;
  list_of_hearts = [];
  list_of_platform = [];
  current_life.innerText = `Life: ${life}`;
  movespeed = 2;
  if (canvas.width > 900) {
    platformwidth = 170;
    movespeed = 3.5;
  }
  ph.gravity = 3;
  ph.speed = 2;
  ph.jump = 10;
}
function game_over() {
  gamestart = false;
  // blur background
  your_score.innerText = `Score: ${points}`;
  if (highscore < points) {
    highscore = points;
    localStorage.setItem("highscore", highscore);
  }
  highscore = localStorage.getItem("highscore");
  high_score.innerText = `highscore: ${highscore}`;
  scorecard.style.display = "flex";
  canvas.classList.toggle("blur");
  bg.classList.toggle("blur");
  points = 0;
  life = 1;
}

start.addEventListener("click", () => {
  bgsound.play();
  setInterval(() => {
    bgsound.play();
  }, 215000);
  gamestart = true;
  home.style.zIndex = -1;
});
tryagain.addEventListener("click", game_start);

class ball {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.contact = false;
    this.left = false;
    this.right = false;
    this.jump = false;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class platform {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.contact = false;
  }
  draw() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class physics {
  constructor(gravity, speed, jump) {
    this.gravity = gravity;
    this.speed = speed;
    this.jump = jump;
  }
}

class heart {
  constructor(width, height) {
    this.x = Math.floor(20 + Math.random() * (width - 20));
    this.y = Math.floor(20 + Math.random() * (height - 20));
  }
  draw() {
    var heart = new Image();
    heart.src = "heart.png";
    ctx.drawImage(heart, this.x, this.y, 30, 30);
  }
}
list_of_platform = [];
list_of_hearts = [];
b = new ball(canvas.width / 2, 50, 15, "white");
ph = new physics(3, 2, 10);
console.log(ph);
createplatforms = setInterval(() => {
  if (gamestart) {
    p = new platform(
      Math.floor(Math.random() * (canvas.width - platformwidth)),
      innerHeight,
      platformwidth,
      15,
      "#3c50b1"
    );
    list_of_platform.push(p);
  }
}, 1500);
setInterval(() => {
  if (gamestart) {
    h = new heart(canvas.width, canvas.height);
    list_of_hearts.push(h);
    console.log("pushed");
    setTimeout(() => {
      list_of_hearts.pop();
      console.log("poped");
    }, 8000);
  }
}, 30000);

setInterval(() => {
  if (gamestart) {
    ph.gravity = ph.gravity + 1;
    ph.speed = ph.speed + 1;
    ph.jump = ph.jump + 1;
    movespeed = movespeed + 1;
    console.log(ph.gravity);
  }
}, 20000);

// main loop of the programe (120fps)
setInterval(() => {
  if (gamestart) {
    ctx.clearRect(0, 0, canvas.width, innerHeight);
    list_of_hearts.forEach((hearts) => {
      hearts.draw();
      if (Math.abs(hearts.x - b.x) <= 20) {
        if (Math.abs(hearts.y - b.y) <= 20) {
          health.play();
          life += 1;
          current_life.innerText = `Life: ${life}`;
          list_of_hearts.pop();
        }
      }
    });
    list_of_platform.forEach((e, i) => {
      e.y = e.y - ph.speed;
      if (
        b.y + b.radius >= e.y &&
        b.y + b.radius <= e.y + e.height &&
        b.x >= e.x &&
        b.x <= e.x + e.width
      ) {
        e.contact = true;
        e.color = "#3C50B1";
      } else {
        e.contact = false;
        e.color = "crimson";
      }
      if (e.contact) {
        b.y = b.y - ph.speed;
      }
      e.draw();
      if (e.y <= 0) {
        list_of_platform.splice(i, 1);
        console.log(list_of_platform);
      }
    });

    // code for ball movement

    b.contact = false;
    list_of_platform.forEach((e) => {
      if (e.contact) {
        b.contact = true;
        if (!touch) {
          touch = true;
          collide.play();
        }
        points = points + 1;
        currentscore.innerText = `Score: ${points}`;
      }
    });
    if (!b.contact && !b.jump) {
      b.y = b.y + ph.gravity;
      touch = false;
    }

    if (b.left && b.x - b.radius >= 0) {
      b.x = b.x - movespeed;
    }
    if (b.right && b.x + b.radius < canvas.width) {
      b.x = b.x + movespeed;
    }
    if (b.jump) {
      b.y = b.y - ph.jump;
    }

    if (b.y > innerHeight + b.radius) {
      console.log(b.y);
      life--;
      current_life.innerText = `Life: ${life}`;
      console.log(life);
      if (life == 0) {
        b.y = b.radius + 30;
        b.x = canvas.width / 2;
        game_over();
      } else {
        b.y = b.radius + 30;
        b.x = canvas.width / 2;
      }
    }
    if (b.y < 45) {
      console.log("gameoverertert");
      game_over();
    }
    b.draw();
  }
}, 1000 / 60);

document.addEventListener("keydown", (e) => {
  if (e.keyCode == 37) {
    console.log("left");
    b.left = true;
  }
  if (e.keyCode == 39) {
    console.log("right");
    b.right = true;
  }
});
document.addEventListener("keyup", (e) => {
  if (e.keyCode == 37) {
    b.left = false;
  }
  if (e.keyCode == 39) {
    b.right = false;
  }
});
document.addEventListener("keypress", (e) => {
  if (e.keyCode == 32) {
    console.log("space");
    if (b.contact) {
      b.jump = true;
      jumpsound.play();
    }
  }
  setTimeout(() => {
    b.jump = false;
  }, 200);
});
window.addEventListener("deviceorientation", (e) => {
  if (e.gamma > 10) {
    b.right = true;
    b.left = false;
  }
  if (e.gamma > -10 && e.gamma < 10) {
    console.log("not moving");
    b.right = false;
    b.left = false;
  }
  if (e.gamma < -10) {
    b.left = true;
    b.right = false;
  }
});
document.addEventListener("touchstart", (e) => {
  if (b.contact) {
    b.jump = true;
    jumpsound.play();
    setTimeout(() => {
      b.jump = false;
    }, 300);
  }
});
