package entity;

import java.io.Serializable;
import java.util.ArrayList;

public class StudentExamToCheck implements Serializable {

	private static final long serialVersionUID = 1L;
	private String studentId;
	private int progressId;
	private Exam exam;
	
	private ArrayList<StudentQuestionAnswer> answers;

	public StudentExamToCheck(String studentId, int progressId, Exam exam, ArrayList<StudentQuestionAnswer> answers) {
		super();
		this.studentId = studentId;
		this.progressId = progressId;
		this.exam = exam;
		this.answers = answers;
	}
	
	public StudentExamToCheck() {
		
	}

	public String getStudentId() {
		return studentId;
	}

	public void setStudentId(String studentId) {
		this.studentId = studentId;
	}

	public int getProgressId() {
		return progressId;
	}

	public void setProgressId(int progressId) {
		this.progressId = progressId;
	}

	public Exam getExam() {
		return exam;
	}

	public void setExam(Exam exam) {
		this.exam = exam;
	}

	public ArrayList<StudentQuestionAnswer> getAnswers() {
		return answers;
	}

	public void setAnswers(ArrayList<StudentQuestionAnswer> answers) {
		this.answers = answers;
	}
}
