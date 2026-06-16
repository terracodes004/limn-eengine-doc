class Display {
    constructor() {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.frameNo = 0;
        this.keys = [];
        this.x = false;
        this.y = false;
        this.interval = null;
        this.camera = new Camera(); // Initialize camera
    }

    start(width = 480, height = 270, no = document.body) {
        this.canvas.width = width;
        this.canvas.height = height;
        no.insertBefore(this.canvas, no.childNodes[0]);
        this.interval = setInterval(() => this.updat(), 20);
        this.addEventListeners();
    }

    addEventListeners() {
        window.addEventListener('keydown', (e) => {
            console.log("Key pressed:", e.keyCode);
            this.keys[e.keyCode] = true;
        });
        window.addEventListener('keyup', (e) => {
            this.keys[e.keyCode] = false;
        });
        window.addEventListener('mousedown', (e) => {
            this.x = e.pageX;
            this.y = e.pageY;
        });
        window.addEventListener('mouseup', () => {
            this.x = false;
            this.y = false;
        });
        window.addEventListener('touchstart', (e) => {
            this.x = e.touches[0].pageX;
            this.y = e.touches[0].pageY;
        });
        window.addEventListener('touchend', () => {
            this.x = false;
            this.y = false;
        });
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    borderStyle(borderStyle) {
        this.canvas.style.borderStyle = borderStyle;
    }

    stop() {
        clearInterval(this.interval);
    }

    borderSize(borderSize) {
        this.canvas.style.borderSize = borderSize;
    }

    backgroundColor(color) {
        this.canvas.style.backgroundColor = color;
    }

    borderColor(color) {
        this.canvas.style.borderColor = color;
    }

    fontColor(color) {
        this.canvas.style.color = color;
    }

    scale(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    add(x) {
        comm.push(x);
    }

    updat() {
        this.clear();
        this.frameNo += 1;
        this.context.save();
        this.context.translate(-this.camera.x, -this.camera.y);
        try {
            update();
        } catch  {
            //pass
        }
        comm.forEach(component => {
            component.move();
            component.update(this.context);
        });
        this.context.restore();
    }
}

class Component {
    constructor(width = 0, height = 0, color = null, x = 0, y = 0, type) {
        this.width = width;
        this.height = height;
        this.color = color;
        this.type = type;
        this.angle = 0;
        this.x = x;
        this.y = y;
        this.speedX = 0;
        this.speedY = 0;
        this.gravity = 0;
        this.gravitySpeed = 0;
        this.bounce = 0.6;
        this.physics = false;
        this.changeAngle = true;
        this.cam = true;

        if (type === "image") {
            this.image = new Image();
            this.image.src = this.color;
        }
    }

    update(ctx = display.context) {
        if (this.type === "text") {
            ctx.font = `${this.width} ${this.height}`;
            ctx.fillStyle = this.color;
            ctx.fillText(this.text, this.x, this.y);
        } else if (this.changeAngle) {
            ctx.save();
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
            ctx.rotate(this.angle);
            if (this.type === "image") {
                ctx.drawImage(this.image, this.width / -2, this.height / -2, this.width, this.height);
            } else {
                ctx.fillStyle = this.color;
                ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
            }
            ctx.restore();
        } else {
            if (this.type === "image") {
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            } else {
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        }
    }

    moveAngle() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX * Math.cos(this.angle);
        this.y += this.speedY * Math.sin(this.angle) + this.gravitySpeed;
    }

    move() {
        if (this.physics) {
            this.gravitySpeed += this.gravity;
            this.x += this.speedX;
            this.y += this.speedY + this.gravitySpeed;
        } else {
            this.x += this.speedX;
            this.y += this.speedY;
        }
    }

    hitBottom() {
        const rockbottom = display.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = -(this.gravitySpeed * this.bounce);
        }
    }

    stopMove() {
        this.speedX = 0;
        this.speedY = 0;
    }

    clicked() {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const rotatedX = (display.x - centerX) * Math.cos(-this.angle) - (display.y - centerY) * Math.sin(-this.angle) + centerX;
        const rotatedY = (display.x - centerX) * Math.sin(-this.angle) + (display.y - centerY) * Math.cos(-this.angle) + centerY;

        const myleft = this.x;
        const myright = this.x + this.width;
        const mytop = this.y;
        const mybottom = this.y + this.height;
        let clicked = true;
        if ((mybottom < rotatedY) || (mytop > rotatedY) || (myright < rotatedX) || (myleft > rotatedX)) {
            clicked = false;
        }
        return clicked;
    }

    crashWith(otherobj) {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const otherCenterX = otherobj.x + otherobj.width / 2;
        const otherCenterY = otherobj.y + otherobj.height / 2;

        const rotatedX = (otherCenterX - centerX) * Math.cos(-this.angle) - (otherCenterY - centerY) * Math.sin(-this.angle) + centerX;
        const rotatedY = (otherCenterX - centerX) * Math.sin(-this.angle) + (otherCenterY - centerY) * Math.cos(-this.angle) + centerY;

        const myleft = this.x;
        const myright = this.x + this.width;
        const mytop = this.y;
        const mybottom = this.y + this.height;
        const otherleft = rotatedX - otherobj.width / 2;
        const otherright = rotatedX + otherobj.width / 2;
        const othertop = rotatedY - otherobj.height / 2;
        const otherbottom = rotatedY + otherobj.height / 2;
        let crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

class Sound {
    constructor(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
    }

    play() {
        this.sound.play();
    }

    stop() {
        this.sound.pause();
    }
}

class Camera {
    constructor(x = 0, y = 0, worldWidth = 1000, worldHeight = 1000) {
        this.x = x;
        this.y = y;
        this.target = null;
        this.speed = 5;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
    }

    follow(target, smooth = false) {
        if (smooth) {
            this.x += (target.x - this.x) * 0.1;
            this.y += (target.y - this.y) * 0.1;
        } else {
            this.x = target.x - display.canvas.width / 2;
            this.y = target.y - display.canvas.height / 2;
        }
        // Clamp camera to world bounds
        this.x = Math.max(0, Math.min(this.x, this.worldWidth - display.canvas.width));
        this.y = Math.max(0, Math.min(this.y, this.worldHeight - display.canvas.height));
    }
}

var comm = [];
var move ={
    backward : function(id, steps){
        id.physics = true;
        id.speedX = -steps;
        id.speedY = -steps;
    },
    teleport : function(id, x, y){
        id.x = x
        id.y = y
    },
    setX : function(id, x){
        id.x = x;
    },
    setY : function(id, y){
        id.y = y;
    },
    stamp : function(id){
        const stamped = new Component(id.width, id.height, id.color, id.x, id.y, id.type)
        
        return stamped;
    },
    circle : function(id, speed){
        id.physics = true;
        id.changeAngle = true
        id.angle = speed * Math.PI / 180;
    },
    dot : function(id){
        var ctx = display.context
        ctx.beginPath();
        ctx.arc(id.x,id.y,0,0,2*Math.PI);
        ctx.fillStyle = "blue";
        ctx.fill();
        ctx.stroke();
    },
    clearStamp : function(id){
        id.update = false;
    },
    turnLeft : function(id, steps){
        id.changeAngle = true
        id.angle += steps
    },
    turnLeft : function(id, steps){
        id.changeAngle = true
        id.angle += -steps;
    },
    bound : function(id){
        if (id.x <= 0){
            id.x = 0;
        }
        if (id.x >= display.canvas.width){
            id.x = display.canvas.width;
        }
        
    },
    boundTo : function(id, left=false, right=false, top=false, bottom=false){
        if(left){
            if(id.x <= left){
                id.x = left;
            }
        }if(right){
            if(id.x >= right){
                id.x = right;
            }
        }if(top){
        
            if(id.y <= top){
                id.y = top;
        
            }
            
        }if(bottom){
            if(id.y >= bottom){
                id.y = bottom;
            }
        }
    
    },
    hitObject : function(id, otherid){
        id.physics = true;
        if((id.crashWith(otherid)) && (id.y <= otherid)){
            id.gravitySpeed = -(id.gravitySpeed * id.bounce);
        }
    },
    glideX : function(id,t, x){
        time = t
        dis = Math.sqrt(Math.pow(id.x-x,2))
        tim = 1000 * time
        time = time * 5
        speed = dis/time
        vc = 1
        ////console.log(speed)
        //console.log("fh")
                if (id.x > x) {
                    id.speedX = -1*speed
                } else{
                    id.speedX = 1*speed

                }
                
           setTimeout(() => {
                id.speedX = 0
                ////console.log("gfhj")
                vc = 0
           }, time);
           
           
        
        
    },
    glideY : function(id,t, y){
        time = t
        dis = Math.sqrt(Math.pow(id.y-y,2))
        tim = 1000 * time
        time = time * 5
        speed = dis/time
        vc = 1
        ////console.log(speed)
        ////console.log("fh")
                if (id.y > y) {
                    id.speedY = -1*speed
                } else{
                    id.speedY = 1*speed

                }
                
           setTimeout(() => {
                id.speedY = 0
                ////console.log("gfhj")
                vc = 0
           }, time);
           
           
        
        
    },
    glideTo: function (id,t, x,y){
        this.glideX(id,t, x )
        this.glideY(id, t, y)
    },
    project : function(id, initialVelocity, angle, gravity) {
        // Convert angle to radians
        let radianAngle = angle * Math.PI / 180;
        
        // Calculate the initial velocity components
        let velocityX = initialVelocity * Math.cos(radianAngle);
        let velocityY = initialVelocity * Math.sin(radianAngle);
        
        // Set the object's initial speed
        id.speedX = velocityX;
        id.speedY = -velocityY; // Negative because upward direction is negative in canvas
    
        // Update the object's position over time
        let updatePosition = () => {
            id.speedY += gravity; // Apply gravity to the vertical speed
            id.x += id.speedX;
            id.y += id.speedY;
    
            // Check for collision with the ground
            if (id.y >= display.canvas.height - id.height) {
                id.y = display.canvas.height - id.height;
                id.speedY = -(id.speedY * id.bounce); // Apply bounce effect
            }
    
            // Continue updating the position
            if (id.y < display.canvas.height - id.height || id.speedY !== 0) {
                requestAnimationFrame(updatePosition);
            }
        };
    
        // Start updating the position
        updatePosition();
    },
    pointTo : function(id, targetX, targetY) {
        // Calculate the difference in coordinates
        let deltaX = targetX - id.x;
        let deltaY = targetY - id.y;
    
        // Calculate the angle in radians
        let angleRadians = Math.atan2(deltaY, deltaX);
    
        // Set the component's angle
        id.angle = angleRadians;
    },
    // New accelerate function
    accelerate: function(id, accelX, accelY, maxSpeedX = Infinity, maxSpeedY = Infinity) {
        // Add acceleration to current speed
        id.speedX += accelX;
        id.speedY += accelY;

        // Clamp speeds to maxSpeed (or Infinity for unlimited)
        if (Math.abs(id.speedX) > maxSpeedX) {
            id.speedX = id.speedX > 0 ? maxSpeedX : -maxSpeedX;
        }
        if (Math.abs(id.speedY) > maxSpeedY) {
            id.speedY = id.speedY > 0 ? maxSpeedY : -maxSpeedY;
        }
    },
    // New decelerate function
    decelerate: function(id, decelX, decelY) {
        // Reduce speedX towards 0
        if (id.speedX > 0) {
            id.speedX -= decelX;
            if (id.speedX < 0) id.speedX = 0; // Prevent overshooting
        } else if (id.speedX < 0) {
            id.speedX += decelX;
            if (id.speedX > 0) id.speedX = 0; // Prevent overshooting
        }

        // Reduce speedY towards 0
        if (id.speedY > 0) {
            id.speedY -= decelY;
            if (id.speedY < 0) id.speedY = 0; // Prevent overshooting
        } else if (id.speedY < 0) {
            id.speedY += decelY;
            if (id.speedY > 0) id.speedY = 0; // Prevent overshooting
        }
    },
    position: function(id, direction, offset = 0) {
        switch (direction.toLowerCase()) {
            case "top":
                id.x = (display.canvas.width - id.width) / 2; // Center horizontally
                id.y = offset; // Offset from top
                break;
            case "bottom":
                id.x = (display.canvas.width - id.width) / 2; // Center horizontally
                id.y = display.canvas.height - id.height - offset; // Offset from bottom
                break;
            case "left":
                id.x = offset; // Offset from left
                id.y = (display.canvas.height - id.height) / 2; // Center vertically
                break;
            case "right":
                id.x = display.canvas.width - id.width - offset; // Offset from right
                id.y = (display.canvas.height - id.height) / 2; // Center vertically
                break;
            case "center":
                id.x = (display.canvas.width - id.width) / 2;
                id.y = (display.canvas.height - id.height) / 2;
                break;
            default:
                console.error("Invalid direction. Use 'top', 'bottom', 'left', or 'right'.");
        }
        // Reset speed to stop any movement after positioning
        id.speedX = 0;
        id.speedY = 0;
    }
    
    

}
var state = {
    distance : function(id, otherid){
        dis = Math.sqrt((Math.pow(id.x-otherid.x,2))+(Math.pow(id.y-otherid.y,2)))
        return dis;
    },
    rect : function(id){
        return [id.x, id.y, id.width, id.height]
    },
    physics :  function(id){
        return id.physics
    },
    changeAngle :  function(id){
        return id.changeAngle
    },
    Angle :  function(id){
        return id.angle
    },
    pos :  function(id){
        return id.x+','+id.y
    }
}
class Sprite {
    constructor(image, frameWidth, frameHeight, frameCount, frameSpeed) {
        this.image = image;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.frameCount = frameCount;
        this.frameSpeed = frameSpeed;
        this.currentFrame = 0;
        this.frameTimer = 0;
    }

    update() {
        this.frameTimer++;
        if (this.frameTimer >= this.frameSpeed) {
            this.frameTimer = 0;
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
        }
    }

    draw(ctx, x, y) {
        ctx.drawImage(
            this.image,
            this.currentFrame * this.frameWidth,
            0,
            this.frameWidth,
            this.frameHeight,
            x,
            y,
            this.frameWidth,
            this.frameHeight
        );
    }
}
