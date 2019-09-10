/*
 * Copyright © 2019 Province of British Columbia
 * Licensed under the Apache License, Version 2.0 (the "License")
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * **
 * http://www.apache.org/licenses/LICENSE-2.0
 * **
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * File: treatment.spec.ts
 * Project: lucy
 * File Created: Monday, 12th August 2019 11:05:15 am
 * Author: pushan
 * -----
 * Last Modified: Monday, 12th August 2019 11:05:23 am
 * Modified By: pushan
 * -----
 */
/**
 * Imports
 */
import { expect, should } from 'chai';
import { commonTestSetupAction, commonTestTearDownAction } from '../../test-helpers/testHelpers';
import {
    mechanicalTreatmentFactory,
    destroyMechanicalTreatment,
    mechanicalTreatmentCreateSpecFactory,
    userFactory,
    mechanicalTreatmentUpdateSpecFactory,
    destroyObservation,
    mechanicalMethodCodeFactory,
    mechanicalDisposalMethodCodeFactory,
    mechanicalSoilDisturbanceCodeFactory,
    mechanicalRootRemovalCodeFactory,
    mechanicalTreatmentIssuesCodeFactory
} from '../factory';
import {
    MechanicalTreatmentController,
    MechanicalTreatment,
    User,
    UserDataController,
    MechanicalTreatmentUpdateSpec,
    ObservationController,
    Observation,
    MechanicalMethodCode,
    MechanicalDisposalMethodCode,
    MechanicalSoilDisturbanceCode,
    MechanicalRootRemovalCode,
    MechanicalTreatmentIssueCode
} from '../models';
import { Destroy } from '../factory/helper';
// import { SharedDBManager } from '../dataBaseManager';

describe('Treatment Test', () => {
    before(async () => {
        await commonTestSetupAction();
    });
    after(async () => {
        await commonTestTearDownAction();
        return;
    });

    // Test0: Test Code Factory
    it('should create code factory', async () => {
        const mm: MechanicalMethodCode = await mechanicalMethodCodeFactory();
        should().exist(mm);
        should().exist(mm.mechanical_method_code_id);
        const mdc: MechanicalDisposalMethodCode = await mechanicalDisposalMethodCodeFactory();
        should().exist(mdc);
        should().exist(mdc.mechanical_disposal_method_code_id);
        const sdc: MechanicalSoilDisturbanceCode = await mechanicalSoilDisturbanceCodeFactory();
        should().exist(sdc);
        const rrc: MechanicalRootRemovalCode = await mechanicalRootRemovalCodeFactory();
        should().exist(rrc);
        const issue: MechanicalTreatmentIssueCode = await mechanicalTreatmentIssuesCodeFactory();
        should().exist(issue);
    });

    // Test1: Create Treatment fro factory
    it('should create treatment from factory', async () => {
        const f = await mechanicalTreatmentFactory();
        should().exist(f);
        const mt: MechanicalTreatment = await MechanicalTreatmentController.shared.findById(f.mechanical_treatment_id);
        should().exist(mt);
        should().exist(mt.observation);
        should().exist(mt.species);
        should().exist(mt.speciesAgency);
        should().exist(mt.mechanicalMethod);
        should().exist(mt.mechanicalDisposalMethod);
        should().exist(mt.soilDisturbance);
        should().exist(mt.rootRemoval);
        should().exist(mt.issue);
        should().exist(mt.providerContractor);
        expect(mt.observation.observation_id).to.be.equal(f.observation.observation_id);
        expect(mt.species.species_id).to.be.equal(f.species.species_id);
        expect(mt.speciesAgency.species_agency_code_id).to.be.equal(f.speciesAgency.species_agency_code_id);
        expect(mt.mechanicalMethod.mechanical_method_code_id).to.be.equal(f.mechanicalMethod.mechanical_method_code_id);
        expect(mt.mechanicalDisposalMethod.mechanical_disposal_method_code_id).to.be.equal(f.mechanicalDisposalMethod.mechanical_disposal_method_code_id);
        expect(mt.soilDisturbance.mechanical_soil_disturbance_code_id).to.be.equal(f.soilDisturbance.mechanical_soil_disturbance_code_id);
        expect(mt.rootRemoval.mechanical_root_removal_code_id).to.be.equal(f.rootRemoval.mechanical_root_removal_code_id);
        expect(mt.issue.mechanical_treatment_issue_code_id).to.be.equal(f.issue.mechanical_treatment_issue_code_id);
        expect(mt.providerContractor.treatment_provider_contractor_id).to.be.equal(f.providerContractor.treatment_provider_contractor_id);
        await destroyMechanicalTreatment(mt);
    });

    // Test2: Create Treatment with specification
    it('should create treatment with spec', async () => {
        const f = await mechanicalTreatmentCreateSpecFactory();
        const user = await userFactory();
        const obj = await MechanicalTreatmentController.shared.createNewObject(f, user);
        const mt = await MechanicalTreatmentController.shared.findById(obj.mechanical_treatment_id);
        should().exist(mt);
        should().exist(mt.observation);
        expect(mt.observation.observation_id).to.be.equal(f.observation.observation_id);
        await destroyMechanicalTreatment(mt);
    });

    // Test2: Create Treatment with specification
    it('should update treatment with spec', async () => {
        const f = await mechanicalTreatmentFactory();
        const user = await userFactory();
        const spec: MechanicalTreatmentUpdateSpec = await mechanicalTreatmentUpdateSpecFactory();
        await MechanicalTreatmentController.shared.updateObject(f, spec, user);
        const mt = await MechanicalTreatmentController.shared.findById(f.mechanical_treatment_id);
        should().exist(mt);
        should().exist(mt.observation);
        const updateObs = spec.observation || {observation_id: 0};
        expect(mt.observation.observation_id).to.be.equal(updateObs.observation_id);
        await destroyMechanicalTreatment(mt);
        await Destroy<User, UserDataController>(UserDataController.shared)(user);
        await destroyObservation(f.observation);
    });

    // Test3: Fetch Mechanical Treatments of observation
    it('should fetch MechanicalTreatment for observation with promise', async () => {
        const f = await mechanicalTreatmentFactory();
        should().exist(f);
        const obs = f.observation;
        should().exist(obs);
        let list: MechanicalTreatment[] = await obs.mechanicalTreatmentsFetcher;
        list = list.filter( t => t.mechanical_treatment_id === f.mechanical_treatment_id);
        expect(list.length).to.be.equal(1);
        await destroyMechanicalTreatment(f);
    });

    // Test3: Fetch Mechanical Treatments of observation
    it('should fetch MechanicalTreatment for observation through prop', async () => {
        const f = await mechanicalTreatmentFactory();
        should().exist(f);
        const obs = f.observation;
        const fetchObs: Observation = await ObservationController.shared.findById(obs.observation_id);
        should().exist(fetchObs);
        let list: MechanicalTreatment[] = fetchObs.mechanicalTreatments || [];
        list = list.filter( t => t.mechanical_treatment_id === f.mechanical_treatment_id);
        expect(list.length).to.be.equal(1);
        await destroyMechanicalTreatment(f);
    });

    it('should fetch treatment all', async () => {
        const f = await mechanicalTreatmentFactory();
        should().exist(f);
        const mtArray: MechanicalTreatment[] = await MechanicalTreatmentController.shared.all({});
        should().exist(mtArray);
        expect(mtArray.length).to.be.greaterThan(0);
        await destroyMechanicalTreatment(f);
    });

});

// ----------------------------------------------------------------------------------------
