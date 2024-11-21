let draggedItem=null;
let originalColors = {};
let originalOrder = [];
const block3Color = "#6fb74d";

function processInput (){

    let input = document.getElementById("inputField").value;
    let parts = input.split("-").map(item=>item.trim()).filter(item=>item);
    
    let associativeArray = {};
    let wordsLower = [], wordsUpper = [], numbers = []; 
    parts.forEach(part =>{
        if(!isNaN(part)){
            numbers.push(Number(part));
        }
        else if (part[0]===part[0].toUpperCase()){
            wordsUpper.push(part);
        }
        else {
            wordsLower.push(part);
        }
    });

    wordsLower.sort();
    wordsUpper.sort();
    numbers.sort((a,b)=>a-b);

    wordsLower.forEach((word, index)=>{
        associativeArray[`a${index+1}`]=word;
    });
    wordsUpper.forEach((word,index)=>{
        associativeArray[`b${index+1}`]=word;
    });
    numbers.forEach((word,index)=>{
        associativeArray[`n${index+1}`]=word;
    });

    originalOrder = Object.keys(associativeArray);

    let block1 = document.getElementById("block1");
    let historyItem = document.createElement("div");
    historyItem.classList.add("word-string");
    historyItem.textContent = Object.entries(associativeArray).map(([value])=>`${value}`).join(" - ");
    block1.appendChild(historyItem);

    let block2 = document.getElementById("block2");
    block2.innerHTML="";
    originalOrder.forEach((key,index)=>{
        let element = document.createElement("div");
        element.classList.add("draggable");
        element.draggable = true;
        element.id=key;
        element.textContent =`${key} ${associativeArray[key]}`;
        let color = getRandomColor();
        originalColors[key] =color;
        element.style.backgroundColor = color;
        block2.appendChild(element);
    });

    initializeDrageAndDrop();
}

function initializeDrageAndDrop(){
    const draggableItems = document.querySelectorAll(".draggable");
    const dropZone2 = document.getElementById("block2");
    const dropZone3 = document.getElementById("block3");
    const selectedWordsContainer = document.getElementById("selectedWords");
    
    draggableItems.forEach(item=>{
        item.addEventListener("dragstart",(e)=>{
            draggedItem = item;
            setTimeout(()=>{
                item.style.display = "none";
            },0);
        });
        item.addEventListener("dragend",()=>{
            setTimeout(()=>{
                draggedItem.style.display = "block";
                draggedItem = null;
            },0);
        });

        item.addEventListener("click",()=>{
            if (item.classList.contains("in-block3")){
                let displayItem = document.createElement("div");
                displayItem.textContent = item.textContent;
                selectedWordsContainer.appendChild(displayItem);
            }
        });
    });

    dropZone2.addEventListener("dragover",(e)=>{
        e.preventDefault();
    });
    dropZone2.addEventListener('drop', (e) => {
        e.preventDefault(); 
        if (draggedItem) { 
            draggedItem.classList.remove('in-block3'); 
            draggedItem.style.left = 'auto'; 
            draggedItem.style.top = 'auto'; 
            draggedItem.style.backgroundColor = originalColors[draggedItem.id]; 
            dropZone2.appendChild(draggedItem); 

            
            originalOrder.forEach(key => { 
                let item = document.getElementById(key); 
                if (item) { 
                    dropZone2.appendChild(item); 
                }
            });
        }
    });

    
    dropZone3.addEventListener('dragover', (e) => {
        e.preventDefault(); 
    });

    
    dropZone3.addEventListener('drop', (e) => {
        e.preventDefault();
        if (draggedItem) { 
            const dropZoneRect = dropZone3.getBoundingClientRect(); 
            const x = e.clientX - dropZoneRect.left; 
            const y = e.clientY - dropZoneRect.top; 

    
    const maxX = dropZone3.clientWidth - draggedItem.offsetWidth; 
    const maxY = dropZone3.clientHeight - draggedItem.offsetHeight; 

    draggedItem.classList.add('in-block3'); 
    draggedItem.style.left = `${Math.min(Math.max(0, x), maxX)}px`; 
    draggedItem.style.top = `${Math.min(Math.max(0, y), maxY)}px`; 
    draggedItem.style.backgroundColor = block3Color; 

    dropZone3.appendChild(draggedItem); 
    }
    });

}
function getRandomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    }
