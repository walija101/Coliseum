// src/components/TextMessage.jsx
import React from 'react';

function TextMessage(props) {
    const textBox = props.isFromUser ? (
        <div className="flex gap-2 items-center max-w-[75%] float-right">
            <div className="flex flex-col">
                <div className={`py-1 px-2 h-min rounded-lg break-words ${props.isFromUser ? `bg-sand float-right` : props.relationship === "FRIEND" ? `bg-specialGreen float-left` : `bg-bgRed float-left`} `}>
                    {props.textContent}
                </div>
                <div className="px-2 text-fontLightBrown text-xs truncate">
                    {props.isFromUser ? "Me" : props.fullName} - {props.time}
                </div>
            </div>
            <div className="w-8">
                <img className="h-8 w-8 rounded-full" src={props.img} alt="pfp" />
            </div>
        </div>
    ) : (
        <div className="flex gap-2 items-center max-w-[75%] float-left">
            <div className="w-8">
                <img className="h-8 w-8 rounded-full" src={props.img} alt="pfp" />
            </div>
            <div className="flex flex-col">
                <div className={`py-1 px-2 h-min rounded-lg break-words ${props.isFromUser ? `bg-sand float-right` : props.relationship === "FRIEND" ? `bg-specialGreen float-left` : `bg-bgRed float-left`} `}>
                    {props.textContent}
                </div>
                <div className="px-2 text-fontLightBrown text-xs truncate">
                    {props.fullName} - {props.time}
                </div>
            </div>
        </div>
    );

    return <div className="w-full clear-both">{textBox}</div>;
}

export default TextMessage;
