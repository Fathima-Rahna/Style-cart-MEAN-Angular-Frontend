import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  yourCart:any = []
  cartTotalPrice:number = 0
  couponStatus:boolean=false
  couponClickStatus:boolean = false

  constructor(private api:ApiService, private router:Router){}

ngOnInit(): void {
  if(sessionStorage.getItem("token")){
    this.getCartItems()
  }
}

  getCartItems(){
    this.api.getCartAPI().subscribe((result:any)=>{
      this.yourCart = result
      this.getCartTotal()
    })
  }

  getCartTotal(){
    this.cartTotalPrice = Math.ceil(this.yourCart.map((item:any)=>item.totalPrice).reduce(((p1:any,p2:any)=>p1+p2)))
  }


  removeItem(id:any){
    this.api.removeCartItemAPI(id).subscribe({
      next:(result:any)=>{
        this.getCartItems()
        this.api.getCartCount()
      },
      error:(reason:any)=>{
        console.log(reason.error);
        
      }
    })
  }


  incrementCart(id:any){
    this.api.getIncrementCartAPI(id).subscribe({
      next:(res:any)=>{
        this.getCartItems()
        this.api.getCartCount()
      },
      error:(reason:any)=>{
        console.log(reason);
        
      }
    })
  }


  decrementCart(id:any){
    this.api.getDecrementCartAPI(id).subscribe({
      next:(res:any)=>{
        this.getCartItems()
        this.api.getCartCount()
      },
      error:(reason:any)=>{
        console.log(reason);
        
      }
    })
  }


  emptyCart(){
    this.api.emptyCartAPI().subscribe({
      next:(res:any)=>{
        this.getCartItems()
        this.api.getCartCount()
      },
      error:(err:any)=>{
        console.log(err);
        
      }
      
    })
  }


  getCoupon(){
    this.couponStatus = true
  }
  backToOfferBtn(){
    this.couponStatus = false
  }


  percent5Discount(){
    this.couponClickStatus = true
    let discount = Math.ceil(this.cartTotalPrice*.05)
    this.cartTotalPrice -= discount
  }
  percent20Discount(){
    this.couponClickStatus = true
    let discount = Math.ceil(this.cartTotalPrice*.2)
    this.cartTotalPrice -= discount
  }
  percent50Discount(){
    this.couponClickStatus = true
    let discount = Math.ceil(this.cartTotalPrice*.5)
    this.cartTotalPrice -= discount
  }
  checkout(){
    sessionStorage.setItem("cartTotal",JSON.stringify(this.cartTotalPrice))
    this.router.navigateByUrl('checkout')
  }

}
