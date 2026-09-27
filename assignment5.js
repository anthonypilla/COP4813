const canvas = document.getElementById("spirographCanvas");
const ctx = canvas.getContext("2d");

const startButton = document.getElementById("startButton");


startButton.addEventListener("click", function () {




ctx.clearRect(0, 0, canvas.width, canvas.height);




const R = randomNumber(100, 250);

const r = randomNumber(20, R - 20);

const O = randomNumber(0, r);




const centerX = canvas.width / 2;
const centerY = canvas.height / 2;




let t = 0;



const tIncrement = 0.01;




ctx.beginPath();


let firstPoint = true;


for (let i = 0; i < 20000; i++) {

    

    const x =
        (R + r) * Math.cos(t) -
        (r + O) * Math.cos(((R + r) / r) * t);

    const y =
        (R + r) * Math.sin(t) -
        (r + O) * Math.sin(((R + r) / r) * t);


    

    const canvasX = centerX + x;
    const canvasY = centerY - y;


    

    if (firstPoint) {

        ctx.moveTo(canvasX, canvasY);

        firstPoint = false;

    } else {

        ctx.lineTo(canvasX, canvasY);

    }


 

    t += tIncrement;

}




ctx.stroke();


});



function randomNumber(min, max) {


return Math.floor(
    Math.random() * (max - min + 1)
) + min;


}
