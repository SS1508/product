import { Injectable } from '@angular/core';
import { signal, computed } from '@angular/core';
import { Product } from './product.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);

  cartItems$ = this.cartItems.asReadonly();

  cartTotal = computed(() => {
    return this.cartItems().reduce((total, item) => total + (item.product.price * item.quantity), 0);
  });

  cartItemCount = computed(() => {
    return this.cartItems().reduce((count, item) => count + item.quantity, 0);
  });

  addToCart(product: Product, quantity: number = 1) {
    this.cartItems.update(items => {
      const existingItem = items.find(item => item.product.id === product.id);
      if (existingItem) {
        existingItem.quantity += quantity;
        return [...items];
      }
      return [...items, { product, quantity }];
    });
  }

  removeFromCart(productId: number) {
    this.cartItems.update(items => items.filter(item => item.product.id !== productId));
  }

  updateQuantity(productId: number, quantity: number) {
    this.cartItems.update(items => {
      const item = items.find(item => item.product.id === productId);
      if (item) {
        item.quantity = Math.max(1, quantity);
      }
      return [...items];
    });
  }

  clearCart() {
    this.cartItems.set([]);
  }

  getCartItems() {
    return this.cartItems();
  }
}
