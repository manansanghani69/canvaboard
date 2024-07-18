let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//for changing pencil color
let pencilColor = document.querySelectorAll(".pencil-color");
let pencilWidthCont = document.querySelector(".pencil-width");
let eraserlWidthCont = document.querySelector(".eraser-width");

let penColor = "red";
let eraserColor = "white";
let penWidth = pencilWidthCont.value;
let eraserWidth =  eraserlWidthCont.value;

//for downloading the note written
let download = document.querySelector(".download");

//for undo redo
let undoRedoTracker = []; //data represet
let track = 0; // represent whoch action from tracker array
let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");

//for making stroke in board
let mousedown = false;

//api
let tool = canvas.getContext("2d");

tool.strokeStyle = penColor;
tool.lineWidth =penWidth;

//mousedown -> start new path
//mousemove -> path fill (graphics fill)
canvas.addEventListener("mousedown" , (e) => {
    mousedown = true;
    // beginPath({
    //     x: e.clientX,
    //     y: e.clientY
    // })
    let data = {
        x: e.clientX,
        y: e.clientY
    }
    socket.emit('beginPath', data);
});

canvas.addEventListener("mousemove" , (e) => {
    if(mousedown){
       let data = {
        x: e.clientX,
        y: e.clientY,
        color: eraserFlag ? eraserColor : penColor,
        width : eraserFlag ? eraserWidth : penWidth
       }
       socket.emit("drawStroke", data);
    }
});

canvas.addEventListener("mouseup", (e) => {
     mousedown = false;

     //for undo redo options
     let url = canvas.toDataURL();
     undoRedoTracker.push(url);
     track =  undoRedoTracker.length - 1;
})

undo.addEventListener("click" , (e) => {
    if(track > 0){
        track--;
    }
    //track action
    let data = {
        trackValue: track,
        undoRedoTracker
    }
   socket.emit("redoUndo", data);
})

redo.addEventListener("click" , (e) => {
    if(track < undoRedoTracker.length - 1){
        track++;
    }
    //action
    let data = {
        trackValue: track,
        undoRedoTracker
    }
    socket.emit("redoUndo", data);
})

function undoRedocanvas(trackobj){
    track = trackobj.trackValue;
    undoRedoTracker = trackobj.undoRedoTracker;
    
    let url = undoRedoTracker[track];
    let img = new Image(); //new image reference element
    img.src = url;
    img.onload = (e) => {
        tool.drawImage(img, 0 , 0 , canvas.width , canvas.height);
    }

}

function beginPath(strokeobj){
    tool.beginPath();
    tool.moveTo(strokeobj.x, strokeobj.y); //clientX -> horizontal distance from a particluar point similar for cientY  
}

function drawStroke(strokeobj){
    tool.strokeStyle = strokeobj.color;
    tool.lineWidth = strokeobj.width;
    tool.lineTo(strokeobj.x, strokeobj.y);
    tool.stroke();
}

//for pencil color
pencilColor.forEach((colorElem) => {
    colorElem.addEventListener("click", (e) => {
        let color = colorElem.classList[0];
        penColor = color;
        tool.strokeStyle = penColor; 
    })
})

//for pencil width
pencilWidthCont.addEventListener("change", (e) => {
    penWidth = pencilWidthCont.value;
    tool.lineWidth = penWidth
})

//for eraser width
eraserlWidthCont.addEventListener("change", (e) => {
    eraserWidth = eraserlWidthCont.value;
    tool.lineWidth = eraserWidth;
})
eraser.addEventListener("click" , (e) => {
    if(eraserFlag){
       tool.strokeStyle = eraserColor;
       tool.lineWidth = eraserWidth;
    }
    else{
        tool.strokeStyle = penColor;
        tool.lineWidth = penWidth;
    }
})

//for downloading the drawn notes
download.addEventListener("click", (e) => {
   let url = canvas.toDataURL(); 
    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
})



socket.on("beginPath", (data) => {
    //data represents data from server
    beginPath(data);
});

socket.on("drawStroke", (data) => {
    drawStroke(data);
});

socket.on("redoUndo" , (data) => {
    undoRedocanvas(data);
})