const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

var x_mid = canvas.width / 2;
var y_mid = canvas.height / 2;
var AR = canvas.width/canvas.height;
var NEAR = 0.1;
var FAR = 10000.0;

function transform(A, v) {
  const x = A[0][0] * v[0] + A[0][1] * v[1] + A[0][2] * v[2] + A[0][3] * v[3];
  const y = A[1][0] * v[0] + A[1][1] * v[1] + A[1][2] * v[2] + A[1][3] * v[3];
  const z = A[2][0] * v[0] + A[2][1] * v[1] + A[2][2] * v[2] + A[2][3] * v[3];
  const p = A[3][0] * v[0] + A[3][1] * v[1] + A[3][2] * v[2] + A[3][3] * v[3]
  return [x, y, z, p];
}

function plot3D(pos, eyepoint, centerOfInterest, viewingAngle) {
  let [x, y, z, p] = pos;
  let [epx, epy, epz] = eyepoint;
  let [coix, coiy, coiz] = centerOfInterest;
  let cot2 = Math.cos(viewingAngle/2) / Math.sin(viewingAngle/2);
  let alpha = FAR/(FAR-NEAR);
  let beta=-FAR*NEAR/(FAR-NEAR);
  // create components of vector from eyepoint to center of interest
  let [a,b,c] = [coix-epx, coiy-epy, coiz-epz];
  let cosTheta = c / (a*a + c*c)**0.5;
  let sinTheta = a / (a*a + c*c)**0.5;
  let d = (a*a + b*b + c*c)**0.5;     // length of ep to coi vector
  let cosPhi = (a*a + c*c)**0.5 / d;
  let sinPhi = b / d;
  let Z = [[cosTheta*cot2,0,-sinTheta*cot2,-coix*cosTheta*cot2+coiz*sinTheta*cot2],
          [-sinTheta*sinPhi*AR*cot2, cosPhi*AR*cot2, -cosTheta*sinPhi*AR*cot2,coix*sinTheta*sinPhi*AR*cot2-coiy*cosPhi*AR*cot2+coiz*cosTheta*sinPhi*AR*cot2],
          [-sinTheta*cosPhi*alpha,-sinPhi*alpha,-cosTheta*cosPhi*alpha,coix*sinTheta*cosPhi*alpha+coiy*sinPhi*alpha+coiz*cosTheta*cosPhi*alpha+alpha*d+beta],
          [-sinTheta*cosPhi,-sinPhi,-cosTheta*cosPhi,coix*sinTheta*cosPhi+coiy*sinPhi+coiz*cosTheta*cosPhi+d]];
  let [xprime, yprime, zprime, pprime] = transform(Z, [x, y, z, p]);       
  return [x_mid + xprime, y_mid - yprime];
}

// Plot a 3D parametric function with a given range, resolution, color, eyepoint and center of interest
/***************************************************************************************************************************/
function plot3DParametric(v, r, resolution = 100, color = 'hsl(190, 100%, 60%)', ep, coi, va) {
  ctx.fillStyle = color;
  let [x_func, y_func, z_func] = v;
  for(let t = r[0]; t <= r[1]; t += (r[1] - r[0]) / resolution) {
    let [rows, cols] = plot3D([x_func(t), y_func(t), z_func(t), 1], ep, coi, va);
    ctx.fillRect(cols, rows, 1, 1);    
  }
}

// Plot a polar grid in the x-y plane with a given perspective (theta, phi)
/************************************************************************************************************************************/
function plot3DGrid(ep, coi, va) {
  for(let r = 0; r < 360; r++) {  // circles every 50px
    if(r % 50 == 0) plot3DParametric([x => r * Math.cos(x), y => r * Math.sin(y), z => 0], [0, 2 * Math.PI], r, 'white', ep, coi, va);
  }
  plot3DParametric([x => x, y => y, z => 0], [-360, 360], 100, 'white', ep, coi, va); // pi/4, 5pi/4
  plot3DParametric([x => x, y => -y, z => 0], [-360, 360], 100, 'white', ep, coi, va); // 3pi/4, 7pi/4
  plot3DParametric([x => x / 2, y => 3**0.5*y/2, z => 0], [-360, 360], 100, 'white', ep, coi, va); // pi/3, 4pi/3
  plot3DParametric([x => 3**0.5*x / 2, y => y/2, z => 0], [-360, 360], 100, 'white', ep, coi, va); // pi/6, 7pi/6
  plot3DParametric([x => x / 2, y => -(3**0.5*y/2), z => 0], [-360, 360], 100, 'white', ep, coi, va); // 2pi/3, 5pi/3
  plot3DParametric([x => 3**0.5*x / 2, y => -y/2, z => 0], [-360, 360], 100, 'white', ep, coi, va); // 5pi/6, 11pi/6
}

// Plot an x, y, z set of axes with a given perspective (theta, phi)
/********************************************************************************************/
function plot3DAxes(ep, coi, va) {
  plot3DParametric([x => x, y => 0, z => 0], [-360, 360], 100, 'red', ep, coi, va); // x axis 
  plot3DParametric([x => 0, y => y, z => 0], [-360, 360], 100, 'green', ep, coi, va); // y axis
  plot3DParametric([x => 0, y => 0, z => z], [-360, 360], 100, 'blue', ep, coi, va); // z axis
}

// Plot a 3D coordinate system with some objects and animate a moving perspective (theta, phi)
/*************************************************************************************************************************************************/
async function paraboloid() {
  let dia = 230;
  let coi = [150,150,50];
  let va = Math.PI/4;
  
  while(true) {
      for(let phi=-Math.PI; phi<4 * Math.PI; phi += Math.PI / 128) {
        await new Promise(resolve => setTimeout(resolve, 20))
        ctx.fillStyle = 'black';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        
        let eyepoint = [100,10*phi,20*phi];
        plot3DAxes(eyepoint, coi, va);
        plot3DGrid(eyepoint, coi, va);

        for(let n = 0; n < 2 * Math.PI; n += Math.PI / 180) {
          plot3DParametric([t => t * Math.cos(n), t => t * Math.sin(n), t => t*t/64], [0, 110], 20, 'goldenrod', eyepoint, coi, va); // paraboloid
          plot3DParametric([t => t * Math.cos(n), t => t * Math.sin(n), t => t], [-150, 0], 10, 'dodgerblue', eyepoint, coi, va);  // cone
          plot3DParametric([t => 150+t * Math.cos(n), t => 150+t * Math.sin(n), t => 50+(1000-t*t)**0.5], [0, 100], 80, 'orangered', eyepoint, coi, va); // hemi-sphere
          plot3DParametric([t => 150+t * Math.cos(n), t => 150+t * Math.sin(n), t => 50-((1000-t*t)**0.5)], [0, 100], 80, 'orangered', eyepoint, coi, va); // hemi-sphere
        }
      }
    
  }
}

paraboloid();