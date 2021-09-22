import { Pipe, PipeTransform } from '@angular/core';
import { Qna } from '../model/Qna';

@Pipe({
  name: 'tagsMainFilter'
})
export class TagsMainFilterPipe implements PipeTransform {
  transform(user: Qna[], searchKey: any): any {
    if (searchKey.length>0 && user.length>0) {
      return user.filter(x => {
         let intersection = x.tags.filter(element => searchKey.includes(element));        
        if (intersection.length>0 ) {
          return true;
        }
      }
      );
    } else {
      return user;
    }

  }

}

