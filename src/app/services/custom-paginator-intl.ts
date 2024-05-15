// defines custom paginator config

import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';

@Injectable()
export class CustomPaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();
  nextPageLabel: string;
  previousPageLabel: string;
  firstPageLabel: string;
  lastPageLabel: string;
  itemsPerPageLabel = `nb éléments par page`;

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return `Page 1 / 1`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return `Page ${page + 1} / ${amountPages}`;
  }
}
