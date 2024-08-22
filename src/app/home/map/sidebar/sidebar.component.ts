import { Component, Input, OnDestroy } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { TitleCasePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { LineName } from '@models/interfaces';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatButton } from '@angular/material/button';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatTabsModule, MatIcon, MatButton, MatCardModule, TitleCasePipe],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnDestroy {
  @Input() linesNames!: LineName[];
  isSmallScreen = false;
  private subscription!: Subscription;

  constructor(breakpointObserver: BreakpointObserver) {
    this.subscription = breakpointObserver
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
}
