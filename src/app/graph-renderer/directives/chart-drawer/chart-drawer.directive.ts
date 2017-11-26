import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[chartDrawer]'
})
export class ChartDrawerDirective {
	@Input() errors: number[] = [];
	@Input() isActive: boolean;

	private context: CanvasRenderingContext2D;
	private width: number;
	private height: number;

	constructor(canvas: ElementRef) {
		this.context = canvas.nativeElement.getContext('2d');
		this.width = parseFloat(canvas.nativeElement.style.width);
		this.height = parseFloat(canvas.nativeElement.style.height);
	}

	private draw(): void {
		if(this.isActive) {

		}
	}

	private drawAxis(): void {
		
	}

	private drawChart(): void {

	}

}
