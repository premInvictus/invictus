import { MatPaginatorIntl } from '@angular/material';
export class MatPaginatorI18n extends MatPaginatorIntl {
	itemsPerPageLabel = 'Lines per page';
	nextPageLabel = 'Next page';
	previousPageLabel = 'Previous page';
	records: any;
	getRangeLabel = (page: number, pageSize: number, totalResults: number) => {
		if (!(localStorage.getItem('invoiceBulkRecords'))) {
			this.records = 0;
		} else {
			this.records = JSON.parse(localStorage.getItem('invoiceBulkRecords')).records;
		}
		if (!totalResults) { return 'No result'; }
		totalResults = Math.max(this.records, 0);
		const startIndex = page * pageSize;
		// If the start index exceeds the list length, do not try and fix the end index to the end.
		const endIndex =
			startIndex < totalResults ?
				Math.min(startIndex + pageSize, totalResults) :
				startIndex + pageSize; return `${startIndex + 1} - ${endIndex} of ${totalResults}`
			;
	}
}
