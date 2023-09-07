import { notifications } from '@mantine/notifications';

export function ErrorNotification(endpoint, method, customMsg=null, title="Error!") {
    notifications.show({
        title: title,
        message: customMsg || "An error occurred with the " + method + " request to endpoint " + endpoint,
        color: 'red',
        autoClose: false,
      });
}