const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let x_mid = canvas.width / 2;
let y_mid = canvas.height / 2;

/***********************************************/
function genVertices(num = 3, radius = 200) {
  const angle = 2 * Math.PI / num;
  let [x, y] = [x_mid, y_mid];
  let points = [];
  ctx.fillStyle = 'dodgerblue';
  for(let i = 0; i < num; i++) {
    let point = [Math.round(x+radius*Math.cos(i*angle)), Math.round(y+radius*Math.sin(i*angle))];
    points.push(point);
    ctx.fillRect(point[0], point[1], 1, 1);
  }
  return points;
}

/*******************************************************************/
function plotFractal(n) {
  if(n < 3 || n > 10) return;
  let r = [0, 0, 0, 0.5, 0.55, 0.618, 0.667, 0.692, 0.707, 0.742, 0.764]; // optimal r
  let points = genVertices(n);
  let [x, y] = [Math.random() * canvas.width, Math.random() * canvas.height];
  ctx.fillStyle = 'dodgerblue';
  
  for(let i = 0; i <= 100000; i++) {
    let pick = Math.floor(Math.random() * n);
    [x, y] = [x+(points[pick][0] - x) * r[n], y+(points[pick][1] - y) * r[n]]; 
    ctx.fillRect(x, y, 1, 1);
  }
}

plotFractal(6);
