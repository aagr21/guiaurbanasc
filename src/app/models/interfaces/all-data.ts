import {
  BusStop,
  ChannelRoute,
  CityCamera,
  EducationCenterGroup,
  LineName,
  Parking,
  SpeedReducerGroup,
  TrafficLightGroup,
} from '@models/interfaces';

export interface AllData {
  busStops: BusStop[];
  cityCameras: CityCamera[];
  linesNames: LineName[];
  channelsRoutes: ChannelRoute[];
  speedReducersGroups: SpeedReducerGroup[];
  trafficLightsGroups: TrafficLightGroup[];
  educationCentersGroups: EducationCenterGroup[];
  parkings: Parking[];
}
