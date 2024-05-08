import { Component, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { map, switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { CurrencyService } from './services/currency.service';
import { FormsModule } from '@angular/forms';

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
    AsyncPipe,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'cryptrends';

  currencyService = inject(CurrencyService);

  currencyTrendingCoins = this.currencyService.currency$.pipe(
    switchMap((currencyValue) =>
      this.currencyService.getTrendingCoins(currencyValue)
    )
  );

  readonly currencies = ['EUR', 'USD'];
  selectedCurrencyValue = toSignal(this.currencyService.currency$);

  #matIconRegistry = inject(MatIconRegistry);
  #domSanitizer = inject(DomSanitizer);

  constructor() {
    this.#loadAppLogo();
  }

  #loadAppLogo(): void {
    this.#matIconRegistry.addSvgIcon(
      'crypTrends',
      this.#domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/cryptrends.svg'
      )
    );
  }
}
