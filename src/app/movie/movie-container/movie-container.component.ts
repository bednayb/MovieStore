import { MovieBasic } from './../models/movie.basic.model';
import { MovieService } from './../movie.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-movie-container',
  templateUrl: './movie-container.component.html',
  styleUrls: ['./movie-container.component.scss']
})
export class MovieContainerComponent implements OnInit {

  // Movie
  private movieSub: Subscription;
  public movieList: MovieBasic[];

  constructor(
    private movieService: MovieService
  ) { }

  ngOnInit() {
    this.movieSub = this.movieService.movies.subscribe(movieList => {
      this.movieList = movieList;
    });
  }


  ngOnDestroy(): void {
    this.movieSub.unsubscribe();
  }
}
