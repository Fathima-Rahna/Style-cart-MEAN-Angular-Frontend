import { Component,OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  allProducts:any=[]
  constructor(private api:ApiService,private toaster:ToastrService){}

  ngOnInit():void{
    this.getWishlist()
  }

  getWishlist(){
    this.api.getWishlistAPI().subscribe((res:any)=>{
      this.allProducts=res
      this.api.getWishlistCount()
    })
  }

  deleteWishlist(id:any){
    this.api.removeWishlistAPI(id).subscribe((result:any)=>{
      this.getWishlist()
    })
  }

    addToCart(product:any){
    if(sessionStorage.getItem("token")){
      product.quantity = 1
      this.api.addToCartAPI(product).subscribe({
        next:(result:any)=>{
          this.toaster.success(result)
          this.api.getCartCount()
          this.deleteWishlist(product._id)
        },
        error:(reason:any)=>{
          this.toaster.warning(reason.error)
        }
      })
  }else{
    this.toaster.warning("please Login")
}

}

}
