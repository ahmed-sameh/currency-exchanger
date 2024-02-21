import { Component, OnDestroy, OnInit } from '@angular/core';
import { ExchangerComponent } from '../../shared/components/exchanger/exchanger.component';
import { CurrenciesService } from '../../core/services/currencies/currencies.service';
import { Subscription, take } from 'rxjs';
import {
  CommonModule,
  DecimalPipe,
  KeyValuePipe,
  SlicePipe,
} from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ExchangerComponent,
    KeyValuePipe,
    SlicePipe,
    DecimalPipe,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  currenciesList;
  allCurrenciesRatesSub: Subscription;
  popularCurrenciesRates;
  currenciesQparamsSub: Subscription;
  currenciesFromKey: string;
  currenciesToKey: string;
  FromCurrency;
  ToCurrency;
  exchangeAmount;
  constructor(
    private currenciesService: CurrenciesService,

    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getAllCurrencies();
    this.popularCurrenciesHandler();
  }

  getFromToCurrencies() {
    this.currenciesQparamsSub = this.route.queryParams.subscribe(
      (qparams: { from: string; to: string }) => {
        if (qparams) {
          this.currenciesFromKey = qparams.from;
          this.currenciesToKey = qparams.to;
          this.viewHandler();
        }
      }
    );
  }

  viewHandler() {
    this.FromCurrency = this.currenciesList[this.currenciesFromKey] || 'EUR';
    this.ToCurrency = this.currenciesList[this.currenciesToKey] || 'USD';
  }

  getAllCurrencies() {
    this.currenciesService
      .getAllCurrencies()
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.currenciesList = res.currencies;
          this.getFromToCurrencies();
        },
      });
  }

  popularCurrenciesHandler() {
    this.allCurrenciesRatesSub =
      this.currenciesService.allCurrencyRatesSub.subscribe((res) => {
        this.popularCurrenciesRates = res.results;
        this.exchangeAmount = res.amount;
      });
  }

  getKeyAsString(key: any) {
    return `${key}`;
  }

  ngOnDestroy(): void {
    this.currenciesQparamsSub.unsubscribe();
    this.allCurrenciesRatesSub.unsubscribe();
  }
}
