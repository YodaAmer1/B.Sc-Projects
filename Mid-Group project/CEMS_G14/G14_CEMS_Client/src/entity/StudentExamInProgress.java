package entity;

import java.io.Serializable;

public class StudentExamInProgress implements Serializable {

	private static final long serialVersionUID = 1L;
	private int progressId;
	private int type;
	private int extraTime;
	private String status;
	
	private Exam exam;
	
	public StudentExamInProgress(int progressId, int type, int extraTime, String status) {
		super();
		this.progressId = progressId;
		this.type = type;
		this.extraTime = extraTime;
		this.status = status;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
	
	public Exam getExam() {
		return exam;
	}

	public void setExam(Exam exam) {
		this.exam = exam;
	}

	public int getProgressId() {
		return progressId;
	}

	public void setProgressId(int progressId) {
		this.progressId = progressId;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public int getExtraTime() {
		return extraTime;
	}

	public void setExtraTime(int extraTime) {
		this.extraTime = extraTime;
	}
}
