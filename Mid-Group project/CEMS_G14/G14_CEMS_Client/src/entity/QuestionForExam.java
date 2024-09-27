package entity;

import javafx.application.Platform;
import javafx.scene.control.Button;
import javafx.scene.control.TextField;

public class QuestionForExam extends Question {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private TextField questionPoints;
	private int points;
	private int questionNumber;
	

	public QuestionForExam(String questionID, String questionSubject, String questionText , String answer1, String answer2, String answer3,
			 String answer4, int correctAnswer, String lecturerName, int questionNumber, int points) {
		super(questionID, questionSubject, questionText , answer1, answer2, answer3, answer4, correctAnswer, lecturerName);
		this.points = points;
		this.questionNumber = questionNumber;
	}
	
	public QuestionForExam(Question question) {
		super(
			question.getQuestionID(), 
			question.getQuestionSubject(), 
			question.getQuestionText() , 
			question.getAnswer1(), 
			question.getAnswer2(), 
			question.getAnswer3(), 
			question.getAnswer4(), 
			question.getCorrectAnswer(), 
			question.getLecturerName()
			);
		setBtnViewQuestion(getBtnViewQuestion());
	}
	
	public Question getQuestion() {
		Question question = new Question(getQuestionID(), getQuestionSubject(), getQuestionText(), getAnswer1(), getAnswer2(), getAnswer3(), getAnswer4(), getCorrectAnswer(), getLecturerName());
		question.setBtnViewQuestion(getBtnViewQuestion());
		return question;
	}
	
	public TextField getQuestionPoints() {
		return questionPoints;
	}
	
	public void setViewButtonAction() {
		
	}
	
	public void setQuestionPoints(TextField questionPoints) {
		this.questionPoints = questionPoints;
	}

	public int getPoints() {
		return points;
	}

	public void setPoints(int points) {
		this.points = points;
	}

	public int getQuestionNumber() {
		return questionNumber;
	}

	public void setQuestionNumber(int questionNumber) {
		this.questionNumber = questionNumber;
	}

}
