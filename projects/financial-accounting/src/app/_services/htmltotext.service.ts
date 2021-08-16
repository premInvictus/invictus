import { Injectable } from '@angular/core';

@Injectable()
export class HtmlToTextService {

	constructor(

	) { }
	htmlToText(html) {
		const tmp = document.createElement('DIV'); // TODO: Check if this the way to go with Angular
		tmp.innerHTML = html;
		return tmp.textContent || tmp.innerText || '';
	}

}
