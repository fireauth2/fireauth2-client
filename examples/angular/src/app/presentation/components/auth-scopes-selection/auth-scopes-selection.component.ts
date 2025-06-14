import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatSelectionList, MatListOption } from '@angular/material/list';
import { DiscoveryDocumentClass } from '../../../auth';

@Component({
  standalone: true,
  imports: [MatSelectionList, MatListOption, MatAccordion, MatExpansionModule],
  selector: 'fa-auth-scopes-selection',
  templateUrl: 'auth-scopes-selection.component.html',
  styleUrl: 'auth-scopes-selection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'fa-auth-scopes-selection',
  },
})
export class AuthScopeSelectionComponent {
  readonly discoveryDocuments = input<DiscoveryDocumentClass[]>([]);
}
