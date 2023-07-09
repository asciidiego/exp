/**
 * Bunch of constants.
 */
class CONSTANTS {
  static BOUNDING_BOX_COLOR = "#999";
  static BOUNDING_BOX_LINE_WIDTH = 1;
  static BOUNDING_BOX_PADDING = 1;
}

/**
 * @abstract A simple circle.
 */
class Circle {
  constructor({ x, y, radius }) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.hovering = false;
    this.selected = false;
  }

  draw(ctx) {
    ctx.save();

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.stroke();

    if (this.selected) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fill();
    }

    ctx.restore();
  }

  getBoundingBox() {
    return {
      x: this.x - this.radius,
      y: this.y - this.radius,
      width: this.radius * 2,
      height: this.radius * 2,
    };
  }

  isPointInside({ x, y }) {
    const isInside = Math.hypot(this.x - x, this.y - y) <= this.radius;

    return isInside;
  }
}

/**
 * @abstract A simple scene.
 *
 * Maybe later can be SceneGraph data structure.
 *
 * @see https://en.wikipedia.org/wiki/Scene_graph
 */
class Scene {
  constructor({ shapes = [], ctx }) {
    this.ctx = ctx;
    this.shapes = shapes;
  }

  add(shape) {
    this.shapes.push(shape);
    this.draw(this.ctx);
  }

  draw(ctx) {
    this.shapes.forEach((shape) => shape.draw(ctx));
  }

  getShapeAt({ x, y }) {
    for (let i = 0; i < this.shapes.length; i++) {
      const shape = this.shapes[i];
      const isInside = shape.isPointInside({ x, y });
      if (isInside) return shape;
    }

    return null;
  }

  onMouseMove({ x, y }) {
    let intersectedShape = null;

    for (let i = 0; i < this.shapes.length; i++) {
      const shape = this.shapes[i];
      const isInside = shape.isPointInside({ x, y });
      if (isInside) {
        shape.hovering = true;
        intersectedShape = shape;
      } else {
        shape.hovering = false;
      }
    }

    return {
      intersection: intersectedShape,
    };
  }
}

/**
 * Base class for a Lienzo canvas.
 */
class Lienzo {
  constructor({ canvasElement, width, height, supersampling = true }) {
    // 2D Canvas API + DOM stuff
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext("2d");
    this.width = width;
    this.height = height;
    this.canvas.width = this.width * (supersampling ? 2 : 1);
    this.canvas.height = this.height * (supersampling ? 2 : 1);
    this.ctx.scale(supersampling ? 2 : 1, supersampling ? 2 : 1);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    // Events
    this.canvas.addEventListener("click", this.onClick.bind(this));
    this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));

    // State
    this.scene = new Scene({ ctx: this.ctx });
    this.selection = null;

    // Init
    this.draw();
  }

  destructor() {
    this.canvas.removeEventListener("click", this.onClick);
    this.canvas.removeEventListener("mousemove", this.onMouseMove);
  }

  add(shape) {
    this.scene.add(shape);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.scene.draw(this.ctx);
  }

  onClick(event) {
    const { offsetX, offsetY } = event;
    const shape = this.scene.getShapeAt({ x: offsetX, y: offsetY });
    if (shape) this.selection = shape;
  }

  onMouseMove(event) {
    const { offsetX, offsetY } = event;
    const { intersection } = this.scene.onMouseMove({ x: offsetX, y: offsetY });

    if (intersection) {
      this.canvas.style.cursor = "pointer";

      // TODO: There shouldn't be any render logic here.

      this.draw();
      const boundingBox = intersection.getBoundingBox();
      this.ctx.save();
      this.ctx.strokeStyle = CONSTANTS.BOUNDING_BOX_COLOR;
      this.ctx.lineWidth = CONSTANTS.BOUNDING_BOX_LINE_WIDTH;
      this.ctx.strokeRect(
        boundingBox.x - CONSTANTS.BOUNDING_BOX_PADDING,
        boundingBox.y - CONSTANTS.BOUNDING_BOX_PADDING,
        boundingBox.width + CONSTANTS.BOUNDING_BOX_PADDING * 2,
        boundingBox.height + CONSTANTS.BOUNDING_BOX_PADDING * 2
      );
      this.ctx.restore();
    } else {
      this.canvas.style.cursor = "default";
      this.draw();
    }
  }
}
