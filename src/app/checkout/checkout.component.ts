import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {IPayPalConfig,ICreateOrderRequest } from 'ngx-paypal';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  public payPalConfig ? : IPayPalConfig;
  checkoutStatus:boolean = false
  totalAmount:string=""
  checkoutForm = this.fb.group({
    username:['',[Validators.required,Validators.pattern('[a-zA-Z ]*')]],
    address:['',[Validators.required,Validators.pattern('[a-zA-Z0-9]*')]],
    pincode:['',[Validators.required,Validators.pattern('[a-zA-Z0-9]*')]],

  })
  constructor(private fb:FormBuilder,private toaster:ToastrService,private api:ApiService,private router:Router){
 }

 proceedToBuy(){
  if(this.checkoutForm.valid){
    this.checkoutStatus = true
    if(sessionStorage.getItem("cartTotal")){
      this.totalAmount = sessionStorage.getItem("cartTotal") || ""
      this.initConfig()
    }
  }else{
    this.toaster.info("invalid Form!!!")
  }
 }
  cancel(){
    this.checkoutForm.reset()
  }

  private initConfig(): void {
    this.payPalConfig = {
        currency: 'USD',
        clientId: 'sb',
        createOrderOnClient: (data) => < ICreateOrderRequest > {
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: '9.99',
                    breakdown: {
                        item_total: {
                            currency_code: 'USD',
                            value: '9.99'
                        }
                    }
                }
              
            }]
        },
        advanced: {
            commit: 'true'
        },
        style: {
            label: 'paypal',
            layout: 'vertical'
        },
        onApprove: (data, actions) => {
            console.log('onApprove - transaction was approved, but not authorized', data, actions);
            actions.order.get().then((details:any) => {
                console.log('onApprove - you can get full order details inside onApprove: ', details);
            });

        },
        onClientAuthorization: (data) => {
            console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
            //step to follow when transaction completed successfully
            this.api.emptyCartAPI().subscribe((res:any)=>{
              this.api.getCartCount()
              this.toaster.success("'successfully completed the payment... thnk you purchasing with us")
              this.checkoutStatus=false
              this.checkoutForm.reset()
              this.router.navigateByUrl("/")
            })


        },
        onCancel: (data, actions) => {
            console.log('OnCancel', data, actions);
            this.toaster.warning("Transaction has been cancelled")
            this.checkoutStatus = false

        },
        onError: err => {
            console.log('OnError', err);
            this.toaster.warning("Transaction failed please try after sometime...")
        },
        onClick: (data, actions) => {
            console.log('onClick', data, actions);
            
        }
    };
}
}



