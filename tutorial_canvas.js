function draw() {
  const canvas = document.getElementById("tutorial");
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");
    
    ctx.fillStyle = "rgba(200, 0, 0, 0.5)"; //(red, green, blue, alpha)
    ctx.fillRect(10, 10, 50, 50); //(x, y, width, height)
    
    ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
    ctx.fillRect(30, 30, 50, 50);

    ctx.strokeStyle = 'rgba(0, 200, 0, 1)';
    ctx.strokeRect(10, 10, 70, 70);

  } else {
    const para = document.querySelector(".unsupported");
    para.textContent = "Your browser does not support HTML5 Canvas";
  }
}

window.addEventListener("load", draw, false);
