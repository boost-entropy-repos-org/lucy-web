import { Injectable } from '@angular/core';
import { Observation } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  public isValidNumber(string: string): boolean {
    const toNumber: number = +string;
    return toNumber ? true : false;
  }

  public isValidInteger(string: string): boolean {
    const service = new ValidationService();
    return (service.isValidNumber(string) && service.decimalPlaces(string) === 0);
  }

  public isValidUTM(string: string): boolean {
    const service = this;
    // TODO: only allow 7 digits for northings, 6 digits for eastings
    return (service.isValidNumber(string));
  }

  public hasMinDecimalPlaces(number: any, minDecimals: number): boolean {
    const service = new ValidationService();
    const numberOfDecimals = service.decimalPlaces(number);
    return numberOfDecimals >= minDecimals;
  }

  /**
   * TODO: Refactor
   * From:
   * https://stackoverflow.com/questions/9539513/is-there-a-reliable-way-in-javascript-to-obtain-the-number-of-decimal-places-of
   * @param n number of decimals
   */
  private decimalPlaces(n: any) {
    const s = `` + (+n);
    const match = /(?:\.(\d+))?(?:[eE]([+\-]?\d+))?$/.exec(s);
    if (!match) { return 0; }
    return Math.max(0,
      (match[1] === '0' ? 0 : (match[1] || '').length)
      - (+match[2] || 0));
  }

  /**
   * TODO: Refactor/ find better validation
   * Allow 5 or more decimal place
   * @param latitude string - * use String(number) if needed.
   */
  public isValidLatitude(latitude: string) {
    const regexpOne = new RegExp('^[+-]?((90\\.?0*$)|(([0-8]?[0-9])\\.?[0-9]*$))');
    const regexpOneResult = regexpOne.test(latitude);
    // console.log(regexpOneResult);
    return regexpOneResult;

    const regexpTwo = new RegExp('^(\\+|-)?(\\d\.\\d{1,6}|[1-8]\\d\\.\\d{1,6}|90\\.0{1,6})$');
    const regexpTwoResult = regexpTwo.test(latitude);
    console.log(regexpTwoResult);

    if (!regexpTwoResult || !regexpOneResult) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * TODO: Refactor/ find better validation
   * Allow 5 or more decimal places
   * @param longitude string - * use String(number) if needed.
   */
  public isValidLongitude(longitude: string) {
    const regexpOne = new RegExp('^-?([1]?[1-7][1-9]|[1]?[1-8][0]|[1-9]?[0-9])\\.{1}\\d{1,6}');
    const regexpOneResult = regexpOne.test(longitude);
    console.log(regexpOneResult);

    const regexpTwo = new RegExp('^[+-]?((180\\.?0*$)|(((1[0-7][0-9])|([0-9]{0,2}))\\.?[0-9]*$))');
    const regexpTwoResult = regexpTwo.test(longitude);
    console.log(regexpTwoResult);

    if (!regexpTwoResult || !regexpOneResult) {
      return false;
    } else {
      return true;
    }
  }

  public isValidObservationMessage(observation: Observation): string | null {
    if (!observation) { return `Object does not exist`; }
    const service = new ValidationService();
    if (!service.hasMinDecimalPlaces(observation.lat, 6) || !service.hasMinDecimalPlaces(observation.long, 6)) {
      return `Location is invalid`;
    }

    if (observation.invasivePlantSpecies.length < 1) {
      return `You must add an invasive plant species`;
    }

    for (const species of observation.invasivePlantSpecies) {
      if (!species.width || !species.length) {
        return `You must specify Plot for invasive plant species`;
      }

      if (!species.jurisdiction) {
        return `You must add a jurisdiction for invasive plant species`;
      }

      if (!species.species) {
        return `You must add a plant species for invasive plant species`;
      }
    }
    return null;
  }
}
