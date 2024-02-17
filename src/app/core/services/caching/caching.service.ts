import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class CachingService {
  private cache: { [key: string]: any } = {};

  constructor() {
    // Load the cache from local storage on initialization
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          try {
            const parsedValue = JSON.parse(value);
            this.cache[key] = parsedValue;
          } catch (e) {
            // console.error(`Error parsing cached item ${key}: ${e}`);
            // If the value is not JSON, treat it as a string
            if (/^".*"$/.test(value)) {
              // If the value is a string literal, remove the quotes
              const stringValue = value.slice(1, -1);
              this.cache[key] = stringValue;
            } else {
              // If the value is not a string literal, return it as-is
              this.cache[key] = value;
            }
          }
        }
      }
    }
  }

  get<T>(key: string): T | string {
    if (key in this.cache) {
      return this.cache[key];
    } else {
      const value = localStorage.getItem(key);
      if (value) {
        try {
          const parsedValue = JSON.parse(value);
          this.cache[key] = parsedValue;
          return parsedValue;
        } catch (e) {
          // console.error(`Error parsing cached item ${key}: ${e}`);
          // If the value is not JSON, treat it as a string
          if (/^".*"$/.test(value)) {
            // If the value is a string literal, remove the quotes
            const stringValue = value.slice(1, -1);
            this.cache[key] = stringValue;
            return stringValue;
          } else {
            // If the value is not a string literal, return it as-is
            this.cache[key] = value;
            return value;
          }
        }
      }
    }
    return "";
  }

  set<T>(key: string, value: T): void {
    this.cache[key] = value;
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    delete this.cache[key];
    localStorage.removeItem(key);
  }

  isKeyExist(key: string) {
    return key in this.cache;
  }

  clear(): void {
    this.cache = {};
    localStorage.clear();
  }
}
