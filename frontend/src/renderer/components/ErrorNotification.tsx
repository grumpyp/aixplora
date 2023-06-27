import { Notifications } from '@mantine/notifications';

export function ErrorNotification(title:string, message: string) {
    Notifications.show({
        title: title,
        message: message,
        color: 'red',
        autoClose: false,
      });
}