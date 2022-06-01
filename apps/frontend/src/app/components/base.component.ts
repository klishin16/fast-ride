import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

// eslint-disable-next-line @angular-eslint/use-injectable-provided-in
@Injectable()
export abstract class BaseComponent implements OnDestroy {
  public destroyed$: Subject<void> = new Subject();

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
