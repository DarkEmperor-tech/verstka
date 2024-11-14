
function firstInput(check) {
    if (check == 1) {
        document.getElementById("choices").style.display = "none";
        document.getElementById("shoeSelect").style.display = "inline-block";
    }
    else {
        document.getElementById("choices").style.display = "none";
        document.getElementById("noShoes").style.display = "block";
    }
}

document.getElementById("1").addEventListener("click", ()=>{
    const size = document.getElementById("inField").value;
    let gen = 0;
    let checkbox = document.getElementsByName('gender');
    for (i = 0; i < checkbox.length; i++) {
            if (checkbox[i].checked)
            gen = checkbox[i].value;
    }
    document.getElementById("shoeSelect").style.display = "none";
    document.getElementById("result").style.display = "block";
    let cabHeight = document.getElementById("cabHeight");
    let cabImage = document.getElementById("cabImage");
    let length = Math.floor(size / 7);
    if (gen == "male") {
        cabHeight.innerHTML = "Высота каблука: 1 см";
        cabImage.src = "boot2.png";
    }

    else if (gen == "female" && length <= 5 ) {
        cabHeight.innerHTML = "Высота каблука: " + length + " см";
        cabImage.src = "boot1.png";
    }

    else if (gen == "female" && length > 5 ) {
        cabHeight.innerHTML = "Высота каблука: " + length + " см";
        cabImage.src = "boot3.png";
    }
})