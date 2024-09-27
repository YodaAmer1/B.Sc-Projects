package gui;

import javafx.application.Platform;
import javafx.collections.FXCollections;
import javafx.collections.ListChangeListener;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.TextField;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.image.ImageView;
import javafx.scene.image.Image;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Pane;
import javafx.scene.layout.VBox;
import javafx.stage.FileChooser;
import javafx.stage.Stage;
import javafx.stage.StageStyle;
import controllers.EchoServer;
import controllers.ServerUI;
import entity.*;
import javafx.scene.control.Label;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.TextArea;

import java.awt.Toolkit;
import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.IOException;
import java.net.InetAddress;
import java.net.URL;
import java.net.UnknownHostException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.ResourceBundle;

import javax.imageio.ImageIO;

import DBControl.ClientDBController;
import DBControl.DBConnector;

/*
 * ToDo List
 * 
 * 
 * 
 * Build User Interface Message View
 * 
 */

public class ServerFormController implements Initializable {

	@FXML
	private ImageView logo = new ImageView();

	@FXML
	private TextField ipAddressTextField;

	@FXML
	private TextField PortTextField;

	@FXML
	private TextField dbNameTextField;

	@FXML
	private TextField dbUsernameTextField;

	@FXML
	private TextField dbPasswordTextField;

	@FXML
	public Label serverStatus = new Label();

	@FXML
	private Button btnStartServer;

	@FXML
	private Button btnServerLog;
	
	@FXML
	private Button btnImportUsersData;

	@FXML
	private Button btnCleanDisconecteds;

	@FXML
	private Button btnExit;

	@FXML
	private ImageView imgBtnExit = new ImageView();

	@FXML
	private TableView<Client> ClientsTableView;

	@FXML
	private TableColumn<Client, String> ipColumn;

	@FXML
	private TableColumn<Client, String> hostNameColumn;

	@FXML
	private TableColumn<Client, String> statusColumn;

	@FXML
	private TableColumn<Client, String> loggedInAsColumn;

	@FXML
	private TextArea logTextArea;

	private Boolean isLogButtonPressed;

	public static ObservableList<Client> clientList = FXCollections.observableArrayList();

	public static ArrayList<Client> clients = new ArrayList<>();

	double x;
	double y;

	@Override
	public void initialize(URL location, ResourceBundle resources) {
		logTextArea.setVisible(false);
		isLogButtonPressed = false;
		btnServerLog.setText("Show Server Log");
		btnServerLog.setDisable(true);

		Image exitImage = new Image(getClass().getResourceAsStream("/images/Exit_64.png"));
		Image logoImage = new Image(getClass().getResourceAsStream("/images/Logo.png"));
		logo.setImage(logoImage);
		imgBtnExit.setImage(exitImage);

		try {
			InetAddress ipAddress = InetAddress.getLocalHost();
			String ip = ipAddress.getHostAddress();
			ipAddressTextField.setText(ip);
		} catch (UnknownHostException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			ipAddressTextField.setText("127.0.0.1");
		}

		PortTextField.setText("5555");
		dbNameTextField.setText("jdbc:mysql://localhost/CEMS?serverTimezone=IST");
		dbUsernameTextField.setText("root");
		dbPasswordTextField.setText("Aa123456");// for Test only
		setStatusStandby();

		// Create a listener
		ListChangeListener<String> listener = change -> {
			while (change.next()) {
				if (change.wasAdded()) {

					for (String addLog : change.getAddedSubList()) {
						String logList = logTextArea.getText();
						logTextArea.setText(logList + addLog + "\n");
					}
					logTextArea.positionCaret(logTextArea.getText().length());
				}
			}
		};

		// Register the listener with the observable list
		EchoServer.ServerLog.addListener(listener);

		new Thread(new Runnable() {

			@Override
			public void run() {
				// TODO Auto-generated method stub
				while (true) {
					ClientsTableView.setItems(clientList);
				}
			}
		}).start();

		initColumns();
		btnImportUsersData.setDisable(true);
	}

	public void start(Stage primaryStage) throws Exception {
		Parent root = FXMLLoader.load(getClass().getResource("ServerForm.fxml"));

		Scene scene = new Scene(root);
		scene.getStylesheets().add(getClass().getResource("style.css").toExternalForm());

		primaryStage.setScene(scene);
		// set stage borderless
		primaryStage.initStyle(StageStyle.UNDECORATED);

		// Allow to drag the stage
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

	public void initColumns() {
		// Initialize the table columns
		ipColumn.setCellValueFactory(new PropertyValueFactory<Client, String>("ipAddress"));
		hostNameColumn.setCellValueFactory(new PropertyValueFactory<Client, String>("hostName"));
		statusColumn.setCellValueFactory(new PropertyValueFactory<Client, String>("status"));
		loggedInAsColumn.setCellValueFactory(new PropertyValueFactory<Client, String>("loggedInAs"));

	}

	public void startServerButton() {
		if (DBConnector.conn == null) {
			if (ValidTextFields()) {
				int port = Integer.parseInt(PortTextField.getText());
				Boolean condition = ServerUI.runServer(dbNameTextField.getText(), dbUsernameTextField.getText(),
						dbPasswordTextField.getText(), port);
				if (condition) {
					setStatusActive();
					btnServerLog.setDisable(false);
				}
			} else {
				// handle error - display message
			}
			btnStartServer.setText("Stop Server");
		} else {
			try {
				ServerUI.serverControl.close();
			} catch (IOException e) {
				System.out.println("Error in closing connection");
				EchoServer.ServerLog.add(EchoServer.getTime() + "> Error in closing connection!");
			}
			setStatusStandby();
			DBConnector.conn = null;
			btnStartServer.setText("Start Server");
		}
	}

	public void cleanDisconnectedUsers() {
		clientList.removeIf(element -> (element.getStatus().equals("Disconnected")));
	}

	public Boolean ValidTextFields() {
		if (ipAddressTextField.getText().isEmpty()) {
			return false;
		}
		if (PortTextField.getText().isEmpty()) {
			return false;
		}
		if (dbNameTextField.getText().isEmpty()) {
			return false;
		}
		if (dbUsernameTextField.getText().isEmpty()) {
			return false;
		}
		if (dbPasswordTextField.getText().isEmpty()) {
			return false;
		}
		return true;
	}

	@FXML
	public void handleServerLogbtnClick(ActionEvent event) {
		if (isLogButtonPressed) {
			ClientsTableView.setPrefHeight(380);
			logTextArea.setVisible(false);
			btnServerLog.setText("Show Server Log");
			isLogButtonPressed = false;
		} else {
			ClientsTableView.setPrefHeight(180);
			logTextArea.setVisible(true);
			btnServerLog.setText("Hide Server Log");
			isLogButtonPressed = true;
		}
	}
	
	@FXML
	public void handleImportBtnClick(ActionEvent event) {
		FileChooser fileChooser = new FileChooser();
		

		// Set the initial directory to the downloads folder
		String userHome = System.getProperty("user.home");
		Path downloadsPath = Paths.get(userHome, "Downloads");
		fileChooser.setInitialDirectory(downloadsPath.toFile());
		
		fileChooser.getExtensionFilters().add(new FileChooser.ExtensionFilter("Text file", "*.txt"));
		File fileToUpload = fileChooser.showOpenDialog(new Stage());
		if (fileToUpload == null)
			return; // in case that the user click cancel in choose upload file (Manual test)
		ClientDBController.importUsersData(fileToUpload.getPath());
		btnImportUsersData.setDisable(true);
	}
	
	private void setStatusStandby() {
		serverStatus.setStyle("-fx-Text-fill: #c72814");
		serverStatus.setText("Standby");
	}
	
	private void setStatusActive() {
		serverStatus.setStyle("-fx-Text-fill: #30aa34");
		serverStatus.setText("Active");
		btnImportUsersData.setDisable(false);
	}

	public void exitButton() {
		ServerUI.exit();
	}
}
