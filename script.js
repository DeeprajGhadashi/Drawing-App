const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-img"),
textInput = document.querySelector("#text-input"),
ctx = canvas.getContext("2d");

//global variable with default value
let prevMouseX, prevMouseY,snapshot,
isDrawing = false,
selectedTool = "brush",
brushWidth = 5,
selectedColor = "#000";

const setCanvasBackground = () => {
    // setting whole canvas background to white, so the downloaded img backgroun will be white
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;  // setting fillstyle back to the selectedColor, it'll be the brush color
}

window.addEventListener("load" , () => {
    //setting canvas width/height.. offsetwidth/height returns viewable width/height of an element
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
})

const drawLine = (e) => {
    if (!isDrawing) return; // If not drawing, return
    ctx.putImageData(snapshot, 0, 0); // Restore previous state
    ctx.beginPath(); // Start a new path
    ctx.moveTo(prevMouseX, prevMouseY); // Move to the starting point
    ctx.lineTo(e.offsetX, e.offsetY); // Draw a line to the current mouse position
    ctx.stroke(); // Stroke the line
};

const drawRect = (e) =>{
    // if fillColor isn't checked deaw a rect with border else draw with background
    if(!fillColor.checked) {
    // creating circle according to the mouse pointer
      return ctx.strokeRect(e.offsetX , e.offsetY, prevMouseX -  e.offsetX , prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX , e.offsetY, prevMouseX -  e.offsetX , prevMouseY - e.offsetY);
}

const drawCircle =(e) => {
    ctx.beginPath(); // creating new path to daw circle
    //getting radius for circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
   ctx.arc(prevMouseX, prevMouseY, radius ,0 , 2 * Math.PI); // creating circle according to the mouse pointer
   fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill circle also draw border circle
}

const drawTriangle = (e) => {
    ctx.beginPath(); // creating new path to daw Triangle
    ctx.moveTo(prevMouseX, prevMouseY); //moving triangle to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY); //creating first line according to the mouse pointer
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); //creating botton line of triangle
    ctx.closePath();       // closing path of a triangle so the third line draw automatically
    fillColor.checked ? ctx.fill() : ctx.stroke(); //if fillColor is checked fill triangle else draw border
}

// Drawing a square
const drawSquare = (e) => {
    ctx.beginPath(); // Start a new path
    const sideLength = Math.abs(e.offsetX - prevMouseX); // Calculate the side length of the square
    ctx.rect(prevMouseX, prevMouseY, sideLength, sideLength); // Draw a square with the calculated side length
    fillColor.checked ? ctx.fill() : ctx.stroke(); // Fill or stroke the square based on the fill color checkbox
};

// Drawing a pentagon
const drawPentagon = (e) => {
    ctx.beginPath(); // Start a new path
    const radius = Math.sqrt(Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2)); // Calculate the radius of the circumscribed circle
    ctx.moveTo(prevMouseX + radius * Math.cos(0), prevMouseY + radius * Math.sin(0)); // Move to the initial point
    for (let i = 1; i <= 5; i++) {
        ctx.lineTo(prevMouseX + radius * Math.cos((i * 2 * Math.PI) / 5), prevMouseY + radius * Math.sin((i * 2 * Math.PI) / 5)); // Draw lines to other points to form a pentagon
    }
    ctx.closePath(); // Close the path
    fillColor.checked ? ctx.fill() : ctx.stroke(); // Fill or stroke the pentagon based on the fill color checkbox
};

// Drawing a hexagon
const drawHexagon = (e) => {
    ctx.beginPath(); // Start a new path
    const radius = Math.sqrt(Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2)); // Calculate the radius of the circumscribed circle
    ctx.moveTo(prevMouseX + radius * Math.cos(0), prevMouseY + radius * Math.sin(0)); // Move to the initial point
    for (let i = 1; i <= 6; i++) {
        ctx.lineTo(prevMouseX + radius * Math.cos((i * 2 * Math.PI) / 6), prevMouseY + radius * Math.sin((i * 2 * Math.PI) / 6)); // Draw lines to other points to form a hexagon
    }
    ctx.closePath(); // Close the path
    fillColor.checked ? ctx.fill() : ctx.stroke(); // Fill or stroke the hexagon based on the fill color checkbox
};

// Drawing a diamond
const drawDiamond = (e) => {
    ctx.beginPath(); // Start a new path
    const width = Math.abs(prevMouseX - e.offsetX); // Calculate the width of the diamond
    const height = Math.abs(prevMouseY - e.offsetY); // Calculate the height of the diamond
    ctx.moveTo(prevMouseX, prevMouseY - height / 2); // Move to the top point
    ctx.lineTo(prevMouseX + width / 2, prevMouseY); // Draw a line to the right point
    ctx.lineTo(prevMouseX, prevMouseY + height / 2); // Draw a line to the bottom point
    ctx.lineTo(prevMouseX - width / 2, prevMouseY); // Draw a line to the left point
    ctx.closePath(); // Close the path
    fillColor.checked ? ctx.fill() : ctx.stroke(); // Fill or stroke the diamond based on the fill color checkbox
};

// Drawing a star
const drawStar = (e) => {
    ctx.beginPath(); // Start a new path
    const radius = Math.sqrt(Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2)); // Calculate the radius of the circumscribed circle
    for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI) / 5; // Calculate the angle for each point
        const innerRadius = i % 2 === 0 ? radius * 0.4 : radius * 0.15; // Alternate between inner and outer points
        ctx.lineTo(prevMouseX + innerRadius * Math.cos(angle), prevMouseY + innerRadius * Math.sin(angle)); // Draw lines to the points
    }
    ctx.closePath(); // Close the path
    fillColor.checked ? ctx.fill() : ctx.stroke(); // Fill or stroke the star based on the fill color checkbox
};

const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX;  // passing current mouseX position as prevMouseX value
    prevMouseY = e.offsetY;  // passing current mouseY position as prrevMouseY value
    ctx.beginPath(); //creating new path to draw
    ctx.lineWidth = brushWidth; // passing brushSize as line width
    ctx.strokeStyle = selectedColor;  // passing selected Color as stroke style
    ctx.fillStyle = selectedColor;  // passing selected Color as fill style
    // copying canvas data & passing as snapshot value.. this avoids dragging the image
    snapshot = ctx.getImageData(0 ,0 , canvas.width , canvas.height);

}

const drawing =(e) => {
    if(!isDrawing) return;  //if isDrawing is false return from here
    ctx.putImageData(snapshot, 0 , 0); // adding copied canvas data on to this canvas
    if(selectedTool === "brush" || selectedTool === "eraser") {
        //if selected tool is eraser then set strokeStyle to white
        // to paint white on to the existing canvas content else set the stroke color to selected color
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY); // creating line according to the mouse pointer
        ctx.stroke(); //drawing/filing line with color
    }else if(selectedTool === "rectangle") {
        drawRect(e);
    }else if(selectedTool === "circle") {
        drawCircle(e);
    }else if (selectedTool === "triangle"){
        drawTriangle(e);  
    }else if (selectedTool === "line"){
        drawLine(e);  
    }
    else if (selectedTool === "square"){
        drawSquare(e);  
    }else if (selectedTool === "pentagon"){
        drawPentagon(e);  
    }
    else if (selectedTool === "hexagon"){
        drawHexagon(e);  
    }else if (selectedTool === "diamond"){
        drawDiamond(e);  
    }else if (selectedTool === "star"){
        drawStar(e);  
    }else {
        drawText(e);
    }
}

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {  //adding click event to all option
       //removing active class from the previous option and adding on current clicked option
       document.querySelector(".options .active").classList.remove("active");
       btn.classList.add("active");
       selectedTool = btn.id;
        console.log(selectedTool);
    });
});

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value); //passing slider value as brushSize

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {  // adding click event to all color button
     //removing active class from the previous option and adding on current clicked option
     document.querySelector(".options .selected").classList.remove("selected");
     btn.classList.add("selected");
     // passing selected btn background color as selectedColor value
    selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
     // console.log(window.getComputedStyle(btn).getPropertyValue("background-color"));
    });
});

colorPicker.addEventListener("change" , ()=> {
    //passing picked color value from color picker to last color btn background
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clearing the whole canvas
    setCanvasBackground();
});

saveImg.addEventListener("click", () => {
    const link = document.createElement("a"); // Creating <a> element
    link.download = `${Date.now()}.jpg`; // Setting download attribute with current date
    link.href = canvas.toDataURL(); // Setting canvas data as href
    link.click(); // Clicking the link to trigger download
});

// Event listener for mouse movement to draw line
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", ()=> isDrawing = false); // do not drwaing at time not hold mouse button





    
    
    
