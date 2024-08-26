import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { LineName, LineRoute } from '@models/interfaces';
import { Subscription } from 'rxjs';
import { MapService } from '@services/map.service';
import { FindLineRoute } from '@models/interfaces/find-line-route';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-lines',
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
  templateUrl: './lines.component.html',
  styleUrl: './lines.component.scss',
})
export class LinesComponent implements OnInit, OnDestroy {
  @Input() linesNames!: LineName[];
  result: LineName[] = [];

  @Input() lineRouteSelected!: LineRoute;
  @Output() lineRouteSelectedChange: EventEmitter<LineRoute> =
    new EventEmitter<LineRoute>();

  searchText: string = '';

  isSmallScreen = false;
  private subscription!: Subscription;
  mapService = inject(MapService);
  isLoading = false;

  constructor(
    private readonly breakpointObserver: BreakpointObserver,
    private readonly spinner: NgxSpinnerService
  ) {
    this.subscription = breakpointObserver
      .observe([Breakpoints.HandsetPortrait])
      .subscribe({
        next: (result) => {
          this.isSmallScreen = result.matches;
        },
      });
  }

  ngOnInit(): void {
    this.result = this.linesNames;
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
        this.lineRouteSelected = response;
        this.lineRouteSelectedChange.emit(this.lineRouteSelected);
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
