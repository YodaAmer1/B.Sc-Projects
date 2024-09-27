package entity;

import java.io.Serializable;

public class Message implements Serializable {

	private static final long serialVersionUID = 1L;

	private MessageType msgType;
	private Object msgData;

	public Message(MessageType messageType, Object messageData) {
		msgType = messageType;
		msgData = messageData;
	}

	public MessageType getMessageType() {
		return msgType;
	}

	public Object getMessageData() {
		return msgData;
	}

	public String toString() {
		return "MESSAGE";
	}

}
