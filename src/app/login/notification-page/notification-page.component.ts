import { Component, OnInit } from '@angular/core';
import { CommonAPIService } from '../../_services/index';
import { NotificationModal } from './notification-page.model'
import { MatDialogRef, MatDialog, } from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { PreviewDocumentComponent } from 'projects/student-app/src/app/shared-module/preview-document/preview-document.component';

@Component({
  selector: 'app-notification-page',
  templateUrl: './notification-page.component.html',
  styleUrls: ['./notification-page.component.css']
})
export class NotificationPageComponent implements OnInit {

  notficationMsg: any[] = [];
  currentUser: any;
  constructor(private commonAPIService: CommonAPIService, private dialog: MatDialog, private router: Router,
    private route: ActivatedRoute) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.getPushNotification();
  }
  getPushNotification() {
    this.commonAPIService.getPushNotification({ 'msg_to': this.currentUser.login_id }).subscribe((result: any) => {
      if (result.status === 'ok') {
        this.notficationMsg = result.data;
      } else {
        this.notficationMsg = [];
      }
    });
  }
  previewDocuments(attachmentArray) {
    const attArr: any[] = [];
    if (attachmentArray && attachmentArray.length > 0) {
      attachmentArray.forEach(element => {
        attArr.push({
          file_url: element.imgUrl
        });
      });
      const dialogRef = this.dialog.open(PreviewDocumentComponent, {
        height: '80%',
        width: '1000px',
        data: {
          index: '',
          images: attArr
        }
      });
    }
  }
  redirectModule(event) {
    const findex = event.msg_to.findIndex(f => Number(f.login_id) === Number(this.currentUser.login_id));
    if (event.msg_type === 'notification') {
      event.msg_to[findex].msg_status = [
        {
          'status_name': 'send'
        }, {
          'status_name': 'read'
        }];

    } else {
      event.msg_to[findex].msg_status.status_name = 'read';
    }
    this.commonAPIService.updateMessage(event).subscribe((result: any) => {
      if (result.status === 'ok') {
        this.getPushNotification();
        if (event.msg_type === 'notification') {
          if (event.notification_type.module === 'syllabus') {
            this.router.navigate(['../academics/view-classwork'], { relativeTo: this.route });
          }
          if (event.notification_type.module === 'assignment') {
            this.router.navigate(['../academics/assignment'], { relativeTo: this.route });
          }
          if (event.notification_type.module === 'fees') {
            this.router.navigate(['../fees/student-fee-detail'], { relativeTo: this.route });
          }
          if (event.notification_type.module === 'classwork') {
            this.router.navigate(['../academics/view-classwork'], { relativeTo: this.route });
          }
          if (event.notification_type.module === 'leave') {
            this.router.navigate(['../academics/leave'], { relativeTo: this.route });
          }
          if (event.notification_type.module === 'timetable') {
            this.router.navigate(['../academics/timetable'], { relativeTo: this.route });
          }
        }
      } else {
        if (event.msg_type === 'notification') {
          if (event.notification_type.module === 'syllabus') {
            this.router.navigate(['../academics/view-classwork'], { relativeTo: this.route });
          }
          if (event.notification_type.module === 'assignment') {
            this.router.navigate(['../academics/assignment'], { relativeTo: this.route });
          }
          if (event.notification_type.module === 'fees') {
            this.router.navigate(['../fees/student-fee-detail'], { relativeTo: this.route });
          }
          if (event.notification_type.module === 'classwork') {
            this.router.navigate(['../academics/view-classwork'], { relativeTo: this.route });
          }
          if (event.notification_type.module === 'leave') {
            this.router.navigate(['../academics/leave'], { relativeTo: this.route });
          }
          if (event.notification_type.module === 'timetable') {
            this.router.navigate(['../academics/timetable'], { relativeTo: this.route });
          }
        }
      }
    });
  }
  deleteNofiy(event) {
    const findex = event.msg_to.findIndex(f => Number(f.login_id) === Number(this.currentUser.login_id));
    if (event.msg_type === 'notification') {
      event.msg_to[findex].msg_status = [
        {
          'status_name': 'send'
        }, {
          'status_name': 'delete'
        }];

    } else {
      event.msg_to[findex].msg_status.status_name = 'delete';
    }
    this.commonAPIService.updateMessage(event).subscribe((result: any) => {
      if (result) {
        this.getPushNotification();
        this.commonAPIService.showSuccessErrorMessage('Notification deleted Successfully', 'success');
      } else {
        this.commonAPIService.showSuccessErrorMessage('Some error Occur !!', 'success');
      }
    });
  }
} 
