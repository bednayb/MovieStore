export class MovieExpanded {
  constructor(
    public poster_path: string,
    public title: string,
    public language: string[],
    public tagline: string,
    public description: string,
    public genres: string[],
    public release_date: string,
    public page: string,
    public runtime: number,
    public production_countries: string[]
  ) { }

}