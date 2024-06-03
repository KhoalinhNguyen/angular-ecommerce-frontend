import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { start } from '@popperjs/core';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { ShopFormServiceService } from 'src/app/services/shop-form-service.service';
import { ShopValidators } from 'src/app/validators/shop-validators';

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

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
              private shopFormService: ShopFormServiceService
  ) {}

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
                                 [Validators.required, 
                                  Validators.minLength(2), 
                                  ShopValidators.notOnlyWhiteSpace]),

        lastName: new FormControl('', 
                                [Validators.required, 
                                 Validators.minLength(2),
                                 ShopValidators.notOnlyWhiteSpace]),

        email: new FormControl('', 
                              Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2-4}$'))
      }),


      shippingAddress: this.formBuilder.group({
        street: new FormControl('',
                                 [Validators.required, Validators.minLength(2), 
                                  ShopValidators.notOnlyWhiteSpace]),
        state: new FormControl('',[Validators.required]),
        city: new FormControl('',
                                [Validators.required, Validators.minLength(2), 
                                ShopValidators.notOnlyWhiteSpace]),
        country: new FormControl('',[Validators.required]),
        zipCode: new FormControl('',
                                [Validators.required, Validators.minLength(5), 
                                ShopValidators.notOnlyWhiteSpace])
      }),


      billingAddress: this.formBuilder.group({
        street: new FormControl('',[Validators.required, Validators.minLength(2), 
                                  ShopValidators.notOnlyWhiteSpace]),
        state: new FormControl('',[Validators.required]),
        city: new FormControl('',[Validators.required, Validators.minLength(2), 
                                  ShopValidators.notOnlyWhiteSpace]),
        country: new FormControl('',[Validators.required]),
        zipCode: new FormControl('',[Validators.required, Validators.minLength(5), 
                                  ShopValidators.notOnlyWhiteSpace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('',[Validators.required]),
        nameOnCard: new FormControl('',[Validators.required, Validators.minLength(2), 
                                      ShopValidators.notOnlyWhiteSpace]),
        cardNumber: new FormControl('',[Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('',[Validators.required, Validators.pattern('[0-9]{3}')]),
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

    // populate countries
    this.shopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + data);
        this.countries = data;
      }
    ); 
  }


  onSubmit() {
    console.log("Handling the submit button");

    // touching all fields triggers the display of the error messages
    if(this.checkoutFormGroup?.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }

    console.log(this.checkoutFormGroup!.get('customer')!.value); 
    console.log("Email: " + this.checkoutFormGroup!.get('customer')!.value.email);

    console.log("Shipping address country: " + this.checkoutFormGroup!.get('shippingAddress')!.value.country.name);
    console.log("Shipping address state: " + this.checkoutFormGroup!.get('shippingAddress')!.value.state.name);
  }

  // get method to access from the html template
  get firstName() {return this.checkoutFormGroup?.get('customer.firstName');}
  get lastName() {return this.checkoutFormGroup?.get('customer.lastName');}
  get email() {return this.checkoutFormGroup?.get('customer.email');}

  get shippingAddressStreet() {return this.checkoutFormGroup?.get('shippingAddress.street');}
  get shippingAddressCity() {return this.checkoutFormGroup?.get('shippingAddress.city');}
  get shippingAddressState() {return this.checkoutFormGroup?.get('shippingAddress.state');}
  get shippingAddressZipcode() {return this.checkoutFormGroup?.get('shippingAddress.zipCode');}
  get shippingAddressCountry() {return this.checkoutFormGroup?.get('shippingAddress.country');}

  get billingAddressStreet() {return this.checkoutFormGroup?.get('billingAddress.street');}
  get billingAddressCity() {return this.checkoutFormGroup?.get('billingAddress.city');}
  get billingAddressState() {return this.checkoutFormGroup?.get('billingAddress.state');}
  get billingAddressZipcode() {return this.checkoutFormGroup?.get('billingAddress.zipCode');}
  get billingAddressCountry() {return this.checkoutFormGroup?.get('billingAddress.country');}

  get cardType() {return this.checkoutFormGroup?.get('creditCard.cardType');}
  get nameOnCard() {return this.checkoutFormGroup?.get('creditCard.nameOnCard');}
  get cardNumber() {return this.checkoutFormGroup?.get('creditCard.cardNumber');}
  get securityCode() {return this.checkoutFormGroup?.get('creditCard.securityCode');}

  // -----------------------------------------------------------------------

  copyShippingAddressToBillingAddress(event) {
    if(event.target.checked) {
      this.checkoutFormGroup!.controls['billingAddress']
        .setValue(this.checkoutFormGroup!.controls['shippingAddress'].value)

        // bug fix for states
        this.billingAddressStates = this.shippingAddressStates;
    }
    else {
      this.checkoutFormGroup!.controls['billingAddress'].reset();
      
      // bug fix for states
      this.billingAddressStates = [];
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

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup?.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup!.value.country.name;

    // country name for testing only
    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.shopFormService.getStates(countryCode).subscribe(
      data => {
        if( formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        }
        else {
          this.billingAddressStates = data;
        }

        // select first state as default
        formGroup?.get('state')?.setValue(data[0]);
      }
    );
    
  }

}
