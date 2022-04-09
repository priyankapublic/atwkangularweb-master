import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'tagsFilter'
})
export class TagsFilterPipe implements PipeTransform {
  transform(tags:any[], searchKey: string): any {
    if (!!searchKey) {
      return tags.filter(x => x.value.toLowerCase().search(searchKey.toLowerCase()) != -1);
    } else {
      return tags;
    }

  }

  
}