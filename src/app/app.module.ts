import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from './services/product.service';
import { Routes, RouterModule, Router } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';

const routes: Routes = [
  // path to match      when path matches, create new instance of component
  {path:'category/:id', component: ProductListComponent},
  {path:'category/', component: ProductListComponent},
  {path:'products', component: ProductListComponent},
  {path:'', redirectTo: '/products', pathMatch: 'full'},
  {path:'**', redirectTo: '/products', pathMatch: 'full'}
  // ** is the generic wild card, it will match on anything didnt match the above routes
  //order of routes is important, first match wins --> start fromt he most specific
];
@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule
  ],
  providers: [ProductService], // service in provider wiil be able to be injected by other components
  bootstrap: [AppComponent]
})
export class AppModule { }
