import { inject, Injectable } from '@angular/core';
import { TranslocoLoader } from '@ngneat/transloco';

import { AppService } from 'services';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  appService = inject(AppService);

  getTranslation(lang: string) {
    const x = import(`../assets/i18n/${lang}.json`);

    x.then(() => {
      //this.appService.i18nReady();
    });

    return x;
  }
}
