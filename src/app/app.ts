import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ProductComponent } from './components/product.component';
import { CartComponent } from './components/cart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProductComponent, CartComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {}
