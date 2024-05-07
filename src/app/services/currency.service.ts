import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Currency } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  currency$ = new BehaviorSubject<Currency>('INR');

  setValue(value: Currency): void {
    this.currency$.next(value);
  }

  getValue(): Currency {
    return this.currency$.value;
  }
}
