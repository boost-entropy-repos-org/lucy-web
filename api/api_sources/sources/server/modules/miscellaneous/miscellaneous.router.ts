//
// Route controller for any route miscellaneous route paths
//
// Copyright © 2019 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Created by Pushan Mitra on 2019-05-10.

// TODO: Create Version routes and other generic info routes

/**
 * Import
 */
import * as express from 'express';
import * as assert from 'assert';
import { errorBody} from '../../core';

export const miscellaneous = () => {};

export const defaultRoute = () => {
    const route = express.Router();
    route.all('*', (_req, _res) => {
        assert(_req);
        _res.status(404).json(errorBody('Route Not Found', []));
    });
    return route;
};
// -----------------------------------------------------------------------------------------------------------

