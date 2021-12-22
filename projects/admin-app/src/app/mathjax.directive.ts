 import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
	// tslint:disable-next-line:directive-selector
	selector: '[MathJax]'
})
export class MathJaxDirective {
	// tslint:disable-next-line:no-input-rename
	@Input('MathJax') fractionString: string;

	constructor(private el: ElementRef) {}

	// tslint:disable-next-line:use-life-cycle-interface
	ngOnChanges() {
		// this.el.nativeElement.style.backgroundColor = 'yellow';
		this.el.nativeElement.innerHTML = this.fractionString;
		MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.el.nativeElement]);
	}
}
