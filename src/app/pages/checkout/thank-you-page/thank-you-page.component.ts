import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-thank-you-page',
  template: `
  <div class ="container">
    <h1 class="title">Thank you!</h1>
    <p class = "content">Your order is on  the way! </p>
    <span>
        Gracias :)
    </span>
  </div>
`,
  styleUrls: ['./thank-you-page.component.scss']
})
export class ThankYouPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
