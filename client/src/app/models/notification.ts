import {NotificationRecipient} from '@models/notification-recipient';

export class Notification {
  id: number;
  name: string;
  text: string;
  subject: string;
  type: string;

  recipients: NotificationRecipient[]

  constructor(id: number, name: string, text: string, subject: string, type:string, recipients: NotificationRecipient[]) {
    this.id = id;
    this.name = name;
    this.text = text;
    this.subject = subject;
    this.type = type;
    this.recipients = recipients;
  }
}
