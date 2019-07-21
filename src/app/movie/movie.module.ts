import { MovieService } from './movie.service';
import { MovieContainerComponent } from './movie-container/movie-container.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    component: MovieContainerComponent
  }
];


@NgModule({
  declarations: [MovieCardComponent, MovieContainerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  providers: [MovieService],
  entryComponents: []

})
export class MovieModule { }
