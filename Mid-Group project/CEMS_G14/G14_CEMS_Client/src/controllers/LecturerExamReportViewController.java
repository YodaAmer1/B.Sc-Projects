package controllers;

import javafx.scene.chart.BarChart;
import javafx.scene.chart.LineChart;
import javafx.scene.chart.NumberAxis;
import javafx.scene.chart.XYChart;
import javafx.stage.Stage;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.ResourceBundle;

import client.ChatClient;
import client.ClientController;
import client.ClientUI;
import entity.*;
import javafx.application.Application;
import javafx.application.Platform;
import javafx.beans.property.ReadOnlyObjectWrapper;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.chart.LineChart;
import javafx.scene.control.Button;
import javafx.scene.control.CheckBox;
import javafx.scene.control.ComboBox;
import javafx.scene.control.Label;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.scene.control.TextFormatter;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.Pane;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;
import javafx.stage.StageStyle;

public class LecturerExamReportViewController implements Initializable {
	
	public static ExamDone exam;

	@FXML
	private ImageView imageLogo = new ImageView();
	
	@FXML
	private BarChart<String, Number> barChart;

	@FXML
	private ImageView imageExit = new ImageView();
	
	@FXML
	private Button requestButton;

	@FXML
	private Button btnExit;
	
	@FXML
	private Label subjectName = new Label();
	
	@FXML
	private Label courseName = new Label();
	
	@FXML
	private Label date = new Label();

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
	
	@FXML
	private TextField extraTime;

	@FXML
	private TextArea reasonTextArea;

	private double x, y;

	@Override
	public void initialize(URL location, ResourceBundle resources) {
	
		initializeChartBars();
		subjectName.setText(exam.getSubject());
		courseName.setText(exam.getCourse());
		date.setText(exam.getDate());
		numberOfStudents.setText("" + exam.getNumberOfStudents());
	}
	
	public void start(Stage primaryStage) throws Exception {
		// TODO Auto-generated method stub
		Parent root = FXMLLoader.load(getClass().getResource("/gui/LecturerExamReportView.fxml"));

		Scene scene = new Scene(root);
		scene.getStylesheets().add(getClass().getResource("/style/viewQuestionFormStyle.css").toExternalForm());
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
	
	
	private void initializeChartBars() {
		ObservableList<XYChart.Data<String, Number>> scoreData = FXCollections.observableArrayList(
				new XYChart.Data<>("0-54", 0), new XYChart.Data<>("55-59", 0), new XYChart.Data<>("60-64", 0),
				new XYChart.Data<>("65-69", 0), new XYChart.Data<>("70-74", 0), new XYChart.Data<>("75-79", 0),
				new XYChart.Data<>("80-84", 0), new XYChart.Data<>("85-89", 0), new XYChart.Data<>("90-94", 10),
				new XYChart.Data<>("95-100", 0));
		exam.setViewReportButton(null);
		
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
				if(grade > highestGrade) {
					highestGrade = grade;
				}
				if(grade < lowestGrade) {
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
			this.avarage.setText("" + (avarage/studentsExams.size()));
			this.highestGrade.setText("" + highestGrade);
			this.lowestGrade.setText("" + lowestGrade);
			this.midGrade.setText("" + midGrade);
			double percent = (percentageFail / studentsExams.size()) * 100;
			this.percentageFail.setText(String.format("%.0f%%", percent));
		}else {
			this.avarage.setText("None");
			this.highestGrade.setText("None");
			this.lowestGrade.setText("None");
			this.midGrade.setText("None");
			this.percentageFail.setText("None");
		}
		

		for (int i = 0; i < 10; i++) {
			scoreData.get(i).setYValue(gradesArr[i]);
//			scoreData.get(i).getNode().setStyle("-fx-bar-fill: #6b4ad6;");
		}

		XYChart.Series<String, Number> series = new XYChart.Series<>(scoreData);

		barChart.getData().add(series);
	}
	
	
	@FXML
	public void handleExitButtonClicked(ActionEvent event) {
		((Node) event.getSource()).getScene().getWindow().hide();
	}
}