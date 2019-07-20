import { MovieService } from './movie.service';
import { MovieContainerComponent } from './movie-container/movie-container.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    component: MovieContainerComponent
  }
];


@NgModule({
  declarations: [MovieCardComponent, MovieContainerComponent, MovieDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  providers: [MovieService],
  entryComponents: [MovieDetailsComponent],

})
export class MovieModule { }
