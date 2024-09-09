import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { TitleCasePipe } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { LineName } from '@models/interfaces';
import { FindLineRoute } from '@models/interfaces/find-line-route';
import { MapService } from '@services/map.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-qr-buses-stop',
  standalone: true,
  imports: [
    MatCardModule,
    TitleCasePipe,
    MatButton,
    MatFormField,
    MatInput,
    FormsModule,
    NgxSpinnerModule,
  ],
  templateUrl: './qr-buses-stop.component.html',
  styleUrl: './qr-buses-stop.component.scss',
})
export class QrBusesStopComponent implements OnDestroy {
  mapService = inject(MapService);
  linesNames!: LineName[];
  result!: LineName[];
  searchText: string = '';
  isSmallScreen = false;
  breakpointObserver = inject(BreakpointObserver);
  private subscription!: Subscription;
  isLoading = false;
  spinner = inject(NgxSpinnerService);

  constructor() {
    const busStop = JSON.parse(localStorage.getItem('bus_stop') as any);
    if (!busStop) return;
    this.mapService
      .findLineNamesNearStop({
        stopLat: busStop.stop_lat,
        stopLon: busStop.stop_lon,
      })
      .subscribe({
        next: (response) => {
          this.linesNames = response;
          this.result = response;
        },
      });
    this.subscription = this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait])
      .subscribe({
        next: (result) => {
          this.isSmallScreen = result.matches;
        },
      });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  selectLineRoute(lineName: LineName, ground: string) {
    const findLineRoute: FindLineRoute = {
      name: lineName.name,
      ground,
    };
    this.isLoading = true;
    this.spinner.show();
    this.mapService.findLineRoute(findLineRoute).subscribe({
      next: (response) => {
        // this.lineRouteSelected = response;
        // this.lineRouteSelectedChange.emit(this.lineRouteSelected);
        this.spinner.hide();
        this.isLoading = false;
      },
      error: (_) => {
        this.spinner.hide();
        this.isLoading = false;
      },
    });
  }

  search(searchText: string) {
    this.result = this.linesNames.filter((lineName) =>
      lineName.name!.includes(searchText.toUpperCase())
    );
  }

  onSearchText(searchText: string) {
    this.search(searchText);
  }
}
