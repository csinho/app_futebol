import {Component} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage  {

  public listas =[
    { link: "/list", icon: "soccer" },
    { link: "", icon: "money" },
    { link: "", icon: "stadium"},
    { link: "", icon: "clock"}    
  ];

  constructor() {
  }
  

}
