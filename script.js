const vec_add = (v1, v2) => new V2(v1.x + v2.x, v1.y + v2.y);
const vec_sub =  (v1, v2) => new V2(v2.x - v1.x, v2.y - v1.y);
const vec_mult  = (v, c) => new V2(v.x * c, v.y * c);
const vec_len = (v) => Math.sqrt(v.x * v.x + v.y * v.y);
const vec_unit = (v) => {
    l = vec_len(v);
    return new V2(v.x / l, v.y / l);
};

class V2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Circle {
    constructor(position, radius, color) {
        this.position = position;
        this.radius = radius;
        this.color = color;
    }
}

class Eye {
    constructor(position, radius) {
        this.position = position;
        this.radius = radius;
        this.eyeball = new Circle(position, radius, "red");

        this.follow(new V2(0, 0));
    }

    follow(point) {
        let direction = vec_sub(this.position, point);
        let unit_direction = vec_unit(direction);
        let distance = vec_len(direction);

        this.pupil = new Circle(
            vec_add(this.position,
                vec_mult(unit_direction, distance > this.radius * 0.2 ? this.radius * 0.2 : distance)),
            this.radius * 0.8,
            "white"
        );

        this.iris = new Circle(
            vec_add(this.position,
                vec_mult(unit_direction, distance > this.radius * 0.6 ? this.radius * 0.6 : distance)),
            this.radius * 0.4,
            "black"
        );

        this.eyeReflection = new Circle(
            vec_add(this.position,
                vec_mult(unit_direction, distance > this.radius * 0.95 ? this.radius * 0.95 : distance)),
            this.radius * 0.05,
            "white"
        );
    }
}

class EyeFactory {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }

    generateEyes(eyeCount, canvasWidth, canvasHeight) {
        let eyes = [];
        for(let i = 0; i < this.canvasWidth; i = i + 150) {
            for(let j = 0; j < this.canvasHeight; j = j + 150) {
                eyes.push(new Eye(new V2(i + 160 * (Math.random() - 0.5), j + 160 * (Math.random() - 0.5)), 80 * Math.random() + 10));
            }
        }
        return eyes;
    }
}

class Renderer {
    constructor(context) {
        this.ctx = context;
    }

    drawEye(eye) {
        this.drawCircle(eye.eyeball);
        this.drawCircle(eye.pupil);
        this.drawCircle(eye.iris);
        this.drawCircle(eye.eyeReflection);
    }

    drawCircle(circle) {
        this.ctx.beginPath();
        this.ctx.arc(circle.position.x, this.ctx.canvas.height - circle.position.y,
                     circle.radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = circle.color;
        this.ctx.fill();
        this.ctx.strokeStyle = circle.color;
        this.ctx.stroke();
    }
}

window.onload = () => {
    let canvas = document.getElementById("game_board");
    let ctx = canvas.getContext("2d");
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const renderer = new Renderer(ctx);
    let eyeFactory = new EyeFactory(ctx.canvas.width, ctx.canvas.height);
    let eyes = eyeFactory.generateEyes();

    canvas.addEventListener('mousemove',(e) => {
        let mousePosition = new V2(e.offsetX, ctx.canvas.height - e.offsetY);
        eyes.map(e => e.follow(mousePosition));
        eyes.map(e => renderer.drawEye(e));
    });
}
