package controllers;

import javafx.application.Application;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.ListView;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.input.KeyCode;
import javafx.scene.input.KeyEvent;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Pane;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;
import javafx.stage.StageStyle;

import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;

import client.ChatClient;
import client.ClientController;
import client.ClientUI;
import entity.*;

public class LoginFormController extends Application implements Initializable {

	@FXML
	private ImageView loginImage;

	@FXML
	private ImageView imgBtnExit;
	
	@FXML
	private ListView<Question> list;

	@FXML
	private TextField usernameField;

	@FXML
	private PasswordField passwordField;

	@FXML
	private Button btnLogin;

	@FXML
	private Button btnForgotpassword;

	@FXML
	private Button btnExit;

	private double x, y;

	@Override
	public void initialize(URL location, ResourceBundle resources) {
		Image sideImage = new Image(getClass().getResourceAsStream("/images/side_Image.png"));
		loginImage.setImage(sideImage);
		Image exitImagebtn = new Image(getClass().getResourceAsStream("/images/Exit.png"));
		imgBtnExit.setImage(exitImagebtn);

		usernameField.setText("");
		passwordField.setText("");
	}

	@Override
	public void start(Stage primaryStage) throws Exception {
		Parent root = FXMLLoader.load(getClass().getResource("/gui/LoginForm.fxml"));

		Scene scene = new Scene(root);
		scene.getStylesheets().add(getClass().getResource("/style/loginFormStyle.css").toExternalForm());

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
	public void handleLoginClick(ActionEvent event) {

		String username = usernameField.getText();
		String password = passwordField.getText();

		if (username.isEmpty()) {
			ClientUI.display(DialogType.Warning, "Have Attention!", "You must fill the Username field.");
			return;
		}

		if (password.isEmpty()) {
			ClientUI.display(DialogType.Warning, "Have Attention!", "You must fill the Password field.");
			return;
		}
		User user = new User(username, password);
		Message message = new Message(MessageType.LogIn, user);
		ClientUI.chat.accept(message);

		if (ClientUI.chat.client.user != null) {
			try {
				if (ClientUI.chat.client.user.getIsLogedIn() != 1) {
					int role = ClientUI.chat.client.user.getRole();
					switch (role) {
					case 1:
						System.out.println("Lecturer Main Menu Opened!");
						ClientUI.primaryStage = new Stage();
						((Node) event.getSource()).getScene().getWindow().hide();
						new LecturerMainMenuController().start(ClientUI.primaryStage);
						return;
					case 2:
						System.out.println("Student Main Menu Opened!");
						((Node) event.getSource()).getScene().getWindow().hide();
						new StudentMainMenuController().start(new Stage());
						return;
					case 3:
						System.out.println("Principal Main Menu Opened!");
						ClientUI.primaryStage = new Stage();
						((Node) event.getSource()).getScene().getWindow().hide();
						new DepartmentHeadMainMenuController().start(ClientUI.primaryStage);
						return;
					default:
						return;
					}
				}else {
					ClientUI.chat.client.user = null;
					ClientUI.display(DialogType.Attention, "Have Attention!",
							"The User is Already Logged In.");
				}
//				if (ClientUI.chat.client.user.getIsLogedIn() != 1) {
//					int role = ClientUI.chat.client.user.getRole();
//					switch (role) {
//					case 1:
//						System.out.println("Lecturer Main Menu Opened!");
//						((Node) event.getSource()).getScene().getWindow().hide();
//						new LecturerMainMenuController().start(new Stage());
//						return;
//					case 2:
//						System.out.println("Student Main Menu Opened!");
//						return;
//					case 3:
//						System.out.println("Head Of Department	 Main Menu Opened!");
//						return;
//					default:
//						return;
//					}
//				}else {
//					ClientUI.chat.client.user = null;
//					ClientUI.display(DialogType.Attention, "Have Attention!",
//							"The User is Already Logged In.");
//				}
			} catch (Exception e) {

			}
		} else {
			ClientUI.display(DialogType.Error, "invalid User Data!",
					"Username And/Or Password are incorrect,\nPlease Check the data you filled.");
		}
	}

	public void handleForgotPasswordButton() {
		// handle Password Button
	}

	public void handleExitButton() {
		ClientController.systemExit();
	}
}
