const canvas = document.querySelector("canvas"),
ctx = canvas.getContext("2d");

window.addEventListener("load" , () => {
    //setting canvas width/height.. offsetwidth/height returns viewable width/height of an element
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
})

const drawing =(e) => {
    ctx.lineTo(e.offsetX, e.offsetY); // creating line according to the mouse pointer
    ctx.stroke(); //drawing/filing line with color
}

canvas.addEventListener("mousemove", drawing);