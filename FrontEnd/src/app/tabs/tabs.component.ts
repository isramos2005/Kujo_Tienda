import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent {

  @Input() tabs: string[] = [];
  activeTab: string = '';

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
