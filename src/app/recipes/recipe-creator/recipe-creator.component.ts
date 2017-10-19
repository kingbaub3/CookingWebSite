import { Component, Inject, OnInit } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

import { Recipe } from './../shared/recipe.model';
import { Genres } from './../genre/shared/genre.service';
import { ApiSpecificRecipeService } from './../shared/api-specific-recipe.service';
import { RecipesService } from './../shared/recipes.service';
import { MinutesToTimeConverter } from './../../utils/minutes-to-time-converter';

@Component({
  selector: 'recipe-creator',
  templateUrl: 'recipe-creator.html',
  styleUrls: ['recipe-creator.css']
})
export class RecipeCreator{
  recipe = new Recipe();
  GENRES = Genres.get();
  NUMBER_OF_TABS = 2;
  selectedTab = 0;
  image = [];
  displayedImage: any = '../../../assets/food-plate.png';
  converter = new MinutesToTimeConverter();
  // Text to display wether we are on edit or create mode.
  isEdit: boolean;
  finishButtonText = "Créer";
  windowTitle = "Création d'une recette";

  constructor(private dialogRef: MdDialogRef<RecipeCreator>,
              private recipeApi:ApiSpecificRecipeService,
              private recipesService:RecipesService,
              @Inject(MD_DIALOG_DATA) private data: any) {}

  ngOnInit() {
    this.isEdit = this.data;
    // If the window has been open to edit a recipe.
    if(this.isEdit) {
      // Fetch the full recipe from the api.
      this.finishButtonText = "Modifier";
      this.windowTitle = "Modification d'une recette";

      this.recipeApi.getRecipe(this.data.recipeId)
                    .subscribe(recipe => this.recipe = recipe);
    }
    // else, the window is already set up for recipe creation.
  }

  goToNextTab() {
    this.selectedTab++;
  }

  createRecipe() {
    this.recipesService.addRecipe(this.recipe);
    this.closeDialog();
  }

  updateRecipe() {
    this.recipesService.updateRecipe(this.recipe._id, this.recipe);
    this.closeDialog();
  }

  deleteRecipe() {
    alert("Delete functionality is not yet implemented.");
  }

  updateImage(fileInput: any): void {
    console.log(fileInput.target.files);

    if (fileInput.target.files && fileInput.target.files[0]) {
      // I create two file reader. One for the backend image (an array buffer)
      // and one for the image display (a data url).
      const backendImageReader = new FileReader();
      const displayedImageReader = new FileReader();

      backendImageReader.onload = ((e) => {
        this.image = e.target['result'];
      });

      displayedImageReader.onload = ((e) => {
        this.displayedImage = e.target['result'];
      });

      backendImageReader.readAsArrayBuffer(fileInput.target.files[0]);
      displayedImageReader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
