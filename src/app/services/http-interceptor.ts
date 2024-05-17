import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, Injector, OnDestroy, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { EMPTY, Observable, Subscription, catchError, throwError } from 'rxjs';
import { ErrorDialogComponent } from '../components/error-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class CustomHttpInterceptor implements HttpInterceptor, OnDestroy {
  #injector = inject(Injector);
  #errorDialogController = this.#injector.get(MatDialog);
  #snackbar = inject(MatSnackBar);
  #subscription = new Subscription();

  ngOnDestroy(): void {
    this.#subscription.unsubscribe();
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.#errorDialogController.closeAll();
          this.#subscription =
            this.#errorDialogController.afterAllClosed.subscribe(() => {
              setTimeout(
                () =>
                  this.#snackbar.open(
                    'Les details de cette crypto sont introuvables...',
                    '',
                    { duration: 3000 }
                  ),
                500
              );
            });
        } else if (error.status === 0) {
          this.#errorDialogController.open(ErrorDialogComponent, {
            disableClose: true,
          });

          return throwError(() => new Error(error.message));
        }
        return EMPTY;
      })
    );
  }
}
