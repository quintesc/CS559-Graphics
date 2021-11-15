// Andres Quintanal Escandon

function setup(){
    var canvas = document.getElementById("myCanvas");
    var dphi = 0;
    var slider = document.getElementById("slider");
    slider.value = 3;
    
    // draws everything
    function draw(){
        context = canvas.getContext('2d');
        canvas.width = canvas.width; 
        const color1 = ["lightPink","hotPink","deepPink"];
        const color2 = ["paleTurquoise","aquamarine","cyan"];
        var outerRadius = 50.0;
        var dr = outerRadius / color1.length;
        var lilCircleRadius = dr / 2.0;
        var inSpeed = slider.value

        // draws a bigger 3 layered circle
        function drawBigCircle(colors){
            var radius = outerRadius;
            for(let i = 0; i < colors.length; i++){
                context.beginPath();
                context.fillStyle = colors[i];
                context.arc(0,0,radius,0,2 * Math.PI);
                context.fill();
                radius -= dr;
            }
        }

        // draws a small circle of the specified olor
        function drawLilCircle(color){
            context.beginPath(); 
            context.fillStyle = color;
            context.arc(0,0,lilCircleRadius,0,2 * Math.PI);
            context.fill();
        }
        
        // draws background
        function drawBackGround(){
            var gradient = context.createRadialGradient(125,125,5,125,125,250);
            gradient.addColorStop(0,"snow");
            gradient.addColorStop(1,"cornsilk");
            context.beginPath();
            context.fillStyle = gradient;
            context.rect(0,0,300,300);
            context.fill();
        }
        
        // draw background
        drawBackGround();
        // move to center
        context.translate(150,150);
        context.save();
        // draw big circle 1
        context.rotate(dphi);
        context.translate(75,0);
        drawBigCircle(color1);
        context.save();
        // draw little circles
        context.rotate(-(dphi * inSpeed));
        context.translate(1 * lilCircleRadius,0);
        drawLilCircle("paleTurquoise");
        context.restore(); // go back to center of circle
        context.save();

        context.rotate(dphi * inSpeed + Math.PI);
        context.translate(3 * lilCircleRadius,0);
        drawLilCircle("aquamarine");
        context.restore(); // go back to center of circle

        context.rotate(-(dphi * inSpeed)); 
        context.translate(5 * lilCircleRadius,0);
        drawLilCircle("cyan");
        context.restore(); // go back to center of canvas

        // draw big circle 2
        context.rotate(dphi + Math.PI);
        context.translate(75,0);
        drawBigCircle(color2);
        context.save();
        // draw little circles
        context.rotate(-(dphi * inSpeed));
        context.translate(1 * lilCircleRadius,0);
        drawLilCircle("lightPink");
        context.restore(); // go back to center of circle
        context.save();

        context.rotate(dphi * inSpeed + Math.PI);  // 2 third of 2pi
        context.translate(3 * lilCircleRadius,0);
        drawLilCircle("hotPink");
        context.restore(); // go back to center of circle

        context.rotate(-(dphi * inSpeed)); // 1 third of 2pi
        context.translate(5 * lilCircleRadius,0);
        drawLilCircle("deepPink");

        dphi += 0.03;
        window.requestAnimationFrame(draw);
    }
    window.requestAnimationFrame(draw);
}
window.onload = setup;
