import { Component, OnInit } from '@angular/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CommonAPIService } from 'src/app/_services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { PreviewDocumentComponent } from 'projects/student-app/src/app/shared-module/preview-document/preview-document.component';
import { MatDialogRef, MatDialog, } from '@angular/material/dialog';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.css']
})
export class NoticeComponent implements OnInit {
  notficationMsg: any[] = [];
  resultArray: any[] = [];
  currentUser: any;
  constructor( private commonAPIService: CommonAPIService, private router: Router,
    private route: ActivatedRoute, private dialog: MatDialog, ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }
  limit = 10;
  ngOnInit() {
    this.getPushNotification();
  }

  onScroll() {
    console.log('scrollperformed');
    this.limit = this.limit + 3;
    this.getPushNotification();
  }
  getPushNotification() {
    this.commonAPIService.getPushNotification({ 'msg_to': this.currentUser.login_id, 'limit': this.limit }).subscribe((result: any) => {
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
  msgRead(event) {
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
      }
    });
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
