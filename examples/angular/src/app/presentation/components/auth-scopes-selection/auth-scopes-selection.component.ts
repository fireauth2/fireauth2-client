import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  viewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import {
  MatListOption,
  MatSelectionList,
  MatSelectionListChange,
} from '@angular/material/list';
import { DiscoveryDocumentClass, Scope } from '../../../core/auth';

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
export class AuthScopeSelectionComponent implements AfterViewInit {
  readonly expanded = input(false, { transform: coerceBooleanProperty });
  readonly discoveryDocuments = input<DiscoveryDocumentClass[]>([]);

  readonly selectionChange = output<Scope[]>();

  private readonly selectionLists = viewChildren(MatSelectionList);

  ngAfterViewInit() {
    // Ensure initial selection emit
    queueMicrotask(() => this._emitCombinedSelection());
  }

  _onSelectionChange(_: MatSelectionListChange) {
    this._emitCombinedSelection();
  }

  private _emitCombinedSelection() {
    const selectedScopes: Scope[] = [];
    const selectionLists = this.selectionLists();

    for (const list of selectionLists) {
      for (const option of list.selectedOptions.selected) {
        const scope = option.value as Scope;
        if (scope) selectedScopes.push(scope);
      }
    }

    this.selectionChange.emit(selectedScopes);
  }
}
