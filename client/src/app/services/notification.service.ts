import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Notification } from '@models/notification';
import { User } from '@models/user';
import { NotificationRecipient } from '@models/notification-recipient';
import {environment} from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'api/notifications';

  constructor(private http: HttpClient) { }

  getNotifications(): Observable<Notification[]> {
    // return this.http.get<Notification[]>(this.apiUrl);
    return of(this.getMockNotifications());
  }

  getNotificationsFromApi(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/notifications`);
  }

  getNotificationFromApi(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/notifications/${id}`)
  }

  createNotification(notification: Notification): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/notifications`, notification.format());
  }

  readNotification(notification: Notification) {
    return this.http.post<any[]>(`${environment.apiUrl}/api/notifications/${notification.id}/read`, notification);
  }

  getUnreadNotificationCount() {
    return this.http.get<any>(`${environment.apiUrl}/api/notifications/count`);
  }

  private getMockNotifications(): Notification[] {
    const users = [
      new User(1, 'John Doe', 'john@example.com'),
      new User(2, 'Jane Smith', 'jane@example.com'),
      new User(3, 'Alice Johnson', 'alice@example.com'),
      new User(4, 'Bob Williams', 'bob@example.com'),
      new User(5, 'Eva Brown', 'eva@example.com')
    ];

    return [
      new Notification(
        1,
        'Welcome Message',
        'Welcome to our platform! We hope you enjoy your experience with us. Here are some tips to get started...',
        'Welcome to Our Platform',
        'info',
        [
          new NotificationRecipient(1, users[0], new Date()),
          new NotificationRecipient(2, users[1]),
          new NotificationRecipient(3, users[2], new Date())
        ]
      ),
      new Notification(
        2,
        'System Maintenance',
        'Our system will be undergoing scheduled maintenance on Saturday from 2am to 4am. During this time, the platform might be temporarily unavailable.',
        'Scheduled Maintenance',
        'warning',
        [
          new NotificationRecipient(4, users[0]),
          new NotificationRecipient(5, users[1]),
          new NotificationRecipient(6, users[2]),
          new NotificationRecipient(7, users[3]),
          new NotificationRecipient(8, users[4])
        ]
      ),
      new Notification(
        3,
        'Payment Confirmation',
        'Your payment for the Premium plan has been successfully processed. Thank you for your purchase!',
        'Payment Successful',
        'success',
        [
          new NotificationRecipient(9, users[0], new Date())
        ]
      ),
      new Notification(
        5,
        'Feature Update',
        'We\'ve added several new features based on your feedback. Check out the new dashboard, improved reporting, and more customization options asdfas dfasdf asdfa sdf asdf asdf asdf asdf asdf asdf asdf asdf' +
        '. hhhhhhhhhhhhhhhasdjfhaslkdjfhaslkdjfhas ldjf alskdjfalskdj faslkdj f' +
        'laskdj flkasjdhfl ashdflha slkjd fhlk asdhfhassdfsd asdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf l asdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf l' +
        'asdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf l' +
        'asdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf l' +
        'asdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf l' +
        'asdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf l' +
        'asdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf l' +
        'asdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf l' +
        'asdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf lasdfasd fasdf asdhfasdfhasd asd fjasdkfasdljkf l' +
        ' djklf hlaskjdfh alskjdfh laksjd f lkasjdh flkajshd  flkajshd flkajshdf lkasjdh f lkasjhdf lkasjhdf lkajshdf lkajshdflkajshdflkja shdflkja shdflkja shdflkj h',
        'New Features Available',
        'primary',
        [
          new NotificationRecipient(11, users[0], new Date()),
          new NotificationRecipient(12, users[2], new Date()),
          new NotificationRecipient(13, users[3])
        ]
      ),
      new Notification(
        4,
        'Security Alert',
        'We detected a login to your account from a new device. If this wasn\'t you, please change your password immediately and contact support.',
        'New Login Detected',
        'danger',
        [
          new NotificationRecipient(10, users[1])
        ]
      )
    ];
  }
}
