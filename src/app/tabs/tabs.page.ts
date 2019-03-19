import { Tab2Page } from './../tab2/tab2.page';
import { Component } from '@angular/core';
// import { Tab2Page } from 'app/tab2/Tab2Page';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {

  // intervalLoad : any;
  constructor( private page2 :Tab2Page ){
   
  }

  
GetCorridas() {
  
    this.page2.GetCorridas();
  }

  
}


