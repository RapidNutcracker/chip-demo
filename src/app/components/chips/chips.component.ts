import { Component, OnInit, KeyValueDiffers } from '@angular/core';
import { MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { ActivatedRoute, Router } from '@angular/router';

interface Thing {
    name: string;
    color: string;
}

@Component({
    selector: 'app-chips',
    templateUrl: './chips.component.html',
    styleUrls: ['./chips.component.scss']
})
export class ChipsComponent implements OnInit {
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    category: string;
    otherCategory: string;
    displayThings: Thing[];

    filters: string[];
    allFilters: string;

    things = {
        fruits: [
            { name: 'Lemon', color: 'yellow' },
            { name: 'Lime', color: 'green' },
            { name: 'Apple', color: 'red' },
        ],
        vegetables: [
            { name: 'Broccoli', color: 'green' },
            { name: 'Celery', color: 'green' },
            { name: 'Zucchini', color: 'green' },
            { name: 'Sweet Potato', color: 'orange' },
        ]
    };

    private order: string;

    constructor(private route: ActivatedRoute, private router: Router) {
        this.route.params.subscribe(params => {
            this.category = params.category;
            this.otherCategory = this.category === 'fruits' ? 'vegetables' : 'fruits';
            this.displayThings = this.things[this.category];
        });

        this.route.queryParams.subscribe(queryParams => {
            console.log(queryParams);

            this.displayThings = this.things[this.category];
            this.filters = Object.entries(queryParams).flatMap(([key, value]) => {

                if (Array.isArray(value)) {
                    return value.map(v => `${key}=${v}`);
                }

                return `${key}=${value}`;
            });
            console.log(this.filters);

            this.allFilters = this.filters.join('&');

            this.order = queryParams.order;
            if (this.order === 'asc') {
                this.displayThings = this.displayThings.sort((a, b) => a.name.localeCompare(b.name));
            } else if (this.order === 'desc') {
                this.displayThings = this.displayThings.sort((a, b) => b.name.localeCompare(a.name));
            }

            if (queryParams.color) {
                this.displayThings = this.displayThings.filter((thing: Thing) => queryParams.color.indexOf(thing.color) > -1);
            }
        });
    }

    ngOnInit() { }

    remove(thing: any): void {
        const index = this.filters.indexOf(thing);

        if (index >= 0) {
            this.filters.splice(index, 1);
            this.allFilters = this.filters.join('&');
            this.updateFilters(this.allFilters);
        }
    }

    updateFilters(newFilterString: string) {

        const newParams: any = {};
        const splitFilters = newFilterString.split('&').map(filter => filter.split('='));
        splitFilters.forEach(([key, value]) => {
            if (newParams[key]) {
                newParams[key] = [newParams[key], value].flat(1);
            } else {
                newParams[key] = value;
            }
        });

        console.log(newParams);


        this.router.navigate(['.'], { relativeTo: this.route, queryParams: newParams });
    }

    clearFilters() {
        this.updateFilters('');
    }

    goToOther() {
        this.router.navigate([`/chips/${this.otherCategory}`], { queryParams: this.route.snapshot.queryParams });
    }
}
