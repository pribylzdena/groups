import {NotificationRecipient} from '@models/notification-recipient';
import {NotificationType} from '@enums/notification-type';

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

  format() {
    return {
      id: this.id,
      name: this.name,
      text: this.text,
      subject: this.subject,
      type: NotificationType.getValueByName(this.type),
      recipients: this.recipients
    };
  }
}
