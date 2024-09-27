// This file contains material supporting section 3.7 of the textbook:
// "Object Oriented Software Engineering" and is issued under the open-source
// license found at www.lloseng.com 

package client;

import ocsf.client.*;
import common.ChatIF;
import controllers.CustomPopupWindow;
import controllers.LecturerExamRETViewController;
import controllers.ViewQuestionFormController;
import entity.*;

import java.io.*;
import java.lang.reflect.Array;
import java.util.ArrayList;

import javafx.application.Platform;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.stage.Stage;
import javafx.stage.StageStyle;

/**
 * This class overrides some of the methods defined in the abstract superclass
 * in order to give more functionality to the client.
 *
 * @author Dr Timothy C. Lethbridge
 * @author Dr Robert Lagani&egrave;
 * @author Fran&ccedil;ois B&eacute;langer
 * @version July 2000
 */
public class ChatClient extends AbstractClient {

	// Instance variables **********************************************
	public User user;
	public ArrayList<ExamInProgress> examsInProgress;
	public ArrayList<Subject> subjectsList;
	public ArrayList<Course> coursesList;
	public ArrayList<Question> questionsList;
	public ArrayList<Exam> examsList;
	public ArrayList<ExamDone> doneExamsList;
	public ArrayList<StudentExam> studentExamList;
	public ArrayList<StudentExam> LecturerStudentsExamsList;
	public Question question;
	public ExamInProgress examInProgress;
	public Exam examToPerform;
	public StudentExamInProgress studentExamInProgress;
	public StudentExamToCheck examToCheck;
	public StudentExam viewExam;
	public ArrayList<Question> questionListDH;
	public ArrayList<DurationRequest> requestList;
	public ArrayList<LectureReport> lecReportList;
	public ArrayList<User> userlist;
	public ArrayList<LectureReport> lecReportListDH;
	public LectureReport lecReport;
	public ArrayList<CoruseReport> CourseReportListDH;
	public ArrayList<StudentReport> stdReportListDH;
	public ArrayList<QuestionForExam> questionsExamList;
	public ArrayList<StudentExamGrade> examReport;

	/**
	 * The interface type variable. It allows the implementation of the display
	 * method in the client.
	 */
	ChatIF clientUI;

	public static boolean awaitResponse = false;

	// Constructors ****************************************************

	/**
	 * Constructs an instance of the chat client.
	 *
	 * @param host     The server to connect to.
	 * @param port     The port number to connect on.
	 * @param clientUI The interface type variable.
	 */

	public ChatClient(String host, int port, ChatIF clientUI) throws IOException {
		super(host, port); // Call the superclass constructor
		this.clientUI = clientUI;
		openConnection();
	}

	// Instance methods ************************************************

	/**
	 * This method handles all data that comes in from the server.
	 *
	 * @param msg The message from the server.
	 */
	public void handleMessageFromServer(Object msg) {

		Message message = (Message) msg;
		MessageType messageType = message.getMessageType();

		System.out.println("Message received from Server -- Message type: " + messageType);

		switch (messageType) {
		case LogInSucceeded:
			this.user = (User) message.getMessageData();
			break;
		case LogInFailed:
			this.user = null;
			break;
		case InProgressExamsList:
			ArrayList<ExamInProgress> examsList = (ArrayList<ExamInProgress>) message.getMessageData();
			for (ExamInProgress examsInProgress : examsList) {

				final Button lockExam = new Button("Lock");
				lockExam.setOnAction(event -> {
					examsInProgress.setLockExam(null);
					examsInProgress.setRequestExtraTimeButton(null);
					Message messageToServer = new Message(MessageType.LockExam, examsInProgress);
					ClientUI.chat.accept(messageToServer);
					lockExam.setDisable(true);
				});
				examsInProgress.setLockExam(lockExam);

				final Button requestTimeChange = new Button("Request");

				requestTimeChange.setOnAction(event -> {
					examInProgress = examsInProgress;
					try {
						new LecturerExamRETViewController().start(new Stage());
					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				});
				examsInProgress.setRequestExtraTimeButton(requestTimeChange);
			}
			this.examsInProgress = examsList;
			break;

		case GetSubjectsList:
			ArrayList<Subject> subejctList = (ArrayList<Subject>) message.getMessageData();
			this.subjectsList = subejctList;
			break;

		case GetCoursesList:
			ArrayList<Course> courseList = (ArrayList<Course>) message.getMessageData();

			this.coursesList = courseList;

			break;

		case CreateQuestionSucceeded:
			Question question = (Question) message.getMessageData();

			ClientUI.display(DialogType.Success, "Question Created Successfully!",
					"Question Subject: " + question.getQuestionSubject() + "\n\n* Question Text: \n"
							+ question.getQuestionText() + "\n\n* Answers: " + "\n1: " + question.getAnswer1() + "\n2: "
							+ question.getAnswer2() + "\n3: " + question.getAnswer3() + "\n4: " + question.getAnswer4()
							+ "\n\n* Correct Answer: " + question.getCorrectAnswer());

			break;

		case CreateQuestionFailed:
			ClientUI.display(DialogType.Error, "Question Creating Faild!",
					"There was an error while creating the question, Please try again.");

			break;

		case QuestionList:
			ArrayList<Question> questionsArray = (ArrayList<Question>) message.getMessageData();

			this.questionsList = questionsArray;

			break;

		case QuestionUpdateSucceeded:
			Question newQuestionData = (Question) message.getMessageData();

			ClientUI.display(DialogType.Success, "Question Updated Successfully!",
					"Question Subject: " + newQuestionData.getQuestionSubject() + "\n\n* Question Text: \n"
							+ newQuestionData.getQuestionText() + "\n\n* Answers: " + "\n1: "
							+ newQuestionData.getAnswer1() + "\n2: " + newQuestionData.getAnswer2() + "\n3: "
							+ newQuestionData.getAnswer3() + "\n4: " + newQuestionData.getAnswer4()
							+ "\n\n* Correct Answer: " + newQuestionData.getCorrectAnswer());

			break;

		case QuestionUpdateFailed:
			ClientUI.display(DialogType.Error, "Question Updating Faild!",
					"There was an error while Updating the question data, Please try again.");
			break;

		case QuestionDeleteSucceeded:
			Question DeletedQuestion = (Question) message.getMessageData();

			ClientUI.display(DialogType.Success, "Question Deleted Successfully!",
					"Deleted Question Data:" + "\n\nQuestion Subject: " + DeletedQuestion.getQuestionSubject()
							+ "\n\n* Question Text: \n" + DeletedQuestion.getQuestionText() + "\n\n* Answers: "
							+ "\n1: " + DeletedQuestion.getAnswer1() + "\n2: " + DeletedQuestion.getAnswer2() + "\n3: "
							+ DeletedQuestion.getAnswer3() + "\n4: " + DeletedQuestion.getAnswer4()
							+ "\n\n* Correct Answer: " + DeletedQuestion.getCorrectAnswer());

			break;

		case CreateExamSucceeded:
			ClientUI.display(DialogType.Success, "Exam Created Successfully!",
					"The Exam Has Added To Bank Successfully.");
			break;

		case CreateExamFail:
			ClientUI.display(DialogType.Error, "Exam Creating Failed!",
					"There Was An Error While Creating The Exam, Please Try Again.");
			break;

		case GetExamsList:
			ArrayList<Exam> examsArray = (ArrayList<Exam>) message.getMessageData();
			System.out.println(examsArray);
			this.examsList = examsArray;

			break;

		case GetExamByCode:
			studentExamInProgress = (StudentExamInProgress) message.getMessageData();

			break;
		case GetStudentExams:
			ArrayList<StudentExam> studentExams = (ArrayList<StudentExam>) message.getMessageData();

			studentExamList = studentExams;

			break;

		case ExamStartedSuccessfuly:
			ClientUI.display(DialogType.Success, "Exam Started Successfully!", "The exam has commenced successfully.");
			break;

		case ExamStartFail:
			ClientUI.display(DialogType.Error, "Exam Starting Failed!", "The exam has failed to start.");
			break;

		case ExamSubmitSucceeded:
			ClientUI.display(DialogType.Success, "Exam Submited Successfully!",
					"You Have Submited The Exam.\nGood Luck!");
			break;

		case ExamSubmitFail:
			ClientUI.display(DialogType.Error, "Exam Submition Error!",
					"There Was An Error While Submition The Exam!\nPlease Try Again.");
			break;

		case LockExam:
			ExamInProgress examInProgress = (ExamInProgress) message.getMessageData();
			if (this.studentExamInProgress == null) {
				break;
			}
			if (!(examInProgress.getProgressId() == this.studentExamInProgress.getProgressId())) {
				break;
			}
			if (!examInProgress.getExamID().equals(this.studentExamInProgress.getExam().getExamID())) {
				break;
			}
			this.studentExamInProgress.setStatus("Locked");
			System.out.println("Shitt!");
			break;

		case GetStudentsExams:
			LecturerStudentsExamsList = (ArrayList<StudentExam>) message.getMessageData();
			break;

		case GetStudentExamToCheck:
			examToCheck = (StudentExamToCheck) message.getMessageData();
			break;

		case SubmitExamGradeSucceeded:
			ClientUI.display(DialogType.Success, "Exam Grade Updated!", "Student Exam Grade Updated Successfuly.");
			break;

		case SubmitExamGradeFailed:
			ClientUI.display(DialogType.Error, "Exam Grade Update Fail!", "Student Exam Grade Update Failed.");
			break;

		case GetDoneExams:
			doneExamsList = (ArrayList<ExamDone>) message.getMessageData();
			break;
			
		case RequestExtraSucceeded:
			ClientUI.display(DialogType.Success, "Request Sent Successfuly!", "The Extra Time Sent Successfuly.");
			break;
			
		case RequestExtraFailed:
			ClientUI.display(DialogType.Error, "Request Sent Fail!", "The Extra Time Didn't Sent.");
			break;
			
		case GetLecturerExamReport:
			examReport = (ArrayList<StudentExamGrade>) message.getMessageData();
			break;

/////////////////////////////////////////// START OF department head ///////////////////////////////////
//Request extra time from department head
		case ListRequestsForDH:
			ArrayList<DurationRequest> requestsList = (ArrayList<DurationRequest>) message.getMessageData();
			this.requestList = requestsList;
			break;

//approve the request
		case approveTheRequest:
			DurationRequest requestApproved = (DurationRequest) message.getMessageData();
			if (this.studentExamInProgress != null) {
				if (this.studentExamInProgress.getProgressId() == requestApproved.getExamID()) {
					this.studentExamInProgress.setExtraTime(requestApproved.getRe_duration());
				}
			}
//			request = requestApproved;
			break;

//decline the request
		case declineTheRequest:
//			DurationRequest requestDecline = (DurationRequest) message.getMessageData();
//			request = requestDecline;
			break;

///Lecture Report 	   
		case ListLecReportsDH:
			ArrayList<LectureReport> lecReportList = (ArrayList<LectureReport>) message.getMessageData();
			System.out.println("lecReporstList in chat client=" + lecReportList);
			lecReportListDH = lecReportList;
			break;

///Student Report 	   
		case ListStdReportsDH:
			ArrayList<StudentReport> stdReporstList = (ArrayList<StudentReport>) message.getMessageData();
			System.out.println("stdReporstList in chat client=" + stdReporstList);
			stdReportListDH = stdReporstList;
			
			break;

///Course Report 	   
		case ListCourseReportsDH:
			ArrayList<CoruseReport> courseReportArray = (ArrayList<CoruseReport>) message.getMessageData();
			System.out.println("CoruseReport in chat client=" + courseReportArray);
			CourseReportListDH = courseReportArray;
			break;

//Question List DH Bank
		case GetQuestionsListDH:
			ArrayList<Question> questionListDH = (ArrayList<Question>) message.getMessageData();
			System.out.println(questionListDH);
			this.questionListDH = questionListDH;
			break;

/// Users list for reports
		case GetUsersList:
			ArrayList<User> usersList = (ArrayList<User>) message.getMessageData();
			userlist = usersList;
			break;

/// Exams List DH
		case GetSubjectsListDH:
			ArrayList<Subject> subejctListDH = (ArrayList<Subject>) message.getMessageData();
			System.out.println(subejctListDH);
			subjectsList = subejctListDH;
			break;
		case GetCoursesListDH:
			ArrayList<Course> CourseListDH = (ArrayList<Course>) message.getMessageData();
			System.out.println(CourseListDH);
			coursesList = CourseListDH;
			break;
		case GetAllExamsListDH:
			ArrayList<Exam> ExamListDH = (ArrayList<Exam>) message.getMessageData();
			System.out.println(ExamListDH);
			this.examsList = ExamListDH;
			break;
		case GetAllExamQuestion: /// A list of questions of a particular exam
			ArrayList<QuestionForExam> ExamQuestionDH = (ArrayList<QuestionForExam>) message.getMessageData();
			this.questionsExamList = ExamQuestionDH;
			break;

/////////////////////////////////////End////////////////////////////////////////////

		default:
//			ClientUI.display(DialogType.Error, "Exam Submition Error!",
//					"There Was An Error While Submition The Exam!\nPlease Try Again.");
			break;
		}

		awaitResponse = false;
	}

	/**
	 * This method handles all data coming from the UI
	 *
	 * @param message The message from the UI.
	 */
	public void handleMessageFromClientUI(Object message) {
		// openConnection(); //in order to send more than one message

		awaitResponse = true;
		try {
			sendToServer(message);
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		// wait for response
		while (awaitResponse) {
			try {

				Thread.sleep(100);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}

	}

	/**
	 * This method terminates the client.
	 */
	public void quit() {
		try {
			sendToServer("Disconnected");
			closeConnection();

		} catch (IOException e) {
		}
		System.exit(0);
	}
}
//End of ChatClient class
