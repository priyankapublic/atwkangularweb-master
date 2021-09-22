import { Pipe, PipeTransform } from '@angular/core';
import { Currentuser } from '../model/Currentuser';
@Pipe({
  name: 'modFilter'
})
export class ModFilterPipe implements PipeTransform {

  transform(user: Currentuser[], searchKey: string): any {
    if (!!searchKey) {
      return user.filter(x => {
        let searchText = x.fromName + ' '+ x.toName + ' '+ x.name + ' '+ x.email+ ' '+ x.email+ ' '+ x.subject+ ' '+ x.role ;
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
