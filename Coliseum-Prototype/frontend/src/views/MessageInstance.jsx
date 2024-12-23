// src/components/MessageInstance.jsx
import { Link } from "react-router-dom"

function MessageInstance(props){
    const latestText = props.latestText?.map(text => text.text)
    const latestTextSender = props.latestText?.map(text => text.senderID)
    
    const chatId = props.chatId; // Use the correct chatId passed from Messages.jsx


    return(
        <Link
            to={`/messages/chat/${chatId}`}
            className="flex gap-3 shadow-xl p-4 hover:bg-peach hover:shadow-inner">
                <img className="h-12 rounded-full" src={props.img} alt="profile" />
                <div className="w-[calc(100%-3.5rem)]">
                    <div className="font-playfair font-bold text-fontBrown text-lg">{props.friendFullName}</div>
                    <div className={`font-playfair text-fontLightBrown text-sm truncate ${props.latestTextIsNew ? `font-bold` : `font-light`}`}>
                        {latestTextSender==props.userID ? "Me" : props.friendFullName}: {latestText}
                    </div>
                </div>
        </Link>
    );
}

export default MessageInstance;
