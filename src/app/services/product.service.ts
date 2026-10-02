import { Injectable } from '@angular/core';
import { signal } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Laptop',
      price: 999.99,
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=300&fit=crop',
      category: 'Electronics'
    },
    {
      id: 2,
      name: 'Smartphone',
      price: 599.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
      category: 'Electronics'
    },
    {
      id: 3,
      name: 'Wireless Headphones',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
      category: 'Audio'
    },
    {
      id: 4,
      name: 'Smartwatch',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
      category: 'Wearables'
    },
    {
      id: 5,
      name: 'Tablet',
      price: 449.99,
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&h=300&fit=crop',
      category: 'Electronics'
    },
    {
      id: 6,
      name: 'Camera',
      price: 799.99,
      image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=300&h=300&fit=crop',
      category: 'Photography'
    }
  ];

  getProducts() {
    return this.products;
  }

  getCategories() {
    const categories = new Set(this.products.map(p => p.category));
    return ['All', ...Array.from(categories).sort()];
  }

  getProductsByCategory(category: string) {
    if (category === 'All') {
      return this.products;
    }
    return this.products.filter(p => p.category === category);
  }

  getProductById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }
}
