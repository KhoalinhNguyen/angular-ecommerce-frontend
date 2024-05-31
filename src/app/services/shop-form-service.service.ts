import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class ShopFormServiceService {

  private countriesUrl = 'http://localhost:8080/api/countries';
  private statesUrl = 'http://localhost:8080/api/states';

  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<Country[]> {

    const x = this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map((response) => response._embedded.countries)
    );
    console.log(x);
    
    return x;
  }

  getStates(theCountryCode: string): Observable<State[]>  {

    // search url
    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;

    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response => response._embedded.states)
    )
  }

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
interface GetResponseCountries {
  _embedded: {
    // countries must match the name under _embedded
    countries: Country[];
  }
}

interface GetResponseStates {
  _embedded: {
    states: State[];
  }
}
