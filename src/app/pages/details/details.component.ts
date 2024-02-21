import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ExchangerComponent } from '../../shared/components/exchanger/exchanger.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { CurrenciesService } from '../../core/services/currencies/currencies.service';
import {
  NgApexchartsModule,
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexDataLabels,
  ApexStroke,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  toolbar: ApexTooltip;
  dataLabels: ApexDataLabels;
  colors: string[];
  stroke: ApexStroke;
};

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [RouterModule, ExchangerComponent, NgApexchartsModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent implements OnInit, OnDestroy {
  currenciesSub: Subscription;
  currenciesList;
  currenciesKeys: { fromCurrency: string; toCurrency: string };
  FromCurrency;
  ToCurrency;
  historyData;
  currencyRate;
  @ViewChild('chart') chart: ChartComponent;
  public chartConfig: Partial<ChartOptions>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private curreciesService: CurrenciesService
  ) {
    this.initChartConfig();
  }

  ngOnInit(): void {
    this.getCurrencies();
  }

  getCurrencies() {
    this.curreciesService
      .getAllCurrencies()
      .pipe(take(1))
      .subscribe((res) => {
        this.currenciesList = res.currencies;
        this.getFromToCurrencies();
      });
  }

  getFromToCurrencies() {
    this.currenciesSub = this.route.params.subscribe(
      (params: { fromCurrency: string; toCurrency: string }) => {
        if (params) {
          this.currenciesKeys = params;
          this.viewHandler();
        }
      }
    );
  }

  viewHandler() {
    this.FromCurrency = this.currenciesList[this.currenciesKeys.fromCurrency];
    this.ToCurrency = this.currenciesList[this.currenciesKeys.toCurrency];
    if (!this.FromCurrency || !this.ToCurrency) {
      this.router.navigate(['/details/EUR/USD']);
    }
    this.getRatesHistory();
  }

  getRatesHistory() {
    this.curreciesService
      .getRateHistory({
        from: this.currenciesKeys.fromCurrency,
        to: this.currenciesKeys.toCurrency,
      })
      .pipe(take(1))
      .subscribe((res: any) => {
        this.historyData = res;
        this.initChartConfig();

        this.updateChart(res.results[this.currenciesKeys?.toCurrency]);
      });
  }

  updateChart(data) {
    const rates = [];
    const xlabels = [];

    Object.keys(data).forEach((key) => {
      rates.push(data[key]);
      xlabels.push(key);
    });

    this.chartConfig.series = [
      {
        name: 'Rate',
        data: rates,
      },
    ];

    this.chartConfig.xaxis = {
      categories: xlabels,
    };
  }

  initChartConfig() {
    this.chartConfig = {
      series: [
        {
          name: 'Reservations',
          data: [],
        },
      ],
      chart: {
        height: 288,
        type: 'line',
        toolbar: {
          show: true,
          tools: {
            zoom: true,
            zoomin: true,
            zoomout: true,
            download: true,
            pan: false,
          },
        },
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 8,
          opacity: 0.2,
        },
      },
      dataLabels: {
        enabled: false,
      },
      colors: ['#871E35'],
      stroke: {
        curve: 'smooth',
        width: 3,
      },
      xaxis: {
        categories: [],
      },
    };
  }

  ngOnDestroy(): void {
    this.currenciesSub.unsubscribe();
  }
}
