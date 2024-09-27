package entity;
import javafx.application.Platform;
import javafx.scene.control.Button;
import javafx.scene.control.TextField;
	
public class CoruseReport  extends Course {

	//private static final long serialVersionUID = 1L;
	private String IDLecturer;
	private String NameLecturer;
	private int progressID;
	private String IDExam;
	private String Subject;
	private String ExamDate;
	private Integer NoStudent;
	
	public CoruseReport(String courseID, String course, String subjectID,String IDExam,String Subject,String IDLecturer,String NameLecturer,String ExamDate,Integer NoStudent, int progressID) {
		super(courseID, course, subjectID);
		this.IDExam=IDExam;
		this.Subject = Subject;
		this.IDLecturer=IDLecturer;
		this.NameLecturer=NameLecturer;
		this.ExamDate=ExamDate;
		this.NoStudent=NoStudent;
		this.progressID = progressID;
	}
	
	

	public int getProgressID() {
		return progressID;
	}



	public void setProgressID(int progressID) {
		this.progressID = progressID;
	}



	public String getIDLecturer() {
		return IDLecturer;
	}

	public void setIDLecturer(String iDLecturer) {
		IDLecturer = iDLecturer;
	}

	public String getNameLecturer() {
		return NameLecturer;
	}

	public void setNameLecturer(String nameLecturer) {
		NameLecturer = nameLecturer;
	}

	public String getIDExam() {
		return IDExam;
	}

	public void setIDExam(String iDExam) {
		IDExam = iDExam;
	}

	public String getSubject() {
		return Subject;
	}

	public void setSubject(String subject) {
		Subject = subject;
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

	@Override
	public String toString() {
		return "CoruseReport [IDLecturer=" + IDLecturer + ", NameLecturer=" + NameLecturer + ", IDExam=" + IDExam
				+ ", Subject=" + Subject + ", ExamDate=" + ExamDate + ", NoStudent=" + NoStudent + "]";
	}
	
	
}
