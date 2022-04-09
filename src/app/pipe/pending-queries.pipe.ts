import { Pipe, PipeTransform } from '@angular/core';
import {Pendingqueries  } from "../model/Pendingqueries";

@Pipe({
  name: 'pendingQueries'
})
export class PendingQueriesPipe implements PipeTransform {

  transform(scholar: Pendingqueries[], searchKey: string): any {
    if (!!searchKey) {
      return scholar.filter(x => {
        let searchText = x.UnreadMessageCount + ' '+ x.ScholarsUserName + ' '+ x.ScholarsName + ' '+ x.UsersUserName + ' '+ x.UsersName;
       if ( searchText.toLowerCase().search(searchKey) != -1 ) {
          return true;
        }
      }
      );
    } else {
      return scholar;

    }

  }
}

