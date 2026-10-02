import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ProductService, Product } from '../services/product.service';
import { CartService } from '../services/cart.service';

@Component({ selector: 'app-product', standalone: true, imports: [CommonModule, CurrencyPipe], changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './product.component.html', styleUrl: './product.component.css' })
export class ProductComponent {
  @Input() searchQuery = ''; @Input() selectedCategory = 'All';
  @Output() productSelected = new EventEmitter<Product>(); @Output() notify = new EventEmitter<string>();
  readonly products: Product[]; readonly categories: string[];
  readonly sort = signal('featured'); readonly maxPrice = signal(100000); readonly minimumRating = signal(0); readonly wishlist = signal<number[]>(this.readWishlist());
  filteredProducts(): Product[] {
    const query = this.searchQuery.trim().toLowerCase();
    const products = this.products.filter(p => (this.selectedCategory === 'All' || p.category === this.selectedCategory) && p.price <= this.maxPrice() && p.rating >= this.minimumRating() && (!query || `${p.name} ${p.brand} ${p.category} ${p.description}`.toLowerCase().includes(query)));
    switch (this.sort()) { case 'price-low': products.sort((a,b)=>a.price-b.price); break; case 'price-high': products.sort((a,b)=>b.price-a.price); break; case 'rating': products.sort((a,b)=>b.rating-a.rating); break; case 'discount': products.sort((a,b)=>(b.mrp-b.price)/b.mrp-(a.mrp-a.price)/a.mrp); }
    return products;
  }
  constructor(private productService: ProductService, public cartService: CartService) { this.products = productService.getProducts(); this.categories = productService.getCategories(); }
  private readWishlist(): number[] { try { return typeof localStorage === 'undefined' ? [] : JSON.parse(localStorage.getItem('bazaar-wishlist') || '[]'); } catch { return []; } }
  toggleWishlist(product: Product, event: Event): void { event.stopPropagation(); const list = this.wishlist().includes(product.id) ? this.wishlist().filter(id => id !== product.id) : [...this.wishlist(), product.id]; this.wishlist.set(list); try { localStorage.setItem('bazaar-wishlist', JSON.stringify(list)); } catch {} this.notify.emit(list.includes(product.id) ? 'Saved to your wishlist' : 'Removed from wishlist'); }
  isWishlisted(id: number): boolean { return this.wishlist().includes(id); }
  addToCart(product: Product, event?: Event): void { event?.stopPropagation(); if (!product.stock) { this.notify.emit('This product is currently unavailable'); return; } this.cartService.addToCart(product); this.notify.emit(`${product.name} added to cart`); }
  discount(product: Product): number { return Math.round((1 - product.price / product.mrp) * 100); }
  trackById(_: number, product: Product): number { return product.id; }
}
