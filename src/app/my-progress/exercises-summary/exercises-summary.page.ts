import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import {
  ProgressService
} from 'src/app/services/progress.service';
import {
  Router
} from '@angular/router';
import {
  AuthService
} from 'src/app/services/auth.service';
import {
  Observable, Subscription
} from 'rxjs';
import {
  LanguageService
} from 'src/app/services/language.service';

@Component({
  selector: 'app-exercises-summary',
  templateUrl: './exercises-summary.page.html',
  styleUrls: ['./exercises-summary.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExercisesSummaryPage implements OnInit {

  exercises_observable: Observable < any[] > ;
  exercises: any;
  uid_observable: Observable < any[] > ;
  uid: string;
  index: number;
  load: boolean = false;
  uid_subscription: Subscription;

  constructor(private progressService: ProgressService, private change: ChangeDetectorRef, private router: Router, private authService: AuthService, private languageService: LanguageService) {}

  ngOnInit() {
    this.getLanguage();
    this.getCurrentUser();
  }

  ionViewDidLeave(){
    this.uid_subscription.unsubscribe();
  }

  getLanguage() {
    this.languageService.getType().then(res => {
      if (res) {
        this.index = parseInt(res);
      } else {
        this.index = 0;
      }
    });
  }

  getCurrentUser() {
    this.uid_observable = this.authService.getCurrentUser();
    this.uid_subscription = this.uid_observable.subscribe((res: any) => {
      try {
        this.uid = res.uid;
      } catch (err) {
        console.log(err);
      }
      this.getData(this.uid);
    });
  }

  getData(id: string) {
    this.exercises_observable = this.progressService.getExerciseResults(id);
    this.exercises_observable.subscribe((res: any) => {
      this.exercises = res;
      if(this.exercises.length > 0){
        this.load = true;
      } else {
        this.load = false;
      }
      this.change.detectChanges();
    })
  }

  seeSummary(id: string) {
    this.router.navigate(['/exercise-detail/' + id]);
  }

}