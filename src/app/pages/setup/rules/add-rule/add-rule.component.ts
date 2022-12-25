import {Component, Input, OnInit} from '@angular/core';
import {Rule} from '../../../../shared/models/Rule.model';
import {ActivatedRoute} from '@angular/router';
import {RulesService} from '../../../../shared/services/rules.service';
import { Location } from '@angular/common';
import {RULES_CATEGORIES} from '../../../../shared/mocks/rules.mocks';

@Component({
  selector: 'app-add-workflow',
  templateUrl: './add-rule.component.html',
  styleUrls: ['./add-rule.component.css']
})
export class AddRuleComponent implements OnInit {
  @Input() rule: Rule;
  categories = RULES_CATEGORIES;
  constructor(private route: ActivatedRoute,
              private rulesService: RulesService,
              private location: Location) { }

  ngOnInit(): void {
    this.getRule();
  }
  getRule(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.rulesService.getRule(id)
      .subscribe(r => this.rule = r);
  }
  goBack(): void {
    this.location.back();
  }

}
