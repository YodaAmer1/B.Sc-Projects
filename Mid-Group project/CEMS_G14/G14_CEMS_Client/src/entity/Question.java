package entity;

import java.io.Serializable;
import java.util.ArrayList;

import javafx.scene.control.Button;

public class Question implements Serializable {
	
	private static final long serialVersionUID = 1L;
	private String questionID;
	private String questionSubject;
	private String questionText;
	private String answer1;
	private String answer2;
	private String answer3;
	private String answer4;
	private int correctAnswer;
	private String lecturerName;
	
	private Button btnViewQuestion;
	

	public Question(String questionID, String questionSubject, String questionText , String answer1, String answer2, String answer3,
			 String answer4, int correctAnswer, String lecturerName) {
		this.questionID = questionID;
		this.questionText = questionText;
		this.questionSubject = questionSubject;
		this.answer1 = answer1;
		this.answer2 = answer2;
		this.answer3 = answer3;
		this.answer4 = answer4;
		this.correctAnswer = correctAnswer;
		this.lecturerName = lecturerName;
	}

	public Button getBtnViewQuestion() {
		return btnViewQuestion;
	}

	@Override
	public String toString() {
		return "Question [questionID=" + questionID + ", questionSubject=" + questionSubject + ", questionText="
				+ questionText + ", answer1=" + answer1 + ", answer2=" + answer2 + ", answer3=" + answer3 + ", answer4="
				+ answer4 + ", correctAnswer=" + correctAnswer + ", lecturerName=" + lecturerName + ", courses=" + "]";
	}

	public void setBtnViewQuestion(Button btnViewQuestion) {
		this.btnViewQuestion = btnViewQuestion;
	}

	public String getSubjectID() {
		return questionID.substring(0, 2);
	}

	public String getQuestionID() {
		return questionID;
	}


	public void setQuestionID(String questionID) {
		this.questionID = questionID;
	}


	public String getQuestionText() {
		return questionText;
	}


	public void setQuestionText(String questionText) {
		this.questionText = questionText;
	}


	public String getQuestionSubject() {
		return questionSubject;
	}


	public void setQuestionSubject(String questionSubject) {
		this.questionSubject = questionSubject;
	}


	public String getAnswer1() {
		return answer1;
	}


	public void setAnswer1(String answer1) {
		this.answer1 = answer1;
	}


	public String getAnswer2() {
		return answer2;
	}


	public void setAnswer2(String answer2) {
		this.answer2 = answer2;
	}


	public String getAnswer3() {
		return answer3;
	}


	public void setAnswer3(String answer3) {
		this.answer3 = answer3;
	}


	public String getAnswer4() {
		return answer4;
	}


	public void setAnswer4(String answer4) {
		this.answer4 = answer4;
	}


	public int getCorrectAnswer() {
		return correctAnswer;
	}


	public void setCorrectAnswer(int correctAnswer) {
		this.correctAnswer = correctAnswer;
	}


	public String getLecturerName() {
		return lecturerName;
	}


	public void setLecturerName(String lecturerName) {
		this.lecturerName = lecturerName;
	}
}
