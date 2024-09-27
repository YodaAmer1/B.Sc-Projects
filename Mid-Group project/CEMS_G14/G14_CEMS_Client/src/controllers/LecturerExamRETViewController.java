package controllers;

import java.net.URL;
import java.util.ArrayList;
import java.util.ResourceBundle;

import client.ChatClient;
import client.ClientUI;
import entity.Course;
import entity.DialogType;
import entity.ExamInProgress;
import entity.ExtraTimeRequest;
import entity.Message;
import entity.MessageType;
import entity.Question;
import entity.Subject;
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

public class LecturerExamRETViewController implements Initializable {

	@FXML
	private ImageView imageLogo = new ImageView();
	
	@FXML
	private ImageView imageSideLogo = new ImageView();

	@FXML
	private ImageView imageExit = new ImageView();
	
	@FXML
	private Button requestButton;

	@FXML
	private Button btnExit;
	
	@FXML
	private Label examIDName = new Label();
	
	@FXML
	private Label subjectName = new Label();

	@FXML
	private Label courseName = new Label();

	@FXML
	private Label Pre_Duration = new Label();
	
	@FXML
	private TextField extraTime;

	@FXML
	private TextArea reasonTextArea;

	private double x, y;

	@Override
	public void initialize(URL location, ResourceBundle resources) {
		examIDName.setText(ClientUI.chat.client.examInProgress.getExamID());
		subjectName.setText(ClientUI.chat.client.examInProgress.getStatus());
		courseName.setText(ClientUI.chat.client.examInProgress.getCourse());
		Pre_Duration.setText("" + ClientUI.chat.client.examInProgress.getTime());
		
		// Create a TextFormatter to limit input to numbers
        TextFormatter<String> textFormatter = new TextFormatter<>(
                change -> {
                	String newText = change.getControlNewText();
                    if (newText.matches("[0-9]*")) {
                        return change;
                    }
                    return null; // Reject the change if it the input not number
                });
        
        extraTime.setTextFormatter(textFormatter);
		
		Image logoImage = new Image(getClass().getResourceAsStream("/images/logo_white.png"));
		Image exitImage = new Image(getClass().getResourceAsStream("/images/Exit.png"));
		imageLogo.setImage(logoImage);
		imageExit.setImage(exitImage);
	}
	
	@FXML
	public void handleRequestButtonClicked(ActionEvent event) {
		if (ValidQuestionData()) {
			ExtraTimeRequest etr = new ExtraTimeRequest(0, ClientUI.chat.client.examInProgress.getProgressId(), ClientUI.chat.client.user.getId(), ClientUI.chat.client.user.getUsername(), ClientUI.chat.client.examInProgress.getCourse(), ClientUI.chat.client.examInProgress.getTime(), ClientUI.chat.client.examInProgress.getSubject(), Integer.parseInt(extraTime.getText()), reasonTextArea.getText(), "0");
			
			Message messageToServer = new Message(MessageType.RequestExtraTime, etr);
			ClientUI.chat.accept(messageToServer);
		}
	}
	
	public Boolean ValidQuestionData() {
		if (extraTime.getText().isEmpty()) {
			ClientUI.display(DialogType.Warning, "Input Error!", "You Must To Fill The Extra Time Field!");
			return false;
		}
		if (reasonTextArea.getText().isEmpty()) {
			ClientUI.display(DialogType.Warning, "Input Error!", "You Must To Fill The Request Reason Field!");
			return false;
		}
		return true;
	}
	
	@FXML
	public void handleExitButtonClicked(ActionEvent event) {
		((Node)event.getSource()).getScene().getWindow().hide();
	}

	public void start(Stage primaryStage) throws Exception {
		// TODO Auto-generated method stub
		Parent root = FXMLLoader.load(getClass().getResource("/gui/LecturerExamRETView.fxml"));

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
}