const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function iterateMandel(grid=canvas, context=ctx, x_center=-0.5, y_center=0.0, range=2.25, iter_scale=1.0) {
  let xm = grid.width / 2, ym = grid.height / 2;  // midpoints
  let t = 100;  // iteration counting variable
  let C = [], T = []; // complex rotate and shift vector
  let div = grid.height / range;  // pixels per complex unit
  
  for(let y = 0; y < grid.height; y++) {
    for(let x = 0; x < grid.width; x++) {
      C = [x_center + (x - xm) / div, y_center + (ym - y) / div]; // convert pixel to complex number
      T = [...C]; // copy to save
      for(t = 100 * iter_scale; t > 0; t--) {
        C=[C[0] * C[0] - C[1] * C[1] + T[0], 2 * C[0] * C[1] + T[1]]; // rotate and shift
        if(C[0] * C[0] + C[1] * C[1] > 4) break;  // check for escape
      }
      // plot pixel with color that indicates speed of escape
      context.fillStyle=(t == 0 ? `hsla(240, 100%, 0%, 1)` : `hsla(250, 100%, ${100*iter_scale-t}%, 1)`);
      context.fillRect(x, y, 1, 1);
    }
  }
}
//iterateMandel(canvas, ctx, -0.5, 0, 2.25, 1); 
//iterateMandel(canvas, ctx, -0.766, 0.1, 0.01, 1.5);
//iterateMandel(canvas, ctx, -0.76603, 0.1008, 0.001, 2.25);
//iterateMandel(canvas, ctx, -0.766445, 0.100865, 0.0001, 3);
//iterateMandel(canvas, ctx, -0.7664455, 0.1008715, 0.00001, 3.75);
//iterateMandel(canvas, ctx, -0.766445295, 0.10087131, 0.000002, 5.5);
//iterateMandel(canvas, ctx, -0.766445293, 0.10087131, 0.000001, 18);
async function flyFractal(grid=canvas, context=ctx) {
  let x_var, y_var, range_var, iter_var;
  for(let s = 0.0; s <= 1.0; s += 0.01) {
    x_var = -0.5 + (-0.766+0.5)* s;
    y_var = 0.1*s;
    range_var = 2.25 + (0.001-2.25)*s;
    iter_var = 1.0 + (1.5-1)*s;
    await new Promise(resolve => setTimeout(resolve, 1));
    context.fillStyle = 'black';
    context.fillRect(0,0,grid.width,grid.height);
    console.log(x_var, y_var, range_var, 1);
    iterateMandel(grid, context, x_var, y_var, range_var, 1.5);
  }
}
//flyFractal();
const drawing = document.getElementById('drawing_pad');
const draw_tools = drawing.getContext('2d');
//flyFractal(drawing, draw_tools);
async function slide_show_fractal(grid, context) {
  iterateMandel(grid, context, -0.5, 0, 2.25, 1); 
  await new Promise(resolve => setTimeout(resolve, 1000));
  iterateMandel(grid, context, -0.766, 0.1, 0.01, 1.5);
  await new Promise(resolve => setTimeout(resolve, 1000));
  iterateMandel(grid, context, -0.76603, 0.1008, 0.001, 2.25);
  await new Promise(resolve => setTimeout(resolve, 1000));
  iterateMandel(grid, context, -0.766445, 0.100865, 0.0001, 3);
  await new Promise(resolve => setTimeout(resolve, 1000));
  iterateMandel(grid, context, -0.7664455, 0.1008715, 0.00001, 3.75);
  await new Promise(resolve => setTimeout(resolve, 1000));
  iterateMandel(grid, context, -0.766445295, 0.10087131, 0.000002, 5.5);
  await new Promise(resolve => setTimeout(resolve, 1000));
  iterateMandel(grid, context, -0.766445293, 0.10087131, 0.000001, 12);
  await new Promise(resolve => setTimeout(resolve, 1000));

}
iterateMandel(canvas, ctx);
iterateMandel(drawing, draw_tools, -0.766445293, 0.10087131, 0.000001, 18);
//flyFractal(drawing, draw_tools);
const slides = document.getElementById('slides');
const slide_tools = slides.getContext('2d');
iterateMandel(slides, slide_tools, -0.766, 0.1, 0.01, 1.3)
//slide_show_fractal(slides, slide_tools);