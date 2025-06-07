const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let x_mid = canvas.width / 2;
let y_mid = canvas.height / 2;

/*******************************************************************/
function plotFractal(n) {
  let r = 2/3; // optimal r
  let points = [[0,0], [canvas.width, 0], [0, canvas.height], [canvas.width, canvas.height], [0, y_mid], [canvas.width, y_mid], [x_mid, 0], [x_mid, canvas.height]];
  let [x, y] = [Math.random() * canvas.width, Math.random() * canvas.height];
  //ctx.fillStyle = 'dodgerblue';
  
  for(let i = 0; i <= 50000000; i++) {
    pick = Math.floor(Math.random() * 8);
    [x, y] = [x+(points[pick][0] - x) * r, y+(points[pick][1] - y) * r];
    ctx.fillStyle = `hsla(${Math.round(360 * pick / 8)},100%,50%,1)`; 
    ctx.fillRect(x, y, 1, 1);
  }
}

plotFractal(4);
