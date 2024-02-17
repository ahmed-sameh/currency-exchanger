import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject } from "rxjs";
import { CachingService } from "../caching/caching.service";

@Injectable({ providedIn: "root" })
export class LanguageService {
  public languages: string[] = ["en", "ar"];
  public showLanguagesList = new BehaviorSubject(false);

  listLang = [
    { text: "English", flag: "assets/images/flags/us.png", lang: "en" },
    {
      text: "العربية",
      flag: "assets/images/flags/saudi-arabia.png",
      lang: "ar",
    },
  ];

  constructor(
    public translate: TranslateService,
    private cachingService: CachingService
  ) {
    let browserLang;
    this.translate.addLangs(this.languages);
    if (this.cachingService.isKeyExist("lang")) {
      browserLang = this.cachingService.get("lang");
      // this.setLanguage(browserLang);
    } else {
      this.setLanguage("en");
      browserLang = translate.getBrowserLang();
    }
    translate.use(browserLang.match(/en|ar/) ? browserLang : "en");
  }

  public setLanguage(lang) {
    this.translate.use(lang);
    this.cachingService.set("lang", lang);
  }

  getCurrentLanguage() {
    const cookieValue = this.cachingService.get("lang");
    if (this.cachingService.isKeyExist("lang") && cookieValue) {
      return this.listLang.filter((x) => x.lang === cookieValue)[0];
    } else {
      return this.listLang[0];
    }
  }
}
