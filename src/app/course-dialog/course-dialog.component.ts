import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as moment from 'moment';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { CoursesService } from '../services/courses.service';
import { LoadingService } from '../loading/loading.service';
import { MessagesService } from '../messages/messages.service';

@Component({
  selector: 'course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.css'],
  providers: [LoadingService, MessagesService]
})
export class CourseDialogComponent implements AfterViewInit {

  form: FormGroup;

  course: Course;

  saveCourse$: Observable<Course>;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course,
    private courseService: CoursesService,
    private loadingService: LoadingService,
    private messageService: MessagesService) {

    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required]
    });

  }

  ngAfterViewInit() {

  }

  save() {
    const changes = this.form.value;
    this.saveCourse$ = this.courseService.saveCourse(this.course.id, changes)
      .pipe(
        catchError((err) => {
          const message = "Could not save couese.";
          console.log('message', err);

          this.messageService.showErros(message);
          return throwError(err);
        })
      );
    const saveCourse$ = this.loadingService.showLoaderUntillCompleted(this.saveCourse$);
    saveCourse$
      .subscribe(
        (val) => {
          console.log(val);
          this.dialogRef.close(val);
        }
      )
  }

  close() {
    this.dialogRef.close();
  }

}
