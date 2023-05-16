import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'customDateFormat'
})
export class CustomDateFormatPipe implements PipeTransform {

  constructor(private datePipe: DatePipe) { }

  transform(date, format?) {
    return date ? this.datePipe.transform(date, (format ? format : 'MM-dd-yyyy')) : null;
  }

}