import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Option } from '@home/map/map.component';
import { AllData } from '@models/interfaces';

export interface OptionSelectedEvent {
  child?: Option;
  option?: string;
  show?: boolean;
}

@Component({
  selector: 'leaflet-panel-layers',
  standalone: true,
  imports: [],
  templateUrl: './leaflet-panel-layers.component.html',
  styleUrl: './leaflet-panel-layers.component.scss',
})
export class LeafletPanelLayersComponent {
  @Input() allData!: AllData;
  @Input() showBusesOption!: boolean;
  @Output() showBusesOptionChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Input() optionsMap!: {
    [k: string]: Option;
  };
  @Output() optionsMapChange: EventEmitter<{
    [k: string]: Option;
  }> = new EventEmitter<{
    [k: string]: Option;
  }>();
  groupsMap: {
    [k: string]: boolean;
  } = {
    educationCentersGroups: false,
    trafficLightsGroups: false,
  };

  selectOption(option: string, event: any, allGroup?: boolean, child?: Option) {
    const show = event.target.checked;
    if (child) {
      const index = this.optionsMap[option].children!.indexOf(child);
      this.optionsMap[option].children![index] = {
        show: show,
        layer: child.layer,
      };
      this.groupsMap[option] = this.optionsMap[option].children?.every(
        (value) => value.show === true
      )!;
    } else {
      if (!allGroup) {
        this.optionsMap[option].show = show;
      } else {
        this.optionsMap[option].children = this.optionsMap[
          option
        ].children!.map((element) => {
          return {
            show,
            layer: element.layer,
          };
        });
        this.groupsMap[option] = show;
      }
    }
  }

  constructor(){
    this.expandedIndices.add(0);
  }

  selectBus(event: any) {
    const show = event.target.checked;
    this.showBusesOption = show;
    this.showBusesOptionChange.emit(this.showBusesOption);
  }

  expandedIndices: Set<number> = new Set();

  toggleCollapse(index: number) {
    if (this.expandedIndices.has(index)) {
      this.expandedIndices.delete(index);
    } else {
      this.expandedIndices.add(index);
    }
  }

  isExpanded(index: number): boolean {
    return this.expandedIndices.has(index);
  }
}
