export class MovieBasic {
  constructor(
    public poster_path: string,
    public title: string,
    public release_date: string,
    public genres: string[]
  ) { }
}