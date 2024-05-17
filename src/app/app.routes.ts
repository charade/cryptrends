import { Routes } from '@angular/router';
import { CoinDetailsModalComponent } from './coin-details/coin.detail.modal';

export const routes: Routes = [
  {
    path: ':coinId',
    component: CoinDetailsModalComponent,
    outlet: 'details',
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
