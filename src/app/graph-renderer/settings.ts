export class Settings {
	private _nodesNumber: number;
	private _variantsNumber: number;
	private _directed: boolean;
	private _weighed: boolean;

	public get nodesNumber(): number {
		return this._nodesNumber;
	}

	public get variantsNumber(): number {
		return this._variantsNumber;
	}

	public get directed(): boolean {
		return this._directed;
	}

	public get weighed(): boolean {
		return this._weighed;
	}

	public set nodesNumber(nodesNumber: number) {
		this._nodesNumber = nodesNumber;
	}

	public set variantsNumber(variantsNumber: number) {
		this._variantsNumber = variantsNumber;
	}

	public set directed(directed: boolean) {
		this._directed = directed;
	}

	public set weighed(weighed: boolean) {
		this._weighed = weighed;
	}
}