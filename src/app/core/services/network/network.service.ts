import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  constructor() {}

  urlHandler(resource?: string | number, params?: {}) {
    if (params) {
      const fullURL = (resource += this.getArgs(params));
      return `https://api.fastforex.io/${fullURL}`;
    } else {
      return `https://api.fastforex.io/${resource}`;
    }
  }

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
