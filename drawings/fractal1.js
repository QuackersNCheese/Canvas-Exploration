const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let x_mid = canvas.width / 2;
let y_mid = canvas.height / 2;

/*******************************************************************/
function plotFractal() {
  let points = [[0, 0], [canvas.width, 0], [x_mid, canvas.height]];
  let [x, y] = [Math.random() * canvas.width, Math.random() * canvas.height];
  ctx.fillStyle = 'dodgerblue';
  for(let i = 0; i <= 100000; i++) {
    let pick = Math.floor(Math.random() * 3);
    [x, y] = [(x + points[pick][0]) / 2, (y + points[pick][1]) / 2]; 
    ctx.fillRect(x, y, 1, 1);
  }
}
plotFractal();
