window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("drawingCanvas");
  const ctx = canvas.getContext("2d");

  const colorPicker = document.getElementById("colorPicker");
  const lineWidth = document.getElementById("lineWidth");
  const clearBtn = document.getElementById("clearBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const eraserBtn = document.getElementById("eraserBtn");
  const backgroundSelect = document.getElementById("backgroundSelect");

  let drawing = false;
  let erasing = false;
  let lastX, lastY;
  let currentBg = "dots";

  function resizeCanvas() {
    canvas.width = Math.min(window.innerWidth * 0.95, 500);
    canvas.height = canvas.width;
    drawBackground(currentBg);
  }

  function drawBackground(style) {
    currentBg = style;
    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#fff0f6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (style === "dots") {
      ctx.fillStyle = "#ffcce0";
      for (let x = 10; x < canvas.width; x += 25) {
        for (let y = 10; y < canvas.height; y += 25) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (style === "grid") {
      ctx.strokeStyle = "#ffd6e6";
      ctx.lineWidth = 0.5;
      for (let x = 25; x < canvas.width; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 25; y < canvas.height; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function getXY(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    return [x, y];
  }

  function startDraw(e) {
    drawing = true;
    [lastX, lastY] = getXY(e);
  }

  function draw(e) {
    if (!drawing) return;
    const [x, y] = getXY(e);
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = erasing ? "#ffffff" : colorPicker.value;
    ctx.lineWidth = lineWidth.value;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalCompositeOperation = erasing ? "destination-out" : "source-over";
    ctx.stroke();
    [lastX, lastY] = [x, y];
  }

  function stopDraw() {
    drawing = false;
    ctx.globalCompositeOperation = "source-over";
  }

  // ✨ Event Listeners
  eraserBtn.addEventListener("click", () => {
    erasing = !erasing;
    eraserBtn.textContent = erasing ? "✏️ Drawing" : "🧽 Eraser";
  });

  clearBtn.addEventListener("click", () => {
    drawBackground(currentBg);
  });

  backgroundSelect.addEventListener("change", (e) => {
    drawBackground(e.target.value);
  });

  downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = canvas.toDataURL();
    link.click();
  });

  // 💖 Touch + Mouse
  canvas.addEventListener("mousedown", startDraw);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopDraw);
  canvas.addEventListener("mouseleave", stopDraw);

  canvas.addEventListener("touchstart", startDraw);
  canvas.addEventListener("touchmove", draw);
  canvas.addEventListener("touchend", stopDraw);

  window.addEventListener("resize", resizeCanvas);

  // ✅ Init
  resizeCanvas();
});
