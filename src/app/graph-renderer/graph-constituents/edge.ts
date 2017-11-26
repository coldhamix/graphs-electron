export class Edge {
	private from: number;
	private to: number;
	private weight: number;

	public getFrom(): number {
		return this.from;
	}

	public getTo(): number {
		return this.to;
	}
	
	public getWeight(): number {
		return this.weight;
	}

	public setFrom(node_id: number): void {
		this.from = node_id;
	}

	public setTo(node_id: number): void {
		this.to = node_id;
	}

	public setWeight(weight: number): void {
		this.weight = weight;
	} 
}