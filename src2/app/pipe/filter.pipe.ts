import { Pipe, PipeTransform } from '@angular/core';
import { Userlist } from '../model/Userlist';
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(user: Userlist[], searchKey: string): any {
    if (!!searchKey) {
      return user.filter(x => {
        let searchText = x.name + ' '+ x.email+ ' '+ x.lastMessage+ ' '+ x.subject+ ' '+ x.role ;
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
