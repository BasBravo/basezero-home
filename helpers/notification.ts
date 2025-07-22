//
// INTERFACE
//
interface notificationOptions {
    title?: string;
    description: string | any;
    icon?: string;
    timeout?: number;
}
//
// EXPORT
//
export const notification: any = {
    toast: null,
    ui: {
        shadow: 'shadow-lg',
        transition: {
            enterActiveClass: 'transform ease-out duration-300 transition',
            enterFromClass: 'opacity-0',
            enterToClass: 'opacity-10',
            leaveActiveClass: 'transition ease-in duration-100',
            leaveFromClass: 'opacity-100',
            leaveToClass: 'opacity-0',
        },
    },
    sendNotification: (options: notificationOptions) => {
        if (notification.toast === null) notification.toast = useToast();
        if (!options.description) return;
        notification.toast.add({
            title: options.title ?? 'Notification',
            icon: options.icon ?? 'i-tabler-bell-ringing',
            color: 'gray',
            description: options.description,
            ui: notification.ui,
            timeout: options.timeout ?? 5000,
        });
    },
    sendErrorNotification: (options: notificationOptions) => {
        if (notification.toast === null) notification.toast = useToast();
        if (!options.description) return;
        notification.toast.add({
            title: options.title ?? 'Error',
            icon: options.icon ?? 'i-tabler-alert-triangle-filled',
            color: 'red',
            description: options.description ?? 'Something went wrong',
            ui: notification.ui,
            timeout: options.timeout ?? 5000,
        });
    },
    sendSuccessNotification: (options: notificationOptions) => {
        if (notification.toast === null) notification.toast = useToast();
        if (!options.description) return;

        notification.toast.add({
            title: options.title ?? 'Successfull',
            icon: options.icon ?? 'i-tabler-circle-check-filled',
            color: 'green',
            description: options.description,
            ui: notification.ui,
            timeout: options.timeout ?? 5000,
        });
    },
    sendWarningNotification: (options: notificationOptions) => {
        if (notification.toast === null) notification.toast = useToast();
        if (!options.description) return;

        notification.toast.add({
            title: options.title ?? 'Warning',
            icon: options.icon ?? 'i-tabler-alert-triangle-filled',
            color: 'yellow',
            description: options.description,
            ui: notification.ui,
            timeout: options.timeout ?? 5000,
        });
    },
    closeAllNotifications: () => {
        notification.toast?.clear();
    },
};
