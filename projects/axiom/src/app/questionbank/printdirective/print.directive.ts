import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';
declare const jQuery:  any;

@Directive({
	// tslint:disable-next-line:directive-selector
	selector: '[printDirective]'
})

export class PrintDirective implements AfterViewInit {

constructor(public e: ElementRef) {}
@Input() printelement: string;

button = this.e.nativeElement;

ngAfterViewInit() {


		const self = this;
		jQuery(this.button).on('click', function() {


				const html = jQuery('#' + self.printelement).prop('outerHTML');


				const sheets = document.styleSheets;
				const array = [];
				for (let c = 0; c < sheets.length; c++) {

						array.push(sheets[c].href);

				}



				let printStyles: any = '';
				const farray: any[] = array.filter(f => f !== undefined && f !== null) as any;

				farray.forEach(function(value: any, index: any) {
						const res = value.substring(value.indexOf(':') + 1);
						printStyles = '<link rel=\'stylesheet\' type=\'text/css\'  href=' + value + ' media=\'print\'>\n' + printStyles ;

				});

				const printContents =  html;

				let  popupWin;

				popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
				popupWin.document.open();
				popupWin.document.write(`
        <html>
            <head>
            <title>Print tab</title>


            ${printStyles}

            </head>
        <body onload="window.print();window.close()">${printContents}</body>
        </html>`
				);
				popupWin.document.close();


				}

); }
 }
