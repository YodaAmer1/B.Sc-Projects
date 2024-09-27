package controllers;

import javafx.application.Application;
import javafx.beans.property.ReadOnlyObjectWrapper;
import javafx.collections.FXCollections;
import javafx.collections.ObservableListBase;
import javafx.collections.ObservableArray;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.fxml.JavaFXBuilderFactory;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Pane;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;
import javafx.stage.StageStyle;
import javafx.util.Callback;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Random;
import java.util.ResourceBundle;

import javax.swing.JComboBox;

import client.ChatClient;
import client.ClientController;
import client.ClientUI;

import entity.Course;
import entity.DialogType;
import entity.Exam;
import entity.ExamReport;
import entity.Message;
import entity.MessageType;
import entity.StudentExam;
import entity.StudentStartExam;

/**
 * The StudentMainMenuController class is responsible for controlling the student main menu functionality.
 * It handles the user interface events and interacts with the backend to perform actions such as starting exams,
 * displaying grades, and logging out.
 */

public class StudentMainMenuController extends Application implements Initializable {
	
	// Enumeration for different button types
	private enum buttonType{
		PerformExamButton,
		GradesButton,
		ReportsButton,
		CoursesButton
	}

	//all FXML GUI variables for this stage.
	@FXML
	private Button btnPerformExam;
	
	@FXML
	private Button btnStartExam;
	
	@FXML
	private TextField txtExamCode;

	@FXML
	private ImageView imageAvatar = new ImageView();
	
	@FXML
	private ImageView exitImage = new ImageView();

	@FXML
	private ImageView sideImage = new ImageView();
	
	@FXML
	private ImageView imageLogo = new ImageView();
	
	@FXML
	private ImageView imageBtnPerformExam = new ImageView();

	@FXML
	private Button btnGrades;
	
	@FXML
	private ImageView imageBtnGrades = new ImageView();

	@FXML
	private Button btnLogOut;

	@FXML
	private ImageView imageLogOut = new ImageView();
	
	@FXML
	private Button btnExit;
	
	@FXML
	private Button viewExamBtn;

	@FXML
	private Pane pnlWelcome;

	@FXML
	private Pane pnlPerformExam;

	@FXML
	private Pane pnlGrades;

	@FXML
	private TextField ExeCode;
	
	@FXML
	private Label studentName= new Label();

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
	private TableColumn<StudentExam,String> statusClmn;
	//stage dimensions.
	private double x, y;

	private ObservableList<StudentExam> studentExamsList = FXCollections.observableArrayList();
	
	/**
	 * The main entry point for the application.
	 *
	 * @param args the command line arguments
	 */
	public static void main(String[] args) {
		launch(args);
	}

	@Override
	public void start(Stage primaryStage) throws Exception {
		Parent root = FXMLLoader.load(getClass().getResource("/gui/StudentMainMenu.fxml"));
		
		Scene scene = new Scene(root);
		scene.getStylesheets().add(getClass().getResource("/style/studentMainMenuStyle.css").toExternalForm());
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
		//set gui
		Image imageSide = new Image(getClass().getResourceAsStream("/images/side_Image.png"));
		Image logoImage = new Image(getClass().getResourceAsStream("/images/logo.png"));
		Image avatarImage = new Image(getClass().getResourceAsStream("/images/avatar_64.png"));
		Image examImage = new Image(getClass().getResourceAsStream("/images/exam_64.png"));
		Image questionsImage = new Image(getClass().getResourceAsStream("/images/questions_64.png"));
		Image logOutImage = new Image(getClass().getResourceAsStream("/images/logout_64.png"));
		Image exitImg = new Image(getClass().getResourceAsStream("/images/Exit.png"));
		imageAvatar.setImage(avatarImage);
		imageLogo.setImage(logoImage);
		sideImage.setImage(imageSide);
		imageBtnPerformExam.setImage(examImage);
		imageBtnGrades.setImage(questionsImage);
		imageLogOut.setImage(logOutImage);
		exitImage.setImage(exitImg);
		//take student name and add to label
		setStudentName();
		viewExamBtn.setDisable(true);
		pnlWelcome.toFront();
		

	}
	/**
	 * Sets the student name label.
	 */
	public void setStudentName() {
		studentName.setText("Hello " + ClientUI.chat.client.user.getFirstName());
		studentName.setVisible(true);
	}
	
	/**
	 * Method to handle click events from user
	 * @param actionEvent The event representing the button click.
	 * @throws IOException The Exception that thrown
	 */
	@FXML
	public void handleClicks(ActionEvent actionEvent) throws IOException {
		if (actionEvent.getSource() == btnPerformExam) {
			setButtonStyle(buttonType.PerformExamButton);
			pnlPerformExam.toFront();
		}
		if (actionEvent.getSource() == btnGrades) {
			setButtonStyle(buttonType.GradesButton);
			fillExamsTable();
			pnlGrades.toFront();
		}
	}
	
	/**
	 * Sets the style of the selected button.
	 *
	 * @param PressedButton the type of the pressed button
	 */
	private void setButtonStyle(buttonType PressedButton) {
		Image examImage;
		Image questionsImage;
		//change buttons style when pressed.
		switch (PressedButton) {
		case PerformExamButton:
			examImage = new Image(getClass().getResourceAsStream("/images/exam_white_64.png"));
			questionsImage = new Image(getClass().getResourceAsStream("/images/questions_64.png"));
			imageBtnPerformExam.setImage(examImage);
			imageBtnGrades.setImage(questionsImage);
			btnGrades.setStyle(null);
			btnPerformExam.setStyle("-fx-background-radius: 10; -fx-background-color : #4F2CC1; -fx-text-fill : #f5f5f5");
			break;
		case GradesButton:
			examImage = new Image(getClass().getResourceAsStream("/images/exam_64.png"));
			questionsImage = new Image(getClass().getResourceAsStream("/images/questions_white_64.png"));
			imageBtnPerformExam.setImage(examImage);
			imageBtnGrades.setImage(questionsImage);
			btnPerformExam.setStyle(null);
			btnGrades.setStyle("-fx-background-radius: 10; -fx-background-color : #4F2CC1; -fx-text-fill : #f5f5f5");
			break;
		}
	}
	
	
	/**
	 * Method to handle start exam button.
	 * @param event, The event representing the button click.
	 */
	@FXML
	public void handleClickBtnStartExam(ActionEvent event) {
		//check execution code text field.
		if (ExeCode.getText().isEmpty()) {
			ClientUI.display(DialogType.Warning, "Have Attention!", "Please Enter Execution Code!");
			return;
		}
		//get the execution code of the exam.
		getExamByCode(new StudentStartExam(ClientUI.chat.client.user.getId(), ExeCode.getText()));
		
		//display message if there is no exams to do.
		if (ClientUI.chat.client.studentExamInProgress == null) {
			ClientUI.display(DialogType.Warning, "Have Attention!", "There is no exam with this Execution Code!");
			return;
		}
		
		//take exam type (manual or online) and open the new window.
		switch (ClientUI.chat.client.studentExamInProgress.getType()) {
		//online exam.
		case 0:
			((Node) event.getSource()).getScene().getWindow().hide();
			try {
				new ExamInProgressStudentFormController().start(new Stage());
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
			break;
		//manual exam.
		case 1:
			((Node) event.getSource()).getScene().getWindow().hide();
			try {
				new ManualExamController().start(new Stage());
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			break;
			
		default:
			break;
		}
	}
	
	/**
	 * Gets the execution code.
	 *
	 * @param code the execution code
	 * @return true if the execution code is retrieved successfully, false otherwise
	 */
	public void getExamByCode(StudentStartExam student) {
		Message message = new Message(MessageType.GetExamByCode, student);
		ClientUI.chat.accept(message);
	}
	
	/**
	 * Initializes the columns of the exams table.
	 */
	private void initializeExamsTableColumns() {
		examIDClmn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getExamID()));
		courseClmn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getCourse()));
		subjectClmn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getSubject()));
		durationClmn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getDuration()));
		gradeClmn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getGrade()));
		statusClmn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getStatus()));

		//add listener for rows
		gradesTableView.getSelectionModel().selectedItemProperty().addListener((observable, oldValue, newValue) -> {
			if (newValue != null) {
				viewExamBtn.setDisable(false);
			} else {
				viewExamBtn.setDisable(true);
			}
		});
	}
	/**
	 * Sets the grades in the grades table.
	 */
	public void fillExamsTable() {
		//clear table and add exams.
		gradesTableView.getItems().clear();
		initializeExamsTableColumns();
		Message message = new Message(MessageType.GetStudentExams, ClientUI.chat.client.user);
		ClientUI.chat.accept(message);
		
		studentExamsList.addAll(ClientUI.chat.client.studentExamList);
		gradesTableView.setItems(studentExamsList);
	}
	
	/**
	 * method to handle logOut button.
	 * @param event, The event representing the button click.
	 */
	@FXML
	public void handleLogOutButtonClicked(ActionEvent event) {
		Message message = new Message(MessageType.LogOut, ClientUI.chat.client.user);
		ClientUI.chat.accept(message);
		//hide current stage.
		((Node) event.getSource()).getScene().getWindow().hide();
		//open LoginFormController window and rest user to nul.
		try {
			new LoginFormController().start(new Stage());
			ClientUI.chat.client.user = null;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	/**
	 * method to handle view exam button click.
	 * @param event,The event representing the view exam button click.
	 */
	@FXML
	public void handleViewExamButtonClicked(ActionEvent event) {
		//select exam to view.
		StudentExam selectedExam = gradesTableView.getSelectionModel().getSelectedItem();
		selectedExam.setStudentID(ClientUI.chat.client.user.getId());
		selectedExam.setProgressID(selectedExam.getProgressID());
		//check selected exam to be checked to view.
		if (selectedExam != null && selectedExam.getStatus().equals("checked")) {
			Message messageToServer = new Message(MessageType.GetStudentExamToCheck, selectedExam);
			ClientUI.chat.accept(messageToServer);
			//open checked exam window.
			try {
				ClientUI.chat.client.viewExam = selectedExam;
				new ViewStudentExamFormController().start(new Stage());
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	

	/**
	 *  handles the Exit button
	 */
	public void handleExitButtonClicked() {
		ClientController.systemExit();
	}
}
