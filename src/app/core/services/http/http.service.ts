import { TranslateService } from "@ngx-translate/core";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { isObject } from "rxjs/internal/util/isObject";
import { urlSettings } from "../../settings/urlSettings";
import { CachingService } from "../caching/caching.service";

@Injectable({ providedIn: "root" })
export class HttpClientService {
  countryCode = "SA";
  httpOptions = {
    headers: new HttpHeaders({
      "access-control-allow-origin": "*",
      "Content-Type": "application/json",
      Accept: "application/json",
      "app-version": "1",
      "device-name": "chrome",
      "device-os-version": "windows",
      "device-udid": "1231321321321321321",
      "device-type": "web",
      "accept-language": this.cachingService.get("lang") || "ar",
      "country-code": this.cachingService.get("countryCode") || "SA",
      "device-push-token": "Not Allowed",
      "send-push": "0",
    }),
    withCredentials: false,
  };
  private formData: FormData;

  constructor(
    private http: HttpClient,
    private translate: TranslateService,
    private cachingService: CachingService
  ) {
    this.translate.onLangChange.subscribe((lang) => {
      this.httpOptions = {
        headers: new HttpHeaders({
          "access-control-allow-origin": "*",
          "Content-Type": "application/json",
          Accept: "application/json",
          "accept-language": lang.lang || "ar",
          "app-version": "1",
          "device-name": "chrome",
          "device-os-version": "windows",
          "device-udid": "1231321321321321321",
          "device-type": "web",
          "country-code": this.cachingService.get("countryCode") || "SA",
          "device-push-token": "Not Allowed",
          "send-push": "0",
        }),
        withCredentials: false,
      };
    });
  }

  updateHeaderBasedOnCountry(): void {
    this.httpOptions = {
      headers: new HttpHeaders({
        "access-control-allow-origin": "*",
        "Content-Type": "application/json",
        Accept: "application/json",
        "app-version": "1",
        "device-name": "chrome",
        "device-os-version": "windows",
        "device-udid": "1231321321321321321",
        "device-type": "web",
        "accept-language": this.cachingService.get("lang") || "ar",
        "country-code": this.countryCode,
        "send-push": "0",
        "device-push-token": "Not Allowed",
      }),
      withCredentials: false,
    };
  }

  /**
   * a getter to return the required headers for Backend
   * X-CSRF-Token - application token from services/session/connect
   * Content-Type - the type of the request content.
   * Accept - forcing Backend to return the response as a json object
   * @return object of the headers
   */

  /**
   * getting token from Backend services module
   * @return http text token response
   */

  // setToken(): Observable<string> {
  //   return this.http.get(`${ERP.backEndUrl}oauth/token`, httpOptions).map(res => {
  //     this.cachingService.get("appToken", res.text())
  //     return res.text();
  //   });
  // }

  /**
   * building up the full url path for each resource and / or params
   * @param resource the entity resource param. ex: system/'connect', user/'login'
   * @return full request path after adding the entity type and resource param
   */
  fullRequestURL(resource: string | number): string {
    // return urlSettings.baseUrl + this.lng + '/v1/' + resource;
    return urlSettings.baseUrl + resource;
  }

  /**
   * basic http get request with headers.
   * @param resource the entity resource param. ex: system/'connect', user/'login'
   * @return http json response
   */
  get(resource?: string | number, params?: {}): Observable<any> {
    if (params) {
      resource += this.getArgs(params);
    }
    return this.http.get(this.fullRequestURL(resource), this.httpOptions);
  }

  /**
   * basic http post request with headers.
   * @param resource the entity resource param. ex: system/'connect', user/'login'
   * @param body the contenct of the request
   * @return http json response
   */
  post(
    body: any = {},
    resource?: string | number,
    params?: {}
  ): Observable<any> {
    if (params) {
      resource += this.getArgs(params);
    }
    return this.http.post(
      this.fullRequestURL(resource),
      body,
      this.httpOptions
    );
  }

  /**
   * basic http post request with headers.
   * @param resource the entity resource param. ex: system/'connect', user/'login'
   * @param body the contenct of the request
   * @return http json response
   */
  postFormData(
    body: any = {},
    resource?: string | number,
    params?: {}
  ): Observable<any> {
    if (params) {
      resource += this.getArgs(params);
    }

    const HttpUploadOptions = {
      headers: new HttpHeaders({
        Accept: "application/json",
        "app-version": "1",
        "device-name": "chrome",
        "device-os-version": "windows",
        "device-udid": "123",
        "device-type": "web",
        "accept-language": this.cachingService.get("lang") || "ar",
        "country-code": this.cachingService.get("countryCode") || "SA",
        "send-push": "0",
        "device-push-token": "Not Allowed",
      }),
    };

    this.formData = new FormData();
    this.toFormData(body);

    return this.http.post(
      this.fullRequestURL(resource),
      this.formData,
      HttpUploadOptions
    );
  }

  postFormDataArrayFiles(
    body: any = {},
    files: File[],
    resource?: string | number,
    params?: {}
  ): Observable<any> {
    if (params) {
      resource += this.getArgs(params);
    }

    let formdata = new FormData();
    Object.keys(body).forEach((key) => {
      formdata.append(key, body[key]);
    });

    if (files.length > 0) {
      Object.keys(files).forEach((file, index) => {
        formdata.append("file[" + index + "]", files[file]);
      });
    }

    let headers = new HttpHeaders();
    // headers = headers.set('Content-Type', 'multipart/form-data');

    const req = new HttpRequest(
      "POST",
      this.fullRequestURL(resource),
      formdata,
      {
        reportProgress: true,
        responseType: "json",
        headers: headers,
      }
    );
    return this.http.request(req);
  }

  /**
   * basic http put request with headers.
   * @param resource the entity resource param. ex: system/'connect', user/'login'
   * @param body the contenct of the request
   * @return http json response
   */
  put(body: any = {}, resource?: string | number): Observable<any> {
    return this.http.put(this.fullRequestURL(resource), body);
  }

  /**
   * basic http delete request with headers.
   * @param resource the entity resource param. ex: system/'connect', user/'login'
   * @return http json response
   */
  delete(params: any = {}, resource?: string | number): Observable<any> {
    if (params) {
      resource += this.getArgs(params);
    }
    return this.http.delete(this.fullRequestURL(resource), this.httpOptions);
  }

  /**
   * Serializin arguments as a string
   * @param options object of Backend parametars to serialize
   * @return string of parameters
   */
  getArgs(options: any): string {
    if (!options) {
      return "";
    }
    var args = "?";
    Object.keys(options).forEach((key, index) => {
      args += this.optionToString(key, options[key]);
    });
    return args;
  }

  /**
   * Check if variable is array of objects
   * @param value array to check
   */
  private isArray(value) {
    return Object.prototype.toString.call(value) === "[object Array]";
  }

  /**
   * serializing eatch option
   * @param key option key
   * @param value option value
   * @return single option serilization
   */
  optionToString(key: string, value: any): string {
    if (value == null || value == undefined) {
      return "";
    }
    var str = "";
    if (value instanceof Array) {
      value.forEach((element, index) => {
        str += `${key}[${index}]=${element}&`;
      });
    } else if (value instanceof Object) {
      Object.keys(value).forEach((element, index) => {
        if (value instanceof Object) {
          str += this.serializeObject(value[element], `${key}[${element}]`);
        } else {
          str += `${key}[${element}]=${value[element]}&`;
        }
      });
    } else {
      str += `${key}=${value}&`;
    }
    return str;
  }

  /**
   * serializing the object keys
   * @param obj object to serialize
   */
  private serializeObject(obj: any, parentSerialized: string): string {
    var str = "";
    Object.keys(obj).forEach((key, index) => {
      const value = obj[key];
      if (value instanceof Object) {
        str += `${this.serializeObject(value, `${parentSerialized}[${key}]`)}`;
      } else {
        str += `${parentSerialized}[${key}]=${value}&`;
      }
    });
    return str;
  }

  // return formdata from normal object
  private toFormData(body): FormData {
    Object.keys(body).forEach((key) => {
      if (body[key] !== "" && body[key] !== null) {
        if (Array.isArray(body[key])) {
          this.arrayToFormData(body[key], key);
        } else if (isObject(body[key]) && !body[key].lastModified) {
          Object.keys(body[key]).forEach((el) => {
            if (body[key][el]) {
              this.formData.append(key + "[" + el + "]", body[key][el]);
            }
          });
        } else {
          this.formData.append(key, body[key]);
        }
      }
    });
    return this.formData;
  }

  private arrayToFormData(array, arrayName) {
    if (array.length) {
      array.forEach((el, i) => {
        if (el instanceof Object) {
          Object.keys(el).forEach((elKey) => {
            this.formData.append(arrayName + `[${i}][${elKey}]`, el[elKey]);
          });
        } else {
          if (el) {
            this.formData.append(arrayName + `[${i}]`, el);
          }
        }
      });
    }
  }
}

// #
