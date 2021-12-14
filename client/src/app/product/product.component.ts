import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { map } from 'rxjs/operators';

// import Swiper core and required components
import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller,
} from 'swiper/core';
import { CartService } from '../services/cart.service';

// install Swiper components
SwiperCore.use([
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller,
]);

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  p_id: number;
  product: any;
  quantity: number;
  showcaseImages: any[] = [];
  loading = false;
  checkProductId:any;
  constructor(
    private _route: ActivatedRoute,
    private _product: ProductService,
    private _cart: CartService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this._route.paramMap
      .pipe(
        map((param: any) => {
          this.checkProductId=param;
          return param.params.id;
        })
      )
      .subscribe((productId) => {

        // returns string so convert it to number
        this.p_id = parseInt(productId);
        console.log("getsingleprod zzzz",this.p_id);
        console.log("getsingleprod id",this.checkProductId);
        this._product.getSingleProduct(productId).subscribe((product) => {
          console.log(product);
          this.product = product;
          if (product.quantity === 0) this.quantity = 0;
          else this.quantity = 1;

          if (product.images) {
            this.showcaseImages = product.images.split(';');
          }
          this.loading = false;
        });
      });
  }

  addToCart(): void {
    this._cart.addProduct({
      p_id: this.p_id,
      price: this.product.price,
      quantity: this.quantity,
      image: this.product.image,
      title: this.product.title,
      maxQuantity: this.product.quantity,
    });
  }
}
