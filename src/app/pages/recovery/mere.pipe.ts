import { Pipe,PipeTransform  } from '@angular/core';
@Pipe({
    name: 'merge'
  })
  export class MergePipe implements PipeTransform{
    transform(arr1:string, arr2:string,arr3:string,arr4:string,arr5:string,arr6:string) {
      var a=arr1.split(',');   
      var b=arr2.split(',');
      var c=arr3.split(',');
      var d=arr4.split(',');
      var e=arr5.split(',');
      var f=arr6.split(',');
      let arr = [];
      a.forEach((item, i) => {
        arr.push({ inst: a[i], trx: b[i],post:c[i],amt:d[i],typ:e[i],dt:f[i] });
      });
      return arr;
    }
   
  }