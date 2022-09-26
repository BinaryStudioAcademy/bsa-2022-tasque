import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cardLabel'
})
export class CardLabelPipe implements PipeTransform {

  transform(value: string | undefined): string {
    if(!value){
      return '';
    }
    if(value.length <= 6){
      return value;
    } else {
      let result = value.slice(0, 5);
      result += '..';
      return result;
    }
  }

}
