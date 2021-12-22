import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'capitalize'})
export class CapitalizePipe implements PipeTransform {
		transform(s) {
				if (typeof s !== 'string') {
						return '';
				}
				return s.charAt(0).toUpperCase() + s.slice(1);
		}
}
