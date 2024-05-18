import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  currentCategoryName: string = "" ;
  searchMode: boolean = false;

  constructor(private productService: ProductService,
              private route: ActivatedRoute
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

    // now search for the products using the keyword
    this.productService.searchProducts(theKeyWord).subscribe(
      data => {
        this.products = data;
      }
    )
  }

  handleListProducts() {

      //check if "id" parameter is available
      const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
      //route = activated routes, snapshot = routes at this given moment, 
      //paramMap = Map of all the route parameters and read the id parameter

    if(hasCategoryId) {
        //get the "id" param string, convert string to number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;

        //get the name param string
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    }
    else {
        //no category id --> dafault id = 1
      this.currentCategoryId = 1;
      this.currentCategoryName = "Books";
    }

      //now get the products for the given category id
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        console.log(data);
        
        this.products = data;
      }
    );
  }
}
