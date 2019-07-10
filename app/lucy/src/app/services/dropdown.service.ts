import { Injectable } from '@angular/core';
import { Jurisdiction, InvasivePlantSpecies } from '../models';
import { AppConstants } from '../constants';
import { ApiService, APIRequestMethod } from './api.service';
import { ObjectValidatorService } from './object-validator.service';

export interface DropdownObject {
  name: string;
  object: any;
}

@Injectable({
  providedIn: 'root'
})

export class DropdownService {

  public displayedJuristictionsField = `code`;
  public displayedInvasivePlantspeciesField = `latinName`;

  /**
   * TODO: Everything is Incomplete
   */
  private juristictions: Jurisdiction[];
  private invasivePlantSpecies: InvasivePlantSpecies[];
  private surveyModes: string[];
  private soilTextureCodes: string[];
  private specificUseCodes: string[];
  private distributions: string[];
  private densities: string[];
  private test: DropdownObject[];

  private codeTables: any| null = null;

  constructor(private api: ApiService, private objectValidator: ObjectValidatorService) { }

  private async getCodes(): Promise<any | null> {
    if (this.codeTables !== null) {
      return this.codeTables;
    }

    const response = await this.api.request(APIRequestMethod.GET, AppConstants.API_observationCodes, null);
    if (response.success) {
      this.codeTables = response.response;
      return response.response;
    } else {
      return null;
    }
  }

  public createDropdownObjectsFrom(objects: any[], displayValue: string): DropdownObject[] {
    const dropdownObjects: DropdownObject[] = [];
    for (const object of objects) {
      dropdownObjects.push( {
        name: object[displayValue],
        object: object,
      });
    }
    return dropdownObjects;
  }

  /**
   * 
   */
  public async getJuristictions(): Promise<DropdownObject[]> {
    if (this.juristictions && this.juristictions.length > 0 ) {
      return this.createDropdownObjectsFrom(this.juristictions, this.displayedJuristictionsField);
    }

    const codes = await this.getCodes();
    if (codes === null) {
       return [];
    }

    const juristictionCodes = codes['jurisdictionCodes'];
    if ( juristictionCodes && (Array.isArray(juristictionCodes) && this.objectValidator.isJurisdictionObject(juristictionCodes[0]))) {
      this.juristictions = juristictionCodes;
      return this.createDropdownObjectsFrom(juristictionCodes, this.displayedJuristictionsField);
    }
  }

  /**
   * 
   */
  public async getInvasivePlantSpecies(): Promise<DropdownObject[]> {
    if (this.invasivePlantSpecies && this.invasivePlantSpecies.length > 0 ) {
      return this.createDropdownObjectsFrom(this.invasivePlantSpecies, this.displayedInvasivePlantspeciesField);
    }

    const codes = await this.getCodes();
    if (codes === null) {
       return [];
    }

    const speciesCodes = codes['speciesList'];
    if ( speciesCodes && (Array.isArray(speciesCodes) && this.objectValidator.isInvasivePlantSpeciesObject(speciesCodes[0]))) {
      this.invasivePlantSpecies = speciesCodes;
      return this.createDropdownObjectsFrom(speciesCodes, this.displayedInvasivePlantspeciesField);
    }
  }

  /**
   * TODO: Incomplete
   */
  public async getSurveyModes(): Promise<DropdownObject[]> {
    return this.getDummyDropdownObjects();
  }

   /**
   * TODO: Incomplete
   */
  public async getSoilTextureCodes(): Promise<DropdownObject[]> {
    return this.getDummyDropdownObjects();
  }

   /**
   * TODO: Incomplete
   */
  public async getSpecificUseCodes(): Promise<DropdownObject[]> {
    return this.getDummyDropdownObjects();
  }

   /**
   * TODO: Incomplete
   */
  public async getDistributions(): Promise<DropdownObject[]> {
    return this.getDummyDropdownObjects();
  }

  /**
   * TODO: Incomplete
   */
  public async getDensities(): Promise<DropdownObject[]> {
    return this.getDummyDropdownObjects();
  }

  /**
   * Return array of dropdowns to use for testing.
   */
  public async getDummyDropdownObjects(): Promise<DropdownObject[]> {
    const dropdownObjects: DropdownObject[] = [];
    dropdownObjects.push( {
      name: `NOT YET IMPLEMENTED.`,
      object: 'item Zero',
    });
    dropdownObjects.push( {
      name: `Item One`,
      object: 'item One',
    });
    dropdownObjects.push( {
      name: `Item Two`,
      object: 'item Two',
    });
    dropdownObjects.push( {
      name: `Item Three`,
      object: 'item Three',
    });
    dropdownObjects.push( {
      name: `Item Four`,
      object: 'item Four',
    });
    return dropdownObjects;
  }
}
