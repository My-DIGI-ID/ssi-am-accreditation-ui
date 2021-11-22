import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class MatPaginatorIntlGerman extends MatPaginatorIntl {
  public itemsPerPageLabel = 'Zeilen pro Seite';

  public nextPageLabel = 'Nächste Seite';

  public previousPageLabel = 'Vorherige Seite';

  // eslint-disable-next-line func-names
  getRangeLabel = function (page: number, pageSize: number, length: number) {
    if (length === 0 || pageSize === 0) {
      return `0 von ${length}`;
    }
    // eslint-disable-next-line no-param-reassign
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} von ${length}`;
  };
}
