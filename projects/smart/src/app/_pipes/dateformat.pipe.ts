import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({ name: 'dateformat' })

export class DateformatPipe implements PipeTransform {
		transform(s: string, format: string) {
				if (!format) {
						format = 'dd-MM-yyyy';
				}
				if (typeof s !== 'string') {
						return '';
				}
				const datePipe = new DatePipe('en-US');
				return datePipe.transform(s, format);
		}
}
