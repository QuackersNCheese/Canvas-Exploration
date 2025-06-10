const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let x_mid = canvas.width / 2;
let y_mid = canvas.height / 2;

/****************************************************
  think of v(t) as a vector valued function
  v(t) = [x(t), y(t)], r for range of t: [a, b]    
  so a circle of radius 10 would be input as:
  [t => 10 * Math.cos(t), t => 10 * Math.sin(t)], [0, 2 * Math.PI]
 ****************************************************/
function plotParametric(v, r, resolution = 100) {
  [x_func, y_func] = v;
  for(let t = r[0]; t <= r[1]; t += (r[1] - r[0]) / resolution) {
    // horizontal shift x, vertical shift and reflect y to center
    ctx.fillStyle = `hsla(${t * 90 % 360}, 100%, 50%, 1)`;
    ctx.fillRect(x_mid + x_func(t), y_mid - y_func(t), 2, 2);
  }
}

async function petals() {
  while(true) {  
    for(let n = 0 ; n < 360; n += 0.001) {
      plotParametric([t=>x_mid * Math.cos(n*t) * Math.cos(t), 
                      t=>y_mid * Math.cos(n*t) * Math.sin(t)], 
                      [-2 * Math.PI, 2 * Math.PI], 
                      1000);
      await new Promise(resolve => setTimeout(resolve, 1))
      ctx.fillStyle = 'black';
      ctx.fillRect(0,0,canvas.width,canvas.height);
    }
  }
}

petals();