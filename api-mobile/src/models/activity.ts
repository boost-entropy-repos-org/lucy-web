import { SEARCH_LIMIT_MAX } from '../constants/misc';
import { parseBase64DataURLString } from './../utils/file-utils';

/**
 * A single media item.
 *
 * @export
 * @interface IMediaItem
 */
export interface IMediaItem {
  media_date?: string;
  description?: string;
  file_name: string;
  encoded_file: string;
}

/**
 * Media object for Data URL base64 encoded files.
 *
 * @export
 * @class MediaBase64
 */
export class MediaBase64 {
  mediaName: string;
  contentType: string;
  contentString: string;
  mediaBuffer: Buffer;
  mediaDescription: string;
  mediaDate: string;

  /**
   * Creates an instance of MediaBase64.
   *
   * @param {IMediaItem} obj
   * @memberof MediaBase64
   */
  constructor(obj: IMediaItem) {
    if (!obj) {
      throw new Error('media was null');
    }

    const base64StringParts = parseBase64DataURLString(obj.encoded_file);

    if (!base64StringParts) {
      throw new Error('media encoded_file could not be parsed');
    }

    this.contentType = base64StringParts.contentType;
    this.contentString = base64StringParts.contentType;
    this.mediaName = obj.file_name;
    this.mediaBuffer = Buffer.from(base64StringParts.contentString, 'base64');
    this.mediaDescription = obj.description || null;
    this.mediaDate = obj.media_date || null;
  }
}

/**
 * Activity post request body.
 *
 * @export
 * @class ActivityPostRequestBody
 */
export class ActivityPostRequestBody {
  activityPostBody: object;
  activityResponseBody: object;

  activity_type: string;
  activity_subtype: string;

  activity_data: object;
  activity_type_data: object;
  activity_subtype_data: object;

  received_timestamp: string;

  geoJSONFeature: GeoJSON.Feature[];

  mediaKeys: string[];

  /**
   * Creates an instance of ActivityPostRequestBody.
   *
   * @param {*} [obj]
   * @memberof ActivityPostRequestBody
   */
  constructor(obj?: any) {
    // Add whole original object for auditing
    this.activityPostBody = {
      ...obj,
      // Strip out any media base64 strings which would convolute the record
      media:
        (obj.media &&
          obj.media.map((item: IMediaItem) => {
            delete item.encoded_file;
            return item;
          })) ||
        []
    };

    this.activity_type = (obj && obj.activity_type) || null;
    this.activity_subtype = (obj && obj.activity_subtype) || null;

    this.activity_data = (obj && obj.form_data && obj.form_data.activity_data) || null;
    this.activity_type_data = (obj && obj.form_data && obj.form_data.activity_type_data) || null;
    this.activity_subtype_data = (obj && obj.form_data && obj.form_data.activity_subtype_data) || null;

    this.received_timestamp = new Date().toISOString();

    this.geoJSONFeature = (obj && obj.geometry) || [];

    this.mediaKeys = (obj && obj.mediaKeys) || null;
  }
}

/**
 * Activity search filter criteria object.
 *
 * @export
 * @class ActivitySearchCriteria
 */
export class ActivitySearchCriteria {
  page: number;
  limit: number;

  activity_type: string;
  activity_subtype: string;

  date_range_start: Date;
  date_range_end: Date;

  search_polygon: GeoJSON.Polygon;

  /**
   * Creates an instance of ActivitySearchCriteria.
   *
   * @param {*} [obj]
   * @memberof ActivitySearchCriteria
   */
  constructor(obj?: any) {
    this.page = (obj && obj.page && this.setPage(obj.page)) || 0;
    this.limit = (obj && obj.limit && this.setLimit(obj.limit)) || SEARCH_LIMIT_MAX;

    this.activity_type = (obj && obj.activity_type) || null;
    this.activity_subtype = (obj && obj.activity_subtype) || null;

    this.date_range_start = (obj && obj.date_range_start) || null;
    this.date_range_end = (obj && obj.date_range_end) || null;

    this.search_polygon = (obj && obj.search_polygon) || null;
  }

  setPage(page: number): number {
    if (!page || page < 0) {
      return 0;
    }

    return page;
  }

  setLimit(limit: number): number {
    if (!limit || limit < 0) {
      return 25;
    }

    if (limit > SEARCH_LIMIT_MAX) {
      return SEARCH_LIMIT_MAX;
    }

    return limit;
  }
}
