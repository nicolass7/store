import { Component, OnInit } from '@angular/core';
import { DataService } from '../products/services/data.service';
import { delay, switchMap, tap } from 'rxjs/operators';
import { Store } from '../products/interfaces/store.interface';
import { NgForm } from '@angular/forms';
import { Details, Order } from 'src/app/shared/interface/order.interface';
import { Product } from '../products/interfaces/product.interface';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';
import { pipe } from 'rxjs';
import { Router } from '@angular/router';
import { ProductsService } from '../products/services/products.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
model = {
  name: '',
  store: '',
  shippingAddress:'',
  city:''
};
  isDelivery = true;
  cart: Product[] = [];
  stores: Store [] = [];

  constructor(
    private dataSvc: DataService, 
    private shoppingCartSvc: ShoppingCartService ,
    private router: Router,
    private productSvc : ProductsService
    ) { 
      this.checkCartIsEmpty();

    }

  ngOnInit(): void {
    this.getStores();
    this.getDataCart();
    this.prepareDetails();
  }

  onPickupOrDelivery(value: boolean): void{
    this.isDelivery = value;
  }
  
  onSubmit({value: formData}:NgForm):void{
    console.log('Guardar', formData);
    const data : Order = {
      ...formData,
      date: this.getCurrentDay(),
      isDelivery: this.isDelivery
    }
    this.dataSvc.saveOrder(data)
    .pipe(
      tap(res => console.log('Order ->',res)),
      switchMap(({id : orderId}) =>{
        const details = this.prepareDetails();
        return this.dataSvc.saveDetailsOrder({details, orderId});
      }),
      //tap(res =>console.log('Finish->', res))
      tap(()=> this.router.navigate(['/checkout/thank-you-page'])),
      delay(200),
      tap(()=>this.shoppingCartSvc.resetCart())
    )
    .subscribe();
  }
  private getStores(): void{
      this.dataSvc.getStores()
      .pipe(
        tap((stores: Store [])  => this.stores = stores)
      ).subscribe();
  }
  private getCurrentDay() : string{
    return new Date().toLocaleDateString();
  }

  private prepareDetails():Details[]{
    const details : Details[] = [];
    this.cart.forEach((product: Product) => {
      const {id : productId, name : productName, qty : quantity, stock} = product;
      const updateStock = (stock - quantity);
      this.productSvc.updateStock(productId,updateStock)
      .pipe(
        tap(()=>details.push({productId, productName, quantity}))
      )
      .subscribe();
      
    });
    return details;
  }

  private getDataCart():void{
    this.shoppingCartSvc.cartAction$
    .pipe(
      tap((products: Product[]) => this.cart = products) 
    ).subscribe(); 
  }

  private checkCartIsEmpty(): void{
    this.shoppingCartSvc.cartAction$
    .pipe(
      tap((products : Product[])=>{
        if(Array.isArray(products) && ! products.length){
          this.router.navigate(['/products'])
        }
      })
    )
    .subscribe()
  }
}
