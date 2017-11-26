export class Node {
	private static id_counter = 0;

	private _id: number;
	private _x: number;
	private _y: number;
	private _dX: number;
	private _dY: number;
	private _degree: number;
	private _isSelected: boolean;

	constructor() {
		this._id = Node.id_counter++;
		this._x = this._y = this._dX = this._dY = this._degree = 0;
		this._isSelected = false; 
	}

	public get id(): number {
		return this._id;
	}

	public get x(): number {
		return this._x;
	}

	public get y(): number {
		return this._y;
	}

	public get dX(): number {
		return this._dX;
	}

	public get dY(): number {
		return this._dY;
	}

	public get degree(): number {
		return this._degree;
	}

	public get isSelected(): boolean {
		return this._isSelected;
	}

	public set x(x: number) {
		this._x = x;
	}

	public set y(y: number) {
		this._y = y;
	}

	public set dX(dX: number) {
		this._dX = dX;
	}

	public set dY(dY: number) {
		this._dY = dY;
	}

	public set degree(degree: number) {
		this._degree = degree;
	}

	public set isSelected(isSelected: boolean) {
		this._isSelected = isSelected;
	}
	public static resetIdCounter(): void {
		Node.id_counter = 0;
	} 
}