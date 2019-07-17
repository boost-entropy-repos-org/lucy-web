import { Injectable } from '@angular/core';
import { Observation } from '../models';
import { ApiService, APIRequestMethod } from './api.service';
import { AppConstants } from '../constants';
import { ObjectValidatorService } from './object-validator.service';

@Injectable({
  providedIn: 'root'
})
export class ObservationService {

  constructor(private api: ApiService, private objectValidator: ObjectValidatorService) { }

  public async submitObservation(observation: Observation): Promise<boolean> {
    const observationBody = {
      lat: observation.lat,
      long: observation.long,
      date: `2019-05-30`
    }
    const response = await this.api.request(APIRequestMethod.POST, AppConstants.API_observation, observationBody);
    console.dir(response);
    if (response.success) {
      console.log(`observation success!!`);
      console.log(response.response[`observation_id`]);
      const observation_Id = response.response[`observation_id`];
      let failed = false;
      for (const species of observation.invasivePlantSpecies) {
        console.dir(species)
        const speciesBody = {
          observation: observation_Id,
          species: species.species.species_id,
          jurisdiction: species.jurisdiction.jurisdiction_code_id,
          width: +species.width,
          length: +species.length,
          accessDescription: species.accessDescription
        };
        const speciesResponse = await this.api.request(APIRequestMethod.POST, AppConstants.API_observationSpecies, speciesBody);
        console.dir(speciesResponse);
          if (speciesResponse.success) {
            console.log(`species success!!`);
          } else {
            console.log(`species FAIL!!`);
            failed = true;
          }
        }
        return !failed;

    } else {
      console.log(`observation FAIL!!`);
    }

    return false;
  }
}
