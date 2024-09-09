import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MapComponent } from '@home/map/map.component';
import { AllData } from '@models/interfaces';
import { MapService } from '@services/map.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgxSpinnerModule, MapComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  isLoading = true;

  mapsService = inject(MapService);
  allData!: AllData;
  router = inject(ActivatedRoute);
  spinner = inject(NgxSpinnerService);

  constructor() {
    const stopLat = this.router.snapshot.queryParamMap.get('stop_lat');
    const stopLon = this.router.snapshot.queryParamMap.get('stop_lon');
    if (stopLat && stopLon) {
      localStorage.setItem(
        'bus_stop',
        JSON.stringify({
          stop_lat: +stopLat,
          stop_lon: +stopLon,
        })
      );
    } else {
      if (localStorage.getItem('bus_stop')) {
        localStorage.removeItem('bus_stop');
      }
    }
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.spinner.show();
    this.mapsService.getAll().subscribe({
      next: (response) => {
        this.allData = response;
        this.isLoading = false;
        this.spinner.hide();
      },
      error: (_) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }
}
