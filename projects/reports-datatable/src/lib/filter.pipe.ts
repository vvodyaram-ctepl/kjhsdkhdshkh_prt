import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filters'
})
export class FilterPipe implements PipeTransform {

  // transform(value: unknown, ...args: unknown[]): unknown {
  //   return null;
  // }

//   transform(value: any, args?: any): any {

//     console.log("value",value);
//     console.log("args",args);
//     if(!value)return null;
//     if(!args)return value;

//     args = args.toLowerCase();

//     return value.filter(function(item){
//       console.log("item",item); 
//         return JSON.stringify(item).toLowerCase().includes(args);
//     });
// }

// transform(items: any[], keyword: any, properties: string[]): any[] {
//   console.log("properties",properties);
//   if (!items) return [];
//   if (!keyword) return items;
//   return items.filter(item => {
//     var itemFound: Boolean;
//     for (let i = 0; i < properties.length; i++) {
//       if (item[properties[i]].toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
//         itemFound = true;
//         break;
//       }
//     }
//     return itemFound;
//   });

// }
transform(items: any[], keyword: any, properties): any[] {
  console.log("headers",properties);
  let headersArr:string[] = [];
  properties.forEach(ele => {
    headersArr.push(ele.key)
  })
  console.log("headersArr",headersArr);
  if (!items) return [];
  if (!keyword) return items;
  return items.filter(item => {
    var itemFound: Boolean;
    for (let i = 0; i < headersArr.length; i++) {
      if (item[headersArr[i]].toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
        itemFound = true;
        break;
      }
    }
    return itemFound;
  });

}


}
