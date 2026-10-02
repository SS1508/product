import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../services/product.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  products: Product[] = [];
  categories: string[] = [];
  selectedCategory = '';
  searchQuery = '';
  filteredProducts = signal<Product[]>([]);

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {
    this.products = this.productService.getProducts();
    this.categories = this.productService.getCategories();
    this.selectedCategory = 'All';
    this.filteredProducts.set(this.products);
  }

  filterByCategory() {
    const categoryFiltered = this.productService.getProductsByCategory(this.selectedCategory);
    this.applySearchFilter(categoryFiltered);
  }

  filterProducts() {
    const categoryFiltered = this.productService.getProductsByCategory(this.selectedCategory);
    this.applySearchFilter(categoryFiltered);
  }

  private applySearchFilter(products: Product[]) {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredProducts.set(products);
    } else {
      this.filteredProducts.set(
        products.filter(product =>
          product.name.toLowerCase().includes(query)
        )
      );
    }
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }
}
