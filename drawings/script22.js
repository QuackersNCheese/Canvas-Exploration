const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
      
function iterateMandel() {
  let range = 2.25; // distance top to bottom on the complex plane
  let x_center = -0.5, y_center = 0;  // center of plot on complex plane
  let xm = canvas.width / 2, ym = canvas.height / 2;  // midpoints
  let t = 100;  // iteration counting variable
  let C = [], T = []; // complex rotate and shift vector
  let div = canvas.height / range;  // pixels per complex unit
  
  for(let y = 0; y < canvas.height; y++) {
    for(let x = 0; x < canvas.width; x++) {
      C = [x_center + (x - xm) / div, y_center + (ym - y) / div]; // convert pixel to complex number
      T = [...C]; // copy to save
      for(t = 100; t > 0; t--) {
        C=[C[0] * C[0] - C[1] * C[1] + T[0], 2 * C[0] * C[1] + T[1]]; // rotate and shift
        if(C[0] * C[0] + C[1] * C[1] > 4) break;  // check for escape
      }
      // plot pixel with color that indicates speed of escape
      ctx.fillStyle=(t == 0 ? `hsla(240, 100%, 0%, 1)` : `hsla(270, 100%, ${100-t}%, 1)`);
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

iterateMandel();