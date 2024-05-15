import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { CurrencyService } from '../services/currency.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';
import { CurrencyPipe, NgClass } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subscription, map, switchMap, tap } from 'rxjs';

import {
  CategoryScale,
  Chart,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Utils } from '../utils';

Chart.register(
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip
);
@Component({
  selector: 'app-coin-details',
  standalone: true,
  templateUrl: './coin-details.component.html',
  styleUrl: './coin-details.component.scss',
  imports: [MatIconModule, CurrencyPipe, MatTableModule, NgClass],
})
export class CoinDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  CoinDetailsPriceChangeTableEnum = Utils.CoinDetailsPriceChangeTableEnum;
  coinDetailsPriceChangeColumns = Utils.coinDetailsPriceChangeColumns;
  coinDetailsPriceChangeHeader = Utils.coinDetailsPriceChangeHeader;
  coinPriceChangeDataSource: MatTableDataSource<{
    lastDay: number;
    lastWeek: number;
    lastMonth: number;
    lastYear: number;
  }>;

  mediaObserver = inject(BreakpointObserver);
  matDialogRef = inject(MatDialogRef);
  #route = inject(ActivatedRoute);
  #currencyService = inject(CurrencyService);
  #subscription = new Subscription();

  selectedCurrency = this.#currencyService.currency$.value;

  coinDetails = toSignal(
    this.#route.firstChild.paramMap.pipe(
      map((param) => param.get('coinId')),
      switchMap((coinId) => this.#currencyService.getCoinById(coinId)),
      // coin price change percentage table
      tap(
        (data) =>
          (this.coinPriceChangeDataSource = new MatTableDataSource([
            {
              lastDay:
                data.market_data.price_change_24h_in_currency[
                  this.selectedCurrency.toLowerCase()
                ].toFixed(2),
              lastWeek:
                data.market_data.price_change_percentage_7d_in_currency[
                  this.selectedCurrency.toLowerCase()
                ].toFixed(2),
              lastMonth:
                data.market_data.price_change_percentage_30d_in_currency[
                  this.selectedCurrency.toLowerCase()
                ].toFixed(2),
              lastYear: +parseFloat(
                data.market_data.price_change_percentage_1y_in_currency[
                  this.selectedCurrency.toLowerCase()
                ]
              ).toFixed(2),
            },
          ]))
      )
    )
  );

  ngOnInit() {
    this.mediaObserver
      .observe('(max-width: 500px)')
      .subscribe((data) => console.log(data));
  }

  ngAfterViewInit(): void {
    this.#subscription = this.#route.firstChild.paramMap
      .pipe(
        map((param) => param.get('coinId')),
        switchMap((coinId) =>
          this.#currencyService.getGraphicalCoinDetailsData(
            coinId,
            this.selectedCurrency
          )
        ),
        map(
          ({ marketCaps, labels }) =>
            new Chart('chart', {
              type: 'line',
              data: {
                datasets: [
                  {
                    label: `Capitalisation (${this.selectedCurrency})`,
                    data: marketCaps,
                    borderColor: 'rgb(101, 209, 96)',
                    backgroundColor: 'transparent',
                    pointHoverBackgroundColor: 'rgb(243, 78, 77)',
                    pointRadius: 1,
                    borderWidth: 0.7,
                  },
                ],
                labels,
              },

              options: {
                plugins: {
                  tooltip: {
                    animation: { easing: 'linear' },
                  },
                  title: {
                    text: `Capitalisation(${this.selectedCurrency}) / 1 mois`,
                    display: true,
                    color: 'rgba(255, 255, 255, 0.6)',
                    align: 'center',
                    font: {
                      size: 15,
                      weight: 300,
                    },
                  },
                },

                scales: {
                  x: {
                    ticks: {
                      color: 'rgb(139, 162, 182)',
                      font: { lineHeight: 3 },
                    },
                  },
                  y: {
                    ticks: {
                      color: 'rgb(139, 162, 182)',
                      font: {
                        size: 12,
                        lineHeight: 2.5,
                      },
                    },
                  },
                },
              },
            })
        )
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.#subscription.unsubscribe();
  }
}
