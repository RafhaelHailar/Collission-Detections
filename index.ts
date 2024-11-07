import p5 from "p5"

class Control {
    
}

class Vector2 {
    x:number;
    y:number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    toArray(): [number, number] {
        return [this.x, this.y]
    }

    sub(that: Vector2): Vector2 {
        return new Vector2(this.x - that.x, this.y - that.y);
    }
}

class Shape {
    center: Vector2;
    vertices: Vector2[];

    constructor (center: Vector2, vertices: Vector2[]) {
        this.vertices = vertices;
        this.center = center;
    }

    draw(p: p5): void {
        p.fill("red");
        p.circle(...this.center.toArray(), 5);

        this.vertices.forEach(vertice => {
            p.fill("blue");
            p.circle(...vertice.toArray(), 5);
        });
    }
}

class Line {
    
}

/* 
y1 = m*x1 + b
y2 = m*x2 + b

m1*x1 + b1 = m2*x2 + b2
m1*x1 = m2*x2 + b2 - b1
m1*x1 - m2*x2 = b2 - b1
ax - bx = ab - bb
x(a-b) = ab - bb
x = (b2 - b1) / (m1 - m2)
kx = c
x = c / k

b =  y2 - m*x2
y1 = m*x1 + y2 - m*x2
y1 = (m*x1 - m*x2) + y2
y1 = m*(x1-x2) + y2
y1 - y2 = m*(x1-x2)
(y1 - y2) / (x1 - x2) = m


*/

class Rectangle extends Shape {
    constructor (position: Vector2, size: Vector2) {
        const v1 = new Vector2(position.x, position.y);
        const v2 = new Vector2(position.x + size.x, position.y);
        const v3 = new Vector2(position.x, position.y + size.y);
        const v4 = new Vector2(position.x + size.x, position.y + size.y);
        
        let cx: number, cy: number;

        (() => {
            const d0 = v4.sub(v1);
            const m0 = d0.y / d0.x;
            const b0 = v1.y - (m0 * v1.x);

            const d1 = v3.sub(v2);
            const m1 = d1.y / d1.x;
            const b1 = v2.y - (m1 * v2.x);

            const dm = m0 - m1;

            if (dm === 0) throw new Error("invalid rectangle dimensions");

            cx = (b1 - b0) / (m0 - m1);
            cy = (m0 * cx) + b0;
        })();

        super(new Vector2(cx,cy), [v1, v2, v3, v4]);
    }
}

const sketch = (p: p5) => {
    const a = new Rectangle(new Vector2(75,105), new Vector2(50,50));

    p.setup = () => {   
        p.createCanvas(600,600);
    }

    p.keyPressed = () => {
       
    }

    p.keyReleased = () => {
        
    }

    p.draw = () => {
        p.background("#fff");

        a.draw(p);
    }
}

new p5(sketch); 