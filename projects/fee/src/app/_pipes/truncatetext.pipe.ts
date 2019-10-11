import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'truncatetext'
})
export class TruncatetextPipe implements PipeTransform {

	transform(value: string, length: number, strip = false): string {
		if (typeof value === 'undefined') {
			return value;
		}
		if (strip) {
			value = value.replace(/<\/?[^>]+(>|$)/g, '');
		}
		if (value.length <= length) {
			return value;
		}
		return value.slice(0, length) + '...';
	}
}
