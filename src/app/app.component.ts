import {
  Component,
  ViewChild,
  WritableSignal,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, Subject, combineLatest, map, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { CurrencyService } from './services/currency.service';
import { FormsModule } from '@angular/forms';
import { Utils } from './utils';
import { Coin } from './models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'cryptrends';

  currencyService = inject(CurrencyService);
  readonly coinsTableRow = Utils.coinsTableColumns;
  TableColumnEnum = Utils.TableColumnEnum;
  coinsTableColumnHeader = Utils.coinsTableColumnHeader;
  coinsTableDataSource: MatTableDataSource<Coin>;

  @ViewChild('matTablePaginator') matTablePaginator: MatPaginator;

  #coinsFilter: WritableSignal<string> = signal('');
  #paginatorChange = new BehaviorSubject<{
    pageSize: number;
    pageIndex: number;
  }>({ pageSize: 10, pageIndex: 1 });

  currencyTrendingCoins = this.currencyService.currency$.pipe(
    switchMap((currencyValue) =>
      this.currencyService.getTrendingCoins(currencyValue)
    )
  );

  readonly currencies = Utils.currencies;
  selectedCurrencyValue = toSignal(this.currencyService.currency$);

  #matIconRegistry = inject(MatIconRegistry);
  #domSanitizer = inject(DomSanitizer);

  constructor() {
    this.#loadAppLogo();
    this.#loadCoinsTable();
  }

  #loadAppLogo(): void {
    this.#matIconRegistry.addSvgIcon(
      'crypTrends',
      this.#domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/cryptrends.svg'
      )
    );
  }

  #loadCoinsTable(): void {
    combineLatest([this.currencyService.currency$, this.#paginatorChange])
      .pipe(
        switchMap(([currency, { pageSize, pageIndex }]) =>
          this.currencyService.queryCoins(currency, pageSize, pageIndex)
        ),
        map((data) => {
          this.coinsTableDataSource = new MatTableDataSource(data);
          this.coinsTableDataSource.filterPredicate = (coin, filter) =>
            [coin.symbol, coin.name].some((entry) =>
              entry.trim().toLowerCase().match(filter.trim().toLowerCase())
            );

          // check if filter applied while changing currency
          this.coinsTableDataSource.filter = this.#coinsFilter() || '';
        })
      )
      .subscribe();
  }

  OnPaginatorChange({ pageSize, pageIndex }: PageEvent) {
    this.#paginatorChange.next({ pageIndex, pageSize });
  }

  filterCoins(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.#coinsFilter.set(value);
    this.coinsTableDataSource.filter = value.trim().toLocaleLowerCase();
  }
}
