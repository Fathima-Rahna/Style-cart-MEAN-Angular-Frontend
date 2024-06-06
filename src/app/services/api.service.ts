import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
   
  wishlistCount = new BehaviorSubject(0)
  cartCount = new BehaviorSubject(0)

  server_url="https://style-cart-angular-mean-server.onrender.com"
  constructor(private http:HttpClient) {
     if(sessionStorage.getItem("token")){
      this.getWishlistCount()
      this.getCartCount()
     }

   }


  getAllProduct(){
    return this.http.get(`${this.server_url}/all-products`);
  }
  registerApi(user:any){
    return this.http.post(`${this.server_url}/register`,user)
  }

  loginApi(user:any){
    return this.http.post(`${this.server_url}/login`,user)
  }
  getAProductAPI(id:any){
    return this.http.get(`${this.server_url}/${id}/get-product`);
  }

  appendToken(){
    const token = sessionStorage.getItem("token")
    let headers = new HttpHeaders()
    if(token){
      headers = headers.append("Authorization",`Bearer ${token}`)
    }
    return {headers}
  }





  //user/add-to-wishlist
  addToWishlistAPI(product:any){
    return this.http.post(`${this.server_url}/user/add-to-wishlist`,product,this.appendToken())
  }


  getWishlistAPI(){
    return this.http.get(`${this.server_url}/get-wishlist`,this.appendToken())
  }

  getWishlistCount(){
    this.getWishlistAPI().subscribe((result:any)=>{
      this.wishlistCount.next(result.length)
    })
  }


  removeWishlistAPI(id:any){
    return this.http.delete(`${this.server_url}/remove-wishlist/${id}/item`,this.appendToken())
  }


  // addToCartAPI(product:any){
  //   return this.http.post(`${this.server_url}/user/add-to-cart`,product,this.appendToken())
  // }
  addToCartAPI(product: any) {
    return this.http.post(`${this.server_url}/user/add-to-cart`, product, this.appendToken());
  }
  

  getCartAPI(){
    return this.http.get(`${this.server_url}/get-cart`,this.appendToken())
  }


  getCartCount(){
    this.getCartAPI().subscribe((result:any)=>{
      this.cartCount.next(result.length)
    })
  }

  removeCartItemAPI(id:any){
    return this.http.delete(`${this.server_url}/remove-cart/${id}/item`,this.appendToken())
  }
  getIncrementCartAPI(id:any){
    return this.http.get(`${this.server_url}/${id}/increment-cart`,this.appendToken())
  }

  getDecrementCartAPI(id:any){
    return this.http.get(`${this.server_url}/${id}/decrement-cart`,this.appendToken())
  }

  emptyCartAPI(){
    return this.http.delete(`${this.server_url}/empty-cart`,this.appendToken())
  }
}
