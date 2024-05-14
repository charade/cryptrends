import { AfterViewInit, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap, tap } from 'rxjs';
import { CurrencyService } from '../services/currency.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';
import { CurrencyPipe } from '@angular/common';
import {
  CategoryScale,
  Chart,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';

Chart.register(
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);
@Component({
  selector: 'app-coin-details',
  standalone: true,
  templateUrl: './coin-details.component.html',
  styleUrl: './coin-details.component.scss',
  imports: [MatIconModule, CurrencyPipe],
})
export class CoinDetailsComponent implements AfterViewInit {
  #route = inject(ActivatedRoute);
  #currencyService = inject(CurrencyService);
  selectedCurrency = this.#currencyService.currency$.value;
  matDialogRef = inject(MatDialogRef);

  coinDetails = toSignal(
    this.#route.firstChild.paramMap.pipe(
      map((param) => param.get('coinId')),
      switchMap((coinId) => this.#currencyService.getCoinById(coinId))
    )
  );

  ngAfterViewInit(): void {
    this.#route.firstChild.paramMap
      .pipe(
        map((param) => param.get('coinId')),
        switchMap((coinId) =>
          this.#currencyService.getGraphicalCoinDetailsData(
            coinId,
            this.selectedCurrency
          )
        ),
        tap((data) => console.log(data)),
        map(
          ({ marketCaps, labels }) =>
            new Chart('chart', {
              type: 'line',
              data: {
                datasets: [
                  {
                    label: 'Capitalisation',
                    data: marketCaps,
                    borderColor: 'rgb(101, 209, 96)',
                    backgroundColor: 'transparent',
                    pointHoverBackgroundColor: 'rgb(243, 78, 77)',
                    pointRadius: 1,
                  },
                ],
                labels,
              },

              options: {
                plugins: {
                  tooltip: {
                    animation: { easing: 'linear' },
                  },
                  legend: {
                    display: true,
                    labels: { font: { size: 16, weight: 300 } },
                    onClick: (e) => null,
                  },
                },

                scales: {
                  x: {
                    ticks: { color: 'rgb(139, 162, 182)' },
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
}
