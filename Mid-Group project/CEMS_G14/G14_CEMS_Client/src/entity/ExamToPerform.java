package entity;

import java.io.Serializable;
import java.util.ArrayList;

import javafx.scene.control.Button;

public class ExamToPerform implements Serializable {

	private static final long serialVersionUID = 1L;
	private Exam exam;
	private String code;
	private int type;
	private String lecturerName;
	private String lecturerID;
	
	public ExamToPerform(Exam exam, String code, int type, String lecturerName, String lecturerID) {
		super();
		this.exam = exam;
		this.code = code;
		this.type = type;
		this.lecturerName = lecturerName;
		this.lecturerID = lecturerID;
	}
	
	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public Exam getExam() {
		return exam;
	}
	public void setExam(Exam exam) {
		this.exam = exam;
	}
	public String getLecturerName() {
		return lecturerName;
	}
	public void setLecturerName(String lecturerName) {
		this.lecturerName = lecturerName;
	}
	public String getLecturerID() {
		return lecturerID;
	}
	public void setLecturerID(String lecturerID) {
		this.lecturerID = lecturerID;
	}

	
	
}
