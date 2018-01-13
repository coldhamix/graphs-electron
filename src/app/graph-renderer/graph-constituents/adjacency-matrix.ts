export class AdjacencyMatrix {
	private adjacencyMatrix: number[][];
	private nodesNumber: number;

	constructor (nodesNumber: number) {
		this.nodesNumber = nodesNumber;
		this.adjacencyMatrix = [];

		for(let i: number = 0; i < nodesNumber; i++) {
			this.adjacencyMatrix.push(new Array<number>(nodesNumber)); 
		}
	}

	private connectNodes(i: number, j: number, weight: number = 1) {
		this.adjacencyMatrix[i][j] = weight; 
		this.adjacencyMatrix[j][i] = weight; 
	}

	private widthSearch(): void {
		const queue: number[] = [];
		const path: number[][] = [];

		let index = 0;
		queue.push(0);
		path.push([]);

		let counter = 0;
		while(true) {
			if(counter > 50) {break};
			const i = queue.shift();
			path[index].push(i);

			for(let j = i + 1; j < this.nodesNumber; j++) {
				if(this.adjacencyMatrix[i][j] != 0 && queue.indexOf(j) == -1) {
					let contains = false;
					for(let k = 0; k < path.length; k++) {
						if(path[k].indexOf(j) != -1) {
							contains = true;
							break;
						}
					}
					if(!contains) {
						queue.push(j);
					}
				}
			}

			if(queue.length == 0) {
				let currentPath = path[0];
				for(let i = 1; i < path.length; i++) {
					currentPath = currentPath.concat(path[i]);
				}

				const nodeIndex = this.checkPath(currentPath, this.nodesNumber);
				if(nodeIndex == -1) {
					for(let i = 1; i < path.length; i++) {
						this.connectNodes(path[i - 1][0], path[i][0]);
					}
					return;
				}

				index++;
				queue.push(nodeIndex);
				path.push([]);
			}
			counter++;
		}
	}

	private checkPath(pathToCheck: number[], nodesNumber: number): number {
		let path = pathToCheck.concat([]);
		const indexes = (new Array<number>(nodesNumber)).fill(0);

		for(let i = 0; i < path.length; i++) {
			let index = path.shift();

			indexes[index] = 1;
		}

		for(let i = 0; i < nodesNumber; i++) {
			if(indexes[i] == 0) {
				return i;
			}
		}

		return -1;
	}

	public generateMatrix(): number[][] {
		// const probability = (0.10 - 0.007 * (this.nodesNumber - 6)); 
		const probability = 0.07;
		for (let i = 0; i < this.nodesNumber; i++) { 
			for (let j = 0; j < this.nodesNumber; j++) { 				
				if (i != j) { 
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
				if (this.adjacencyMatrix[i][j] != 0) {
					break; 
				}
				
				if(j == this.nodesNumber - 1) { 
					let k = i;
					while(k == i || k == this.nodesNumber) {
						k = Math.round(Math.random() * this.nodesNumber);
					} 
					const weight = 1 + Math.round(Math.random() * 9);
					this.connectNodes(i, k);
				} 
			} 
		}

		this.widthSearch();
		return this.adjacencyMatrix;
	}
}