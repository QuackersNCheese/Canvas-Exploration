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

//drawAxes();
//drawGrid();

//plotParametric([t => 25 * t + 50 * Math.cos(t), t => 50 * Math.sin(t)], [-4*Math.PI,4*Math.PI], 2000, 'gold');
//plotParametric([t => 25 * t * Math.cos(t), t => 25 * t * Math.sin(t)], [-4 * Math.PI, 4 * Math.PI], 4000, 'dodgerblue');
//plotParametric([t => 25 * t * Math.cos(t), t => -25 * t * Math.sin(t)], [-4 * Math.PI, 4 * Math.PI], 3000, 'red');
async function petals() {
  for(let n = 0; n < 4 * Math.PI; n += 0.001) {
    plotParametric([t=>100*Math.cos(n*t)*Math.cos(t), t=>100*Math.cos(n*t)*Math.sin(t)], [-2 * Math.PI, 2 * Math.PI], 200, 'cyan');
    await new Promise(resolve => setTimeout(resolve, 1))
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }
}

petals();