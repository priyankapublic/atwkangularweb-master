import { Pipe, PipeTransform } from '@angular/core';
import { Scholar } from '../model/Scholar';
@Pipe({
  name: 'scholarFilter'
})
export class ScholarFilterPipe implements PipeTransform {

  transform(scholar: Scholar[], searchKey: string): any {
    if (!!searchKey) {
      return scholar.filter(x => {
        let searchText = x.name + ' '+ x.email + ' '+ x.location + ' '+ x.nationality + ' '+ x.details + ' '+ x.language + ' '+ x.specialisationIn + ' '+ x.studiesAt ;
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