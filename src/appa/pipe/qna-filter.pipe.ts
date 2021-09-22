import { Pipe, PipeTransform } from '@angular/core';
import { Qna } from '../model/Qna';


@Pipe({
  name: 'qnaFilter'
})
export class QnaFilterPipe implements PipeTransform {

  transform(user: Qna[], searchKey: string): any {
    if (!!searchKey) {
      return user.filter(x => {
        let searchText =  x.subject + ' '+ x.scholar+ ' '+ x.ayatollah+ ' '+x.data[0].answer+' '+x.data[0].question;
        let temp:string;
          for(let i =0; i<x.data.length;i++){
             temp = x.data[i].question+x.data[i].answer;
          }
         searchText = searchText + ' ' + temp
        if ( searchText.toLowerCase().search(searchKey) != -1 ) {
          return true;
        }
      }
      );
    } else {
      return user;
    }

  }

}

