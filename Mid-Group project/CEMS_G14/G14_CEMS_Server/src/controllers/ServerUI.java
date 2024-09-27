package controllers;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;
import javafx.stage.StageStyle;
import DBControl.DBConnector;
import gui.ServerFormController;
import gui.ServerFormController;

public class ServerUI extends Application {
	
	public static ServerFormController control;
	public static EchoServer serverControl;

	public static void main(String[] args) {
		launch(args);
	}

	@Override
	public void start(Stage primaryStage) throws Exception {
		control = new ServerFormController();
		control.start(primaryStage);
	}

	public static Boolean runServer(String url, String username, String password, int port) {
		if(DBConnector.conn == null) {
			serverControl = new EchoServer(url, username, password, port);
			try {
				// start listening for the connection.
				serverControl.listen();
				return true;
			} catch (Exception ex) {
				System.out.println("ERROR - Could not listen for clients!");
				EchoServer.ServerLog.add(EchoServer.getTime() + "> ERROR - Could not listen for clients!");
				DBConnector.conn = null;
				return false;
			}
		}else {
			//handle error - Server already running
			return false;
		}
	}

	public static void exit() {
		// close server.
		if (DBConnector.conn != null) {
			try {
				serverControl.close();
			} catch (IOException e) {
				System.out.println("Error in closing connection");
				EchoServer.ServerLog.add(EchoServer.getTime() + "> Error in closing connection!");
			}
		}
		System.exit(0);
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