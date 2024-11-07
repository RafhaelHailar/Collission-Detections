import p5 from "p5"

const APP = {
    isNewShapeMode: true
};

const isNewShapeModeHTML = document.getElementById("isNewShapeModeHTML");

if (isNewShapeModeHTML) {
    isNewShapeModeHTML.addEventListener("change", function(event: Event) {
        const element = event.target as HTMLInputElement;
        APP.isNewShapeMode = element.checked;
    });
}
   
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
        const [cx,cy] = this.center.toArray();
        p.fill("red");
        p.circle(...this.center.toArray(), POINT_SIZE);
        p.textSize(8);
        p.textAlign("center");
        p.text(`${cx.toFixed(2)}, ${cx.toFixed(2)}`, cx, cx + POINT_SIZE);

        this.vertices.forEach(vertice => {
            p.noStroke();
            p.fill("blue");
            p.circle(...vertice.toArray(), POINT_SIZE);

            const [x,y] = vertice.toArray();
            p.textSize(8);
            p.textAlign("center");
            p.text(`${x.toFixed(2)}, ${y.toFixed(2)}`, x, y + POINT_SIZE);
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
        const [x,y] = this.position.toArray();
        p.textSize(8);
        p.textAlign("center");
        p.text(`${x.toFixed(2)}, ${y.toFixed(2)}`, x, y + POINT_SIZE);

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

        return rSum >= d;
    }
}

function getRadius(c: Vector2,a: WorldShape) {
    if (a instanceof Vector2) return POINT_SIZE / 2;

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
    const c = new Shape(new Vector2(0,0), [
        new Vector2(352, 168),
        new Vector2(396, 199),
        new Vector2(441, 166),
        new Vector2(390, 136)
    ],[
        [new Vector2(352, 168), new Vector2(396, 199)],
        [new Vector2(396, 199), new Vector2(441, 166)],
        [new Vector2(441, 166), new Vector2(390, 136)],
        [new Vector2(390, 136), new Vector2(352, 168)]
    ])

    const points: Point[] = [];
    const edges: [Point, Point][] = [];

    let lastPoint: Point | null = null;

    function getPointCollided(p0: Vector2): Point | null {
        for (let i = 0;i < points.length;i++) {
            const point = points[i];
            if (CircleCollission.compare(p0, point.position)) return point;
        }

        return null;
    }

    p.setup = () => {   
        p.createCanvas(600,600);
    }

    p.keyPressed = () => {
       
    }

    p.keyReleased = () => {
        
    }

    p.mouseClicked = () => {
        const m = new Vector2(p.mouseX, p.mouseY);
        const pointCollided = getPointCollided(m);

        if (!APP.isNewShapeMode || (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height)) return;
        if (lastPoint === pointCollided && points.length > 0) return;

        let newLastPoint: Point | null = pointCollided;

        if (!newLastPoint) {
            const newPoint = new Point(m, "blue");
            points.push(newPoint);              
            newLastPoint = newPoint;
        }

        if (lastPoint) edges.push([lastPoint, newLastPoint]);

        lastPoint = newLastPoint;
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
        });

        edges.forEach((edge) => {
            const [p0, p1] = edge;

            p.stroke("black");
            p.line(...p0.position.toArray(), ...p1.position.toArray());
        })

        p.fill("purple");
        p.circle(p.mouseX, p.mouseY, POINT_SIZE);

        c.draw(p);
        // for debugging
      /*   points.forEach(point => {
            const m = new Vector2(p.mouseX, p.mouseY);

            p.stroke("black");
            p.line(...point.position.toArray(), ...m.toArray());
            
            p.text(m.length(point.position), ...point.position.toArray());
        }) */
    }
}

new p5(sketch); 