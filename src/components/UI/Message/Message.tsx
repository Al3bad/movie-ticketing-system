import styles from "./Message.module.css";
import React from "react";

type MessageProps = {
    type: "error" | "success";
    msg: string;
}

const Message: React.FC<MessageProps> = ({type, msg}) => {
    return (
        <p className={`${styles.message} ${styles[`message--${type}`]}`}>{msg}</p>
    );
};

export default Message;