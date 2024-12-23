import MobileNotifications from "./MobileNotifications";
import DesktopNotifications from "./DesktopNotifications";

function Notifications() {
    return (
        <div>
            <div className="hidden lg:block">
                <DesktopNotifications />
            </div>
            <div className="lg:hidden">
                <MobileNotifications />
            </div>
        </div>
    );
}

export default Notifications;

