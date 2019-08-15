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
 * File: 1565631204586-TreatmentCodes.ts
 * Project: lucy
 * File Created: Monday, 12th August 2019 10:33:24 am
 * Author: pushan
 * -----
 * Last Modified: Monday, 12th August 2019 10:34:16 am
 * Modified By: pushan
 * -----
 */

import {MigrationInterface, QueryRunner} from 'typeorm';
import { MechanicalMethodCodeSchema, getSQLFileData } from '../database-schema';

export class TreatmentCodes1565631204586 implements MigrationInterface {

    // Schemas
    mechanicalTreatmentMethodCodeSchema: MechanicalMethodCodeSchema = new MechanicalMethodCodeSchema();

    /**
     * @description Up method
     * @param QueryRunner queryRunner
     * @return Promise<any>
     */
    public async up(queryRunner: QueryRunner): Promise<any> {
        // Create Table
        await queryRunner.query(this.mechanicalTreatmentMethodCodeSchema.migrationSQL);

        // Load data
        await queryRunner.query(getSQLFileData(this.mechanicalTreatmentMethodCodeSchema.dataSQLPath()));
    }

    /**
     * @description  down method
     * @param QueryRunner queryRunner
     * @return Promise<any>
     */
    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(this.mechanicalTreatmentMethodCodeSchema.dropTable());
    }

}
