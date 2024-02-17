import { Pipe, PipeTransform } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { CurrenciesService } from "../services/currencies/currencies.service";

@Pipe({
  name: "currencyExchanger",
})
export class CurrencyPipe implements PipeTransform {
  constructor(
    private translate: TranslateService,
    private currenciesServices: CurrenciesService
  ) {}
  transform(price, exchange: boolean): string {
    if (!price) {
      return `0 ${this.translate.instant(
        this.currenciesServices._CurrenctCurrency
      )}`;
    }

    if (exchange) {
      const convertedPrice = this.currenciesServices.moneyExchange(
        +price,
        "from$"
      );
      const priceWithCurrency = `${convertedPrice.toFixed(
        2
      )} ${this.translate.instant(this.currenciesServices._CurrenctCurrency)}`;
      return priceWithCurrency;
    } else {
      return `${+price.toFixed(2)} ${this.translate.instant(
        this.currenciesServices._CurrenctCurrency
      )}`;
    }
  }
}
