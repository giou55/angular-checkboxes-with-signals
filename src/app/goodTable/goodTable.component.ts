import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Signal, computed, signal } from '@angular/core';
import { IssueInterface } from './issue.interface';

interface IssueEntriesInterface {
  [key: string]: { isSelected: boolean };
}
/*
{
  c9613c41-32f0-435e-aef2-b17ce758431b: {isSelected: false},
  1f62d084-cc32-4c7b-943d-417c5dac896e: {isSelected: false},
  d4febf2b-022e-45ff-a70b-cea24234f8b5: {isSelected: false},
}
*/

@Component({
  selector: 'good-table',
  templateUrl: './goodTable.component.html',
  styleUrls: ['./goodTable.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class GoodTable implements OnInit {
  @Input({ required: true }) issues!: IssueInterface[];

  issuesSig = signal<IssueInterface[]>([]);
  issueEntriesSig = signal<IssueEntriesInterface>({});

  totalSelectedSig: Signal<number> = computed(
    () =>
      Object.values(this.issueEntriesSig()).filter(
        (issueData) => issueData.isSelected
      ).length
  );

  indeterminateSig: Signal<boolean> = computed(() => {
    const totalOpenedIssues: number = this.issuesSig().filter(
      (issue) => issue.status === 'open'
    ).length;
    return (
      this.totalSelectedSig() < totalOpenedIssues && this.totalSelectedSig() > 0
    );
  });

  ngOnInit() {
    this.issuesSig.set(this.issues);
    this.issueEntriesSig.set(this.convertIssuesToEntries(this.issues, false));
  }

  convertIssuesToEntries(
    issues: IssueInterface[],
    isSelected: boolean
  ): IssueEntriesInterface {
    const entries = issues.map((issue) => [
      issue.id,
      { isSelected: issue.status === 'open' ? isSelected : false },
    ]);
    console.log(entries);
    /*
    [
      ["c9613c41-32f0-435e-aef2-b17ce758431b", {isSelected: false}],
      ["1f62d084-cc32-4c7b-943d-417c5dac896e", {isSelected: false}],
      ["d4febf2b-022e-45ff-a70b-cea24234f8b5", {isSelected: false}],
    ]
    */

    console.log(Object.fromEntries(entries));
    /*
    {
      c9613c41-32f0-435e-aef2-b17ce758431b: {isSelected: false},
      1f62d084-cc32-4c7b-943d-417c5dac896e: {isSelected: false},
      d4febf2b-022e-45ff-a70b-cea24234f8b5: {isSelected: false},
    }
    */
    return Object.fromEntries(entries);
  }

  selectRow(issueId: string): void {
    const updatedIssueEntry = {
      ...this.issueEntriesSig()[issueId],
      isSelected: !this.issueEntriesSig()[issueId].isSelected,
    };
    const updatedIssueEntries = {
      ...this.issueEntriesSig(),
      [issueId]: updatedIssueEntry,
    };
    this.issueEntriesSig.set(updatedIssueEntries);
  }

  selectAll(event: Event): void {
    const target = event.target as HTMLInputElement;
    const updatedIssueEntries = this.convertIssuesToEntries(
      this.issuesSig(),
      target.checked
    );
    this.issueEntriesSig.set(updatedIssueEntries);
  }
}
