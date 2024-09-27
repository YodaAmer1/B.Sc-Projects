package controllers;

import javafx.application.Application;
import javafx.application.Platform;
import javafx.beans.property.ReadOnlyObjectWrapper;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.collections.transformation.FilteredList;
import javafx.collections.transformation.SortedList;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.control.Alert.AlertType;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.Pane;
import javafx.stage.Stage;
import javafx.stage.StageStyle;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Random;
import java.util.ResourceBundle;

import client.ChatClient;
import client.ClientController;
import client.ClientUI;

import entity.*;


public class DepartmentHeadMainMenuController extends Application implements Initializable {
	
	private enum buttonType{
		RequestButton,
		ReportsButton,
		ExamBanksButton,
		QuestionsBanksButton,
	}


	@FXML
	private Label lblUsername = new Label();
	
	// The Images That will appear in this stage

	@FXML
	private ImageView imageSearch = new ImageView();
	
	@FXML
	private ImageView imageAvatar = new ImageView();

	@FXML
	private ImageView sideImage = new ImageView();
	
	@FXML
	private ImageView imageReport = new ImageView();
	
	@FXML
	private ImageView imageLogo = new ImageView();
	
	@FXML
	private ImageView imageBtnRequests = new ImageView();

	@FXML
	private ImageView imageBtnQuestions = new ImageView();

	@FXML
	private ImageView imageBtnReports = new ImageView();
	
	@FXML
	private ImageView imageBtnExams = new ImageView();
	
	@FXML
	private ImageView imageLogOut = new ImageView();
	
	@FXML
	private ImageView imageExit = new ImageView();
	
	// All the buttons in the stage

	@FXML
	private Button btnRequestsDH;
	
	@FXML
	private Button btnReportsDH;
	
	@FXML
	private Button btnExamsBankDH;
	
	@FXML
	private Button btnQuestionsBankDH;
	
	@FXML
	private Button btnLogOut;
	
	@FXML
	private Button btnExit;

	
////////All The changeable Panes___________________________________________________

	@FXML
	private Pane pnlWelcome;
		
	
///////Request Pane____________________________________________________________________________
	
	@FXML
	private Pane pnlRequest;
	
	@FXML
	private TextField SearchText_Request;
	
	//////////Table for request//////////////////
	@FXML
	private Button btnapproveRequest;
	
	@FXML
	private Button btndeclineRequest;
	
	@FXML
	private TableView<DurationRequest> RequestTableView;

	@FXML
	private TableColumn<DurationRequest, Integer> RequestIDColumn;

	@FXML
	private TableColumn<DurationRequest, Integer> ExamIDColumn;
	
	@FXML
	private TableColumn<DurationRequest, String> LectureNameColumn;
	
	@FXML
	private TableColumn<DurationRequest, String> CourseColumn;

	@FXML
	private TableColumn<DurationRequest, String> TopicColumn;

	@FXML
	private TableColumn<DurationRequest, Integer> PreDurationColumn;
	
	@FXML
	private TableColumn<DurationRequest, Integer> ReDurationColumn;
	
	@FXML
	private TableColumn<DurationRequest, String> ReasonColumn;
	
	
	private ObservableList<DurationRequest> DurationRequestList = FXCollections.observableArrayList();
	
	private FilteredList<DurationRequest> filteredData;

	private SortedList<DurationRequest> sortedData;
	
	
//////Exams Pane_________________________________________________________
	
	
	@FXML
	private Pane pnlExamsBank;
	
	@FXML
	private TextField examSearch;
	
	@FXML
	private TableView<Exam> examsTableView;

	@FXML
	private TableColumn<Exam, String> examIDColumn;
	
	@FXML
	private TableColumn<Exam, String> examSubjectColumn;
	
	@FXML
	private TableColumn<Exam, String> examCourseColumn;

	@FXML
	private TableColumn<Exam, String> examTimeColumn;

	@FXML
	private TableColumn<Exam, String> examLecturerColumn;

	@FXML
	private TableColumn<Exam, Integer> numOfQuestionColumn;
	
	private ObservableList<Exam> examsList = FXCollections.observableArrayList();
	
	private FilteredList<Exam> filteredExam;

	private SortedList<Exam> sortedExam;
	
	@FXML
	private Button btnViewExam;

	
	
///////Report Pane______________________________________________________

@FXML
	private Pane pnlReports;
	
	@FXML
	private TextField IDTypeSearchTextField;
	
	@FXML
	private ComboBox<String>ReportTypeComboBox = new ComboBox<>();
	
	@FXML
	private Button btnReportsView;
	
	// 1: student report  2:lecturer report  3:course  report 
	private int choosenReportType=0;
	
	
///////Exams Bank Pane_______________________________________________________

	/*@FXML
	private Pane pnlExamsBank;*/
	
	
///////Questions Bank Pane_____________________________________________________

	@FXML
	private Pane pnlQuestionsBank;
	
	@FXML
	private TextField questionDHSearch;
	
	@FXML
	private TableView<Question> questionsTableDHView;

	@FXML
	private TableColumn<Question, String> questionIDClm;

	@FXML
	private TableColumn<Question, String> questionSubjectClm;
	
	@FXML
	private TableColumn<Question, String> questionTextClm;
	
	@FXML
	private TableColumn<Question, String> LecNameClm;
	
	@FXML
	private TableColumn<Question, Button> questionViewButtonClm;
	
	
	private ObservableList<Question> questionsList = FXCollections.observableArrayList();
	
	private FilteredList<Question> filteredQuestionData;

	private SortedList<Question> sortedQuestionData;
	
/////////////// the coordinates variables (x, y) for the drag

	private double x, y;
	
	public static DurationRequest durationRequest;
	
	public static void main(String[] args) {
		launch(args);
	}
	
/////////////// Stage Methods_____________________________________________________________________________________

	//@Override
	public void start(Stage primaryStage) throws Exception {
		Parent root = FXMLLoader.load(getClass().getResource("/gui/DepartmentHeadMainMenu.fxml"));
		
		Scene scene = new Scene(root);
		scene.getStylesheets().add(getClass().getResource("/style/DepartmentHeadMainMenuStyle.css").toExternalForm());
		
		primaryStage.setScene(scene);
		// set stage borderless
		primaryStage.initStyle(StageStyle.UNDECORATED);

		// drag it here
		root.setOnMousePressed(event -> {
			x = event.getSceneX();
			y = event.getSceneY();
		});
		root.setOnMouseDragged(event -> {
			primaryStage.setX(event.getScreenX() - x);
			primaryStage.setY(event.getScreenY() - y);
		});

		primaryStage.show();
	}
	
	
	/**
	 *initialize the images.
	 *initialize two searches:Request panel and Question bank panel  
	 */
	@Override
	public void initialize(URL location, ResourceBundle resources) {
		// Initialize the name of the logged in user
		lblUsername.setText("Hello " + ClientUI.chat.client.user.getUsername());
		
	
		
		// Initialize the images in the page
	
		Image imageSide = new Image(getClass().getResourceAsStream("/images/side_Image.png"));
		Image imagereport = new Image(getClass().getResourceAsStream("/images/imageReport.jpeg"));
		Image avatarImage = new Image(getClass().getResourceAsStream("/images/avatar_64.png"));
		Image logoImage = new Image(getClass().getResourceAsStream("/images/logo.png"));
		Image examImage = new Image(getClass().getResourceAsStream("/images/exam_64.png"));
		Image questionsImage = new Image(getClass().getResourceAsStream("/images/questions_64.png"));
		Image reportImage = new Image(getClass().getResourceAsStream("/images/chart_64.png"));
		Image requestsImage = new Image(getClass().getResourceAsStream("/images/request_64.png"));
		Image logOutImage = new Image(getClass().getResourceAsStream("/images/logout_64.png"));
		Image exitImage = new Image(getClass().getResourceAsStream("/images/Exit.png"));
		sideImage.setImage(imageSide);
		imageReport.setImage(imagereport);
		imageAvatar.setImage(avatarImage);
		imageLogo.setImage(logoImage);
		imageBtnExams.setImage(examImage);
		imageBtnQuestions.setImage(questionsImage);
		imageBtnReports.setImage(reportImage);
		imageBtnRequests.setImage(requestsImage);
		imageLogOut.setImage(logOutImage);
		imageExit.setImage(exitImage);
	
		//////////////filter for Requests Table///////////////////////

		// Wrap the ObservableList in a FilteredList (initially display all data).
		filteredData = new FilteredList<>(DurationRequestList, b -> true);

		// 2. Set the filter Predicate whenever the filter changes.
		SearchText_Request.textProperty().addListener((observable, oldValue, newValue) -> {
		     filteredData.setPredicate(DurationRequest -> {
		        // If filter text is empty, display all DurationRequests.
		        if (newValue == null || newValue.isEmpty()) {
		            return true;
		        }

		        // Compare fields of every DurationRequest with filter text.
		        String lowerCaseFilter = newValue.toLowerCase();

		        if (String.valueOf(DurationRequest.getRequestID()).toLowerCase().indexOf(lowerCaseFilter) != -1) {
		            return true; // Filter matches Request ID.
		        } 
		        else if (String.valueOf(DurationRequest.getExamID()).toLowerCase().indexOf(lowerCaseFilter) != -1) {
		            return true; // Filter matches Exam ID.
		        } 
		        else if (String.valueOf(DurationRequest.getLectureID()).toLowerCase().indexOf(lowerCaseFilter) != -1) {
		            return true; // Filter matches Lecture ID.
		        }
		        else if (DurationRequest.getLectureName().toLowerCase().contains(lowerCaseFilter)) {
		            return true; // Filter matches lecturer name.
		        } else if (DurationRequest.getCourse().toLowerCase().contains(lowerCaseFilter)) {
		            return true; // Filter matches course name.
		        } else if (DurationRequest.getTopic().toLowerCase().contains(lowerCaseFilter)) {
		            return true; // Filter matches subject.
		        } else if (String.valueOf(DurationRequest.getPre_duration()).toLowerCase().indexOf(lowerCaseFilter) != -1) {
		            return true; // Filter matches Preduration.
		        } else if (String.valueOf(DurationRequest.getRe_duration()).toLowerCase().indexOf(lowerCaseFilter) != -1) {
		            return true; // Filter matches Reduration.
		        } else if (DurationRequest.getReason().toLowerCase().contains(lowerCaseFilter)) {
		            return true; // Filter matches Reason.
		        }
		        else {
		            return false; // Does not match.
		        }
		    });
		});


		// 3. Wrap the FilteredList in a SortedList.
		sortedData = new SortedList<>(filteredData);

		// 4. Bind the SortedList comparator to the TableView comparator.
		// Otherwise, sorting the TableView would have no effect.
		sortedData.comparatorProperty().bind(RequestTableView.comparatorProperty());
		
		//////////////filter for Questions Table///////////////////////
		
		// Wrap the ObservableList in a FilteredList (initially display all data).
		filteredQuestionData = new FilteredList<>(questionsList, b -> true);

		// Set the filter Predicate whenever the filter changes.
		questionDHSearch.textProperty().addListener((observable, oldValue, newValue) -> {
			filteredQuestionData.setPredicate(question -> {
				// If filter text is empty, display all persons.

				if (newValue == null || newValue.isEmpty()) {
					return true;
				}

				// Compare first name and last name of every person with filter text.
				String lowerCaseFilter = newValue.toLowerCase();

				if (question.getQuestionID().toLowerCase().indexOf(lowerCaseFilter) != -1) {
					return true; // Filter matches first name.
				} else if (question.getQuestionSubject().toLowerCase().indexOf(lowerCaseFilter) != -1) {
					return true; // Filter matches last name.
				} else if (question.getQuestionText().toLowerCase().indexOf(lowerCaseFilter) != -1) {
					return true; // Filter matches last name.
				} else if (question.getLecturerName().toLowerCase().indexOf(lowerCaseFilter) != -1) {
					return true; // Filter matches last name.
				} else
					return false; // Does not match.
			});
		});

		// Wrap the FilteredList in a SortedList.
		sortedQuestionData = new SortedList<>(filteredQuestionData);

		// Bind the SortedList comparator to the TableView comparator.
		// Otherwise, sorting the TableView would have no effect.
		sortedQuestionData.comparatorProperty().bind(questionsTableDHView.comparatorProperty());
	
		//Open the welcome panel in first call to DepartmentHeadMainMenuController() method
		pnlWelcome.toFront();
	}

	
	/**
	 * The method handles the activation of the panels 
	 * according to the pressing of the corresponding
	 *  button on the main screen
	 * @param actionEvent
	 */
	@FXML
	public void handleClicks(ActionEvent actionEvent){
		//REPORT
		if (actionEvent.getSource() == btnReportsDH) {
			setButtonStyle(buttonType.ReportsButton);
			pnlReports.toFront();
			
			//Initialize the comboBox in Reports Panel
			ReportTypeComboBox.setItems(FXCollections.observableArrayList("Student",  "Lecturer", "Course"));
			ReportTypeComboBox.setOnAction(event -> {
				String selectedItem = ReportTypeComboBox.getSelectionModel().getSelectedItem();
				if (selectedItem != null) {
					if(selectedItem.equals("Student")) {
						choosenReportType = 1;
						IDTypeSearchTextField.setPromptText("Enter Student ID");
					}else if(selectedItem.equals("Lecturer")){
						choosenReportType = 2;
						IDTypeSearchTextField.setPromptText("Enter Lecturer ID");
					}else{
						choosenReportType = 3;
						IDTypeSearchTextField.setPromptText("Enter Course ID");
					}
				}
			});
			
		}
		//REQUEST panel
		if (actionEvent.getSource() == btnRequestsDH) {
			initializeRequestTableColumns();
			fillRequestTable();
			setButtonStyle(buttonType.RequestButton);
			pnlRequest.toFront();
		}
		
		//Exams Bank panel
		if (actionEvent.getSource() == btnExamsBankDH) {
			setButtonStyle(buttonType.ExamBanksButton);
			initializeExamsTableColumns();
			fillExamsTable();
			pnlExamsBank.toFront();

		}
		//Questions Bank panel
		if (actionEvent.getSource() == btnQuestionsBankDH) {
			setButtonStyle(buttonType.QuestionsBanksButton);
			initializeQuestionsTableColumns();
			fillQuestionsTable();
			pnlQuestionsBank.toFront();
		
		}
	}
	
	/** 
	 * @param PressedButton
	 */
	private void setButtonStyle(buttonType PressedButton) {
		Image requestsImage;
		Image examImage;
		Image reportImage;
		Image questionsImage;
		switch (PressedButton) 
		{
		case RequestButton:
			requestsImage = new Image(getClass().getResourceAsStream("/images/request_white_64.png"));
			examImage = new Image(getClass().getResourceAsStream("/images/exam_64.png"));
			reportImage = new Image(getClass().getResourceAsStream("/images/chart_64.png"));
			questionsImage = new Image(getClass().getResourceAsStream("/images/questions_64.png"));
			imageBtnRequests.setImage(requestsImage);
			imageBtnExams.setImage(examImage);
			imageBtnReports.setImage(reportImage);
			imageBtnQuestions.setImage(questionsImage);
			
			btnReportsDH.setStyle(null);
			btnExamsBankDH.setStyle(null);
			btnQuestionsBankDH.setStyle(null);
			btnRequestsDH.setStyle("-fx-background-radius: 10; -fx-background-color : #4F2CC1; -fx-text-fill : #f5f5f5");
			break;
		
		case ExamBanksButton:
			requestsImage = new Image(getClass().getResourceAsStream("/images/request_64.png"));
			examImage = new Image(getClass().getResourceAsStream("/images/exam_white_64.png"));
			reportImage = new Image(getClass().getResourceAsStream("/images/chart_64.png"));
			questionsImage = new Image(getClass().getResourceAsStream("/images/questions_64.png"));
			imageBtnRequests.setImage(requestsImage);
			imageBtnExams.setImage(examImage);
			imageBtnReports.setImage(reportImage);
			imageBtnQuestions.setImage(questionsImage);
			
			btnRequestsDH.setStyle(null);
			btnReportsDH.setStyle(null);
			btnQuestionsBankDH.setStyle(null);
			btnExamsBankDH.setStyle("-fx-background-radius: 10; -fx-background-color : #4F2CC1; -fx-text-fill : #f5f5f5");
			break;
			
		case QuestionsBanksButton:
			requestsImage = new Image(getClass().getResourceAsStream("/images/request_64.png"));
			examImage = new Image(getClass().getResourceAsStream("/images/exam_64.png"));
			reportImage = new Image(getClass().getResourceAsStream("/images/chart_64.png"));
			questionsImage = new Image(getClass().getResourceAsStream("/images/questions_white_64.png"));
			imageBtnRequests.setImage(requestsImage);
			imageBtnExams.setImage(examImage);
			imageBtnReports.setImage(reportImage);
			imageBtnQuestions.setImage(questionsImage);
			
			btnRequestsDH.setStyle(null);
			btnReportsDH.setStyle(null);
			btnExamsBankDH.setStyle(null);
			btnQuestionsBankDH.setStyle("-fx-background-radius: 10; -fx-background-color : #4F2CC1; -fx-text-fill : #f5f5f5");
			break;
		
	
		case ReportsButton:
			requestsImage = new Image(getClass().getResourceAsStream("/images/request_64.png"));
			examImage = new Image(getClass().getResourceAsStream("/images/exam_64.png"));
			reportImage = new Image(getClass().getResourceAsStream("/images/chart_white_64.png"));
			questionsImage = new Image(getClass().getResourceAsStream("/images/questions_64.png"));
			imageBtnRequests.setImage(requestsImage);
			imageBtnExams.setImage(examImage);
			imageBtnReports.setImage(reportImage);
			imageBtnQuestions.setImage(questionsImage);
			
			btnRequestsDH.setStyle(null);
			btnExamsBankDH.setStyle(null);
			btnQuestionsBankDH.setStyle(null);
			btnReportsDH.setStyle("-fx-background-radius: 10; -fx-background-color : #4F2CC1; -fx-text-fill : #f5f5f5");
			break;
	
		}
	}
	

/////////////// Requests Pane Methods_____________________________________________________________________________________

	/**
	 * Initializes the columns of the request table with their respective cell value factories.
	 */
	private void initializeRequestTableColumns() {
	    // Set the cell value factory for the RequestIDColumn
	    RequestIDColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getRequestID()));
	    
	    // Set the cell value factory for the ExamIDColumn
	    ExamIDColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getExamID()));

	    // Set the cell value factory for the LectureNameColumn
	    LectureNameColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getLectureName()));

	    // Set the cell value factory for the PreDurationColumn
	    PreDurationColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getPre_duration()));
	    
	    // Set the cell value factory for the ReDurationColumn
	    ReDurationColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getRe_duration()));
	    
	    // Set the cell value factory for the TopicColumn
	    TopicColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getTopic()));
	   
	    // Set the cell value factory for the CourseColumn
	    CourseColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getCourse()));
	    
	    // Set the cell value factory for the ReasonColumn
	    ReasonColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getReason()));
	}

	/**
	 * Fills the request table with duration requests obtained from the server.
	 * This method clears the existing items in the table, retrieves duration requests from the server,
	 * adds them to the DurationRequestList, and sets the sortedData as the items of the request table.
	 */
	private void fillRequestTable() {
	    // Clear the existing items in the request table
		DurationRequestList.clear();

	    // Create a new message to request duration requests for the current user
	    Message message = new Message(MessageType.ListRequestsForDH, ClientUI.chat.client.user.getId());
	    // Send the message to the server and wait for a response
	    ClientUI.chat.accept(message);
	    
	    // Retrieve the duration requests from the server's response
	    ArrayList<DurationRequest> requestArray = ClientUI.chat.client.requestList;
	    
	    // Add the retrieved duration requests to the DurationRequestList
	    DurationRequestList.addAll(requestArray);
	    
	    // 5. Add sorted (and filtered) data to the table.	   
	    RequestTableView.setItems(sortedData);
	    
	}

	
	
	/**
	 * Handles the click event when the approve request button is clicked.
	 * This method retrieves the selected duration request from the request table,
	 * sends an approval request to the server, and removes the approved request from the table.
	 *
	 * @param event The ActionEvent object representing the click event.
	 */
	@FXML
	public void handleApproveRequestClick(ActionEvent event) {
	    System.out.println("Approve Request");
	  
	    // Retrieve the selected duration request from the request table
	    durationRequest = RequestTableView.getSelectionModel().getSelectedItem();
	    
	    if (durationRequest != null) {
	        System.out.println(durationRequest.getRequestID());
	        
	        // Create a message to send the approval request to the server, with the selected duration request as the payload
	        Message msg = new Message(MessageType.approveTheRequest, durationRequest);
	        
	        // Send the approval request message to the server
	        ClientUI.chat.accept(msg);
	        
	        // Remove the approved request from the Duration Request List
	        DurationRequestList.remove(durationRequest);
	        
	        // Display a success message to the user
	        ClientUI.display(DialogType.Success, "Success", "Your approve request has been successfully sent");
	    } else {
	        // Display an attention message to the user if no request is selected
	        ClientUI.display(DialogType.Attention, "Attention", "There are several requests available to you, please select one");
	    }
	}

	/**
	 * Handles the click event when the decline request button is clicked.
	 * This method retrieves the selected duration request from the request table,
	 * sends a decline request to the server, and removes the declined request from the table.
	 *
	 * @param event The ActionEvent object representing the click event.
	 */
	@FXML
	public void handleDeclineRequestClicks(ActionEvent event) {
	    System.out.println("Decline Request");
	    
	    // Retrieve the selected duration request from the request table
	    durationRequest = RequestTableView.getSelectionModel().getSelectedItem();
	    
	    if (durationRequest != null) {
	        System.out.println(durationRequest.getRequestID());
	        
	        // Create a message to send the decline request to the server, with the selected duration request as the payload
	        Message msg = new Message(MessageType.declineTheRequest, durationRequest);
	        
	        // Send the decline request message to the server
	        ClientUI.chat.accept(msg);
	        
	        // Remove the declined request from the Duration Request Lis
	        DurationRequestList.remove(durationRequest);
	        
	        // Display a success message to the user
	        ClientUI.display(DialogType.Success, "Success", "Your decline request has been successfully sent");
	    } else {
	        // Display an attention message to the user if no request is selected
	        ClientUI.display(DialogType.Attention, "Attention", "There are several requests available to you, please select one");
	    }
	}
	
/////////////// Questions Pane Methods_____________________________________________________________________________________

	/**
	 * Initializes the columns of the questions bank table with their respective cell value factories
	 */
	private void initializeQuestionsTableColumns() {
	questionIDClm
			.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getQuestionID()));
	questionSubjectClm
			.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getQuestionSubject()));
	questionTextClm
			.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getQuestionText()));
	LecNameClm
	.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getLecturerName()));
	questionViewButtonClm
			.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getBtnViewQuestion()));
	
	}
	
	/**
	 * Fills the questions bank table with questions obtained from the server.
	 * This method clears the existing items in the table, retrieves questions bank from the server,
	 * adds them to the questionsList, and sets the sortedData as the items of the questions bank table.
	 */
	private void fillQuestionsTable() {
	questionsList.clear();
	
	//send message to  the clientUI  
	Message message = new Message(MessageType.GetQuestionsListDH, null);
	ClientUI.chat.accept(message);
	
	//Create new buttons in the last column in table with text "view" 
	//initialize the handle clicked button to open QuestionsBankDHController() method  
	ArrayList<Question> questionsArray = ClientUI.chat.client.questionListDH;
	for (Question quest : questionsArray) {
		Button viewButton = new Button("View");
		viewButton.setOnAction(event -> {
			Platform.runLater(() -> {
				try {
					ClientUI.chat.client.question = quest;
					QuestionsBankDHController form = new QuestionsBankDHController();
					form.start(new Stage());
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			});
		});
		quest.setBtnViewQuestion(viewButton);
	}
	//add all the questionsArray after the initialization 
	questionsList.addAll(questionsArray);
	
	//Add sorted (and filtered) data to the table.
	questionsTableDHView.setItems(sortedQuestionData);
	}	

/////////ExitButon______________
	/**
	 * Handles the click event when the exit button is clicked.
	 * This method closes the current window.
	 *
	 * @param event The ActionEvent object representing the click event.
	 */
//	@FXML
//	public void exitButton(ActionEvent event) {
//	    // Get the source of the event and hide the window associated with it
//	    ((Node) event.getSource()).getScene().getWindow().hide();
//	}

	/**
	 * Handles the click event when the exit button is clicked.
	 * This method terminates the application by calling the `System.exit()` method with a status code of 0.
	 */
//	public void handleExitButtonClicked() {
//	    ClientController.systemExit();
//	}

	
	private void initializeExamsTableColumns() {

		examIDColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getExamID()));
		
		examSubjectColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getSubject()));
		
		examCourseColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getCourse()));
		
		examTimeColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getTime()));
		
		examLecturerColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getLecturerName()));
		
		numOfQuestionColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getNumOfQuestions()));

		
		// Wrap the ObservableList in a FilteredList (initially display all data).
		filteredExam = new FilteredList<>(examsList, b -> true);

		// Set the filter Predicate whenever the filter changes.
		examSearch.textProperty().addListener((observable, oldValue, newValue) -> {
			filteredExam.setPredicate(exam -> {
				
				// If filter text is empty, display all persons.
				if (newValue == null || newValue.isEmpty()) {
					return true;
				}

				// Compare data of every exam with filter text.
				String lowerCaseFilter = newValue.toLowerCase();

				if (exam.getExamID().toLowerCase().indexOf(lowerCaseFilter) != -1) {
					return true; // Filter matches exam id.
				}else if (exam.getSubject().toLowerCase().indexOf(lowerCaseFilter) != -1) {
					return true; // Filter matches Subject.
				}else if (exam.getCourse().toLowerCase().indexOf(lowerCaseFilter) != -1) {
					return true; // Filter matches Course.
				} else if (exam.getLecturerName().toLowerCase().indexOf(lowerCaseFilter) != -1) {
					return true; // Filter matches lecturer.
				} else if (exam.getTime().toLowerCase().indexOf(lowerCaseFilter) != -1) {
					return true; // Filter matches exam Time.
				}else if (Integer.toString(exam.getNumOfQuestions()).toString().toLowerCase().indexOf(lowerCaseFilter) != -1) {
					return true; // Filter matches exam Time.
				} else
					return false; // Does not match.
			});
		});

		// Wrap the FilteredList in a SortedList.
		sortedExam = new SortedList<>(filteredExam);

		// Bind the SortedList comparator to the TableView comparator.
		// Otherwise, sorting the TableView would have no effect.
		sortedExam.comparatorProperty().bind(examsTableView.comparatorProperty());

		// Add listener for selected exam
		examsTableView.getSelectionModel().selectedItemProperty().addListener((observable, oldValue, newValue) -> {
			if (newValue != null) {
				btnViewExam.setDisable(false);
			} else {
				btnViewExam.setDisable(true);
			}
		});
	}

	private void fillExamsTable() {
		examsList.clear();

		//Build message to send to the server
		Message message = new Message(MessageType.GetAllExamsListDH,null);
		ClientUI.chat.accept(message);

		ArrayList<Exam> examsArray = ClientUI.chat.client.examsList;
		
		examsList.addAll(examsArray);

		// Add sorted (and filtered) data to the table.
		examsTableView.setItems(sortedExam);
	}

	
	@FXML
	public void handleViewExamButtonClicked(ActionEvent event) {
		System.out.println("Selecting an exam for viewing");
		Exam examData = examsTableView.getSelectionModel().getSelectedItem();	 
	    if (examData != null) {
	        System.out.println(examData.getExamID()); 
	        // Display a success message to the user
	        ClientUI.display(DialogType.Success, "Success", "Successfully selected an exam for viewing");
	    } else {
	        // Display an attention message to the user if no request is selected
	        ClientUI.display(DialogType.Attention, "Attention", "First, select an exam to view");
	    }
   }

	
//////////////Reports Pane Methods___________________________

	/**
	 * Check if the id lecture/student entered in search text field is in the data 
	 * 
	 */
	private boolean CheckIdIsExit(int role)
	{
		//send message to ClientUI to get user list
		Message message = new Message(MessageType.GetUsersList, null);
		ClientUI.chat.accept(message);

		for (User user : ClientUI.chat.client.userlist) {
			//check if the id exit in user list(data)
			if (IDTypeSearchTextField.getText().equals(user.getId()) && user.getRole()==role) {
	            return true;
	        }
		}
	    return false;
	}
	
	/**
	 * Check if the id course entered in search text field is in the data 
	 */
	private boolean CheckIdCourseIsExit()
	{
		//send message to ClientUI to get course list
		Message message = new Message(MessageType.GetCoursesListDH, null);
		ClientUI.chat.accept(message);

		for (Course courseid : ClientUI.chat.client.coursesList) {
			//check if the id exit in course list(data)
			if (IDTypeSearchTextField.getText().equals(courseid.getCourseID())) {
	            return true;
	        }
		}
	    return false;
	}
	
	/**
	 * @param event
	 * @throws Exception
	 */
	@FXML
	public void handleReportsButtonClicked(ActionEvent event)throws Exception {
	    // Check if the IDTypeSearchTextField is not empty
		if(!IDTypeSearchTextField.getText().equals("")) {
	        // Switch statement based on the choosenReportType
			switch (choosenReportType) 
			{
            // Student report
			    case 1:
	                // Check if the entered ID exists
			    	if(CheckIdIsExit(2)) {
	                    // Set the ID in the ReportStudentDHController
			    		ReportStudentDHController.id = IDTypeSearchTextField.getText();
	                    // Hide the current window
						((Node) event.getSource()).getScene().getWindow().hide();
	                    // Open a new window for generating the student report
						new ReportStudentDHController().start(new Stage());
			    	}					
			    	break;
		        //Lecture report
			    case 2:
	                // Check if the entered ID exists
			    	if(CheckIdIsExit(1)) {
	                    // Set the ID in the ReportLectureDHController
			    		ReportLectureDHController.id = IDTypeSearchTextField.getText();
	                    // Hide the current window
						((Node) event.getSource()).getScene().getWindow().hide();
	                    // Open a new window for generating the lecture report
						new ReportLectureDHController().start(new Stage());
			    	}		
					break;
		            // Course report
			    case 3:
	                // Check if the entered course ID exists
			    	if(CheckIdCourseIsExit()) {
	                    // Set the course ID in the ReportCourseDHController
			    		ReportCourseDHController.idCourse = IDTypeSearchTextField.getText();
	                    // Hide the current window
						((Node) event.getSource()).getScene().getWindow().hide();
	                    // Open a new window for generating the course report
						new ReportCourseDHController().start(new Stage());
			    	}
			    	
					break;
			    default:
	                // No report type selected
					System.out.print("Please select report type!!");
			        ClientUI.display(DialogType.Attention, "Attention", "Please select report type!!");
			        break;
			}
		}
        // Empty IDTypeSearchTextField
		else
		{System.out.print("Please enter required id!!");
        ClientUI.display(DialogType.Attention, "Attention", "Please enter required id!!");
		}
	}

////////////LogOut Button_____________________________________________________
	/**
	 * Handles the click event when the log out button is clicked.
	 * This method sends a log out message to the server, closes the current window, and opens a new login form.
	 *
	 * @param event The ActionEvent object representing the click event.
	 */
	@FXML
	public void handleLogOutButtonClicked(ActionEvent event) {
	    // Create a log out message with the current user as the sender
	    Message message = new Message(MessageType.LogOut, ClientUI.chat.client.user);
	    
	    // Send the log out message to the server
	    ClientUI.chat.accept(message);
	    
	    // Close the current window associated with the event source
	    ((Node) event.getSource()).getScene().getWindow().hide();
	    
	    try {
	        // Open a new login form by starting a new instance of LoginFormController
	        new LoginFormController().start(new Stage());
	    } catch (Exception e) {
	        // Print the stack trace if an exception occurs during the opening of the login form
	        e.printStackTrace();
	    }
	}

	
	/**
	 * Handles the click event when the exit button is clicked.
	 * This method calls the `systemExit()` method of the `ClientController` class to terminate the application.
	 *
	 * @param event The ActionEvent object representing the click event.
	 */
	@FXML
	public void handleExitButtonClicked(ActionEvent event) {
	    // Call the systemExit() method of the ClientController class to terminate the application
	    ClientController.systemExit();
	}



 }


