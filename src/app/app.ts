import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductComponent } from './components/product.component';
import { CartComponent } from './components/cart.component';
import { Product, ProductService } from './services/product.service';
import { CartService } from './services/cart.service';

@Component({ selector: 'app-root', standalone: true, imports: [CommonModule, FormsModule, CurrencyPipe, ProductComponent, CartComponent], templateUrl: './app.html', styleUrl: './app.css', changeDetection: ChangeDetectionStrategy.OnPush })
export class App {
  readonly categories: string[]; readonly view = signal('home'); readonly query = signal(''); readonly category = signal('All'); readonly toast = signal(''); readonly selectedProduct = signal<Product | null>(null); readonly mobileMenu = signal(false); readonly step = signal(1); readonly orderId = signal(''); readonly wishlist = signal<number[]>(this.readWishlist());
  constructor(public cart: CartService, public products: ProductService) { this.categories = products.getCategories(); }
  toggleMobileMenu(): void { this.mobileMenu.update(value => !value); }
  private readWishlist(): number[] { try { return typeof localStorage === 'undefined' ? [] : JSON.parse(localStorage.getItem('bazaar-wishlist') || '[]'); } catch { return []; } }
  open(view: string): void { this.view.set(view); this.selectedProduct.set(null); this.mobileMenu.set(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  chooseCategory(category: string): void { this.category.set(category); this.open('shop'); }
  notify(message: string): void { this.toast.set(message); window.setTimeout(() => { if (this.toast() === message) this.toast.set(''); }, 2600); }
  goToProduct(product: Product): void { this.selectedProduct.set(product); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  get wishedProducts(): Product[] { return this.wishlist().map(id => this.products.getProductById(id)).filter((p): p is Product => !!p); }
  toggleWish(product: Product): void { const list = this.wishlist().includes(product.id) ? this.wishlist().filter(id => id !== product.id) : [...this.wishlist(), product.id]; this.wishlist.set(list); try { localStorage.setItem('bazaar-wishlist', JSON.stringify(list)); } catch {} this.notify(list.includes(product.id) ? 'Saved to your wishlist' : 'Removed from wishlist'); }
  moveToCart(product: Product): void { this.cart.addToCart(product); this.toggleWish(product); this.notify('Moved to your bag'); }
  beginCheckout(): void { if (!this.cart.cartItemCount()) { this.notify('Add something lovely to your bag first'); return; } this.step.set(1); this.open('checkout'); }
  placeOrder(): void { this.orderId.set(`BB${Date.now().toString().slice(-8)}`); this.cart.clearCart(); this.open('success'); }
  search(): void { this.category.set('All'); this.open('shop'); }
  discount(product: Product): number { return Math.round((1 - product.price / product.mrp) * 100); }
}
