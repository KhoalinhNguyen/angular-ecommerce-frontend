import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopFormServiceService {

  constructor() { }

  getCreditCardMonths(startMonth: number): Observable<number[]> {

    let data: number[] = [];

    // build and array for "Month" drop down lost
    // - start at current month and loop until

    for(let theMonth = startMonth; theMonth <= 12; theMonth++)  {
      data.push(theMonth);
    }

    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    
    let data: number[] = [];

    // build an array for "Year" drop down list

    const currentYear: number = new Date().getFullYear();
    const endYear: number = currentYear + 10;

    for(let theYear = currentYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }

    return of(data);
  }
}
