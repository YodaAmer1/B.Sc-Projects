package entity;

import java.io.Serializable;

public class Subject implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private String topicID;
	private String topic;
	public Subject(String topicID, String topic) {
		super();
		this.topicID = topicID;
		this.topic = topic;
	}

	public String getTopicID() {
		return topicID;
	}

	public void setTopicID(String topicID) {
		this.topicID = topicID;
	}

	public String getTopic() {
		return topic;
	}

	public void setTopic(String topic) {
		this.topic = topic;
	}

	@Override
	public String toString() {
		return topicID + " - " + topic;
	}
	
	

}
