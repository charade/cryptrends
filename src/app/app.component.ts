import {
  Component,
  OnDestroy,
  ViewChild,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, Subscription, map, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { CurrencyService } from './services/currency.service';
import { FormsModule } from '@angular/forms';
import { Utils } from './utils';
import { Coin } from './models';
import { CustomPaginatorIntl } from './services/custom-paginator-intl';

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
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  title = 'cryptrends';

  currencyService = inject(CurrencyService);
  readonly coinsTableRow = Utils.coinsTableColumns;
  TableColumnEnum = Utils.TableColumnEnum;
  coinsTableColumnHeader = Utils.coinsTableColumnHeader;
  coinsTableDataSource: MatTableDataSource<Coin>;

  #router = inject(Router);

  @ViewChild('matTablePaginator') matTablePaginator: MatPaginator;

  #coinsFilter: WritableSignal<string> = signal('');
  #paginatorChange = new BehaviorSubject<{
    pageIndex: number;
  }>({ pageIndex: 0 });

  currencyTrendingCoins = this.currencyService.currency$.pipe(
    switchMap((currencyValue) =>
      this.currencyService.getTrendingCoinsMock(currencyValue)
    )
  );

  readonly currencies = Utils.currencies;
  selectedCurrencyValue = toSignal(this.currencyService.currency$);

  #matIconRegistry = inject(MatIconRegistry);
  #domSanitizer = inject(DomSanitizer);
  #subscription = new Subscription();

  constructor() {
    this.#loadAppLogo();
    this.#loadCoinsTable();
  }

  ngOnDestroy(): void {
    this.#subscription.unsubscribe();
  }

  #loadAppLogo(): void {
    this.#matIconRegistry.addSvgIcon(
      'crypTrends-icon',
      this.#domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/cryptrends.svg'
      )
    );
  }

  #loadCoinsTable(): void {
    this.#subscription = this.currencyService.currency$
      .pipe(
        switchMap((currency) => this.currencyService.queryCoins(currency)),
        map((data) => {
          this.coinsTableDataSource = new MatTableDataSource(data);
          this.coinsTableDataSource.paginator = this.matTablePaginator;
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

  OnPaginatorChange({ pageIndex }: PageEvent) {
    this.#paginatorChange.next({ pageIndex });
  }

  filterCoins(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.#coinsFilter.set(value);
    this.coinsTableDataSource.filter = value.trim().toLocaleLowerCase();
  }

  onOpenDetails(coinId: string): void {
    this.#router.navigate([{ outlets: { details: [coinId] } }]);
  }
}
