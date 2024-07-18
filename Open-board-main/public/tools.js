let toolsCont = document.querySelector(".tools-cont");

let optionsCont = document.querySelector(".options-cont");
let optionsFlag = true;

let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");
let pencilToolCont = document.querySelector(".pencil-tool-cont");
let eraserToolCont = document.querySelector(".eraser-tool-cont");
let pencilFlag = false;
let eraserFlag = false;

// sticky note element to show sticky note when you click on this   
let  stciky = document.querySelector(".sticky");

//for upload file option 
let upload = document.querySelector(".upload");

optionsCont.addEventListener("click" , (e) => {
    // true -> show tools
    //fasle -> hide tools
    optionsFlag = !optionsFlag;

    if (optionsFlag) openTools();

    else closeTools();
})

function openTools(){
     let iconElem = optionsCont.children[0];
     iconElem.classList.remove("fa-times");
     iconElem.classList.add("fa-bars");
     toolsCont.style.display = "flex";
}

function closeTools() {
    let iconElem = optionsCont.children[0];
    iconElem.classList.remove("fa-bars");
    iconElem.classList.add("fa-times");
    toolsCont.style.display = "none";

    pencilToolCont.style.display = "none";
    eraserToolCont.style.display = "none";
}

//for pencile toggle bar
pencil.addEventListener("click", (e) => {
    //true -> show penncil tool
    //false -> hide pencil tool
    pencilFlag = !pencilFlag;

    if(pencilFlag){
        pencilToolCont.style.display = "block";
    }
    else{
        pencilToolCont.style.display = "none";
    }
})

//for eraser toggle bar 
eraser.addEventListener("click", (e) => {
    //true -> show eraser tool
    //false -> hide eraser tool
    eraserFlag = !eraserFlag;

    if(eraserFlag){
        eraserToolCont.style.display = "flex";
    }
    else{
        eraserToolCont.style.display = "none";
    }
})


upload.addEventListener("click", (e) => {
    //whenever i click on upload image i have to open file explorer window so for that here is the code
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change", (e) => {
        let file = input.files[0];
        let url = URL.createObjectURL(file);

        let stickytemplateHtml = `
        <div class="header-cont">
        <div class="mini"></div>
        <div class="remove"></div> 
     </div>
    <div class="note-cont">
          <img src="${url}"/>
     </div>
        `;
      
        createSticky(stickytemplateHtml);
      
    })
})

//for sticky note appreance disapeerance
stciky.addEventListener("click" , (e) =>{
    let stickytemplateHtml = `
        <div class="header-cont">
           <div class="mini"></div>
           <div class="remove"></div> 
        </div>
       <div class="note-cont">
             <textarea spellcheck="false"></textarea>
        </div> `;
    
    createSticky(stickytemplateHtml);
})

//a whole fucntion for inner html 
function createSticky(stickytemplateHtml){
    let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class", "sticky-cont");
    stickyCont.innerHTML = stickytemplateHtml;
     document.body.appendChild(stickyCont);

     let minimize = stickyCont.querySelector(".mini");
     let remove = stickyCont.querySelector(".remove");
     noteFunctionality(minimize,remove , stickyCont);
    
    //  code for drag and drop of files or notes
    stickyCont.onmousedown = function(event) {
         dragAndDrop(stickyCont, event);
      };
      
      stickyCont.ondragstart = function() {
        return false;
      };
}

// For minimizing the note we produces
function noteFunctionality(minimize, remove, stickyCont){
     remove.addEventListener("click", (e) => {
        stickyCont.remove();
     })
     minimize.addEventListener("click" , (e) => {
        let noteCont = stickyCont.querySelector(".note-cont");
        let display = getComputedStyle(noteCont).getPropertyValue("display");
        if(display === "none"){
            noteCont.style.display="block";
        }
        else{
            noteCont.style.display="none";
        }
     })
} 




function dragAndDrop(element, event){
        let shiftX = event.clientX - element.getBoundingClientRect().left;
        let shiftY = event.clientY - element.getBoundingClientRect().top;
      
        element.style.position = 'absolute';
        element.style.zIndex = 1000;
      
        moveAt(event.pageX, event.pageY);
      
        // moves the element at (pageX, pageY) coordinates
        // taking initial shifts into account
        function moveAt(pageX, pageY) {
          element.style.left = pageX - shiftX + 'px';
          element.style.top = pageY - shiftY + 'px';
        }
      
        function onMouseMove(event) {
          moveAt(event.pageX, event.pageY);
        }
        // move the element on mousemove
        document.addEventListener('mousemove', onMouseMove);
      
        // drop the element, remove unneeded handlers
        element.onmouseup = function() {
          document.removeEventListener('mousemove', onMouseMove);
          element.onmouseup = null;
        };
      
}