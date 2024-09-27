package controllers;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.ResourceBundle;

import client.ChatClient;
import client.ClientController;
import client.ClientUI;
import entity.*;
import javafx.application.Application;
import javafx.application.Platform;
import javafx.beans.property.ReadOnlyObjectWrapper;
import javafx.beans.value.ObservableValue;
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
import javafx.scene.control.Button;
import javafx.scene.control.ComboBox;
import javafx.scene.control.Label;
import javafx.scene.control.TableCell;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableRow;
import javafx.scene.control.TableView;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.scene.control.TableColumn.CellDataFeatures;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.input.ClipboardContent;
import javafx.scene.input.DataFormat;
import javafx.scene.input.Dragboard;
import javafx.scene.input.TransferMode;
import javafx.scene.layout.Pane;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;
import javafx.stage.StageStyle;
import javafx.util.Callback;

public class ExamBankFormController extends Application implements Initializable {
	
	@FXML
	private TextField examSearch;

	@FXML
	private ImageView imageLogo = new ImageView();

	@FXML
	private ImageView imageExit = new ImageView();

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
	
	@FXML
	private TableColumn<Exam, Button> examViewButtonColumn;

	private ObservableList<Exam> examsList = FXCollections.observableArrayList();

	@FXML
	private Button btnStartExam;

	@FXML
	private Button exitButton;

	@FXML
	private ComboBox<Subject> subjectNameComboBox = new ComboBox<>();
	private ObservableList<Subject> subjectList = FXCollections.observableArrayList();

	@FXML
	private ComboBox<Course> CourseNameComboBox = new ComboBox<>();
	private ObservableList<Course> courseList = FXCollections.observableArrayList();

	private FilteredList<Exam> filteredData;

	private SortedList<Exam> sortedData;

	private double x, y;
	
	private Subject allSubjects = new Subject("", "All Subjects");
	private Course allCourses = new Course("", "All Courses", "");

	@Override
	public void initialize(URL location, ResourceBundle resources) {
		Image logoImage = new Image(getClass().getResourceAsStream("/images/logo_white.png"));
		Image exitImage = new Image(getClass().getResourceAsStream("/images/Exit.png"));
		imageLogo.setImage(logoImage);
		imageExit.setImage(exitImage);

		btnStartExam.setDisable(true);

		getSubjectsList();
		subjectNameComboBox.setValue(allSubjects);
		getCoursesList();
		CourseNameComboBox.setValue(allCourses);

		initializeExamsTableColumns();
		fillExamsTable();


		subjectNameComboBox.setOnAction(event -> {

			Subject selectedSubject = subjectNameComboBox.getSelectionModel().getSelectedItem();
			
			filterCourseComboBoxBySubject(selectedSubject);
			
			CourseNameComboBox.setValue(allCourses);
			
			filterExamsTableBySubject(selectedSubject);
			
		});
		
		CourseNameComboBox.setOnAction(event -> {

			Course selectedCourse = CourseNameComboBox.getSelectionModel().getSelectedItem();
			if (selectedCourse != null) {
				filterExamsTableBySubjectAndCourse(subjectNameComboBox.getValue(), selectedCourse);
			}
			
		});
	}
	

	/**
	 * method that send message to the server to get the subject list
	 */
	private void getSubjectsList() {
		Message message = new Message(MessageType.GetSubjectsList, ClientUI.chat.client.user.getId());
		ClientUI.chat.accept(message);

		subjectList.add(allSubjects);
		subjectList.addAll(ClientUI.chat.client.subjectsList);

		subjectNameComboBox.setItems(subjectList);
	}
	
	
	/**
	 * method that send message to the server to get the subject list
	 */
	private void getCoursesList() {
		Message message = new Message(MessageType.GetCoursesList, ClientUI.chat.client.user.getId());
		ClientUI.chat.accept(message);
		
		courseList.add(allCourses);
		CourseNameComboBox.setItems(courseList);
	}


	@FXML
	public void handleStartExamButtonClicked(ActionEvent event) {
		ClientUI.chat.client.examToPerform = examsTableView.getSelectionModel().getSelectedItem();
		if (ClientUI.chat.client.examToPerform != null) {
			try {
				new LecturerStartingExamFormController().start(new Stage());
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}else {
			
		}
		examsTableView.getSelectionModel().clearSelection();
		
	}

	private void initializeExamsTableColumns() {

		examIDColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getExamID()));
		
		examSubjectColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getSubject()));
		
		examCourseColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getCourse()));
		
		examTimeColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getTime()));
		
		examLecturerColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getLecturerName()));
		
		numOfQuestionColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getNumOfQuestions()));

		
		// Wrap the ObservableList in a FilteredList (initially display all data).
		filteredData = new FilteredList<>(examsList, b -> true);

		// Set the filter Predicate whenever the filter changes.
		examSearch.textProperty().addListener((observable, oldValue, newValue) -> {
			filteredData.setPredicate(exam -> {
				
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
		sortedData = new SortedList<>(filteredData);

		// Bind the SortedList comparator to the TableView comparator.
		// Otherwise, sorting the TableView would have no effect.
		sortedData.comparatorProperty().bind(examsTableView.comparatorProperty());

		// Add listener for selected exam
		examsTableView.getSelectionModel().selectedItemProperty().addListener((observable, oldValue, newValue) -> {
			if (newValue != null) {
				btnStartExam.setDisable(false);
			} else {
				btnStartExam.setDisable(true);
			}
		});
	}

	private void fillExamsTable() {
		examsList.clear();

		//Build message to send to the server
		Message message = new Message(MessageType.GetExamsList, ClientUI.chat.client.user.getId());
		ClientUI.chat.accept(message);

		ArrayList<Exam> examsArray = ClientUI.chat.client.examsList;
		
		examsList.addAll(examsArray);

		// Add sorted (and filtered) data to the table.
		examsTableView.setItems(sortedData);
	}

	
	
	/**
	 * method that filter the exam table by subject and Course
	 * 
	 * @param subject - the Subject that want to filter the table with
	 * @param course - the Course that want to filter the table with
	 */
	private void filterExamsTableBySubjectAndCourse(Subject subject, Course course) {
		ArrayList<Exam> filteredExamsArray = new ArrayList<>();
		if (subject.getTopic().equals("All Subjects")) {
			filteredExamsArray = ClientUI.chat.client.examsList;
		}else {
			for (Exam exam : ClientUI.chat.client.examsList) {
				if (!exam.getSubjectID().equals(subject.getTopicID())) {
					continue;
				}
				if (course.getCourse().equals("All Courses") || exam.getCourseID().equals(course.getCourseID())) {
					filteredExamsArray.add(exam);
				}
			}
		}
		examsList.clear();
		examsList.addAll(filteredExamsArray);
	}
	
	/**
	 * method that filter the exam table by subject
	 * 
	 * @param subject - the Subject that want to filter the table to
	 */
	private void filterExamsTableBySubject(Subject subject) {
		ArrayList<Exam> filteredExamsArray = new ArrayList<>();
		if (subject.getTopic().equals("All Subjects")) {
			filteredExamsArray = ClientUI.chat.client.examsList;
		}else {
			for (Exam exam : ClientUI.chat.client.examsList) {
				if (exam.getSubjectID().equals(subject.getTopicID())) {
					filteredExamsArray.add(exam);
				}
			}
		}
		examsList.clear();
		examsList.addAll(filteredExamsArray);
	}


	/**
	 * method that filter the courses combo box by subject
	 * 
	 * @param subject - the Subject that want to filter the table to.
	 */
	private void filterCourseComboBoxBySubject(Subject subject) {
		courseList.clear();
		courseList.add(allCourses);
		for (Course course : ClientUI.chat.client.coursesList) {
			if (course.getSubjectID().equals(subject.getTopicID())) {
				courseList.add(course);
			}
		}
		
		CourseNameComboBox.setItems(courseList);
	}

	
	@FXML
	public void exitButton(ActionEvent event) {
		((Node) event.getSource()).getScene().getWindow().hide();
	}

	@Override
	public void start(Stage primaryStage) throws Exception {
		Parent root = FXMLLoader.load(getClass().getResource("/gui/ExamsBankForm.fxml"));

		Scene scene = new Scene(root);
		scene.getStylesheets().add(getClass().getResource("/style/createExamFormStyle.css").toExternalForm());

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
}