// This file contains material supporting section 3.7 of the textbook:
// "Object Oriented Software Engineering" and is issued under the open-source
// license found at www.lloseng.com 
package controllers;

import java.io.*;
import java.lang.reflect.Array;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Vector;

import javafx.application.Platform;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXMLLoader;
import entity.*;

import ocsf.*;
import DBControl.*;

/**
 * This class overrides some of the methods in the abstract superclass in order
 * to give more functionality to the server.
 *
 * @author Dr Timothy C. Lethbridge
 * @author Dr Robert Lagani&egrave;re
 * @author Fran&ccedil;ois B&eacute;langer
 * @author Paul Holden
 * @version July 2000
 */

public class EchoServer extends AbstractServer {

	// Class variables *************************************************

	public static final String ANSI_RESET = "\u001B[0m";
	public static final String ANSI_BLACK = "\u001B[30m";
	public static final String ANSI_RED = "\u001B[31m";
	public static final String ANSI_GREEN = "\u001B[32m";
	public static final String ANSI_YELLOW = "\u001B[33m";
	public static final String ANSI_BLUE = "\u001B[34m";
	public static final String ANSI_PURPLE = "\u001B[35m";
	public static final String ANSI_CYAN = "\u001B[36m";
	public static final String ANSI_WHITE = "\u001B[37m";
	
	public static ObservableList<String> ServerLog = FXCollections.observableArrayList();

	
	private static ArrayList<ConnectionToClient> clients = new ArrayList<>();
	// Constructors ****************************************************

	/**
	 * Constructs an instance of the echo server.
	 *
	 * @param port The port number to connect on.
	 * 
	 */
	public static DBConnector dbConnector;

	public EchoServer(String url, String username, String password, int port) {
		super(port);
		dbConnector = new DBConnector(url, username, password);
	}

	// Instance methods ************************************************

	/**
	 * This method handles any messages received from the client.
	 *
	 * @param msg    The message received from the client.
	 * @param client The connection from which the message originated.
	 * 
	 */
	public void handleMessageFromClient(Object msg, ConnectionToClient client) {

		Message message = (Message) msg;
		MessageType messageType = message.getMessageType(); 

		ServerLog.add(getTime() + "> Request: " + messageType + " -- From: " + client.getInetAddress().getHostName() + ".");
		
		User user;
		String lecturerID;
		
		Message messageFromServer = null;

		System.out.println("Message received -> From Client: " + ANSI_CYAN + client + ANSI_RESET + " Message type: "
				+ ANSI_GREEN + messageType + ANSI_RESET);

		switch (messageType) {
		case LogIn:
			user = (User) message.getMessageData();
			User newUser = ClientDBController.authLogIn(user);
			if (newUser != null) {
				messageFromServer = new Message(messageType.LogInSucceeded, newUser);
				updateStatus(client, "Logged In", newUser.getUsername());
			} else {
				messageFromServer = new Message(messageType.LogInFailed, null);
			}
			break;
		case LogOut:
			updateStatus(client, "Connected", "-");
			user = (User) message.getMessageData();
			ClientDBController.logOut(user);
			messageFromServer = new Message(MessageType.LogOutSucceeded, null);
			break;

		case SystemExit:
			updateStatus(client, "Disconnected", "-");
			user = (User) message.getMessageData();
			if (user != null) {
				ClientDBController.logOut(user);
			}
			messageFromServer = new Message(MessageType.SystemExit, null);
			break;
			
		case InProgressExamsList:
			
			ArrayList<ExamInProgress> examslist = ExamDBController.getInProgressExams((User) message.getMessageData());
			
			messageFromServer = new Message(MessageType.InProgressExamsList, examslist);
			
			break;
			
		case GetSubjectsList:
			lecturerID = (String)message.getMessageData();
			ArrayList<Subject> subjectslist = ClientDBController.getSubjectsList(lecturerID);
			
			messageFromServer = new Message(MessageType.GetSubjectsList, subjectslist);
			break;

		case GetCoursesList:
			lecturerID = (String)message.getMessageData();
			
			ArrayList<Course> courseslist = ClientDBController.getCoursesList(lecturerID);
			
			messageFromServer = new Message(MessageType.GetCoursesList, courseslist);
			break;
		case CreateNewQuestion:
			Question newQuetion = (Question) message.getMessageData();
			
			if (ClientDBController.createNewQuestion(newQuetion)) {
				messageFromServer = new Message(MessageType.CreateQuestionSucceeded, newQuetion);
			} else {
				messageFromServer = new Message(MessageType.CreateQuestionFailed, null);
			}
			
			break;
			
		case GetAllQuestion:
			lecturerID = (String) message.getMessageData();
			ArrayList<Question> questionsList = ClientDBController.getQuestionsList(lecturerID);
			
			messageFromServer = new Message(MessageType.QuestionList, questionsList);
			
			break;
			
		case UpdateQuestionData:
			Question newQuetionData = (Question) message.getMessageData();
			
			if (ClientDBController.updateQuestionData(newQuetionData)) {
				messageFromServer = new Message(MessageType.QuestionUpdateSucceeded, newQuetionData);
			} else {
				messageFromServer = new Message(MessageType.QuestionUpdateFailed, null);
			}
			
			break;
			
		case DeleteQuestion:
			Question quetionData = (Question) message.getMessageData();
			
			if (ClientDBController.deleteQuestion(quetionData.getQuestionID())) {
				messageFromServer = new Message(MessageType.QuestionDeleteSucceeded, quetionData);
			} else {
				messageFromServer = new Message(MessageType.QuestionDeleteFailed, null);
			}
			
			break;
			
		case CreateNewExam:
			Exam newExam = (Exam) message.getMessageData();
			
			if (ExamDBController.createNewExam(newExam)) {
				messageFromServer = new Message(MessageType.CreateExamSucceeded, newExam);
			} else {
				messageFromServer = new Message(MessageType.CreateExamFail, null);
			}
			
			break;
			
		case GetExamsList:
			lecturerID = (String) message.getMessageData();
			ArrayList<Exam> examsList = ClientDBController.getExamsList(lecturerID);
			
			messageFromServer = new Message(MessageType.GetExamsList, examsList);
			break;
			
		case GetExamByCode:
			StudentStartExam student = (StudentStartExam) message.getMessageData();
			
			StudentExamInProgress exam = ExamDBController.getExamByCode(student);
			
			messageFromServer = new Message(MessageType.GetExamByCode, exam);
			break;
			
		case GetStudentExams:
		
			ArrayList<StudentExam> studentExams = ClientDBController.getStudentExams((User) message.getMessageData());
			messageFromServer = new Message(MessageType.GetStudentExams, studentExams);
			break;
			
		case LecturerStartExam:
			ExamToPerform examToPerformData = (ExamToPerform) message.getMessageData();
			
			if(ExamDBController.lecturerStartExam(examToPerformData)) {
				messageFromServer = new Message(MessageType.ExamStartedSuccessfuly, null);
			}else {
				messageFromServer = new Message(MessageType.ExamStartFail, null);
			}
			
			break;
			
		case SubmitStudentOnlineExam:
			StudentSubmitedExam submitedExam = (StudentSubmitedExam) message.getMessageData();
			
			if (ExamDBController.submitExamAnswers(submitedExam)) {
				messageFromServer = new Message(MessageType.ExamSubmitSucceeded, null);
			}else {
				messageFromServer = new Message(MessageType.ExamSubmitFail, null);
			}
			break;
			
		case LockExam:
			ExamInProgress examToLock = (ExamInProgress) message.getMessageData();
			ExamDBController.lockExam(examToLock);
			sendToAllClients(message);
			return;
			
		case GetStudentsExams:
			user = (User) message.getMessageData();
			ArrayList<StudentExam> studentsExams = ExamDBController.getStudentsExams(user);
			messageFromServer = new Message(MessageType.GetStudentsExams, studentsExams);
			break;
			
		case GetStudentExamToCheck:
			StudentExam studentExam = (StudentExam) message.getMessageData();
			StudentExamToCheck examToCheck = ExamDBController.getStudentExamDone(studentExam);
			messageFromServer = new Message(MessageType.GetStudentExamToCheck, examToCheck);
			break;
			
		case SubmitExamGrade:
			SubmitedExamGrade submitedGrade = (SubmitedExamGrade) message.getMessageData();
			if (ExamDBController.submitStudentExamGrade(submitedGrade)) {
				messageFromServer = new Message(MessageType.SubmitExamGradeSucceeded, null);
			}else {
				messageFromServer = new Message(MessageType.SubmitExamGradeFailed, null);
			}
			
			break;
			
		case RequestExtraTime:
			ExtraTimeRequest request = (ExtraTimeRequest) message.getMessageData();
			if (ExamDBController.requestExtraTimeExam(request)) {
				messageFromServer = new Message(MessageType.RequestExtraSucceeded, null);
			} else {
				messageFromServer = new Message(MessageType.RequestExtraFailed, null);
			}
			break;
			
		case GetDoneExams:
			user = (User) message.getMessageData();
			
			ArrayList<ExamDone> doneExamsList = ExamDBController.getDoneExams(user);
			messageFromServer = new Message(MessageType.GetDoneExams, doneExamsList);
			
			break;
//////////////Department Head Start///////////////
			
		case ListRequestsForDH:
			
			ArrayList<DurationRequest> requestslist = ClientDBController.getRequestList();
			
			messageFromServer = new Message(MessageType.ListRequestsForDH, requestslist);
			break;
			
		case approveTheRequest:
			DurationRequest ApproveRequest = (DurationRequest) message.getMessageData();
			ClientDBController.updateRequestStatusInDataApprove(ApproveRequest);
			messageFromServer = new Message(MessageType.approveTheRequest, ApproveRequest);
			sendToAllClients(messageFromServer);
			return;
		
		case declineTheRequest:
			DurationRequest DeclineRequest = (DurationRequest) message.getMessageData();
			ClientDBController.updateRequestStatusInDataDecline(DeclineRequest);
			messageFromServer = new Message(MessageType.declineTheRequest, null);
			break;
		///Lecture Report 	   
		case ListLecReportsDH:
			lecturerID = (String) message.getMessageData();
			ArrayList<LectureReport> lecturerReporstList =  ClientDBController.getLectureReportList(lecturerID);
			messageFromServer = new Message(MessageType.ListLecReportsDH, lecturerReporstList);
			break;

		//Student Report		
		case ListStdReportsDH:
			
			String studentID = (String) message.getMessageData();
			ArrayList<StudentReport> stdentReporstList = ClientDBController.getStudentReportList(studentID);
			messageFromServer = new Message(MessageType.ListStdReportsDH, stdentReporstList);
			break;
		case ListCourseReportsDH:
			String courseID = (String) message.getMessageData();
			ArrayList<CoruseReport> courseReporstList = ClientDBController.getCourseReportList(courseID);
			messageFromServer = new Message(MessageType.ListCourseReportsDH, courseReporstList);
			break;
		
		case GetSubjectsListDH:
			ArrayList<Subject> subejctListDH = ClientDBController.getSubejctListDH();
			messageFromServer = new Message(MessageType.GetSubjectsListDH, subejctListDH);
			break;
			
		case GetCoursesListDH:
			ArrayList<Course> CourseListDH = ClientDBController.getCoursesListDH();
			messageFromServer = new Message(MessageType.GetCoursesListDH, CourseListDH);
			break;
			
			
		case GetAllExamsListDH:
			ArrayList<Exam> ExamListDH = ClientDBController.getAllExamsListForDH();
			messageFromServer = new Message(MessageType.GetAllExamsListDH, ExamListDH);
			break;	
		case GetAllExamQuestion:
			String ExamID = (String) message.getMessageData();
			ArrayList<QuestionForExam> ExamQuestionDH = ClientDBController.getQuestionExamsList(ExamID);			
			messageFromServer = new Message(MessageType.GetAllExamQuestion, ExamQuestionDH);
			break;
			
		case GetQuestionsListDH:
			ArrayList<Question> questionListDH = ClientDBController.getQuestionsListDH();
			messageFromServer = new Message(MessageType.GetQuestionsListDH, questionListDH);
			break;
		
			
			/// users list 
		case GetUsersList:		
			ArrayList<User> usersList  = ClientDBController.getUsersList();	
			messageFromServer = new Message(MessageType.GetUsersList, usersList);
			break;
			
		case GetLecturerExamReport:
			ExamDone examDone = (ExamDone)message.getMessageData(); 
			ArrayList<StudentExamGrade> studnetgrades = ExamDBController.getLecturerExamReport(examDone);
			messageFromServer = new Message(MessageType.GetLecturerExamReport, studnetgrades);
			break;
	
		////////////////////END///////////////////////////////////////////////////
			
//		case extraTime:
//			sendToAllClients(messageFromServer);
//
//			break;
		}
		
		
		try {
			System.out.println("Return Message For Client: " + ANSI_PURPLE + client + ANSI_RESET + " Message type: "
					+ ANSI_YELLOW + messageFromServer.getMessageType() + ANSI_RESET);
			client.sendToClient(messageFromServer);
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	private void updateStatus(ConnectionToClient client, String status, String loggedInAs) {
		for (int i = 0; i < ServerUI.control.clientList.size(); i++) {
			Client clientData = ServerUI.control.clientList.get(i);
			if (clientData.getIpAddress().equals(client.getInetAddress().getHostName())) {
				clientData.setLoggedInAs(loggedInAs);
				clientData.setStatus(status);
				ServerUI.control.clientList.set(i, clientData);
			}
		}
	}

	public void clientConnected(ConnectionToClient client) {
		System.out.println("->Client Connected");
		clients.add(client);
		try {
//			dbConnector.createConnection();// start it one time per client "connect to the database"
//			System.out.println("Data base connected");
			client.getInetAddress();

			addClient(InetAddress.getLocalHost(), client.getInetAddress().getHostName(), "Connected");
			
			
			ServerLog.add(getTime() + "> Client Connected with IP Address: " + client.getInetAddress().getHostName() + ".");
			
		} catch (java.net.UnknownHostException e) {
			e.printStackTrace();
		}
	}

	public void clientDisconnected(ConnectionToClient client) {
		System.out.println("->Client DisConnected");
		clients.remove(client);
		try {
			addClient(client.getInetAddress().getLocalHost(), client.getInetAddress().getHostName(), "Disconnected");
			
			ServerLog.add(getTime() + "> Client Disconnected with IP Address:" + client.getInetAddress().getHostName() + ".");
			
		} catch (java.net.UnknownHostException e) {
			e.printStackTrace();
		}
	}

	private void addClient(InetAddress HostName, String IP, String Status) {
		System.out.println("Host: " + HostName + " IP: " + IP + " Status: " + Status);
		ServerUI.control.clientList.add(new Client(IP, HostName.toString(), Status, "-"));
	}

	/**
	 * This method overrides the one in the superclass. Called when the server
	 * starts listening for connections.
	 */
	protected void serverStarted() {
		super.serverStarted();
		System.out.println("Server listening for connections on port " + getPort());
		ServerLog.add(getTime() + "> Server listening for connections on port " + getPort() + ".");

	}

	/**
	 * This method overrides the one in the superclass. Called when the server stops
	 * listening for connections.
	 */
	protected void serverStopped() {
		super.serverStopped();
		System.out.println("Server has stopped listening for connections.");
		ServerLog.add(getTime() + "> Server has stopped listening for connections.");
	}
	
	public static String getTime() {
		LocalTime currentTime = LocalTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");
        return currentTime.format(formatter);
	}
}
//End of EchoServer class
