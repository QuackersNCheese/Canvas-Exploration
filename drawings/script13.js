const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let x_mid = canvas.width / 2;
let y_mid = canvas.height / 2;
      
function drawAxes(color = 'rgba(255, 255, 255, 0.5)') {
  ctx.setLineDash([2, 3]);
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, y_mid);
  ctx.lineTo(canvas.width, y_mid);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x_mid, 0);
  ctx.lineTo(x_mid, canvas.height);
  ctx.stroke();
}

function drawGrid(t_div = 50, v_div = 50, color = 'rgba(255, 255, 255, 0.5)') {
  ctx.setLineDash([1, 4]);
  ctx.strokeStyle = color;

  // center out from axes guarantees axis/grid alignment
  for(let i = 0; i < x_mid; i += t_div) {
    ctx.beginPath();
    ctx.moveTo(x_mid + i, 0);
    ctx.lineTo(x_mid + i, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x_mid - i, 0);
    ctx.lineTo(x_mid - i, canvas.height);
    ctx.stroke();
  }
  for(let i = 0; i < y_mid; i += v_div) {
    ctx.beginPath();
    ctx.moveTo(0, y_mid + i);
    ctx.lineTo(canvas.width, y_mid + i);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, y_mid - i);
    ctx.lineTo(canvas.width, y_mid - i);
    ctx.stroke();
  }
}

/***************************************************
 f is an anonymous call back function, so to input a 
 function like f(x) = 3x+1, use:  x => 3 * x + 1
 ***************************************************/
function plotFunc(f, color='hsl(190, 100%, 60%)', tol = 4) {
  for(let x = 0; x <= canvas.width; x += 1) {
    for(let y = 0; y <= canvas.height; y += 1) {
      // horizontal shift x, vertical shift and reflect y to center
      let func = y_mid - f(x-x_mid);  // function to plot
      if(y > func - tol && y < func + tol) {  // tolerance
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.75;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
}

/****************************************************
  think of v(t) as a vector valued function
  v(t) = [x(t), y(t)], r for range of t: [a, b]    
  so a circle of radius 10 would be input as:
  [t => 10 * Math.cos(t), t => 10 * Math.sin(t)], [0, 2 * Math.PI]
 ****************************************************/
function plotParametric(v, r, resolution = 100, color = 'hsl(190, 100%, 60%)') {
  ctx.fillStyle = color;
  [x_func, y_func] = v;
  for(let t = r[0]; t <= r[1]; t += (r[1] - r[0]) / resolution) {
    // horizontal shift x, vertical shift and reflect y to center
    ctx.fillRect(x_mid + x_func(t), y_mid - y_func(t), 1, 1);
  }
}

async function petals() {
  for(let n = 0 ; n < 50; n += 0.001) {
    drawAxes();
    //drawGrid();
    plotParametric([t=>200*Math.cos(n*t)*Math.cos(t), t=>200*Math.cos(n*t)*Math.sin(t)], [-2 * Math.PI, 2 * Math.PI], 1000, 'dodgerblue');
    await new Promise(resolve => setTimeout(resolve, 1))
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }
}

function plot3D(Xmin, Ymin, Xmax, Ymax, colMax, rowMax, x, y, z, theta, phi) {
  const xprime = Math.cos(theta) * x + Math.sin(theta) * z;
  const yprime = Math.sin(theta) * Math.sin(phi) * x + Math.cos(phi) * y - Math.cos(theta) * Math.sin(phi) * z;

  const rows = Math.round((yprime - Ymax) * (rowMax - 1) / (Ymin - Ymax) + 1);
  const cols = Math.round((xprime - Xmin) * (colMax - 1) / (Xmax - Xmin) + 1);

  return [rows, cols];
}

function plot3DParametric(v, r, resolution = 100, color = 'hsl(190, 100%, 60%)') {
  ctx.fillStyle = color;
  [x_func, y_func, z_func] = v;
  for(let t = r[0]; t <= r[1]; t += (r[1] - r[0]) / resolution) {
    let [rows, cols] = plot3D(-200, -200, 200, 200, canvas.width, canvas.height, x_func(t), y_func(t), z_func(t), 0.05 , 1.3);
    ctx.fillRect(cols, rows, 1, 1);
    
  }
}
for(let r = 0; r < 200; r += 25) {
  plot3DParametric([x => r * Math.cos(x), y => r * Math.sin(y), z => 0], [0, 2 * Math.PI], r, 'white');
}
plot3DParametric([x => x, y => 0, z => 0], [-200, 200], 100, 'red'); // x axis 
plot3DParametric([x => 0, y => y, z => 0], [-200, 200], 100, 'green'); // y axis
plot3DParametric([x => 0, y => 0, z => z], [-200, 200], 100, 'blue'); // z axis

// Helix
plot3DParametric([x => 100 * Math.cos(x), y => 100 * Math.sin(y), z => 2 * z], [-50 * Math.PI, 50 * Math.PI], 40000);