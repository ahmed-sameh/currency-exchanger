import { Injectable } from '@angular/core';
import { CachingService } from '../caching/caching.service';
import { HttpClient } from '@angular/common/http';
import { NetworkService } from '../network/network.service';
import { Subject, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CurrenciesService {
  currenciesList;

  currentCurrency;
  token = '77c54cdc5f-f8e3ad0cbb-s9vbt0';
  allCurrencyRatesSub = new Subject<{
    base: string;
    results: any;
    amount: number;
  }>();

  constructor(
    private cachingService: CachingService,
    private http: HttpClient,
    private networkService: NetworkService
  ) {}

  getAllCurrencies() {
    if (this.currenciesList) {
      return of(this.currenciesList);
    } else {
      return this.http.get(this.networkService.urlHandler('currencies')).pipe(
        tap((res: any) => {
          this.currenciesList = res;
        })
      );
    }
  }

  getCurrencyAllRates(currency) {
    const lastCurrencyRatesCache = this.cachingService.isKeyExist(
      'lastCurrencyRates'
    )
      ? this.cachingService.get('lastCurrencyRates')
      : null;
    if (
      lastCurrencyRatesCache &&
      currency.from == lastCurrencyRatesCache['base']
    ) {
      return of(lastCurrencyRatesCache);
    } else {
      return this.http
        .get(this.networkService.urlHandler('/fetch-all', currency))
        .pipe(
          tap((res) => {
            this.cachingService.set('lastCurrencyRates', res);
          })
        );
    }
  }

  getCurrencyRate(currencies) {
    return this.http.get(
      this.networkService.urlHandler('/fetch-one', currencies)
    );
  }

  getRateHistory(currencies) {
    return this.http.get(
      this.networkService.urlHandler('/time-series', currencies)
    );
  }
}
