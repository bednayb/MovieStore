import { MatDialog } from '@angular/material';
import { MovieBasic } from './../models/movie.basic.model';
import { Component, OnInit, Input } from '@angular/core';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {

  @Input()
  public movieData: MovieBasic;

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit() {

  }

  openDetails(): void {
    this.dialog.open(MovieDetailsComponent, {
      data: { id: this.movieData.id, type: this.movieData.type }
    });


  }
}
