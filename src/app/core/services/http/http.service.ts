import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { urlSettings } from '../../settings/urlSettings';

@Injectable({ providedIn: 'root' })
export class HttpClientService {
  constructor(private http: HttpClient) {}

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
    console.log(this.fullRequestURL(resource));
    return this.http.get(this.fullRequestURL(resource));
  }

  /**
   * Serializin arguments as a string
   * @param options object of Backend parametars to serialize
   * @return string of parameters
   */
  getArgs(options: any): string {
    if (!options) {
      return '';
    }
    var args = '?';
    Object.keys(options).forEach((key, index) => {
      args += this.optionToString(key, options[key]);
    });
    return args;
  }

  /**
   * serializing eatch option
   * @param key option key
   * @param value option value
   * @return single option serilization
   */
  optionToString(key: string, value: any): string {
    if (value == null || value == undefined) {
      return '';
    }
    var str = '';
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
    var str = '';
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
}
