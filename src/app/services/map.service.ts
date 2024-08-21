import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AllData, Parking } from '@models/interfaces';
import { Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { environment } from "@environments/environment.prod";

@Injectable({
  providedIn: 'root',
})
export class MapService extends Socket {
  constructor() {
    super({
      url: `${ environment.apiBaseUrl }/parkings`,
    });
    this.onUpdate();
  }

  private http = inject(HttpClient);

  onUpdate() {
    return this.fromEvent<Parking[]>('update');
  }

  getAll(): Observable<AllData> {
    return this.http.get<AllData>(`${ environment.apiBaseUrl }/api/root`);
  }
}
