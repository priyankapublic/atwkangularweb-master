import { Component, OnInit } from '@angular/core';
import { MenuDataToRightPanService } from 'src/app/shared/menu-data-to-right-pan.service';

@Component({
  selector: 'app-right-side-bar',
  templateUrl: './right-side-bar.component.html',
  styleUrls: ['./right-side-bar.component.scss']
})
export class RightSideBarComponent implements OnInit {
   tag :string;
  constructor(

    private menuDataToRightPanService: MenuDataToRightPanService,

  ) { }

  ngOnInit() {
    this. dataForRightPan();
  }
  dataForRightPan(){
    this.menuDataToRightPanService.menuDataToRightPan$.subscribe(
      data =>{    this.tag = data.tag ;} 
    )
  }
}
