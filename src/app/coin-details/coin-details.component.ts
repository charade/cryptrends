import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { CurrencyService } from '../services/currency.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-coin-details',
  standalone: true,
  templateUrl: './coin-details.component.html',
  styleUrl: './coin-details.component.scss',
  imports: [MatIconModule, CurrencyPipe],
})
export class CoinDetailsComponent {
  #route = inject(ActivatedRoute);
  #currencyService = inject(CurrencyService);
  selectedCurrency = this.#currencyService.currency$.value;
  matDialogRef = inject(MatDialogRef);

  coinDetails = toSignal(
    this.#route.firstChild.paramMap.pipe(
      map((param) => param.get('coinId')),
      switchMap((coinId) => this.#currencyService.getCoinByIdMock(coinId))
    )
  );

  constructor() {
    console.log(this.coinDetails());
  }
}
