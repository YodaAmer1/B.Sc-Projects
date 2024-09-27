package client;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

import javax.swing.JOptionPane;

import controllers.ConnectToServerFormController;
import controllers.CreateExamFormController;
import controllers.CustomPopupWindow;
import controllers.ExamInProgressStudentFormController;
import controllers.LecturerExamReportViewController;
import controllers.LecturerMainMenuController;
import entity.DialogType;
import javafx.application.Application;
import javafx.application.Platform;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;
import javafx.stage.StageStyle;

/**
 * @author safak
 *
 */
public class ClientUI extends Application {
	public static ClientController chat;

	public static Stage primaryStage;
	
	public static CustomPopupWindow dialog = new CustomPopupWindow();

	public static double x, y;

	@Override
	public void start(Stage primaryStage) throws Exception {
		this.primaryStage = new Stage();
//		new LecturerExamReportViewController().start(this.primaryStage);
		new ConnectToServerFormController().start(this.primaryStage);
//		new ExamInProgressStudentFormController().start(primaryStage);
//		new CreateExamFormController().start(primaryStage);
	}

	public void changeStage(String resourse) {
		try {
			primaryStage.getScene().getWindow().hide();
			Parent root = FXMLLoader.load(getClass().getResource(resourse));
			primaryStage = new Stage();
			primaryStage.setScene(new Scene(root));
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
		} catch (Exception e) {

		}
	}

	public static void main(String[] args) {
		launch(args);
	}
	
	/**
	 * @param type	Dialog type ..
	 * @param Title
	 * @param Message
	 */
	public static void display(DialogType type ,String Title, String Message) {
		// TODO Auto-generated method stub
//		JOptionPane.showMessageDialog(null, msg);
		Platform.runLater(new Runnable() {
			
			@Override
			public void run() {
				// TODO Auto-generated method stub
				dialog.start(primaryStage, type, Title, Message);
			}
		});
		
	}
	
	public static String dateFormat() {
		 // Get the current date
        LocalDate currentDate = LocalDate.now();
        
        // Create a formatter for the desired date format
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        
        // Format the date using the formatter
        return currentDate.format(formatter);
	}
	
	public static String timeFormat() {
		// Get the current date
		LocalTime currentTime = LocalTime.now();
		
		// Create a formatter for the desired date format
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
        
     // Format the date using the formatter
        return currentTime.format(formatter);
	}
}
