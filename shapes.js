// Andres Quintanal

function make(){
    var canvas = document.getElementById('myCanvas');
    var slider = document.getElementById('slider');
    slider.addEventListener("input",squares);
    slider.value = 20; // i have no clue why but 20 makes everything work
    
    // colors for the squars
    const colors = ["blue","darkcyan","azure","aquamarine","seagreen","yellowgreen","yellow","gold","orange","red"];
    squares();

function squares(){
        var context = canvas.getContext('2d');
        canvas.width = canvas.width;
        var scalar =1 - (slider.value/100);
        for(let i = 0; i < colors.length; i++){
            var b = 0;
            context.beginPath();
            context.moveTo(125,125);
            context.lineTo(125,0);
            context.lineTo(0,0);
            context.lineTo(0,250);
            context.lineTo(250,250);
            context.lineTo(250,0);
            context.lineTo(125,0);
            context.lineTo(125,125);
            context.closePath();
            context.fillStyle = colors[i];
            context.fill();
            context.translate(25,25);
            context.scale(scalar,scalar);
        } 
    }


}

window.onload = make;
