package controllers;

import java.net.URL;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.ResourceBundle;

import client.ChatClient;
import client.ClientUI;
import entity.Course;
import entity.Exam;
import entity.ExamDone;
import entity.CoruseReport;
import entity.Message;
import entity.MessageType;
import entity.Question;
import entity.StudentExamGrade;
import entity.Subject;
import entity.User;
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
import javafx.scene.chart.BarChart;
import javafx.scene.chart.XYChart;
import javafx.scene.control.Button;
import javafx.scene.control.CheckBox;
import javafx.scene.control.ComboBox;
import javafx.scene.control.Label;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.Pane;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;
import javafx.stage.StageStyle;

public class ReportCourseDHController extends Application implements Initializable {

	@FXML
	private Pane CourseReportPane;

	@FXML
	private Pane HistogramPane;

	@FXML
	private ImageView imageSearch = new ImageView();

	@FXML
	private ImageView imageLogo = new ImageView();

	@FXML
	private ImageView imageExit = new ImageView();

	@FXML
	private ImageView imageBack = new ImageView();

//////Labels

	@FXML
	private Label avarageLabel = new Label();

	@FXML
	private Label highestGradeLabel = new Label();

	@FXML
	private Label lowestGradeLabel = new Label();

	@FXML
	private Label midGradeLabel = new Label();

	@FXML
	private Label numberOfStudentsLabel = new Label();

	@FXML
	private Label percentageFailLabel = new Label();

	@FXML
	private Label courseName = new Label();

	@FXML
	private Label CourseId = new Label();

	@FXML
	private Label avarage = new Label();

	@FXML
	private Label highestGrade = new Label();

	@FXML
	private Label lowestGrade = new Label();

	@FXML
	private Label midGrade = new Label();

	@FXML
	private Label numberOfStudents = new Label();

	@FXML
	private Label percentageFail = new Label();

/////////Buttons 	

	@FXML
	private Button btnExit;

	@FXML
	private BarChart<String, Number> barChart;

	@FXML
	private Button btnHistogram;

	@FXML
	private Button BackToReportPaneButton;

///////////Search Text Field
	@FXML
	private TextField SearchTextField;

	private double x, y;

	static String idCourse;
//////////////////Report course Table View
	@FXML
	private TableView<CoruseReport> CourseReportsTableView;

	@FXML
	private TableColumn<CoruseReport, String> CourseExamIdClm;

	@FXML
	private TableColumn<CoruseReport, String> SubjectClm;

	@FXML
	private TableColumn<CoruseReport, String> CourseLecIdClm;

	@FXML
	private TableColumn<CoruseReport, String> CourseLecNameClm;

	@FXML
	private TableColumn<CoruseReport, String> ExamDateClm;

	@FXML
	private TableColumn<CoruseReport, Integer> NoStudentClm;

	private ObservableList<CoruseReport> CourseReportList = FXCollections.observableArrayList();

	private FilteredList<CoruseReport> filteredData;

	private SortedList<CoruseReport> sortedData;

//////////////		

	/**
	 * This method is called during the initialization of the controller. It sets up
	 * the initial state of the user interface and prepares the data.
	 */
	@Override
	public void initialize(URL location, ResourceBundle resources) {
		System.out.println("getting into inizle");


		avarageLabel.setVisible(false);
		highestGradeLabel.setVisible(false);
		lowestGradeLabel.setVisible(false);
		midGradeLabel.setVisible(false);
		numberOfStudentsLabel.setVisible(false);
		percentageFailLabel.setVisible(false);
		avarage.setVisible(false);
		highestGrade.setVisible(false);
		lowestGrade.setVisible(false);
		midGrade.setVisible(false);
		numberOfStudents.setVisible(false);
		percentageFail.setVisible(false);
		btnHistogram.setDisable(true);

		Image logoImage = new Image(getClass().getResourceAsStream("/images/logo_white.png"));
		Image searchImage = new Image(getClass().getResourceAsStream("/images/Search_64.png"));
		Image exitImage = new Image(getClass().getResourceAsStream("/images/Exit.png"));
		Image backImage = new Image(getClass().getResourceAsStream("/images/back_64.png"));
		imageLogo.setImage(logoImage);
		imageSearch.setImage(searchImage);
		imageExit.setImage(exitImage);
		imageBack.setImage(backImage);

		// Iterate over the coursesList in ChatClient to find the course with a matching
		// ID
		for (Course course : ClientUI.chat.client.coursesList) {
			if (idCourse.equals(course.getCourseID())) {
				// Set the course name and ID labels with the found course details
				courseName.setText(course.getCourse());
				CourseId.setText(course.getCourseID());
			}
		}

//////////////////search course report table/////////////////////// 

// Wrap the ObservableList in a FilteredList (initially display all data).
		filteredData = new FilteredList<>(CourseReportList, b -> true);

// Set the filter Predicate whenever the filter changes.
		SearchTextField.textProperty().addListener((observable, oldValue, newValue) -> {
			filteredData.setPredicate(coursereport -> {
				// If filter text is empty, display all persons.

				if (newValue == null || newValue.isEmpty()) {
					return true;
				}

				// Compare first name and last name of every person with filter text.
				String lowerCaseFilter = newValue.toLowerCase();

				if (coursereport.getIDExam().toLowerCase().indexOf(lowerCaseFilter) != -1) {
					return true; // Filter matches exam ID.
				} else if (coursereport.getSubject().toLowerCase().indexOf(lowerCaseFilter) != -1) {
					return true; // Filter matches subject.
				} else if (coursereport.getIDLecturer().toLowerCase().indexOf(lowerCaseFilter) != -1) {
					return true; // Filter matches lecturer ID.
				} else if (coursereport.getNameLecturer().toLowerCase().indexOf(lowerCaseFilter) != -1) {
					return true; // Filter matches lecturer Name.
				} else if (coursereport.getExamDate().toLowerCase().indexOf(lowerCaseFilter) != -1) {
					return true; // Filter matches exam Date.
				} else if (String.valueOf(coursereport.getNoStudent()).toLowerCase().indexOf(lowerCaseFilter) != -1) {
					return true; // Filter matches number Of Students.
				} else
					return false; // Does not match.
			});
		});

// Wrap the FilteredList in a SortedList.
		sortedData = new SortedList<>(filteredData);

// Bind the SortedList comparator to the TableView comparator.
// Otherwise, sorting the TableView would have no effect.
		sortedData.comparatorProperty().bind(CourseReportsTableView.comparatorProperty());

		// Initialize the table columns for the courses table
		initializeCoursesTableColumns();
		// Fill the exams table with data
		fillExamsTable();

	}

	/**
	 * Initialize the columns of the courses table. It specifies how the data should
	 * be extracted from the CourseReport objects and displayed in each column.
	 */
	private void initializeCoursesTableColumns() {
		CourseExamIdClm.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getIDExam()));
		SubjectClm.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getSubject()));
		CourseLecIdClm
				.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getIDLecturer()));
		CourseLecNameClm
				.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getNameLecturer()));
		ExamDateClm.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getExamDate()));
		NoStudentClm.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getNoStudent()));

		CourseReportsTableView.getSelectionModel().selectedItemProperty()
				.addListener((observable, oldValue, newValue) -> {
					if (newValue != null) {
						btnHistogram.setDisable(false);
					} else {
						btnHistogram.setDisable(true);
					}
				});
	}

	/**
	 * Populates the exams table with data. It retrieves the course reports from the
	 * server and adds them to the table.
	 */
	private void fillExamsTable() {

		CourseReportList.clear();

		// Build message to send to the server
		Message message = new Message(MessageType.ListCourseReportsDH, idCourse);
		ClientUI.chat.accept(message);

		// Retrieve the course reports from ChatClient
		ArrayList<CoruseReport> courseArray = ClientUI.chat.client.CourseReportListDH;

		// Add the course reports to the CourseReportList
		CourseReportList.addAll(courseArray);

		// Add sorted (and filtered) data to the table.
		CourseReportsTableView.setItems(sortedData);

	}

	private void initializeChartBars(CoruseReport report) {
		barChart.setAnimated(true);
		barChart.getData().clear();

		ObservableList<XYChart.Data<String, Number>> scoreData = FXCollections.observableArrayList(
				new XYChart.Data<>("0-54", 0), new XYChart.Data<>("55-59", 0), new XYChart.Data<>("60-64", 0),
				new XYChart.Data<>("65-69", 0), new XYChart.Data<>("70-74", 0), new XYChart.Data<>("75-79", 0),
				new XYChart.Data<>("80-84", 0), new XYChart.Data<>("85-89", 0), new XYChart.Data<>("90-94", 10),
				new XYChart.Data<>("95-100", 0));

		ExamDone exam = new ExamDone(report.getIDExam(), report.getProgressID(), "", "", "", 0, 0, "", "", 0);

		Message message = new Message(MessageType.GetLecturerExamReport, exam);
		ClientUI.chat.accept(message);

		int highestGrade = 0;
		int lowestGrade = 100;
		int midGrade = 0;
		double avarage = 0;
		double percentageFail = 0;

		ArrayList<StudentExamGrade> studentsExams = ClientUI.chat.client.examReport;
		int[] gradesArr = new int[10];
		if (!studentsExams.isEmpty()) {

			Collections.sort(studentsExams, new Comparator<StudentExamGrade>() {
				@Override
				public int compare(StudentExamGrade s1, StudentExamGrade s2) {
					return Integer.compare(s1.getGrade(), s2.getGrade());
				}
			});
			int midIndex = studentsExams.size() / 2;

			midGrade = studentsExams.get(midIndex).getGrade();

			for (StudentExamGrade studentExamGrade : studentsExams) {

				int grade = studentExamGrade.getGrade();
				avarage += grade;
				if (grade > highestGrade) {
					highestGrade = grade;
				}
				if (grade < lowestGrade) {
					lowestGrade = grade;
				}
				if (grade < 55) {
					percentageFail++;
					gradesArr[0]++;
				} else if (grade > 54 && grade < 60) {
					gradesArr[1]++;
				} else if (grade > 59 && grade < 65) {
					gradesArr[2]++;
				} else if (grade > 64 && grade < 70) {
					gradesArr[3]++;
				} else if (grade > 69 && grade < 75) {
					gradesArr[4]++;
				} else if (grade > 74 && grade < 80) {
					gradesArr[5]++;
				} else if (grade > 79 && grade < 85) {
					gradesArr[6]++;
				} else if (grade > 84 && grade < 90) {
					gradesArr[7]++;
				} else if (grade > 89 && grade < 95) {
					gradesArr[8]++;
				} else if (grade > 94 && grade <= 100) {
					gradesArr[9]++;
				}
			}
			this.avarage.setText("" + (avarage / studentsExams.size()));
			this.highestGrade.setText("" + highestGrade);
			this.lowestGrade.setText("" + lowestGrade);
			this.midGrade.setText("" + midGrade);
			this.numberOfStudents.setText("" + studentsExams.size());
			double percent = (percentageFail / studentsExams.size()) * 100;
			this.percentageFail.setText(String.format("%.0f%%", percent));
		} else {
			this.avarage.setText("None");
			this.highestGrade.setText("None");
			this.lowestGrade.setText("None");
			this.midGrade.setText("None");
			this.numberOfStudents.setText("0");
			this.percentageFail.setText("None");
		}

		for (int i = 0; i < 10; i++) {
			scoreData.get(i).setYValue(gradesArr[i]);
		}

		XYChart.Series<String, Number> series = new XYChart.Series<>(scoreData);
		barChart.getData().add(series);
		barChart.setAnimated(false);
	}
/////////////////

	/**
	 * handle exit button
	 * 
	 * @param event
	 */
	@FXML
	public void handleExitButtonClicked(ActionEvent event) {
		((Node) event.getSource()).getScene().getWindow().hide();
		try {
			new DepartmentHeadMainMenuController().start(new Stage());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	/**
	 * @param event
	 */
	@FXML
	public void handleHistogramClicked(ActionEvent event) {
		CoruseReport report = CourseReportsTableView.getSelectionModel().getSelectedItem();
		if (report != null) {
			initializeChartBars(report);
			HistogramPane.toFront();
			avarageLabel.setVisible(true);
			highestGradeLabel.setVisible(true);
			lowestGradeLabel.setVisible(true);
			midGradeLabel.setVisible(true);
			numberOfStudentsLabel.setVisible(true);
			percentageFailLabel.setVisible(true);
			avarage.setVisible(true);
			highestGrade.setVisible(true);
			lowestGrade.setVisible(true);
			midGrade.setVisible(true);
			numberOfStudents.setVisible(true);
			percentageFail.setVisible(true);
			CourseReportsTableView.getSelectionModel().clearSelection();
		}

	}

	@Override
	public void start(Stage primaryStage) throws Exception {
		// TODO Auto-generated method stub
		Parent root = FXMLLoader.load(getClass().getResource("/gui/CourseReportDHForm.fxml"));

		Scene scene = new Scene(root);
		scene.getStylesheets().add(getClass().getResource("/style/CourseReportDHFormStyle.css").toExternalForm());

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

	@FXML
	public void handleBackToReportListClicked(ActionEvent event) {
		CourseReportPane.toFront();
		avarageLabel.setVisible(false);
		highestGradeLabel.setVisible(false);
		lowestGradeLabel.setVisible(false);
		midGradeLabel.setVisible(false);
		numberOfStudentsLabel.setVisible(false);
		percentageFailLabel.setVisible(false);
		avarage.setVisible(false);
		highestGrade.setVisible(false);
		lowestGrade.setVisible(false);
		midGrade.setVisible(false);
		numberOfStudents.setVisible(false);
		percentageFail.setVisible(false);
	}

}
