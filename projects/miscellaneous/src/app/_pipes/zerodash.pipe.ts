import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'zerodash'
})
export class ZerodashPipe implements PipeTransform {

	transform(value: any, args?: any): any {
		if (typeof(value === 'number')) {
			if (Number(value) === 0) {
				return '-';
			} else {
				return value;
			}
		} else {
			return value;
		}
	}

}
