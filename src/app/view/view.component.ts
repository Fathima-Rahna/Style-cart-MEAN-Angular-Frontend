// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { ApiService } from '../services/api.service';
// import { ToastrService } from 'ngx-toastr';

// @Component({
//   selector: 'app-view',
//   templateUrl: './view.component.html',
//   styleUrls: ['./view.component.css']
// })
// export class ViewComponent implements OnInit {
// product:any= {}
//   constructor(private route:ActivatedRoute,private api:ApiService){}
//   ngOnInit(): void {
//     this.route.params.subscribe((res:any)=>{
//       const {id} = res
//       this.getProductDetails(id)
//     })
//   }

//   getProductDetails(id:any){
//     this.api.getAProductAPI(id).subscribe((res:any)=>{
//       this.product = res
//     })
//   }

//   addToWishlist(product:any){
//     if(sessionStorage.getItem("token")){
//       this.api.addToWishlistAPI(product).subscribe({
//         next:(result:any)=>{
//           this.toaster.success(`product ${result.title} added to your wishlist!!`)
//           this.api.getWishlistCount()
//         },
//         error:(reason:any)=>{
//           console.log(reason);
//           this.toaster.warning(reason.error)
          

          
//         }
//       })

//     }else{
//       this.toaster.warning("please Login")
//     }
//   }

// }


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  product: any = {};

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private toaster: ToastrService // Inject ToastrService here
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((res:any) => {
      const {id} = res;
      this.getProductDetails(id);
    });
  }

  getProductDetails(id: any) {
    this.api.getAProductAPI(id).subscribe((res: any) => {
      this.product = res;
    });
  }

  addToWishlist(product: any) {
    if (sessionStorage.getItem('token')) {
      this.api.addToWishlistAPI(product).subscribe({
        next: (result: any) => {
          this.toaster.success(`product ${result.title} added to your wishlist!!`);
          this.api.getWishlistCount();
        },
        error: (reason: any) => {
          console.log(reason);
          this.toaster.warning(reason.error);
        }
      });
    } else {
      this.toaster.warning('Please Login');
    }
  }

  addToCart(product: any) {
    if (sessionStorage.getItem("token")) {
      product.quantity = 1;
      this.api.addToCartAPI(product).subscribe({
        next: (result: any) => {
          if (typeof result === 'object') {
            this.toaster.success('Product added to your cart successfully!');
          } else {
            this.toaster.success(result);
          }
          this.api.getCartCount();
        },
        error: (reason: any) => {
          this.toaster.warning(reason.error);
        }
      });
    } else {
      this.toaster.warning("Please login");
    }
  }
  
}
