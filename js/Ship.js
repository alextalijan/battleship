class Ship {
  constructor(length) {
    if (length < 1) {
      throw new Error("Ship can't be of length less than one.");
    }

    this.length = length;
    this.hits = 0;
  }

  hit() {
    this.hits += 1;
  }

  get isSunk() {
    if (this.length === this.hits) return true;

    return false;
  }
}

export default Ship;
