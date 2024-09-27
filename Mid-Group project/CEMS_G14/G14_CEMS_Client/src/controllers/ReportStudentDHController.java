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
import java.util.Random;
import java.util.ResourceBundle;

import client.ChatClient;
import client.ClientController;
import client.ClientUI;

import entity.*;

public class ReportStudentDHController extends Application implements Initializable {

	@FXML
	private Pane HistogramPane;

	@FXML
	private Pane StudentReportPane;

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
	private Label stdfirstname = new Label();

	@FXML
	private Label stdlastname = new Label();

	@FXML
	private Label stdId = new Label();

	@FXML
	private Label stdfaculty = new Label();

/////////Buttons 	

	@FXML
	private Button btnExit;

	@FXML
	private Button btnBack;

	@FXML
	private Button btnHistogram;

	/////////// Search Text Field
	@FXML
	private TextField SearchTextField;

	private double x, y;

	public static StudentReport studentReport;

	static String id;

	////////////////// Report student Table View
	@FXML
	private TableView<StudentReport> StudentsReportsTableView;

	@FXML
	private TableColumn<StudentReport, String> stdexamidClm;

	@FXML
	private TableColumn<StudentReport, String> stdLecnameClm;

	@FXML
	private TableColumn<StudentReport, String> stddateClm;

	@FXML
	private TableColumn<StudentReport, String> stdexamtypeClm;

	@FXML
	private TableColumn<StudentReport, String> stdCourseClm;

	@FXML
	private TableColumn<StudentReport, String> stdcommentsClm;

	@FXML
	private TableColumn<StudentReport, String> stdgradeClm;

	@FXML
	private TableColumn<StudentReport, String> stdExamSubjectClm;

	private ObservableList<StudentReport> StudentReportList = FXCollections.observableArrayList();

	private FilteredList<StudentReport> filteredData;

	private SortedList<StudentReport> sortedData;

	@FXML
	private BarChart<String, Number> barChart;

	//////////////

	public static void main(String[] args) {
		launch(args);
	}

	// @Override
	public void start(Stage primaryStage) throws Exception {
		Parent root = FXMLLoader.load(getClass().getResource("/gui/StudentReportDHForm.fxml"));

		Scene scene = new Scene(root);
		 scene.getStylesheets().add(getClass().getResource("/style/StudentReportDHFormStyle.css").toExternalForm());

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

		Image logoImage = new Image(getClass().getResourceAsStream("/images/logo_white.png"));
		Image searchImage = new Image(getClass().getResourceAsStream("/images/Search_64.png"));
		Image exitImage = new Image(getClass().getResourceAsStream("/images/Exit.png"));
		Image backImage = new Image(getClass().getResourceAsStream("/images/back_64.png"));
		imageLogo.setImage(logoImage);
		imageSearch.setImage(searchImage);
		imageExit.setImage(exitImage);
		imageBack.setImage(backImage);

		for (User user : ClientUI.chat.client.userlist) {
			if (id.equals(user.getId())) {

				stdfirstname.setText(user.getFirstName());
				stdlastname.setText(user.getLastName());
				stdId.setText(user.getId());
				stdfaculty.setText(user.getFaculty());
			}
		}

//////////////////search student report table///////////////////////

// Wrap the ObservableList in a FilteredList (initially display all data).
		filteredData = new FilteredList<>(StudentReportList, b -> true);

// Set the filter Predicate whenever the filter changes.
		SearchTextField.textProperty().addListener((observable, oldValue, newValue) -> {
			filteredData.setPredicate(stdReport -> {
				// If filter text is empty, display all persons.

				if (newValue == null || newValue.isEmpty()) {
					return true;
				}

				// Compare first name and last name of every person with filter text.
				String lowerCaseFilter = newValue.toLowerCase();

				if (stdReport.getExamId().toLowerCase().indexOf(lowerCaseFilter) != -1) {
					return true; // Filter matches first name.
				} else if (stdReport.getLectureName().toLowerCase().indexOf(lowerCaseFilter) != -1) {
					return true; // Filter matches last name.
				} else if (stdReport.getCourse().toLowerCase().indexOf(lowerCaseFilter) != -1) {
					return true; // Filter matches last name.
				} else if (stdReport.getGrade().toLowerCase().indexOf(lowerCaseFilter) != -1) {
					return true; // Filter matches last name.
				} else if (stdReport.getDate().toLowerCase().indexOf(lowerCaseFilter) != -1) {
					return true; // Filter matches last name.
				} else if (stdReport.getExamType().toLowerCase().indexOf(lowerCaseFilter) != -1) {
					return true; // Filter matches last name.
				} else if (stdReport.getSubject().toLowerCase().indexOf(lowerCaseFilter) != -1) {
					return true; // Filter matches last name.
				} else if (stdReport.getComments().toLowerCase().indexOf(lowerCaseFilter) != -1) {
					return true; // Filter matches last name.
				} else if (stdReport.getTime().toLowerCase().indexOf(lowerCaseFilter) != -1) {
					return true; // Filter matches last name.
				} else
					return false; // Does not match.
			});
		});

// Wrap the FilteredList in a SortedList.
		sortedData = new SortedList<>(filteredData);

// Bind the SortedList comparator to the TableView comparator.
// Otherwise, sorting the TableView would have no effect.
		sortedData.comparatorProperty().bind(StudentsReportsTableView.comparatorProperty());

		// call to the methods to initialize and fill student report table
		initializeStdReportTableColumns();
		fillStdReportTable();

		StudentReportPane.toFront();
	}

	/**
	 * Initializes the columns of the tudent report table with their respective cell
	 * value factories.
	 */
	private void initializeStdReportTableColumns() {

		stdexamidClm.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getExamId()));

		stdLecnameClm
				.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getLectureName()));

		stddateClm.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getDate()));

		stdexamtypeClm.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getExamType()));

		stdCourseClm.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getCourse()));

		stdcommentsClm.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getComments()));

		stdgradeClm.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getGrade()));

		stdExamSubjectClm.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getSubject()));

	}

	private void initializeChartData() {
		ObservableList<XYChart.Data<String, Number>> scoreData = FXCollections.observableArrayList(
				new XYChart.Data<>("0-54", 0), new XYChart.Data<>("55-59", 0), new XYChart.Data<>("60-64", 0),
				new XYChart.Data<>("65-69", 0), new XYChart.Data<>("70-74", 0), new XYChart.Data<>("75-79", 0),
				new XYChart.Data<>("80-84", 0), new XYChart.Data<>("85-89", 0), new XYChart.Data<>("90-94", 10),
				new XYChart.Data<>("95-100", 0));
		// Create a message with the ListStdReportsDH MessageType and the ID
		Message message = new Message(MessageType.ListStdReportsDH, id);
		// Send the message to the server using the ClientUI's chat object
		ClientUI.chat.accept(message);

		int[] gradesArr = new int[10];
		for (StudentReport report : ClientUI.chat.client.stdReportListDH) {
			int grade = Integer.parseInt(report.getGrade());
			if (grade < 55) {
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

		for (int i = 0; i < 10; i++) {
			scoreData.get(i).setYValue(gradesArr[i]);
		}

		XYChart.Series<String, Number> series = new XYChart.Series<>(scoreData);

		barChart.getData().add(series);
	}

	/**
	 * 
	 */
	private void fillStdReportTable() {
		ObservableList<XYChart.Data<String, Number>> scoreData = FXCollections.observableArrayList(
				new XYChart.Data<>("0-54", 0), new XYChart.Data<>("55-59", 0), new XYChart.Data<>("60-64", 0),
				new XYChart.Data<>("65-69", 0), new XYChart.Data<>("70-74", 0), new XYChart.Data<>("75-79", 0),
				new XYChart.Data<>("80-84", 0), new XYChart.Data<>("85-89", 0), new XYChart.Data<>("90-94", 10),
				new XYChart.Data<>("95-100", 0));
		// Clear the StudentReportList
		StudentReportList.clear();
		// Create a message with the ListStdReportsDH MessageType and the ID
		Message message = new Message(MessageType.ListStdReportsDH, id);
		// Send the message to the server using the ClientUI's chat object
		ClientUI.chat.accept(message);
		// Retrieve the studentArray from the ChatClient's stdReportListDH variable
		ArrayList<StudentReport> studentArray = ClientUI.chat.client.stdReportListDH;
		// Add all elements from studentArray to the StudentReportList
		StudentReportList.addAll(studentArray);

		// Add the sorted (and filtered) data from StudentReportList to the
		// StudentsReportsTableView
		StudentsReportsTableView.setItems(sortedData);
		
		int[] gradesArr = new int[10];
		for (StudentReport report : ClientUI.chat.client.stdReportListDH) {
			int grade = Integer.parseInt(report.getGrade());
			if (grade < 55) {
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

		for (int i = 0; i < 10; i++) {
			scoreData.get(i).setYValue(gradesArr[i]);
		}

		XYChart.Series<String, Number> series = new XYChart.Series<>(scoreData);

		barChart.getData().add(series);
	}

	//////////// back Button_____________________________________________________

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
	public void handleStdHistogramClicked(ActionEvent event) {
		HistogramPane.toFront();
	}

	@FXML
	public void handlebtnBackClicked(ActionEvent event) {
		StudentReportPane.toFront();
	}
}
