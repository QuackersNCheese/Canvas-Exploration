const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Convert 3D x, y, z coordinate to 2D canvas [rows, cols] coordinate
/*************************************************************************************************************/
function plot3D(Xmin, Ymin, Xmax, Ymax, colMax, rowMax, x, y, z, theta, phi) {
  const xprime = Math.cos(theta) * x + Math.sin(theta) * z;
  const yprime = Math.sin(theta) * Math.sin(phi) * x + Math.cos(phi) * y - Math.cos(theta) * Math.sin(phi) * z;

  const rows = Math.round((yprime - Ymax) * (rowMax - 1) / (Ymin - Ymax) + 1);
  const cols = Math.round((xprime - Xmin) * (colMax - 1) / (Xmax - Xmin) + 1);

  return [rows, cols];
}

// Plot a 3D parametric function with a given range, resolution, color, and perspective (theta, phi)
/***************************************************************************************************************************/
function plot3DParametric(v, r, resolution = 100, color = 'hsl(190, 100%, 60%)', theta=0, phi=0) {
  ctx.fillStyle = color;
  [x_func, y_func, z_func] = v;
  for(let t = r[0]; t <= r[1]; t += (r[1] - r[0]) / resolution) {
    let [rows, cols] = plot3D(-200, -200, 200, 200, canvas.width, canvas.height, x_func(t), y_func(t), z_func(t), theta, phi);
    ctx.fillRect(cols, rows, 1, 1);    
  }
}

// Plot a polar grid in the x-y plane with a given perspective (theta, phi)
/************************************************************************************************************************************/
function plot3DGrid(theta=0, phi=0) {
  for(let r = 0; r < 360; r++) {  // circles every 50px
    if(r % 50 == 0) plot3DParametric([x => r * Math.cos(x), y => r * Math.sin(y), z => 0], [0, 2 * Math.PI], r, 'white', theta, phi);
  }
  plot3DParametric([x => x, y => y, z => 0], [-360, 360], 141, 'white', theta, phi); // pi/4, 5pi/4
  plot3DParametric([x => x, y => -y, z => 0], [-360, 360], 141, 'white', theta, phi); // 3pi/4, 7pi/4
  plot3DParametric([x => x / 2, y => 3**0.5*y/2, z => 0], [-360, 360], 100, 'white', theta, phi); // pi/3, 4pi/3
  plot3DParametric([x => 3**0.5*x / 2, y => y/2, z => 0], [-360, 360], 100, 'white', theta, phi); // pi/6, 7pi/6
  plot3DParametric([x => x / 2, y => -(3**0.5*y/2), z => 0], [-360, 360], 100, 'white', theta, phi); // 2pi/3, 5pi/3
  plot3DParametric([x => 3**0.5*x / 2, y => -y/2, z => 0], [-360, 360], 100, 'white', theta, phi); // 5pi/6, 11pi/6
}

// Plot an x, y, z set of axes with a given perspective (theta, phi)
/********************************************************************************************/
function plot3DAxes(theta=0, phi=0) {
  plot3DParametric([x => x, y => 0, z => 0], [-360, 360], 100, 'red', theta, phi); // x axis 
  plot3DParametric([x => 0, y => y, z => 0], [-360, 360], 100, 'green', theta, phi); // y axis
  plot3DParametric([x => 0, y => 0, z => z], [-360, 360], 100, 'blue', theta, phi); // z axis
}

// Plot a 3D coordinate system with some objects and animate a moving perspective (theta, phi)
/*************************************************************************************************************************************************/
async function paraboloid() {
  while(true) {
    for(let phi=-2*Math.PI; phi<2*Math.PI; phi += Math.PI / 128) {
      await new Promise(resolve => setTimeout(resolve, 50))
      ctx.fillStyle = 'black';
      ctx.fillRect(0,0,canvas.width,canvas.height);

      plot3DAxes(-phi, phi*2);
      plot3DGrid(-phi, phi*2);

      for(let n = 0; n < 2 * Math.PI; n += Math.PI / 180) {
        plot3DParametric([t => t * Math.cos(n), t => t * Math.sin(n), t => t*t/64], [-100, 100], 50, 'goldenrod', -phi, phi*2); // paraboloid
        plot3DParametric([t => t * Math.cos(n), t => t * Math.sin(n), t => t], [-100, 0], 20, 'dodgerblue', -phi, phi*2);  // cone
        plot3DParametric([t => 150+t * Math.cos(n), t => 150+t * Math.sin(n), t => 50+(1000-t*t)**0.5], [0, 100], 80, 'orangered', -phi, phi*2); // hemi-sphere
        plot3DParametric([t => 150+t * Math.cos(n), t => 150+t * Math.sin(n), t => 50-((1000-t*t)**0.5)], [0, 100], 80, 'orangered', -phi, phi*2); // hemi-sphere
      }
    }
  }
}

paraboloid();