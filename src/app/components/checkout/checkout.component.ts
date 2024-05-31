import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { start } from '@popperjs/core';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { ShopFormServiceService } from 'src/app/services/shop-form-service.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {


  checkoutFormGroup: FormGroup | undefined;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];
    
  countries: Country[] = [];
  states: State[] = [];

  constructor(private formBuilder: FormBuilder,
              private shopFormService: ShopFormServiceService
  ) {}

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        state: [''],
        city: [''],
        country: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        state: [''],
        city: [''],
        country: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      }),
    });

    // populate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    console.log("Start month:" + startMonth);
    
    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    );
    // populate credit car years
    this.shopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years: " + data);
        this.creditCardYears = data;
      }
    );

    this.listCountry();
    
  }
  listCountry() {
    // populate the countries
    this.shopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + data);
        this.countries = data;
      }
    );
  }

  onSubmit() {
    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup!.get('customer')!.value); 
    console.log("Email: " + this.checkoutFormGroup!.get('customer')!.value.email);
  }

  copyShippingAddressToBillingAddress(event) {
    if(event.target.checked) {
      this.checkoutFormGroup!.controls['billingAddress']
        .setValue(this.checkoutFormGroup!.controls['shippingAddress'].value)
    }
    else {
      this.checkoutFormGroup!.controls['billingAddress'].reset();
    }
  }

  handleMonthsAndYears() {
    
    const creditCardFormGroup = this.checkoutFormGroup!.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    // if the current year equals the selected year, then start with the current month

    let startMonth: number;

    if( currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    );
  }

}
