import { notifications } from '@mantine/notifications';

export function ErrorNotification(endpoint, method) {
    notifications.show({
        title: "Error!",
        message: "An error occurred with the " + method + " request to endpoint " + endpoint,
        color: 'red',
        autoClose: false,
      });
}