package entity;

import java.io.Serializable;

public class StudentQuestionAnswer implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private String questionID;
	private int questionAnswer;
	
	public StudentQuestionAnswer(String questionID, int questionAnswer) {
		super();
		this.questionID = questionID;
		this.questionAnswer = questionAnswer;
	}

	public String getQuestionID() {
		return questionID;
	}

	public void setQuestionID(String questionID) {
		this.questionID = questionID;
	}

	public int getQuestionAnswer() {
		return questionAnswer;
	}

	public void setQuestionAnswer(int questionAnswer) {
		this.questionAnswer = questionAnswer;
	}
	
	
}
