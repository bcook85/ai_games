'use strict';

class Ball {
  constructor(pos, radius) {
    this.pos = new Vector(pos.x, pos.y);
    this.radius = radius;
    this.vel = new Vector(0, 0);
  };
  vsVector(vec) {
    return Math.abs(((vec.x - this.x) * (vec.x - this.x)) + ((vec.y - this.y) * (vec.y - this.y))) < this.radius * this.radius;
  };
  vsBall(b) {
    if (this.pos.getDistance(b.pos) < this.radius + b.radius) {
      return true;
    }
    return false;
  };
  vsCircle(pos, radius) {
    if (this.pos.getDistance(pos) < this.radius + radius) {
      return true;
    }
    return false;
  };
  vsSeg(startPoint, endPoint) {
    let v1 = endPoint.sub(startPoint);
    let v2 = this.pos.sub(startPoint);
    let u = (v2.x * v1.x + v2.y * v1.y) / (v1.y * v1.y + v1.x * v1.x);
    let dist = 0;
    if (u >= 0 && u <= 1) {
      dist = (startPoint.x + v1.x * u - this.pos.x) ** 2 + (startPoint.y + v1.y * u - this.pos.y) ** 2;
    } else {
      dist = u < 0 ?
        (startPoint.x - this.pos.x) ** 2 + (startPoint.y - this.pos.y) ** 2 :
        (endPoint.x - this.pos.x) ** 2 + (endPoint.y - this.pos.y) ** 2;
    }
    return dist < this.radius * this.radius;
  };
  vsRay(p1, angle, maxDistance) {
    let p2 = p1.add(Vector.fromAngle(angle).mul(maxDistance));
    let a = (p2.x - p1.x)**2 + (p2.y - p1.y)**2;
    let b = 2*((p2.x - p1.x) * (p1.x - this.pos.x)) + 2*((p2.y - p1.y) * (p1.y - this.pos.y));
    let c = (p1.x - this.pos.x)**2 + (p1.y - this.pos.y)**2 - this.radius**2;
    let discriminant = b**2 - (4 * a * c);
    if (discriminant > this.radius**2) {
      let t = (2 * c) / (Math.sqrt(discriminant) - b)
      if (t >= 0 && t <= 1) {
        return t * maxDistance;
      }
    }
    return maxDistance;
  };
  resolveBallCollision(target) {
    let potentialPosition = this.pos.add(this.vel);
    if (this.vsBall(target)) {
      let distanceBetween = Math.hypot(target.pos.x - potentialPosition.x, target.pos.y - potentialPosition.y);
      let overlap = (distanceBetween - this.radius - target.radius);
      potentialPosition = potentialPosition.sub(potentialPosition.sub(target.pos).mul(overlap).div(distanceBetween));
      this.vel = Vector.fromAngle(this.pos.getAngle(potentialPosition)).normalize().mul(this.pos.getDistance(potentialPosition));
    }
  };
  resolveGridCollision(grid) {
    let potentialPosition = this.pos.add(this.vel);
    let currentCell = new Vector(Math.floor(this.pos.x), Math.floor(this.pos.y));
    let targetCell = potentialPosition;
    let areaTL = new Vector(Math.floor(Math.min(currentCell.x, targetCell.x) - 1), Math.floor(Math.min(currentCell.y, targetCell.y)) - 1);
    let areaBR = new Vector(Math.floor(Math.max(currentCell.x, targetCell.x) + 1), Math.floor(Math.max(currentCell.y, targetCell.y)) + 1);
    let cell = new Vector(0, 0);
    for (cell.y = areaTL.y; cell.y <= areaBR.y; cell.y++) {
      for (cell.x = areaTL.x; cell.x <= areaBR.x; cell.x++) {
        if (cell.x < 0 || cell.y < 0
          || cell.x >= grid.length || cell.y >= grid[cell.x].length
          || grid[cell.x][cell.y] >= 0) {
          potentialPosition = this.pos.add(this.vel);
          let near = new Vector(
            Math.max(cell.x, Math.min(potentialPosition.x, cell.x + 1))
            ,Math.max(cell.y, Math.min(potentialPosition.y, cell.y + 1))
          );
          let rayToNear = near.sub(potentialPosition);
          if (rayToNear.x == 0 && rayToNear.y == 0) {
            potentialPosition = potentialPosition.sub(this.vel.normalize().mul(this.radius));
          } else {
            let overlap = this.radius - rayToNear.mag();
            if (!isNaN(overlap) && overlap > 0) {
              potentialPosition = potentialPosition.sub(rayToNear.normalize().mul(overlap));
            }
          }
          this.vel = Vector.fromAngle(this.pos.getAngle(potentialPosition)).normalize().mul(this.pos.getDistance(potentialPosition));
        }
      }
    }
  };
  collidesGrid(grid) {
    let areaTL = new Vector(
      Math.floor(this.pos.x - this.radius) - 1
      ,Math.floor(this.pos.y - this.radius) - 1
    );
    let areaBR = new Vector(
      Math.ceil(this.pos.x + this.radius) + 1
      ,Math.ceil(this.pos.y + this.radius) + 1
    );
    let cell = new Vector(0, 0);
    for (cell.y = areaTL.y; cell.y <= areaBR.y; cell.y++) {
      for (cell.x = areaTL.x; cell.x <= areaBR.x; cell.x++) {
        if (cell.x < 0 || cell.y < 0
          || cell.x >= grid.length || cell.y >= grid[cell.x].length
          || grid[cell.x][cell.y] >= 0) {
          let near = new Vector(
            Math.max(cell.x, Math.min(this.pos.x, cell.x + 1))
            ,Math.max(cell.y, Math.min(this.pos.y, cell.y + 1))
          );
          let rayToNear = near.sub(this.pos);
          if (rayToNear.x == 0 && rayToNear.y == 0) {
            return true;
          } else {
            let overlap = this.radius - rayToNear.mag();
            if (!isNaN(overlap) && overlap > 0) {
              return true;
            }
          }
        }
      }
    }
    return false;
  };
};