import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  currency$ = new BehaviorSubject<'INR' | 'USD' | undefined>(undefined);

  setCurrency(value: 'INR' | 'USD'): void {
    this.currency$.next(value);
  }

  getCurrency(): 'INR' | 'USD' {
    return this.currency$.value;
  }
}
