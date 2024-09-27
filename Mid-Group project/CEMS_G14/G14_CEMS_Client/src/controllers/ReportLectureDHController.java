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
import javafx.scene.chart.BarChart;
import javafx.scene.chart.XYChart;
import javafx.scene.control.*;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.Pane;
import javafx.stage.Stage;
import javafx.stage.StageStyle;

import java.net.URL;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Random;
import java.util.ResourceBundle;

import client.ChatClient;
import client.ClientController;
import client.ClientUI;

import entity.*;

public class ReportLectureDHController extends Application implements Initializable {

	@FXML
	private Pane LecturerReportPane;

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
	private Label lecLastName = new Label();

	@FXML
	private Label lecFirstName = new Label();

	@FXML
	private Label lecId = new Label();

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
	private Button BackButton;

	@FXML
	private BarChart<String, Number> barChart;

	@FXML
	private Button BackToReportPaneButton;

	/////////// Search Text Field
	@FXML
	private TextField searchTextField;

	private double x, y;

	static String id;

	public LectureReport lectureReport;

	////////////////// Report Lecture Table View
	@FXML
	private TableView<LectureReport> LecReportTableView;

	@FXML
	private TableColumn<LectureReport, String> LecExamIdClm;

	@FXML
	private TableColumn<LectureReport, String> LecCourseClm;

	@FXML
	private TableColumn<LectureReport, String> SubjectClm;

	@FXML
	private TableColumn<LectureReport, String> TimeClm;

	@FXML
	private TableColumn<LectureReport, String> ExamDateClm;

	@FXML
	private TableColumn<LectureReport, Integer> NoStudentClm;

	@FXML
	private TableColumn<LectureReport, Button> btnViewHistogram;

	private ObservableList<LectureReport> LectureReportList = FXCollections.observableArrayList();

	private FilteredList<LectureReport> filteredData;

	private SortedList<LectureReport> sortedData;

	//////////////

	@Override
	public void start(Stage primaryStage) throws Exception {
		Parent root = FXMLLoader.load(getClass().getResource("/gui/LectureReportDHForm.fxml"));

		Scene scene = new Scene(root);
		 scene.getStylesheets().add(getClass().getResource("/style/LectureReportDHFormStyle.css").toExternalForm());

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

	// Initialize The Labels
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

		Image logoImage = new Image(getClass().getResourceAsStream("/images/logo_white.png"));
		Image searchImage = new Image(getClass().getResourceAsStream("/images/Search_64.png"));
		Image exitImage = new Image(getClass().getResourceAsStream("/images/Exit.png"));
		Image backImage = new Image(getClass().getResourceAsStream("/images/back_64.png"));
		imageLogo.setImage(logoImage);
		imageSearch.setImage(searchImage);
		imageExit.setImage(exitImage);
		imageBack.setImage(backImage);

		// initialize the labels
		for (User user : ClientUI.chat.client.userlist) {
			if (id.equals(user.getId())) {

				lecFirstName.setText(user.getFirstName());
				lecLastName.setText(user.getLastName());
				lecId.setText(user.getId());
			}
		}

//////////////////search lecture report table/////////////////////// 

// Wrap the ObservableList in a FilteredList (initially display all data).
		filteredData = new FilteredList<>(LectureReportList, b -> true);

// Set the filter Predicate whenever the filter changes.
		searchTextField.textProperty().addListener((observable, oldValue, newValue) -> {
			filteredData.setPredicate(lecReport -> {
				// If filter text is empty, display all persons.

				if (newValue == null || newValue.isEmpty()) {
					return true;
				}

				// Compare first name and last name of every person with filter text.
				String lowerCaseFilter = newValue.toLowerCase();

				if (lecReport.getExamId().toLowerCase().indexOf(lowerCaseFilter) != -1) {
					return true; // Filter matches exam id.
				} else if (lecReport.getCourseName().toLowerCase().indexOf(lowerCaseFilter) != -1) {
					return true; // Filter matches course name.
				} else if (lecReport.getSubject().toLowerCase().indexOf(lowerCaseFilter) != -1) {
					return true; // Filter matches subject.
				} else if (lecReport.getTime().toLowerCase().indexOf(lowerCaseFilter) != -1) {
					return true; // Filter matches time.
				} else if (lecReport.getExamDate().toLowerCase().indexOf(lowerCaseFilter) != -1) {
					return true; // Filter matches date.
				} else if (String.valueOf(lecReport.getNoStudent()).toLowerCase().indexOf(lowerCaseFilter) != -1) {
					return true; // Filter matches number of students.
				} else
					return false; // Does not match.
			});
		});

// Wrap the FilteredList in a SortedList.
		sortedData = new SortedList<>(filteredData);

// Bind the SortedList comparator to the TableView comparator.
// Otherwise, sorting the TableView would have no effect.
		sortedData.comparatorProperty().bind(LecReportTableView.comparatorProperty());

		// call to the methods to initialize and fill lecture report table
		initializeLecReportTableColumns();
		fillLecReportTable();

	}

	/**
	 * Initializes the columns of the lecture report table with their respective
	 * cell value factories.
	 */
	private void initializeLecReportTableColumns() {

		LecExamIdClm.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getExamId()));

		LecCourseClm.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getCourseName()));

		SubjectClm.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getSubject()));

		TimeClm.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getTime()));

		ExamDateClm.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getExamDate()));

		NoStudentClm.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getNoStudent()));

		btnViewHistogram
				.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getViewHistogram()));

	}

	private void fillLecReportTable() {

		// Clear the LectureReportList
		LectureReportList.clear();
		// Create a message with the ListLecReportsDH MessageType and the ID
		Message message = new Message(MessageType.ListLecReportsDH, id);
		// Send the message to the server using the ClientUI's chat object
		ClientUI.chat.accept(message);
		// Retrieve the reportArray from the ChatClient's lecReportListDH variable
		ArrayList<LectureReport> reportArray = ClientUI.chat.client.lecReportListDH;
		// Iterate over each lecture report in the reportArray
		for (LectureReport report : reportArray) {
			// Create a "View" button for each report
			Button viewButton = new Button("View");
			// Set the action for the "View" button
			viewButton.setOnAction(event -> {
				Platform.runLater(() -> {
					try {
						// Set the selected lecture report in ChatClient's lecReport variable
						lectureReport = report;
						initializeChartBars();
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
						// on action view button
					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				});
			});
			// Set the viewButton for the current lecture report
			report.setViewHistogram(viewButton);
		}
		// Add all lecture reports from reportArray to the LectureReportList
		LectureReportList.addAll(reportArray);

		// Add the sorted (and filtered) data from LectureReportList to the
		// LecReportTableView
		LecReportTableView.setItems(sortedData);
	}

	private void initializeChartBars() {
		barChart.setAnimated(true);
		barChart.getData().clear();

		ObservableList<XYChart.Data<String, Number>> scoreData = FXCollections.observableArrayList(
				new XYChart.Data<>("0-54", 0), new XYChart.Data<>("55-59", 0), new XYChart.Data<>("60-64", 0),
				new XYChart.Data<>("65-69", 0), new XYChart.Data<>("70-74", 0), new XYChart.Data<>("75-79", 0),
				new XYChart.Data<>("80-84", 0), new XYChart.Data<>("85-89", 0), new XYChart.Data<>("90-94", 10),
				new XYChart.Data<>("95-100", 0));

		ExamDone exam = new ExamDone(lectureReport.getExamId(), lectureReport.getProgressID(), "", "", "", 0, 0, "", "",
				0);

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

	//////////// Back Button_____________________________________________________

	@FXML
	public void handleBackButtonClicked(ActionEvent event) {
		((Node) event.getSource()).getScene().getWindow().hide();
		try {
			new DepartmentHeadMainMenuController().start(new Stage());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	@FXML
	public void handleBackToReportListClicked(ActionEvent event) {
		LecturerReportPane.toFront();
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
