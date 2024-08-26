import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIcon } from '@angular/material/icon';
import { LineName, LineRoute } from '@models/interfaces';
import { LinesComponent } from './lines/lines.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatTabsModule, MatIcon, LinesComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  @Input() linesNames!: LineName[];
  @Input() lineRouteSelected!: LineRoute;
  @Output() lineRouteSelectedChange: EventEmitter<LineRoute> =
    new EventEmitter<LineRoute>();

  onLineRouteSelected(lineRoute: LineRoute) {
    this.lineRouteSelected = lineRoute;
    this.lineRouteSelectedChange.emit(this.lineRouteSelected);
  }  
}