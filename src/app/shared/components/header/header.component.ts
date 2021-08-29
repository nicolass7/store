import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShoppingCartService } from '../../services/shopping-cart.service';

@Component({
  selector: 'app-header',

  template: `
  <mat-toolbar color="primary">
    <a [routerLink]="['/']"><span>My Store</span></a>
    <span class="spacer"></span>

    <app-cart class="mouseHover" (click)="gotToCheckout()"></app-cart>
  </mat-toolbar>
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent{
  constructor(private router: Router){}
  gotToCheckout(): void{
    this.router.navigate(['/checkout'])
  }
}