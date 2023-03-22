import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { ListItem } from '@reader/reader/interfaces/list-item.interface';

@Component({
  selector: 'rd-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavListComponent {
  @Input()
  items: ListItem[] = [];

  @Input()
  itemTemplate?: TemplateRef<ListItem>;

  @Output()
  itemClicked = new EventEmitter<void>();

  onItemClick(): void {
    this.itemClicked.emit();
  }
}
