import { Injectable } from '@angular/core';

import { RECIPES } from '../mocks/recipes';

@Injectable()
export class RecipeProvider {

  constructor() { }

  getNameByUrl(url: string): Promise<string> {
    return Promise.resolve(RECIPES.get(url));
  }

}
