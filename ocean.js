// Andres Quintanal Escandon <3
function setup(){
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext('2d');
    var slider1 = document.getElementById("slider1");
    var slider2 = document.getElementById("slider2");
    slider1.value = 25;
    slider2.value = 0.5;
    var x = 0;
    var y = 1;
    var phi = 0;
    
    // transforms
    var canvas_to_sun = mat3.create();
    mat3.fromTranslation(canvas_to_sun, [250,260]);

    var canvas_to_crown = mat3.create();
    mat3.fromTranslation(canvas_to_crown, [250, 260]);

    var canvas_to_wave1 = mat3.create();
    mat3.fromTranslation(canvas_to_wave1, [0,250]);

    var canvas_to_wave2 = mat3.create();
    mat3.fromTranslation(canvas_to_wave2, [0, 300]); 

    var canvas_to_wave3 = mat3.create();
    mat3.fromTranslation(canvas_to_wave3, [0, 350]); 

    var canvas_to_wave4 = mat3.create();
    mat3.fromTranslation(canvas_to_wave4, [0,400]);

    // curves
    var sun = function(t){return circle(t, 100)} 
    var wave1 = function(t){return sinWave(t, canvas.width, 25, 3, -1 *phi)}
    var wave2 = function(t){return sinWave(t, canvas.width, 17, 8, phi)}
    var wave3 = function(t){return sinWave(t, canvas.width, 10, 13, -1 * phi)}
    var wave4 = function(t){return sinWave(t, canvas.width, 5, 20, phi)}
    
    // arrays with waves, transforms, and colors
    const waves = [wave1, wave2, wave3, wave4];
    const transforms = [canvas_to_wave1, canvas_to_wave2, canvas_to_wave3, canvas_to_wave4];
    const colors = ["skyBlue", "steelBlue", "blue","midnightBlue"];

    // makes a line to x,y in given transform
    function lineToTx(x, y, tx){
        var endpoint = vec2.create();
        vec2.transformMat3(endpoint ,[x, y],tx);
        ctx.lineTo(endpoint[0],endpoint[1]);
    }

    // moves to x,y in given transform
    function moveToTx(x, y, tx){
        var endpoint = vec2.create(); 
        vec2.transformMat3(endpoint, [x,y], tx); 
        ctx.moveTo(endpoint[0], endpoint[1]);
    }
    
    // makes a circle with radius r centered on x,y in given transform
    function arcTx(x, y, radius, tx){
        var center = vec2.create(); 
        vec2.transformMat3(center, [x,y], tx); 
        ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI);
    }
    
    // lineToTx along the given curve, with a set number of intervals, in given transform
    // note that all given curves should be paramed to go from t = 0 to t = 1
    function drawCurve(curve, intervals, tx){
        var nextPoint = curve(0);
        var dt = 1.0 / intervals;
        moveToTx(nextPoint[x], nextPoint[y], tx);
        for(let t = 0.0; t < 1.0 + 0.1 * dt; t += dt){ // t1 + 0.1*dt because theyre doubles
            nextPoint = curve(t);
            lineToTx(nextPoint[x], nextPoint[y], tx);
        }
    }
    
    // Curve that makes a circle. can do any polygon by changing intervals in drawCurve
    var circle = function(t, radius) { // can do any regular polygon by changing interval param when drawing it
            var a = vec2.create();
            a[x] = radius*Math.cos(t*2*Math.PI);
            a[y] = radius*Math.sin(t*2*Math.PI);
            return a;
        }
 
    // parametrization of a sin wave, goes horizontally from 0 to length
    var sinWave = function(t, length, periods, amplitude, phase) {
        var a = vec2.create();
        a[x] = t * length;
        a[y] = amplitude * Math.cos(t * periods * 2*Math.PI + phase);
        return a;
    }

    // parametrization of a square
    var square = function(t, length){
        var a = vec2.create();
        if (t < 0.25){ // i really hope this counts as piecewise
            a[x] = t * 4 * length;
            a[y] = 0;
        } else if (t < 0.5) {
            t -= 0.25;
            a[x] = length;
            a[y] = t * 4 * length;
        } else if (t < 0.75) {
            t -= 0.5;
            a[x] = length - (t * 4 * length);
            a[y] = length;
        } else {
            t -= 0.75;
            a[x] = 0;
            a[y] = length - (t * 4 * length);
        }
        return a;
    }
    
    // curve that makes like a wobly circle thingy idk what the math is doing but it's doing something
    var scrunchie = function(t, radius, periods, amplitude, phase){
        var circ = circle(t, radius);
        var sin = sinWave(t, radius*2*Math.PI, periods, amplitude, phase);
        var a = vec2.create();
        a[x] = circ[x];
        a[y] = circ[y] + sin[y];
        return a;
    }
    
    // draws an ocean wave with the given sin wave and params 
    function drawOceanWave(c, height, tx){
        drawCurve(c, 1000, tx);
        lineToTx(canvas.width, height, tx);
        lineToTx(0, height, tx);
        ctx.closePath();
    }
    
    // draws the background of the canvas
    function drawBackGround(colorCenter, colorOut){
            var gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2,5,canvas.width/2, canvas.height/2, 2*canvas.width/3);
            gradient.addColorStop(0,colorCenter);
            gradient.addColorStop(1,colorOut);
            ctx.beginPath();
            ctx.fillStyle = gradient;
            ctx.rect(0,0,canvas.width,canvas.height);
            ctx.fill();
        }

    // draws everything on the screen
    function draw(){
        canvas.width = canvas.width;
        phi += 0.05;
        drawBackGround("yellow", "orange");

        var sun = function(t){return circle(t, 100)} // circle with radius 50
        var crown = function(t){return scrunchie(t, 200, 200, 5, phi*4)}
        var ship = function(t){return square(t,25)}
       
        // draws background
        drawBackGround("coral","mediumSlateBlue");

        //draws sun and scrunchie
        var sunSides = slider1.value;
        ctx.beginPath();
        ctx.fillStyle = "crimson"; 
        drawCurve(sun, sunSides, canvas_to_sun); 
        ctx.fill();

        ctx.beginPath();
        ctx.strokeStyle = "crimson";
        drawCurve(crown, 1000, canvas_to_crown);
        ctx.stroke();
    

        // draws the ocean
        var baseHeight = 250;
        var distWaves = 50;
        for(let i = 0; i < waves.length; i++){
            ctx.beginPath();
            ctx.fillStyle = colors[i];
            drawOceanWave(waves[i], baseHeight - distWaves*i, transforms[i]);
            ctx.fill();
        }

        // draws the square floating on wave4
        var time = slider2.value;
        var position = wave4(time); 
        position[y] += baseHeight +  distWaves * 3; 
        var canvas_to_square = mat3.create();
        mat3.fromTranslation(canvas_to_square, position);
        mat3.rotate(canvas_to_square, canvas_to_square, 1.25*Math.PI);
        ctx.beginPath();
        ctx.strokeStyle = "orchid";
        ctx.lineWidth = 4;
        drawCurve(ship, 20, canvas_to_square);
        
	window.requestAnimationFrame(draw);
    }
    draw();
}
window.onload = setup;
