import { Component, OnInit, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CoinDetailsComponent } from './coin-details.component';
import { Router } from '@angular/router';

@Component({
  selector: 'coin-detail-modal',
  template: '',
  standalone: true,
  imports: [MatDialogModule],
})
export class CoinDetailsModalComponent implements OnInit {
  #modalController = inject(MatDialog);
  #router = inject(Router);

  ngOnInit(): void {
    this.#modalController.open(CoinDetailsComponent, {
      backdropClass: 'dialog-backdrop',
    });

    this.#modalController.afterAllClosed.subscribe(() =>
      this.#router.navigate([''])
    );
  }
}
