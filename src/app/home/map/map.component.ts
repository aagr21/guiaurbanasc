import { Component, inject, Input, OnInit } from '@angular/core';
import {
  geoJSON,
  latLng,
  Layer,
  Map,
  MapOptions,
  tileLayer,
  LatLng,
  marker,
  icon,
} from 'leaflet';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { LeafletPanelLayersComponent, OptionSelectedEvent } from './controls';
import { AllData } from '@models/interfaces';
import { Feature, Geometry, Point } from 'geojson';
import { MapService } from '@services/map.service';
import { MatDialog } from '@angular/material/dialog';
import { CameraDialogComponent } from './dialogs/camera-dialog/camera-dialog.component';

export interface Option {
  show?: boolean;
  layer?: Layer;
  children?: Option[];
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [LeafletModule, LeafletPanelLayersComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements OnInit {
  map!: Map;
  @Input() allData!: AllData;

  googleMapsLayer = tileLayer(
    'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    {
      maxZoom: 22,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }
  );

  options: MapOptions = {
    zoom: 13,
    center: latLng(-17.779223, -63.18164),
    attributionControl: false,
    maxBoundsViscosity: 1.0,
    zoomAnimation: true,
  };

  baseLayers: { [name: string]: Layer } = {
    'Google Maps': this.googleMapsLayer,
    'Google Satélite': tileLayer(
      'https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
      {
        maxZoom: 22,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }
    ),
    'Open Street Map': tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 20,
      }
    ),
  };
  optionsMap!: {
    [k: string]: Option;
  };
  mapService = inject(MapService);

  educationCentersGroupsObj: { [p: string]: string } = {
    'MÓDULOS EDUCATIVOS': 'MÓDULO EDUCATIVO',
    'COLEGIOS PRIVADOS': 'COLEGIO PRIVADO',
    'EDUCACIÓN ESPECIAL': 'EDUCACIÓN ESPECIAL',
    UNIVERSIDADES: 'UNIVERSIDAD',
    INSTITUTOS: 'INSTITUTO',
    'EDUCACIÓN COMPLEMENTARIA': 'EDUCACIÓN COMPLEMENTARIA',
  };
  dialog = inject(MatDialog);

  onEachFeature(feature: Feature<Geometry, any>, layer: Layer): void {
    layer.on({
      click: (e) => {
        const dialogRef = this.dialog.open(CameraDialogComponent, {
          data: feature.properties,
        });
        dialogRef.afterOpened().subscribe((_) => {
          setTimeout(() => {
            dialogRef.close();
          }, 30000);
        });
      },
    });
  }

  ngOnInit(): void {
    this.optionsMap = {
      busStops: {
        show: false,
        layer: geoJSON(
          {
            type: 'FeatureCollection',
            features: this.allData.busStops.map((element) => {
              return {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: element.geom.coordinates,
                },
                properties: {},
              };
            }),
          } as any,
          {
            pointToLayer(_: Feature<Point, any>, latlng: LatLng) {
              return marker(latlng, {
                icon: icon({
                  iconSize: [27, 27],
                  iconUrl: '/assets/images/bus-stop.svg',
                }),
              });
            },
          }
        ),
      },
      cityCameras: {
        show: false,
        layer: geoJSON(
          {
            type: 'FeatureCollection',
            features: this.allData.cityCameras.map((element) => {
              return {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: element.geom.coordinates,
                },
                properties: {
                  location: element.location,
                  camera: element.id,
                  urlVideo: '/assets/videos/traffic.mp4',
                },
              };
            }),
          } as any,
          {
            pointToLayer(_: Feature<Point, any>, latlng: LatLng) {
              return marker(latlng, {
                icon: icon({
                  iconSize: [52, 52],
                  iconUrl: '/assets/images/camera.svg',
                }),
              });
            },
            onEachFeature: this.onEachFeature.bind(this),
          }
        ),
      },
      parkings: {
        show: false,
        layer: geoJSON(
          {
            type: 'FeatureCollection',
            features: this.allData.parkings.map((element) => {
              return {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: element.geom.coordinates,
                },
                properties: {
                  isFree: !element.isFull,
                  imageUrl: element.imageUrl,
                },
              };
            }),
          } as any,
          {
            pointToLayer(feature: Feature<Point, any>, latlng: LatLng) {
              return marker(latlng, {
                icon: icon({
                  iconSize: [18, 18],
                  iconUrl: `/assets/images/${
                    feature.properties.isFree ? 'parking-free' : 'parking-full'
                  }.svg`,
                }),
              });
            },
            onEachFeature(feature, layer) {
              layer.bindPopup(`
                <style>
                  .image-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 200px;
                    background-color: #ffffff;
                    margin-bottom: 10px;
                    margin-left: 0;
                    margin-right: 0;
                  }

                  .image {
                    max-height: 100%;
                    max-width: 100%;
                    height: auto;
                    width: auto;
                  }
                </style>
                <div class='image-container'>
                <img src='${feature.properties.imageUrl}' class='image my-2' loading='lazy'>
                </div>
                `);
            },
          }
        ),
      },
      channelsRoutes: {
        show: false,
        layer: geoJSON(
          {
            type: 'FeatureCollection',
            features: this.allData.channelsRoutes.map((element) => {
              return {
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: element.geom.coordinates,
                },
                properties: { strokeColor: element.color },
              };
            }),
          } as any,
          {
            style(feature) {
              return {
                color: feature!.properties.strokeColor,
                weight: 3.5,
              };
            },
          }
        ),
      },
      educationCentersGroups: {
        children: this.allData.educationCentersGroups.map((group) => {
          return {
            show: false,
            layer: geoJSON(
              {
                type: 'FeatureCollection',
                features: group.educationCenters.map((element) => {
                  return {
                    type: 'Feature',
                    geometry: {
                      type: 'Point',
                      coordinates: element.geom.coordinates,
                    },
                    properties: {
                      name: `${this.educationCentersGroupsObj[group.type]}: ${
                        element.name
                      }`,
                    },
                  };
                }),
              } as any,
              {
                pointToLayer(_: Feature<Point, any>, latlng: LatLng) {
                  return marker(latlng, {
                    icon: icon({
                      iconSize: [24, 24],
                      iconUrl: '/assets/images/education.svg',
                    }),
                  });
                },
                onEachFeature(feature, layer) {
                  layer.bindPopup(feature.properties.name);
                },
              }
            ),
          };
        }),
      },
      trafficLightsGroups: {
        children: this.allData.trafficLightsGroups.map((group) => {
          return {
            show: false,
            layer: geoJSON(
              {
                type: 'FeatureCollection',
                features: group.trafficLights.map((element) => {
                  return {
                    type: 'Feature',
                    geometry: {
                      type: 'Point',
                      coordinates: element.geom.coordinates,
                    },
                    properties: {
                      location: element.location,
                    },
                  };
                }),
              } as any,
              {
                pointToLayer(_: Feature<Point, any>, latlng: LatLng) {
                  return marker(latlng, {
                    icon: icon({
                      iconSize: [29, 29],
                      iconUrl: '/assets/images/traffic-light.svg',
                    }),
                  });
                },
                onEachFeature(feature, layer) {
                  layer.bindPopup(feature.properties.location);
                },
              }
            ),
          };
        }),
      },
      speedReducersGroups: {
        children: this.allData.speedReducersGroups.map((group) => {
          return {
            show: false,
            layer: geoJSON(
              {
                type: 'FeatureCollection',
                features: group.speedReducers.map((element) => {
                  return {
                    type: 'Feature',
                    geometry: {
                      type: 'Point',
                      coordinates: element.geom.coordinates,
                    },
                    properties: {
                      location: element.location,
                    },
                  };
                }),
              } as any,
              {
                pointToLayer(_: Feature<Point, any>, latlng: LatLng) {
                  return marker(latlng, {
                    icon: icon({
                      iconSize: [23, 23],
                      iconUrl: '/assets/images/bump.svg',
                    }),
                  });
                },
                onEachFeature(feature, layer) {
                  layer.bindPopup(feature.properties.location);
                },
              }
            ),
          };
        }),
      },
    };
    this.mapService.onUpdate().subscribe({
      next: (response) => {
        this.allData.parkings = response;
        this.optionsMap['parkings'].layer = geoJSON(
          {
            type: 'FeatureCollection',
            features: this.allData.parkings.map((element) => {
              return {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: element.geom.coordinates,
                },
                properties: {
                  isFree: !element.isFull,
                  imageUrl: element.imageUrl,
                },
              };
            }),
          } as any,
          {
            pointToLayer(feature: Feature<Point, any>, latlng: LatLng) {
              return marker(latlng, {
                icon: icon({
                  iconSize: [18, 18],
                  iconUrl: `/assets/images/${
                    feature.properties.isFree ? 'parking-free' : 'parking-full'
                  }.svg`,
                }),
              });
            },
            onEachFeature(feature, layer) {
              layer.bindPopup(`
                <style>
                  .image-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 200px;
                    background-color: #ffffff;
                    margin-bottom: 10px;
                    margin-left: 0;
                    margin-right: 0;
                  }

                  .image {
                    max-height: 100%;
                    max-width: 100%;
                    height: auto;
                    width: auto;
                  }
                </style>
                <div class='image-container'>
                <img src='${feature.properties.imageUrl}' class='image my-2'>
                </div>
                `);
            },
          }
        );
      },
    });
  }

  optionSelected(event: OptionSelectedEvent) {
    if (event.option === 'educationCentersGroups') {
    }
    this.optionsMap[event.option!].show = event.show;
  }

  styleMap() {
    return 'height: 100%; width: 100%';
  }

  onMapReady(map: Map) {
    this.map = map;
  }
}
