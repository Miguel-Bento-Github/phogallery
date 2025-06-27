import type { Schema, Struct } from '@strapi/strapi';

export interface PhotoCameraSettings extends Struct.ComponentSchema {
  collectionName: 'components_photo_camera_settings';
  info: {
    description: 'Camera and shooting settings for photos';
    displayName: 'Camera Settings';
  };
  attributes: {
    aperture: Schema.Attribute.String;
    camera: Schema.Attribute.String;
    focalLength: Schema.Attribute.String;
    iso: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 204800;
          min: 50;
        },
        number
      >;
    lens: Schema.Attribute.String;
    shutterSpeed: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'photo.camera-settings': PhotoCameraSettings;
    }
  }
}
