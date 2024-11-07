import p5 from "p5"

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
}

const sketch = (p: p5) => {
    p.setup = () => {   
        p.createCanvas(600,600);
    }

    p.draw = () => {
        p.background("#1A1A1D");

        p.fill("#A64D79")
        p.rect(50,50, 50, 50)
    }
}

new p5(sketch); 