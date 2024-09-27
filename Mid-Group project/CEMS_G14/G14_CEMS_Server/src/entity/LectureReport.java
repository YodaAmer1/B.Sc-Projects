package entity;

import java.io.Serializable;

import javafx.scene.control.Button;
public class LectureReport implements Serializable
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private int progressID;
	private String ExamId;
	private String CourseName;
	private String Subject;
	private String Time;
	private String ExamDate;
	private Integer NoStudent;
	private Button ViewHistogram;

	
	public LectureReport(String ExamId,
	 String CourseName,
	 String Subject,
	 String Time,
	 String ExamDate,
	 Integer NoStudent,
	 int progressID
	 )
	{
		this.ExamId=ExamId;
		 this.CourseName= CourseName;
		 this.Subject= Subject;
		 this.Time= Time;
		 this.ExamDate= ExamDate;
		 this.NoStudent= NoStudent;
		 this.progressID = progressID;
	}

	

	public int getProgressID() {
		return progressID;
	}



	public void setProgressID(int progressID) {
		this.progressID = progressID;
	}



	public String getExamId() {
		return ExamId;
	}


	public void setExamId(String examId) {
		ExamId = examId;
	}


	public String getCourseName() {
		return CourseName;
	}


	public void setCourseName(String courseName) {
		CourseName = courseName;
	}


	public String getSubject() {
		return Subject;
	}


	public void setSubject(String subject) {
		Subject = subject;
	}


	public String getTime() {
		return Time;
	}


	public void setTime(String time) {
		Time = time;
	}


	public String getExamDate() {
		return ExamDate;
	}


	public void setExamDate(String examDate) {
		ExamDate = examDate;
	}


	public Integer getNoStudent() {
		return NoStudent;
	}


	public void setNoStudent(Integer noStudent) {
		NoStudent = noStudent;
	}


	public Button getViewHistogram() {
		return ViewHistogram;
	}


	public void setViewHistogram(Button viewHistogram) {
		ViewHistogram = viewHistogram;
	}


	@Override
	public String toString() {
		return "LectureReport [ExamId=" + ExamId + ", CourseName=" + CourseName + ", Subject=" + Subject + ", Time="
				+ Time + ", ExamDate=" + ExamDate + ", NoStudent=" + NoStudent + ", ViewHistogram=" + ViewHistogram
				+ "]";
	}

	
	
}
