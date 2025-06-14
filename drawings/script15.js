const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let x_mid = canvas.width / 2;
let y_mid = canvas.height / 2;

function transform(A, v) {
  const x = A[0][0] * v[0] + A[0][1] * v[1] + A[0][2] * v[2] + A[0][3];
  const y = A[1][0] * v[0] + A[1][1] * v[1] + A[1][2] * v[2] + A[1][3];
  const z = A[2][0] * v[0] + A[2][1] * v[1] + A[2][2] * v[2] + A[2][3];
  return [x, y, z];
}

function plot3D(x, y, z, epx=1, epy=1, epz=1, coix=0, coiy=0, coiz=0) {
    // create components of vector from eyepoint to center of interest
    let [a,b,c] = [coix-epx, coiy-epy, coiz-epz];
    let cosTheta = c / (a*a + c*c)**0.5;
    let sinTheta = a / (a*a + c*c)**0.5;
    let d = (a*a + b*b + c*c)**0.5;     // length of ep to coi vector
    let cosPhi = (a*a + c*c)**0.5 / d;
    let sinPhi = b / d;
    let A = [[1, 0, 0, -coix], 
            [0, 1, 0, -coiy], 
            [0, 0, 1, -coiz]] 
    let B = [[cosTheta, 0, -sinTheta,0],
            [0, 1, 0, 0],
            [sinTheta, 0, cosTheta, 0]];
    let C = [[1, 0, 0, 0],
            [0, cosPhi, -sinPhi, 0],
            [0, sinPhi, cosPhi, 0]];
    let D = [[1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, -1, d]];

    let [xprime, yprime, zprime] = transform(D,transform(C,transform(B,transform(A, [x, y, z]))));
    return [x_mid + xprime, y_mid - yprime];
}

// Plot a 3D parametric function with a given range, resolution, color, eyepoint and center of interest
/***************************************************************************************************************************/
function plot3DParametric(v, r, resolution = 100, color = 'hsl(190, 100%, 60%)', epx=1, epy=1, epz=1, coix=0, coiy=0, coiz=0) {
  ctx.fillStyle = color;
  let [x_func, y_func, z_func] = v;
  for(let t = r[0]; t <= r[1]; t += (r[1] - r[0]) / resolution) {
    let [rows, cols] = plot3D(x_func(t), y_func(t), z_func(t), epx, epy, epz, coix, coiy, coiz);
    ctx.fillRect(cols, rows, 1, 1);    
  }
}

// Plot a polar grid in the x-y plane with a given perspective (theta, phi)
/************************************************************************************************************************************/
function plot3DGrid(epx=1, epy=1, epz=1, coix=0, coiy=0, coiz=0) {
  for(let r = 0; r < 360; r++) {  // circles every 50px
    if(r % 50 == 0) plot3DParametric([x => r * Math.cos(x), y => r * Math.sin(y), z => 0], [0, 2 * Math.PI], r, 'white', epx, epy, epz, coix, coiy, coiz);
  }
  plot3DParametric([x => x, y => y, z => 0], [-360, 360], 100, 'white', epx, epy, epz, coix, coiy, coiz); // pi/4, 5pi/4
  plot3DParametric([x => x, y => -y, z => 0], [-360, 360], 100, 'white', epx, epy, epz, coix, coiy, coiz); // 3pi/4, 7pi/4
  plot3DParametric([x => x / 2, y => 3**0.5*y/2, z => 0], [-360, 360], 100, 'white', epx, epy, epz, coix, coiy, coiz); // pi/3, 4pi/3
  plot3DParametric([x => 3**0.5*x / 2, y => y/2, z => 0], [-360, 360], 100, 'white', epx, epy, epz, coix, coiy, coiz); // pi/6, 7pi/6
  plot3DParametric([x => x / 2, y => -(3**0.5*y/2), z => 0], [-360, 360], 100, 'white', epx, epy, epz, coix, coiy, coiz); // 2pi/3, 5pi/3
  plot3DParametric([x => 3**0.5*x / 2, y => -y/2, z => 0], [-360, 360], 100, 'white', epx, epy, epz, coix, coiy, coiz); // 5pi/6, 11pi/6
}

// Plot an x, y, z set of axes with a given perspective (theta, phi)
/********************************************************************************************/
function plot3DAxes(epx=1, epy=1, epz=1, coix=0, coiy=0, coiz=0) {
  plot3DParametric([x => x, y => 0, z => 0], [-360, 360], 100, 'red', epx, epy, epz, coix, coiy, coiz); // x axis 
  plot3DParametric([x => 0, y => y, z => 0], [-360, 360], 100, 'green', epx, epy, epz, coix, coiy, coiz); // y axis
  plot3DParametric([x => 0, y => 0, z => z], [-360, 360], 100, 'blue', epx, epy, epz, coix, coiy, coiz); // z axis
}

// Plot a 3D coordinate system with some objects and animate a moving perspective (theta, phi)
/*************************************************************************************************************************************************/
async function paraboloid() {
  while(true) {
    for(let phi=-Math.PI; phi<Math.PI; phi += Math.PI / 128) {
      await new Promise(resolve => setTimeout(resolve, 20))
      ctx.fillStyle = 'black';
      ctx.fillRect(0,0,canvas.width,canvas.height);

      plot3DAxes(150*Math.cos(phi), 150*Math.sin(phi), 10,0,0,20);
      plot3DGrid(150*Math.cos(phi), 150*Math.sin(phi), 10,0,0,20);

      for(let n = 0; n < 2 * Math.PI; n += Math.PI / 180) {
        plot3DParametric([t => t * Math.cos(n), t => t * Math.sin(n), t => t*t/64], [-100, 100], 50, 'goldenrod',150*Math.cos(phi), 150*Math.sin(phi), 10,0,0,20); // paraboloid
        plot3DParametric([t => t * Math.cos(n), t => t * Math.sin(n), t => t], [-100, 0], 20, 'dodgerblue',150*Math.cos(phi), 150*Math.sin(phi), 10,0,0,20);  // cone
        plot3DParametric([t => 150+t * Math.cos(n), t => 150+t * Math.sin(n), t => 50+(1000-t*t)**0.5], [0, 100], 80, 'orangered',150*Math.cos(phi), 150*Math.sin(phi), 10,0,0,20); // hemi-sphere
        plot3DParametric([t => 150+t * Math.cos(n), t => 150+t * Math.sin(n), t => 50-((1000-t*t)**0.5)], [0, 100], 80, 'orangered',150*Math.cos(phi), 150*Math.sin(phi), 10,0,0,20); // hemi-sphere
      }
    }
  }
}

paraboloid();