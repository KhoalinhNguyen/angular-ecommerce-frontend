import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  // Subject is a subclass of Observable
  // Subject can publish event to all subscribers
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem: CartItem) {

    // check if the item is in the cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined;

    if(this.cartItems.length > 0) {

      // find the item in the cart
      existingCartItem = this.cartItems.find( tempCartItem => (tempCartItem.id === theCartItem.id));

      // check if we found it
      alreadyExistsInCart = (existingCartItem != undefined);
    }

    if(alreadyExistsInCart) {
      // increment the quantity
      existingCartItem!.quantity++;
    } else {
      // add the item to the cart
      this.cartItems.push(theCartItem);
    }

    // compute the cart total price and total quantity
    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity*currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // public the new value to all subscribers
    // .next() is the publish/send event
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log cart data for debugging
    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the cart');
    for(let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity: ${tempCartItem.quantity}, unitPrice: ${tempCartItem.unitPrice}, sub total price: ${subTotalPrice}`);
    }
    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}`);
    console.log(`----`);
  }
}
