import { MovieBasic } from './../models/movie.basic.model';
import { MovieService } from './../movie.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-movie-container',
  templateUrl: './movie-container.component.html',
  styleUrls: ['./movie-container.component.scss']
})
export class MovieContainerComponent implements OnInit, OnDestroy {

  // Movie
  private movieSub: Subscription;
  public movieList: MovieBasic[];

  // Search
  public search = new FormControl('', [
    Validators.minLength(3)
  ]);

  constructor(
    private movieService: MovieService
  ) { }

  ngOnInit() {
    this.movieSub = this.movieService.movies.subscribe(movieList => {
      this.movieList = movieList;
    });
  }

  filterMovies() {
    if (this.search.valid) {
      this.movieService.searchMovieList(this.search.value);
    }
  }

  ngOnDestroy(): void {
    this.movieSub.unsubscribe();
  }
}
