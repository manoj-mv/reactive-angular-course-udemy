import { Component, OnInit } from '@angular/core';
import { Course, sortCoursesBySeqNo } from '../model/course';
import { interval, noop, Observable, of, throwError, timer } from 'rxjs';
import { catchError, delay, delayWhen, filter, finalize, map, retryWhen, shareReplay, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CourseDialogComponent } from '../course-dialog/course-dialog.component';
import { CoursesService } from '../services/courses.service';
import { LoadingService } from '../loading/loading.service';
import { MessagesService } from '../messages/messages.service';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;


  constructor(
    private coursesService: CoursesService,
    private loadingService: LoadingService,
    private messageService: MessagesService
  ) { }

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    const courses$ = this.coursesService.loadAllCourses().pipe(
      map(courses => courses.sort(sortCoursesBySeqNo)),
      catchError((errors: string[]) => {
        const message = "Something went wrong!"
        this.messageService.showErros(message);
        console.log(message, errors);
        return throwError(errors)
      })
    );
    const loadCourses$ = this.loadingService.showLoaderUntillCompleted(courses$);

    this.beginnerCourses$ = loadCourses$.pipe(
      map(courses => {
        return courses.filter(course => course.category === "BEGINNER")
      })
    );

    this.advancedCourses$ = loadCourses$.pipe(
      map(courses => {
        return courses.filter(course => course.category === "ADVANCED")
      }
      )
    );
  }


}




