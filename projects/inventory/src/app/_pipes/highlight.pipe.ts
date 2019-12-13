import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {
    transform(text: string, search): string {
        console.log('text--', text);
        console.log('search--', search);
        if (search) {
            const pattern = search
                .replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
                .split(' ')
                .filter(t => t.length > 0)
                .join('|');
            const regex = new RegExp(pattern, 'gi');

            return search ? text.replace(regex, match => `<b>${match}</b>`) : text;
        }

    }
}