import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "cutLongString" })
export class CutStringsPipe implements PipeTransform {
  transform(value: string, length: number) {
    if (value.length > length) {
      return `${value.substring(0, length)}...`;
    } else {
      return value;
    }
  }
}
