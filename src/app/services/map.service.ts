import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AllData, LineName, LineRoute, Parking } from '@models/interfaces';
import { Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { environment } from '@environments/environment.prod';
import { FindLineRoute } from '@models/interfaces/find-line-route';
import { BusStop } from '../home/map/map.component';

@Injectable({
  providedIn: 'root',
})
export class MapService extends Socket {
  constructor() {
    super({
      url: `${environment.apiBaseUrl}/parkings`,
    });
    this.onParkingsUpdate();
  }

  private http = inject(HttpClient);

  onParkingsUpdate() {
    return this.fromEvent<Parking[]>('update');
  }

  getAll(): Observable<AllData> {
    return this.http.get<AllData>(`${environment.apiBaseUrl}/api/root`);
  }

  findLineNamesNearStop(busStop: BusStop) {
    return this.http.get<LineName[]>(
      `${environment.apiBaseUrl}/api/lines-names?stop_lat=${busStop.stopLat}&stop_lon=${busStop.stopLon}`
    );
  }

  findLineRoute(findLineRoute: FindLineRoute): Observable<LineRoute> {
    return this.http.post<LineRoute>(
      `${environment.apiBaseUrl}/api/lines-routes/find-line-route`,
      findLineRoute
    );
  }
}
