import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Currency } from '../utils';
import { HttpClient } from '@angular/common/http';
import { Coin } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  currency$ = new BehaviorSubject<Currency>('EUR');
  #http = inject(HttpClient);

  setValue(value: Currency): void {
    this.currency$.next(value);
  }

  queryCoins(currency: Currency) {
    return this.#http.get<Coin[]>(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&sparkline=false`
    );
  }

  getTrendingCoins(currency: Currency) {
    return this.#http.get<Coin[]>(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`
    );
  }
}
