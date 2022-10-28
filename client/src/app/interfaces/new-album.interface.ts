import { FormControl } from "@angular/forms";

export interface INewAlbumForm{
  title: FormControl;
    description: FormControl,
    is_public:FormControl
}