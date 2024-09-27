package controllers;

import javafx.application.Application;
import javafx.scene.input.ClipboardContent;
import javafx.application.Platform;
import javafx.beans.property.ReadOnlyObjectWrapper;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.collections.transformation.FilteredList;
import javafx.collections.transformation.SortedList;
import javafx.event.ActionEvent;
import javafx.event.Event;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.input.Dragboard;
import javafx.scene.input.TransferMode;
import javafx.scene.layout.Pane;
import javafx.stage.Stage;
import javafx.stage.StageStyle;

import java.net.URL;
import java.util.ArrayList;
import java.util.Random;
import java.util.ResourceBundle;

import client.ChatClient;
import client.ClientController;
import client.ClientUI;

import entity.*;

public class LecturerMainMenuController extends Application implements Initializable {

	private enum buttonType {
		ExamsButton, QuestionsButton, ReportsButton, CoursesButton
	}

	@FXML
	private Label lblUsername;

	// The Images That will appear in this stage
	@FXML
	private ImageView imageAvatar = new ImageView();

	@FXML
	private ImageView sideImage = new ImageView();
	
	@FXML
	private ImageView imageLogo = new ImageView();

	@FXML
	private ImageView imageBtnExams = new ImageView();

	@FXML
	private ImageView imageBtnQuestions = new ImageView();

	@FXML
	private ImageView imageBtnReports = new ImageView();

	@FXML
	private ImageView imageBtnCheckExams = new ImageView();

	@FXML
	private ImageView imageLogOut = new ImageView();

	@FXML
	private ImageView imageExit = new ImageView();
	
//	@FXML
//	private ImageView backButtonImage = new ImageView();

	// All the buttons in the stage
	@FXML
	private Button btnExams;

	@FXML
	private Button btnQuestions;

	@FXML
	private Button btnReports;

	@FXML
	private Button btnCheckExams;

	@FXML
	private Button btnLogOut;

	@FXML
	private Button btnExit;

//////////////////All The changeable Panes
	@FXML
	private Pane pnlWelcome;

////////////////START -- Exams Pane

	@FXML
	private Pane pnlExams;

	@FXML
	private Button btnViewExamsList;

	@FXML
	private Button btnCreateNewExam;

	@FXML
	private TableView<ExamInProgress> inProgressExamsTableView;

	@FXML
	private TableColumn<ExamInProgress, String> examIDColumn;
	
	@FXML
	private TableColumn<ExamInProgress, Integer> examProgressIDColumn;

	@FXML
	private TableColumn<ExamInProgress, Integer> examTimeColumn;

	@FXML
	private TableColumn<ExamInProgress, String> examSubjectColumn;

	@FXML
	private TableColumn<ExamInProgress, String> examCourseColumn;

	@FXML
	private TableColumn<ExamInProgress, String> examTypeColumn;

	@FXML
	private TableColumn<ExamInProgress, Integer> examExtraTimeColumn;

	@FXML
	private TableColumn<ExamInProgress, Button> examLockColumn;

	@FXML
	private TableColumn<ExamInProgress, Button> examRETColumn;

	@FXML
	private TableColumn<ExamInProgress, String> examStatusColumn;

	private ObservableList<ExamInProgress> examsList = FXCollections.observableArrayList();

////////////////END Exams Pane

//_________________________________________________________________________

////////////////START Questions Pane

	@FXML
	private Pane pnlQuestions;

	@FXML
	private TextField questionSearch;

	@FXML
	private Button btnCreateNewQuestion;

	@FXML
	private TableView<Question> questionsTableView;

	@FXML
	private TableColumn<Question, String> questionIDColumn;

	@FXML
	private TableColumn<Question, String> questionSubjectColumn;

	@FXML
	private TableColumn<Question, String> questionTextColumn;

	@FXML
	private TableColumn<Question, Button> questionViewButtonColumn;

	private ObservableList<Question> questionsList = FXCollections.observableArrayList();
	
	private FilteredList<Question> filteredData;
	
	private SortedList<Question> sortedData;

////////////////END Questions Pane

//_________________________________________________________________________

//////////////// START Report Pane

	@FXML
	private Pane pnlReports;

	@FXML
	private TableView<ExamDone> examsReportTableView;

	@FXML
	private TableColumn<ExamDone, String> examReportIDColumn;

	@FXML
	private TableColumn<ExamDone, Integer> examProgressIDReportColumn;
	
	@FXML
	private TableColumn<ExamDone, String> examReportSubjectColumn;

	@FXML
	private TableColumn<ExamDone, String> examReportCourseColumn;

	@FXML
	private TableColumn<ExamDone, String> examReportDateColumn;

	@FXML
	private TableColumn<ExamDone, String> examOperatorLecturerColumn;

	@FXML
	private TableColumn<ExamDone, Button> examReportButtonColumn;

	private ObservableList<ExamDone> examsReportList = FXCollections.observableArrayList();

//////////////// END Report Pane

//_________________________________________________________________________

////////////////START Check Exams Pane

	@FXML
	private Pane pnlCheckExams;
	
	@FXML
	private Button checkExamBtn;
	
	@FXML
	private TableView<StudentExam> gradesTableView;
	@FXML
	private TableColumn<StudentExam,String> examIDClmn;
	@FXML
	private TableColumn<StudentExam,String> subjectClmn;
	@FXML
	private TableColumn<StudentExam,String> courseClmn;
	@FXML
	private TableColumn<StudentExam,String> durationClmn;
	@FXML
	private TableColumn<StudentExam,String> gradeClmn;
	@FXML
	private TableColumn<StudentExam,String> checkClmn;
	//
	private ObservableList<StudentExam> studentsExamsList = FXCollections.observableArrayList();
	

////////////////END Check Exams Pane

//_________________________________________________________________________

/////////////// the coordinates variables (x, y) for the drag
	
	private double x, y;
	

/////////////// Stage Methods_____________________________________________________________________________________

	@Override
	public void start(Stage primaryStage) throws Exception {
		Parent root = FXMLLoader.load(getClass().getResource("/gui/LecturerMainMenu.fxml"));

		Scene scene = new Scene(root);
		scene.getStylesheets().add(getClass().getResource("/style/lecturerMainMenuStyle.css").toExternalForm());

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

	@Override
	public void initialize(URL location, ResourceBundle resources) {
		
		// Initialize the name of the logged in user
		lblUsername.setText("Hello " + ClientUI.chat.client.user.getFirstName() + " " + ClientUI.chat.client.user.getLastName());

		// Initialize the images in the page
		Image imageSide = new Image(getClass().getResourceAsStream("/images/side_Image.png"));
		Image avatarImage = new Image(getClass().getResourceAsStream("/images/avatar_64.png"));
		Image logoImage = new Image(getClass().getResourceAsStream("/images/logo.png"));
		Image examImage = new Image(getClass().getResourceAsStream("/images/exam_64.png"));
		Image questionsImage = new Image(getClass().getResourceAsStream("/images/questions_64.png"));
		Image reportImage = new Image(getClass().getResourceAsStream("/images/chart_64.png"));
		Image checkExamImage = new Image(getClass().getResourceAsStream("/images/maybe_64.png"));
		Image logOutImage = new Image(getClass().getResourceAsStream("/images/logout_64.png"));
		Image exitImage = new Image(getClass().getResourceAsStream("/images/Exit.png"));
		sideImage.setImage(imageSide);
		imageAvatar.setImage(avatarImage);
		imageLogo.setImage(logoImage);
		imageBtnExams.setImage(examImage);
		imageBtnQuestions.setImage(questionsImage);
		imageBtnReports.setImage(reportImage);
		imageBtnCheckExams.setImage(checkExamImage);
		imageLogOut.setImage(logOutImage);
		imageExit.setImage(exitImage);
		
		// Wrap the ObservableList in a FilteredList (initially display all data).
		filteredData = new FilteredList<>(questionsList, b -> true);

		// Set the filter Predicate whenever the filter changes.
		questionSearch.textProperty().addListener((observable, oldValue, newValue) -> {
			filteredData.setPredicate(question -> {
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
				} else
					return false; // Does not match.
			});
		});

		// Wrap the FilteredList in a SortedList.
		sortedData = new SortedList<>(filteredData);

		// Bind the SortedList comparator to the TableView comparator.
		// Otherwise, sorting the TableView would have no effect.
		sortedData.comparatorProperty().bind(questionsTableView.comparatorProperty());

		
		pnlWelcome.toFront();
	}

	/**
	 * Handles button clicks in the user interface.
	 *
	 * @param actionEvent The action event triggered by a button click.
	 */
	public void handleClicks(ActionEvent actionEvent) {
	    if (actionEvent.getSource() == btnExams) {
	        // Show exams panel
	        initializeExamsTableColumns();
	        fillExamsTable();
	        setButtonStyle(buttonType.ExamsButton);
	        pnlExams.toFront();
	    }

	    if (actionEvent.getSource() == btnQuestions) {
	        // Show questions panel
	        initializeQuestionsTableColumns();
	        fillQuestionsTable();
	        setButtonStyle(buttonType.QuestionsButton);
	        pnlQuestions.toFront();
	    }

	    if (actionEvent.getSource() == btnReports) {
	        // Show reports panel
	        initializeExamsReportTableColumns();
	        fillExamsReportTable();
	        setButtonStyle(buttonType.ReportsButton);
	        pnlReports.toFront();
	    }

	    if (actionEvent.getSource() == btnCheckExams) {
	        // Show check exams panel
	        initializeStudentsExamsTableColumns();
	        fillStudentsExamsTable();
	        setButtonStyle(buttonType.CoursesButton);
	        pnlCheckExams.toFront();
	    }
	}

	/**
	 * Sets the style and images for buttons based on the pressed button type.
	 *
	 * @param pressedButton The type of the pressed button.
	 */
	private void setButtonStyle(buttonType pressedButton) {
	    Image examImage;
	    Image questionsImage;
	    Image reportImage;
	    Image checkExamsImage;

	    switch (pressedButton) {
	        case ExamsButton:
	            // Exams button is pressed
	            examImage = new Image(getClass().getResourceAsStream("/images/exam_white_64.png"));
	            questionsImage = new Image(getClass().getResourceAsStream("/images/questions_64.png"));
	            reportImage = new Image(getClass().getResourceAsStream("/images/chart_64.png"));
	            checkExamsImage = new Image(getClass().getResourceAsStream("/images/maybe_64.png"));
	            imageBtnExams.setImage(examImage);
	            imageBtnQuestions.setImage(questionsImage);
	            imageBtnReports.setImage(reportImage);
	            imageBtnCheckExams.setImage(checkExamsImage);
	            btnQuestions.setStyle(null);
	            btnReports.setStyle(null);
	            btnCheckExams.setStyle(null);
	            btnExams.setStyle("-fx-background-radius: 10; -fx-background-color : #4F2CC1; -fx-text-fill : #f5f5f5");
	            break;
	        case QuestionsButton:
	            // Questions button is pressed
	            examImage = new Image(getClass().getResourceAsStream("/images/exam_64.png"));
	            questionsImage = new Image(getClass().getResourceAsStream("/images/questions_white_64.png"));
	            reportImage = new Image(getClass().getResourceAsStream("/images/chart_64.png"));
	            checkExamsImage = new Image(getClass().getResourceAsStream("/images/maybe_64.png"));
	            imageBtnExams.setImage(examImage);
	            imageBtnQuestions.setImage(questionsImage);
	            imageBtnReports.setImage(reportImage);
	            imageBtnCheckExams.setImage(checkExamsImage);
	            btnExams.setStyle(null);
	            btnReports.setStyle(null);
	            btnCheckExams.setStyle(null);
	            btnQuestions.setStyle("-fx-background-radius: 10; -fx-background-color : #4F2CC1; -fx-text-fill : #f5f5f5");
	            break;
	        case ReportsButton:
	            // Reports button is pressed
	            examImage = new Image(getClass().getResourceAsStream("/images/exam_64.png"));
	            questionsImage = new Image(getClass().getResourceAsStream("/images/questions_64.png"));
	            reportImage = new Image(getClass().getResourceAsStream("/images/chart_white_64.png"));
	            checkExamsImage = new Image(getClass().getResourceAsStream("/images/maybe_64.png"));
	            imageBtnExams.setImage(examImage);
	            imageBtnQuestions.setImage(questionsImage);
	            imageBtnReports.setImage(reportImage);
	            imageBtnCheckExams.setImage(checkExamsImage);
	            btnExams.setStyle(null);
	            btnQuestions.setStyle(null);
	            btnCheckExams.setStyle(null);
	            btnReports.setStyle("-fx-background-radius: 10; -fx-background-color : #4F2CC1; -fx-text-fill : #f5f5f5");
	            break;
	        case CoursesButton:
	            // Check exams button is pressed
	            examImage = new Image(getClass().getResourceAsStream("/images/exam_64.png"));
	            questionsImage = new Image(getClass().getResourceAsStream("/images/questions_64.png"));
	            reportImage = new Image(getClass().getResourceAsStream("/images/chart_64.png"));
	            checkExamsImage = new Image(getClass().getResourceAsStream("/images/maybe_white_64.png"));
	            imageBtnExams.setImage(examImage);
	            imageBtnQuestions.setImage(questionsImage);
	            imageBtnReports.setImage(reportImage);
	            imageBtnCheckExams.setImage(checkExamsImage);
	            btnExams.setStyle(null);
	            btnQuestions.setStyle(null);
	            btnReports.setStyle(null);
	            btnCheckExams.setStyle("-fx-background-radius: 10; -fx-background-color : #4F2CC1; -fx-text-fill : #f5f5f5");
	            break;
	    }
	}

	/**
	 * Handles the click event of the Log Out button.
	 *
	 * @param event The action event triggered by the button click.
	 */
	@FXML
	public void handleLogOutButtonClicked(ActionEvent event) {
	    // Send a log out message to the server
	    Message message = new Message(MessageType.LogOut, ClientUI.chat.client.user);
	    ClientUI.chat.accept(message);

	    // Hide the current window
	    ((Node) event.getSource()).getScene().getWindow().hide();

	    try {
	        // Open the login form in a new window
	        new LoginFormController().start(new Stage());

	        // Set the user to null
	        ClientUI.chat.client.user = null;
	    } catch (Exception e) {
	        e.printStackTrace();
	    }
	}

	/**
	 * Handles the click event of the Exit button.
	 *
	 * @param event The action event triggered by the button click.
	 */
	@FXML
	public void handleExitButtonClicked(ActionEvent event) {
	    // Call the systemExit method in the ClientController to exit the application gracefully
	    ClientController.systemExit();
	}

///////////////Exam Pane Methods_____________________________________________________________________________________

	/**
	 * Initializes the columns of the Exams table.
	 */
	private void initializeExamsTableColumns() {
	    examIDColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getExamID()));
	    examProgressIDColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getProgressId()));
	    examSubjectColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getSubject()));
	    examCourseColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getCourse()));
	    examTimeColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getTime()));
	    examTypeColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getType()));
	    examExtraTimeColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getExtraTime()));
	    examStatusColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getStatus()));
	    examLockColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getLockExam()));
	    examRETColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getRequestExtraTimeButton()));
	}

	/**
	 * Fills the Exams table with data.
	 */
	private void fillExamsTable() {
	    inProgressExamsTableView.getItems().clear();

	    // Request the list of in-progress exams from the server
	    Message message = new Message(MessageType.InProgressExamsList, ClientUI.chat.client.user);
	    ClientUI.chat.accept(message);

	    // Add the retrieved exams to the examsList
	    examsList.addAll(ClientUI.chat.client.examsInProgress);

	    // Set the examsList as the items of the inProgressExamsTableView
	    inProgressExamsTableView.setItems(examsList);
	}

	/**
	 * Handles the click event of the Create New Exam button.
	 *
	 * @param event The action event triggered by the button click.
	 */
	@FXML
	public void handleCreateNewExamButtonClicked(ActionEvent event) {
	    try {
	        // Open the Create Exam form in a new window
	        new CreateExamFormController().start(new Stage());
	    } catch (Exception e) {
	        e.printStackTrace();
	    }
	}

	/**
	 * Handles the click event of the View Exams List button.
	 *
	 * @param event The action event triggered by the button click.
	 */
	@FXML
	public void handleViewExamsListButtonClicked(ActionEvent event) {
	    try {
	        // Open the Exam Bank form in a new window
	        new ExamBankFormController().start(new Stage());
	    } catch (Exception e) {
	        e.printStackTrace();
	    }
	}

/////////////// Questions Pane Methods_____________________________________________________________________________________

	/**
	 * Initializes the columns of the Questions table.
	 */
	private void initializeQuestionsTableColumns() {
	    questionIDColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getQuestionID()));
	    questionSubjectColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getQuestionSubject()));
	    questionTextColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getQuestionText()));
	    questionViewButtonColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getBtnViewQuestion()));
	}

	/**
	 * Fills the Questions table with data.
	 */
	private void fillQuestionsTable() {
	    // Clear the questionsList
	    questionsList.clear();

	    // Request all questions from the server
	    Message message = new Message(MessageType.GetAllQuestion, ClientUI.chat.client.user.getId());
	    ClientUI.chat.accept(message);

	    // Retrieve the questions list from the server
	    ArrayList<Question> questionsArray = ClientUI.chat.client.questionsList;

	    // Set the action for the view button in each question
	    for (Question quest : questionsArray) {
	        Button viewButton = new Button("View");
	        viewButton.setOnAction(event -> {
	            Platform.runLater(() -> {
	                try {
	                	ClientUI.chat.client.question = quest;
	                    ViewQuestionFormController form = new ViewQuestionFormController();
	                    form.start(new Stage());
	                } catch (Exception e) {
	                    e.printStackTrace();
	                }
	            });
	        });
	        quest.setBtnViewQuestion(viewButton);
	    }

	    // Add the retrieved questions to the questionsList
	    questionsList.addAll(questionsArray);

	    // Set the sortedData (sorted and filtered data) as the items of the questionsTableView
	    questionsTableView.setItems(sortedData);
	}

	/**
	 * Handles the click event of the Create New Question button.
	 *
	 * @param event The action event triggered by the button click.
	 */
	@FXML
	public void handleCreateNewQuestionButtonClicked(ActionEvent event) {
	    try {
	        // Open the Create Question form in a new window
	        new CreateQuestionFormController().start(new Stage());
	    } catch (Exception e) {
	        e.printStackTrace();
	    }
	}
	
/////////////// Reports Pane Methods_____________________________________________________________________________________

	/**
	 * Initializes the columns of the Exams Report table.
	 */
	private void initializeExamsReportTableColumns() {
	    examReportIDColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getExamID()));
	    examReportSubjectColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getSubject()));
	    examReportCourseColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getCourse()));
	    examProgressIDReportColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getProgressId()));
	    examOperatorLecturerColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getOperatorLecturer()));
	    examReportDateColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getDate()));
	    examReportButtonColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getViewReportButton()));
	}

	/**
	 * Fills the Exams Report table with data.
	 */
	private void fillExamsReportTable() {
	    // Clear the examsReportTableView
	    examsReportTableView.getItems().clear();

	    // Request done exams from the server
	    Message message = new Message(MessageType.GetDoneExams, ClientUI.chat.client.user);
	    ClientUI.chat.accept(message);

	    // Retrieve the list of done exams from the server
	    ArrayList<ExamDone> examsArray = ClientUI.chat.client.doneExamsList;

	    // Set the action for the view report button in each exam
	    for (ExamDone exam : examsArray) {
	        Button reportButton = new Button("View");
	        reportButton.setOnAction(event -> {
	            Platform.runLater(() -> {
	            	LecturerExamReportViewController.exam = exam;
					
					try {
						new LecturerExamReportViewController().start(new Stage());
					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
	            });
	        });
	        exam.setViewReportButton(reportButton);
	    }

	    // Add the done exams to the examsReportList
	    examsReportList.addAll(ClientUI.chat.client.doneExamsList);

	    // Set the examsReportList as the items of the examsReportTableView
	    examsReportTableView.setItems(examsReportList);
	}
	
/////////////// Check Exams Pane Methods_____________________________________________________________________________________
	
	/**
	 * Initializes the columns of the exams table.
	 */
	private void initializeStudentsExamsTableColumns() {
		examIDClmn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getExamID()));
		courseClmn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getCourse()));
		subjectClmn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getSubject()));
		durationClmn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getDuration()));
		gradeClmn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getGrade()));
		checkClmn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getStatus()));
		
		gradesTableView.getSelectionModel().selectedItemProperty().addListener((observable, oldValue, newValue) -> {
			if (newValue != null) {
				checkExamBtn.setDisable(false);
			} else {
				checkExamBtn.setDisable(true);
			}
		});

	}
	/**
	 * Sets the grades in the grades table.
	 */
	public void fillStudentsExamsTable() {
		gradesTableView.getItems().clear();
		//send a message for server to get studentExams.
		Message message = new Message(MessageType.GetStudentsExams, ClientUI.chat.client.user);
		ClientUI.chat.accept(message);
		
		studentsExamsList.addAll(ClientUI.chat.client.LecturerStudentsExamsList);
		gradesTableView.setItems(studentsExamsList);
	}
	
	@FXML
	public void handleCheckExamButtonClicked(ActionEvent event) {
	    // Get the selected student exam from the gradesTableView
	    StudentExam studentExam = gradesTableView.getSelectionModel().getSelectedItem();
	    
	    if (studentExam != null) {
	        // Send a message to the server to retrieve the student exam for checking
	        Message messageToServer = new Message(MessageType.GetStudentExamToCheck, studentExam);
	        ClientUI.chat.accept(messageToServer);

	        // Open the ReCheckExamInLecturerFormController to check the student exam
	        try {
	            new ReCheckExamInLecturerFormController().start(new Stage());
	        } catch (Exception e) {
	            e.printStackTrace();
	        }
	    }
	}
}
