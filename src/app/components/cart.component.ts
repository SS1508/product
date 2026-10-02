import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  constructor(public cartService: CartService) {}

  removeFromCart(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  updateQuantity(productId: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const quantity = parseInt(input.value, 10);
    if (quantity > 0) {
      this.cartService.updateQuantity(productId, quantity);
    }
  }

  increaseQuantity(productId: number) {
    const item = this.cartService.getCartItems().find(i => i.product.id === productId);
    if (item) {
      this.cartService.updateQuantity(productId, item.quantity + 1);
    }
  }

  decreaseQuantity(productId: number) {
    const item = this.cartService.getCartItems().find(i => i.product.id === productId);
    if (item && item.quantity > 1) {
      this.cartService.updateQuantity(productId, item.quantity - 1);
    }
  }

  clearCart() {
    this.cartService.clearCart();
  }
}
