package controllers;

import java.net.URL;
import java.util.ArrayList;
import java.util.ResourceBundle;

import client.ChatClient;
import client.ClientUI;
import entity.Course;
import entity.DialogType;
import entity.ExamInProgress;
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
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.Pane;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;
import javafx.stage.StageStyle;

public class QuestionsBankDHController implements Initializable{
	@FXML
	private ImageView imageLogo = new ImageView();

	@FXML
	private ImageView imageExit = new ImageView();
	
	@FXML
	private Button BackButton;
	
	
	@FXML
	private Label QuestionIdLabelDH = new Label() ;
	
	@FXML
	private Label SubjectLabelDH = new Label();
	
	@FXML
	private Label LectureNameLabelDH = new Label();
	
	@FXML
	private Label CorrectAswerLabelDH = new Label();
	
	@FXML
	private TextArea questionDHTextArea;

	@FXML
	private TextArea AnswerADHTexDHtArea;

	@FXML
	private TextArea AnswerBDHTextArea;

	@FXML
	private TextArea AnswerCDHTextArea;

	@FXML
	private TextArea AnswerDDHTextArea;

	private double x, y;

	/**
	 * Initialize the question details view.
	 * It sets the text and properties of various UI elements with the corresponding question data.
	 */
	@Override
	public void initialize(URL location, ResourceBundle resources) 
	{	
	    // Set the question text
		questionDHTextArea.setText(ClientUI.chat.client.question.getQuestionText());
		
	    // Set the answer texts
		AnswerADHTexDHtArea.setText(ClientUI.chat.client.question.getAnswer1());
		AnswerBDHTextArea.setText(ClientUI.chat.client.question.getAnswer2());
		AnswerCDHTextArea.setText(ClientUI.chat.client.question.getAnswer3());
		AnswerDDHTextArea.setText(ClientUI.chat.client.question.getAnswer4());
		
	    // Set the question details labels
		QuestionIdLabelDH.setText(ClientUI.chat.client.question.getQuestionID());
		SubjectLabelDH.setText(ClientUI.chat.client.question.getQuestionSubject());
		LectureNameLabelDH.setText(ClientUI.chat.client.question.getLecturerName());
		CorrectAswerLabelDH.setText(Integer.toString(ClientUI.chat.client.question.getCorrectAnswer()));
		
	    // Set the images for the logo and exit button
		Image logoImage = new Image(getClass().getResourceAsStream("/images/logo_white.png"));
		Image exitImage = new Image(getClass().getResourceAsStream("/images/Exit.png"));
		imageLogo.setImage(logoImage);
		imageExit.setImage(exitImage);
		
	    // Set the text areas to be non-editable
		questionDHTextArea.setEditable(false);
		AnswerADHTexDHtArea.setEditable(false);
		AnswerBDHTextArea.setEditable(false);
		AnswerCDHTextArea.setEditable(false);
		AnswerDDHTextArea.setEditable(false);
		
	}
	
	
	/**
	 * Handle the exit button action.
	 * It hides the current window when the exit button is clicked.
	 */
	@FXML
	public void exitButton(ActionEvent event) {
		((Node)event.getSource()).getScene().getWindow().hide();
	}

	public void start(Stage primaryStage) throws Exception {
		// TODO Auto-generated method stub
		Parent root = FXMLLoader.load(getClass().getResource("/gui/ViewQuestionsBank.fxml"));

		Scene scene = new Scene(root);
		//scene.getStylesheets().add(getClass().getResource("/style/QuestionsBankDHController.css").toExternalForm());
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
