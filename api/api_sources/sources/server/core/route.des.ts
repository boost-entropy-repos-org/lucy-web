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
 * File: route.des.ts
 * Project: lucy
 * File Created: Friday, 9th August 2019 12:17:35 pm
 * Author: pushan
 * -----
 * Last Modified: Friday, 9th August 2019 12:17:47 pm
 * Modified By: pushan
 * -----
 */
import 'reflect-metadata';
import { RouteDescription, RouteConfig } from './base.route.controller';
import { ResourceInfo } from './route.const';

const StaticConfig: {[key: string]: RouteConfig[]} = {};

export function Route (des: RouteDescription) {
    return function<T>(obj: Object, prop: string, propDes?: PropertyDescriptor) {
        /*const existing: RouteConfig[] = StaticConfig[obj.constructor.name] || [];
        existing.push({description: des, handler: prop});
        StaticConfig[obj.constructor.name] = existing;*/
        // console.dir(obj);
        // console.log(`${typeof obj} | ${obj.constructor.name}`);
        const existing: {[key: string]: RouteConfig} = obj.constructor.prototype._configMap || {};
        existing[prop] = {description: des, handler: prop};
        obj.constructor.prototype._configMap = existing;
    };
}

export function ResourceRoute(info: ResourceInfo) {
    return function(target: Function) {
        // 1. Check existing
        const existing: any = target.prototype._routeResourceInfo;
        info.createMiddleware = existing.createMiddleware || info.createMiddleware;
        info.updateMiddleware = existing.updateMiddleware || info.updateMiddleware;
        info.viewMiddleware = existing.viewMiddleware || info.viewMiddleware;
        target.prototype._routeResourceInfo = info;
        // console.dir(target);
        // console.dir(target.prototype);
    };
}

export function CreateMiddleware(middleware: () => any[]) {
    return function(target: Function) {
        // Get resource info
        if (target.prototype._routeResourceInfo) {
            const info: any = target.prototype._routeResourceInfo;
            info.createMiddleware = middleware;
        } else {
            target.prototype._routeResourceInfo = {
                createMiddleware: middleware
            };
        }
    };
}

export function UpdateMiddleware(middleware: () => any[]) {
    return function(target: Function) {
        // Get resource info
        if (target.prototype._routeResourceInfo) {
            const info: any = target.prototype._routeResourceInfo;
            info.updateMiddleware = middleware;
        } else {
            target.prototype._routeResourceInfo = {
                updateMiddleware: middleware
            };
        }
    };
}

export function ViewMiddleware(middleware: () => any[]) {
    return function(target: Function) {
        // Get resource info
        if (target.prototype._routeResourceInfo) {
            const info: any = target.prototype._routeResourceInfo;
            info.viewMiddleware = middleware;
        } else {
            target.prototype._routeResourceInfo = {
                viewMiddleware: middleware
            };
        }
    };
}

export const getRouteConfigs = (cls: any | string) => {
    const key = typeof cls === 'string' ? cls : cls.constructor.name;
    return StaticConfig[key];
};

export const getAllRouteConfig = () => StaticConfig;

//  --------------------------------------------------------
