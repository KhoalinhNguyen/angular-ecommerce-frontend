import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string = "" ;
  searchMode: boolean = false;

  // new property for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 100;

  previousKeyword: string = "";

  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProduct();
    }) 
  }

  listProduct() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');
      //keyword is passed in from the search component

    if(this.searchMode) {
      this.handleSearchProducts();
    }else {
      this.handleListProducts();
    }

  }

  handleSearchProducts() {

    const theKeyWord = this.route.snapshot.paramMap.get('keyword')!;

    //
    // If we have different keyword than previous
    // then set the page number to 1 
    //
    if (this.previousKeyword != theKeyWord) {
      this.thePageNumber = 1;
    }
    this.previousKeyword = theKeyWord;
    console.log(`keyword=${theKeyWord}, thPageNumber=${this.thePageNumber}`);
    

    // now search for the products using the keyword
    this.productService.searchProductsPaginate(this.thePageNumber - 1 ,      
                                              this.thePageSize,
                                              theKeyWord).subscribe(this.handleResult());
  }

  handleListProducts() {

      //check if "id" parameter is available
      const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
      //route = activated routes, snapshot = routes at this given moment, 
      //paramMap = Map of all the route parameters and read the id parameter

    if(hasCategoryId) {
      
      //
      //get the "id" param string, convert string to number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;

      //
      //get the name param string
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    }
    else {
      
      //
      //no category id --> dafault id = 1
      this.currentCategoryId = 1;
      this.currentCategoryName = "Books";
    }


    //
    // Check if we have a different category than previous
    // Note: Angular will reuse a component if it is currently being viewed
    //

    // if we have a different category id than the previous
    // then set thePageNumber back to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

    
    //
    //now get the products for the given category id
    this.productService.getProductListPaginate(this.thePageNumber - 1,
                                              this.thePageSize,
                                              this.currentCategoryId)
                                              .subscribe(this.handleResult());
  }

  handleResult() {
    return (data:any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

  updatePageSize(size: string) {
    this.thePageSize = +size;
    this.thePageNumber = 1;

    // refresh the page view
    this.listProduct();
  }

  addToCart(product: Product) {

    console.log(`Product: ${product.name}, price: ${product.unitPrice}`);
    
    //TODO - do the real work
    const theCartItem = new CartItem(product);

    this.cartService.addToCart(theCartItem);
  }
}
