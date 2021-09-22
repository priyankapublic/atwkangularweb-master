import { Pipe, PipeTransform } from '@angular/core';
import { Qna } from '../model/Qna';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(user: Qna[], searchKey: string): any {
    if (!!searchKey && !! user) {
      if(searchKey == 'views'){
        return user.sort((a, b) => a.count > b.count ? -1 : a.count < b.count ? 1 : 0); 
       }else if(searchKey == 'latest'){
        return user.sort((a, b) => a.sn < b.sn ? -1 : a.sn > b.sn ? 1 : 0); 
       }else if(searchKey == 'oldest'){
        return user.sort((a, b) => a.sn > b.sn ? -1 : a.sn < b.sn ? 1 : 0); 
       }
     
    } else {
      return user;
    }

  }

}

