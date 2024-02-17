import { Injectable } from "@angular/core";
import { HttpClientService } from "../http/http.service";
import { CachingService } from "../caching/caching.service";
import { ICurrencyData } from "../../models/currency.model";

@Injectable({ providedIn: "root" })
export class CurrenciesService {
  currenciesList = [];
  currentCurrency;

  constructor(
    private cachingService: CachingService,
    private http: HttpClientService
  ) {
    this.checkCurrencyStorage();
  }

  checkCurrencyStorage() {
    if (!this.cachingService.isKeyExist("currency")) {
      this.setCurrency({
        currency_code_en: "USD",
      });
    }
    const currentCurrency = this.cachingService.get("currency");
    if (currentCurrency == "undefined") {
      this.setCurrency({
        currency_code_en: "USD",
      });
    }
  }

  getUpdatedCurrencies(options: ICurrencyData) {
    return this.http.get("settings/currencies", options);
  }

  public setCurrency(currency) {
    this.cachingService.set("currency", currency.currency_code_en);
    this.currentCurrency = currency;
  }

  getCurrency() {
    let allCurrencies;
    if (this.cachingService.isKeyExist("currenciesList")) {
      allCurrencies = this.cachingService.get("currenciesList") as any[];
    } else {
      this.getUpdatedCurrencies({ return_all: 1 }).subscribe(
        (res) => (allCurrencies = res.data)
      );
    }

    this.currentCurrency =
      allCurrencies.find(
        (el) => el.currency_code_en == this._CurrenctCurrency
      ) || allCurrencies.find((el) => el.currency_code_en == "USD");

    return this.currentCurrency;
  }

  moneyExchange(money: number, extchangeCase: "from$" | "to$") {
    const exchangeRate = this.getCurrency().exchange_rate;
    switch (extchangeCase) {
      case "from$":
        return +money * +exchangeRate;
      case "to$":
        return +money / +exchangeRate;
    }
  }

  get _CurrenctCurrency(): string {
    if (!this.cachingService.isKeyExist("currency")) {
      this.setCurrency("USD");
      return "USD";
    }

    const currentCurrency = this.cachingService.get("currency");

    if (currentCurrency && currentCurrency != undefined) {
      return currentCurrency as string;
    } else {
      this.setCurrency("USD");
      return "USD";
    }
  }
}
