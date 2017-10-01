export class AdjacencyMatrix {
  private adjacencyMatrix: number[][];
  private nodesNumber: number;

  constructor(nodesNumber: number) {
    this.nodesNumber = nodesNumber;
    this.adjacencyMatrix = [];

    for (let i = 0; i < nodesNumber; i++) {
      this.adjacencyMatrix.push(new Array<number>(nodesNumber));
    }
  }

  public generateMatrix(): number[][] {
    const probability = (0.45 - 0.4 * (this.nodesNumber - 6));

    for (let i = 0; i < this.nodesNumber; i++) {
      for (let j = 0; j < this.nodesNumber; j++) {
        if (i !== j) {
          const randomProb = Math.random();
          if (randomProb <= probability) {
            const weight = 1 + Math.round(Math.random() * 9);
            this.connectNodes(i, j, weight);
          } else {
            this.connectNodes(i, j, 0);
          }
        } else {
          this.connectNodes(i, i, 0);
        }
      }
    }

    for (let i = 0; i < this.nodesNumber; i++) {
      for (let j = 0; j < this.nodesNumber; j++) {
        if (this.adjacencyMatrix[i][j] !== 0) {
          break;
        }

        if (j === this.nodesNumber - 1) {
          let k = i;
          while (k === i || k === this.nodesNumber) {
            k = Math.round(Math.random() * this.nodesNumber);
          }

          this.connectNodes(i, k);
        }
      }
    }

    return this.adjacencyMatrix;
  }

  private connectNodes(i: number, j: number, weight: number = 1) {
    this.adjacencyMatrix[i][j] = weight;
    this.adjacencyMatrix[j][i] = weight;
  }
}
