import { MovieService } from './../movie.service';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MovieExpanded } from '../models/movie.expanded.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent implements OnInit, OnDestroy {

  // Movie
  private movieSub: Subscription;
  public movieData: MovieExpanded;

  // error
  public error = '';

  constructor(
    public dialogRef: MatDialogRef<MovieDetailsComponent>,
    private movieService: MovieService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.movieService.searchMovie(this.data.id, this.data.type);
    this.movieSub = this.movieService.movie.subscribe(movieData => {

      this.movieData = movieData;
      if (!this.movieData) {
        this.error = 'oops sg went wrong';
      } else {
        this.error = '';
      }
    });
  }

  ngOnDestroy(): void {
    this.movieSub.unsubscribe();
  }

}
