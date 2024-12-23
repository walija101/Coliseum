import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { getNotifications } from '../../api/apiService';
import NotificationInstance from './NotificationInstance';

function MobileNotifications() {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await getNotifications();
                console.log(response);
                setNotifications(response.notifications);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    const NotificationContent = () => {
        if (notifications.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-fontBrown text-lg mb-2">No New Notifications</p>
                    <p className="text-fontBrown text-sm opacity-75">
                        New notifications will appear here.
                    </p>
                </div>
            );
        }

        return notifications.map((notification, index) => (
            <NotificationInstance
                key={index}
                type={notification.type}
                userName={notification.userName}
                userImage={notification.userImage}
                onOpen={() => console.log('Open notification', notification.id)}
                onAccept={() => console.log('Accept notification', notification.id)}
                onDecline={() => console.log('Decline notification', notification.id)}
                message={notification.message}
                sendingUserId={notification.sendingUserId}
                notificationId={notification.id}
                matchId={notification.content}
            />
        ));
    };

    const notificationText = notifications.length === 0 
        ? "No Notifications" 
        : `${notifications.length} Notifications`;

    return (
        <div>
            <div className='w-full flex justify-between items-center font-playfair text-fontBrown text-3xl bg-[#F9D689] p-2 px-6'>
                <span className="font-medium text-base">{notificationText}</span>
                <FontAwesomeIcon icon={faCircleQuestion} />
            </div>

            <div className="flex flex-col space-y-4 justify-center items-center font-playfair p-6">
                <NotificationContent />
            </div>
        </div>
    );
}

export default MobileNotifications;