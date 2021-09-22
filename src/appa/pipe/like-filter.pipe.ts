import { Pipe, PipeTransform } from '@angular/core';
import { Qna } from '../model/Qna';

@Pipe({
  name: 'likeFilter'
})
export class LikeFilterPipe implements PipeTransform {

  transform(qna: Qna[], filterhKey: boolean): any {
    if (!!filterhKey) {
      return qna.filter(x =>x.is_liked ==true );
    } else {
      return qna;
    }

  }

}





