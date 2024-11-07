import p5 from "p5"

const POINT_SIZE = 10;
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

    length(that: Vector2): number {
        const d = this.sub(that);
        return Math.sqrt(d.x ** 2 + d.y ** 2);
    }
}

class Shape {
    center: Vector2;
    vertices: Vector2[];
    edges: [Vector2, Vector2][];

    constructor (center: Vector2, vertices: Vector2[], edges?: [Vector2, Vector2][]) {
        this.vertices = vertices;
        this.center = center;
        this.edges = edges || [];
    }

    draw(p: p5): void {
        p.fill("red");
        p.circle(...this.center.toArray(), POINT_SIZE);

        this.vertices.forEach(vertice => {
            p.fill("blue");
            p.circle(...vertice.toArray(), POINT_SIZE);
        });

        this.edges.forEach(edge => {
            const [p0, p1] = edge;
            
            p.stroke("black");
            p.line(p0.x, p0.y, p1.x, p1.y);
        })
    }
}

class Point {
    position: Vector2;
    color: string;

    constructor (position: Vector2, color?: string) {
        this.position = position;
        this.color = color ?? "black";
    }

    draw(p: p5) {
        p.fill(this.color);
        p.circle(...this.position.toArray(), POINT_SIZE);
    }
}

class Line {
    
}

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

        super(
            new Vector2(cx,cy),
            [v1, v2, v3, v4],
            [[v1, v2], [v1, v3], [v2, v4], [v3, v4]]
        );
    }
}

type WorldShape = Rectangle | Vector2;

class CircleCollission {
    static compare(a: WorldShape, b: WorldShape): boolean {
        const ca: Vector2 = getCenter(a);
        const cb: Vector2 = getCenter(b);

        const ra = getRadius(ca, a);
        const rb = getRadius(cb, b);

        const d = ca.length(cb);
        const rSum = ra + rb;

        return rSum > d;
    }
}

function getRadius(c: Vector2,a: WorldShape) {
    if (a instanceof Vector2) return POINT_SIZE;

    let maxDistance = Number.MIN_VALUE;
    a.vertices.forEach(vertice => {
        let distance = c.length(vertice);
        if (distance > maxDistance) {
            maxDistance = distance;
        }
    });

    return maxDistance;
}

function getCenter(a: WorldShape): Vector2 {
    if (a instanceof Vector2) return a;
    return a.center;
}

const sketch = (p: p5) => {
    const a = new Rectangle(new Vector2(75,105), new Vector2(50,50));
    const b = new Rectangle(new Vector2(175,105), new Vector2(50,50));

    const points: Point[] = [];

    p.setup = () => {   
        p.createCanvas(600,600);
    }

    p.keyPressed = () => {
       
    }

    p.keyReleased = () => {
        
    }

    p.mouseClicked = () => {
        points.push(new Point(new Vector2(p.mouseX, p. mouseY), "blue"));
    }

    p.mouseMoved = () => {
        const m = new Vector2(p.mouseX, p.mouseY);
      
        points.forEach(point => {
            if (CircleCollission.compare(m, point.position)) {
                point.color = "green";
                setTimeout(() => {
                    const m = new Vector2(p.mouseX, p.mouseY);
                    if (CircleCollission.compare(m, point.position)) return;
                    point.color = "blue";
                }, 1000);
            }
        });
    }

    p.draw = () => {
        p.background("#fff");

        p.noStroke();
        a.draw(p);
        b.draw(p);

        points.forEach((point, i) => {
            p.noStroke();
            point.draw(p);

            if (i < points.length - 1) {
                const nextPoint = points[i + 1];
                p.fill("black");
                p.line(...point.position.toArray(), ...nextPoint.position.toArray());
            }
        })
    }
}

new p5(sketch); 