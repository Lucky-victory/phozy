import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit,DoCheck {
  generalResult!: any;
  isLoggedIn!: boolean;
  currentPage = 1;
  noMoreData:boolean;
  isLoading: boolean = true;
  footerInfo: string;
  constructor(private apiService:ApiService,private authService:AuthService,private router:Router ) {
    
  }

  ngOnInit() {
    this.footerInfo = 'This project was built for Planetscale X Hashnode hackathon';
    this.apiService.getGeneral(this.currentPage).subscribe((response => {
      this.isLoading = false;
      this.generalResult = response.data
    
    }));
    this.isLoggedIn=this.authService.isLoggedIn()
  }
  loadData() {
    
      this.apiService.getGeneral(1).subscribe((response => {
      this.isLoading = false;
      this.generalResult=response.data
    
    }));
  }
  ngDoCheck(): void {
    
    this.isLoggedIn = this.authService.isLoggedIn();
  
  }
  loadMore(event) {
    this.currentPage += 1;
this.apiService.getGeneral(this.currentPage).subscribe((response => {
  setTimeout(() => {
  
    event.target.complete();
  if (!response.data?.length) {
    this.noMoreData = true;
    event.target.disabled = true;
  }    

      
  this.generalResult.push(...response.data)
    }, 500);
    
    }));
  }
  doRefresh(event) {
    this.loadData()
    setTimeout(() => {
      event.target.complete()
    },2000)
  }
  // not yet implemented
  likeOrUnlikePhoto([photo, isLiked]) {
    console.log(photo);
    
    if (isLiked) {
      this.apiService.unlikePhoto(photo.pid);
      console.log('unlike');
      
    }
    else {
      this.apiService.likePhoto(photo.pid);
      console.log('like');
    }
  }
  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/')
  }
}
