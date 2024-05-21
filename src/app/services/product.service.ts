import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';

  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) {}

  getProductListPaginate(thePage: number,
                         thePageSize: number, 
                         categoryId: number): Observable<GetResponseProducts> {
      //need to build URL based on category id, page and size
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`
                    + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductList(categoryId: number): Observable<Product[]> {
      //need to build URL based on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;

    return this.getProducts(searchUrl);
  }

  searchProducts(keyword: string): Observable<Product[]> {
      //need to build URL based on category id
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}`;
    
    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(thePage: number,
                        thePageSize: number,
                        keyword: string): Observable<GetResponseProducts> {

      //need to build URL based on category id
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}`
                    + `&page=${thePage}&size=${thePageSize}`;
    
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient
      .get<GetResponseProducts>(searchUrl)
      .pipe(map(response => response._embedded.products));
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient
      .get<GetResponseProductCategory>(this.categoryUrl)
      .pipe(map((response) => response._embedded.productCategory));
  }

  getProduct(thePoductId: number): Observable<Product> {

    const productUrl = `${this.baseUrl}/${thePoductId}`;

    return this.httpClient.get<Product>(productUrl);
    // no need to unwrap the content here
  }
  
}

/*-----------------------------------------------------------------*/

//help interface to wrap the response (_embedded entry) and add it to an array
interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
      // size of the page
    size: number,
      // grand total of all elements
    totalElements: number,
      // number of pages
    totalPages: number,
      // current page
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  };
}
