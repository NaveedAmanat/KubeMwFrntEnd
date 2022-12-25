import { Injectable } from '@angular/core';

import { CATEGORIES } from '../mocks/categories';

@Injectable()
export class CategoryProvider {

  constructor() { }

  getNameByUrl(url: string): Promise<string> {
    return Promise.resolve(CATEGORIES.get(url));
  }

}
