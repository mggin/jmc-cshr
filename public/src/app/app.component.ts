import { Component } from '@angular/core';
import { Time } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  timeIn: Time;
  timeOut: Time;
  serviceDate: String;

  handleClick() {
    console.log(this.timeIn);
    console.log(this.timeOut);
    
    let n = new Date(this.serviceDate.replace(/-/g, '/'));
    console.log(n.getMonth())
  }
}
