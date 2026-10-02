import { Injectable, signal, computed } from '@angular/core';
import { Product } from './product.service';
export interface CartItem { product: Product; quantity: number; }
@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItems = signal<CartItem[]>(this.readCart());
  readonly cartItems$ = this.cartItems.asReadonly();
  readonly cartTotal = computed(() => this.cartItems().reduce((total, item) => total + item.product.price * item.quantity, 0));
  readonly cartItemCount = computed(() => this.cartItems().reduce((count, item) => count + item.quantity, 0));
  readonly listTotal = computed(() => this.cartItems().reduce((total, item) => total + item.product.mrp * item.quantity, 0));
  private readCart(): CartItem[] { try { return typeof localStorage === 'undefined' ? [] : JSON.parse(localStorage.getItem('bazaar-cart') || '[]'); } catch { return []; } }
  private persist(): void { try { localStorage.setItem('bazaar-cart', JSON.stringify(this.cartItems())); } catch {} }
  addToCart(product: Product, quantity = 1): void { this.cartItems.update(items => { const found = items.find(item => item.product.id === product.id); return found ? items.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item) : [...items, { product, quantity }]; }); this.persist(); }
  removeFromCart(id: number): void { this.cartItems.update(items => items.filter(item => item.product.id !== id)); this.persist(); }
  updateQuantity(id: number, quantity: number): void { this.cartItems.update(items => items.map(item => item.product.id === id ? { ...item, quantity: Math.max(1, Math.floor(quantity)) } : item)); this.persist(); }
  clearCart(): void { this.cartItems.set([]); this.persist(); }
  getCartItems(): CartItem[] { return this.cartItems(); }
}
