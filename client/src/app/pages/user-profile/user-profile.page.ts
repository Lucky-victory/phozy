import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from 'src/app/interfaces/auth-user.interface';
import { IResponseResult } from 'src/app/interfaces/common';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  userData: any;
  userAlbums: any;
  constructor(private activeRoute:ActivatedRoute,private apiService:ApiService) { }

  ngOnInit() {
    const username = this.activeRoute.snapshot.paramMap.get('username');
    this.apiService.getUserData(username).subscribe((res) => {
      this.userData = res.data  as IUser;
      
      
    });
    this.apiService.getUserAlbums(username).subscribe((res) => {
      this.userAlbums=res.data
    })
  }

}

