// Andres Quintanal Escandon <3
function setup(){
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext('2d');
    var k = (75*16) / Math.PI; // idk just random numbers pls ignore

    var slider1 = document.getElementById("slider1");
    slider1.value = 12.5;
    var slider2 = document.getElementById("slider2");
    slider2.value = 12.5;
    var slider3 = document.getElementById("slider3");
    slider3.value = 12.5;
    var slider4 = document.getElementById("slider4");
    slider4.value = 12.5;

    var length1 = 10;
    var radius1 = 5;
    var theta1 = slider1.value / k;

    var length2 = 15;
    var radius2 = 7.5;
    var theta2 = slider2.value / k;

    var length3 = 20;
    var radius3 = 10;
    var theta3 = slider3.value / k;

    var length4 = 25;
    var radius4 = 12.5;
    var theta4 = slider4.value / k;

    const colors1 = ["midnightBlue","blue","steelBlue","skyBlue"];
    const colors2 = ["paleGreen","aquamarine","springGreen","mediumSpringGreen"];
    const colors3 = ["lightCoral","salmon","coral","tomato"];


    function lineToTx(x, y, tx){
        var endpoint = vec2.create();
        vec2.transformMat3(endpoint ,[x, y],tx);
        ctx.lineTo(endpoint[0],endpoint[1]);
    }

    function moveToTx(x, y, tx){
        var endpoint = vec2.create(); 
        vec2.transformMat3(endpoint, [x,y], tx); 
        ctx.moveTo(endpoint[0], endpoint[1]);
    }

    function arcTx(x, y, radius, color, tx){
        var center = vec2.create(); 
        vec2.transformMat3(center, [x,y], tx); // put it at length bc that's the end of the string
        ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI);
    }

    function pendulum(length, radius, color, tx){
        // make string
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = color;
        moveToTx(0, 0, tx);
        lineToTx(0,length,tx); // lines made on y axis exclusively
        ctx.stroke();
        ctx.closePath();

        // make circle
        ctx.beginPath();
        ctx.fillStyle = color;
        moveToTx(0, length, tx);
        arcTx(0, length, radius, color, tx);
        ctx.fill();
        ctx.closePath();
    }

    function drawPendulum(x,y,colors){
        var canvas_to_top = mat3.create();
        mat3.fromTranslation(canvas_to_top, [x,y]); // move to center of pendulum
        mat3.rotate(canvas_to_top, canvas_to_top, theta1); //
        pendulum(length1, radius1, colors[0], canvas_to_top);

        var top_to_two = mat3.create();
        mat3.fromTranslation(top_to_two, [0, length1 + radius1]); // length + radius so there's no random lines inside the circles
        mat3.rotate(top_to_two, top_to_two, theta2);
        var canvas_to_two = mat3.create();
        mat3.multiply(canvas_to_two, canvas_to_top, top_to_two);
        pendulum(length2, radius2, colors[1], canvas_to_two);

        var two_to_three = mat3.create();
        mat3.fromTranslation(two_to_three, [0, length2 + radius2]);
        mat3.rotate(two_to_three, two_to_three, theta3);
        var canvas_to_three = mat3.create();
        mat3.multiply(canvas_to_three, canvas_to_two, two_to_three);
        pendulum(length3, radius3, colors[2], canvas_to_three);
        
        var three_to_four = mat3.create();
        mat3.fromTranslation(three_to_four, [0, length3 + radius3]);
        mat3.rotate(three_to_four, three_to_four, theta4);
        var canvas_to_four = mat3.create();
        mat3.multiply(canvas_to_four, canvas_to_three, three_to_four);
        pendulum(length4, radius4, colors[3], canvas_to_four);
        }

    function draw(){
        canvas.width = canvas.width;

        // make background
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.rect(0,0,500,500);
        ctx.fill();
        ctx.closePath();

        drawPendulum(125,125,colors1);
        drawPendulum(250,125,colors1);
        drawPendulum(375,125,colors1);

        drawPendulum(125,250,colors2);
        drawPendulum(250,250,colors2);
        drawPendulum(375,250,colors2);

        drawPendulum(125,375,colors3);
        drawPendulum(250,375,colors3);
        drawPendulum(375,375,colors3);

        theta1 += slider1.value / k; 
        theta2 += slider2.value / k;
        theta3 += slider3.value / k;
        theta4 += slider4.value / k;

        window.requestAnimationFrame(draw);
    }
    draw();
}
window.onload = setup;
