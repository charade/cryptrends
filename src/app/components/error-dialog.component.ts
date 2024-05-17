import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrl: './error-dialog.component.scss',
  standalone: true,
  imports: [MatIconModule],
})
export class ErrorDialogComponent {}
