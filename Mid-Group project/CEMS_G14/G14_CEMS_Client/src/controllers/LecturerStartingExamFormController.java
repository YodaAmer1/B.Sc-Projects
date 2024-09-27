package controllers;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.ResourceBundle;

import client.ChatClient;
import client.ClientController;
import client.ClientUI;
import entity.*;
import javafx.application.Application;
import javafx.application.Platform;
import javafx.beans.property.ReadOnlyObjectWrapper;
import javafx.beans.value.ObservableValue;
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
import javafx.scene.control.Button;
import javafx.scene.control.ComboBox;
import javafx.scene.control.Label;
import javafx.scene.control.TableCell;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableRow;
import javafx.scene.control.TableView;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.scene.control.TableColumn.CellDataFeatures;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.input.ClipboardContent;
import javafx.scene.input.DataFormat;
import javafx.scene.input.Dragboard;
import javafx.scene.input.TransferMode;
import javafx.scene.layout.Pane;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;
import javafx.stage.StageStyle;
import javafx.util.Callback;
import javafx.scene.control.TextFormatter;

public class LecturerStartingExamFormController extends Application implements Initializable {
	//all FXML GUI variables on this stage.
	@FXML
	private ImageView imageLogo = new ImageView();
	
	@FXML
	private ImageView imageSide = new ImageView();

	@FXML
	private ImageView imageExit = new ImageView();

	@FXML
	private Button btnStartExam;


	@FXML
	private Button btnExit;

	@FXML
	private ComboBox<String> examTypeComboBox = new ComboBox<>();

	@FXML
	private TextField examCodeTextField;

	@FXML
	private Label teacherNotesTextArea = new Label();

	private double x, y;

	@Override
	public void initialize(URL location, ResourceBundle resources) {
		Image logoImage = new Image(getClass().getResourceAsStream("/images/logo_white.png"));
		Image sideImage = new Image(getClass().getResourceAsStream("/images/perfomExam.png"));
		Image exitImage = new Image(getClass().getResourceAsStream("/images/Exit.png"));
		imageLogo.setImage(logoImage);
		imageSide.setImage(sideImage);
		imageExit.setImage(exitImage);
		
		int codeLength = 4; // Specify your desired maximum length here
        
        // Create a TextFormatter to limit the length
        TextFormatter<String> textFormatter = new TextFormatter<>(
        		change -> {
                	String newText = change.getControlNewText();
                    if (newText.matches("[A-Za-z0-9]*") && change.getControlNewText().length() <= codeLength) {
                        return change;
                    }
                    return null; // Reject the change if it exceeds the maximum length
                });
        
        examCodeTextField.setTextFormatter(textFormatter);

		examTypeComboBox.setItems(FXCollections.observableArrayList("Online", "Manual"));
		
		teacherNotesTextArea.setText(ClientUI.chat.client.examToPerform.getCommentsForLecturer());
	}

	@FXML
	public void handleStartExamButton(ActionEvent event) {
	    // Check if the exam data is valid
	    if (validExamData()) {
	        // Create an ExamToPerform object with the necessary details
	        ExamToPerform startedExam = new ExamToPerform(
	        		ClientUI.chat.client.examToPerform,
	                examCodeTextField.getText(),
	                examTypeComboBox.getSelectionModel().getSelectedIndex(),
	                ClientUI.chat.client.user.getFirstName() + " " + ClientUI.chat.client.user.getLastName(),
	                ClientUI.chat.client.user.getId()
	        );

	        // Send a message to start the exam to the server
	        Message message = new Message(MessageType.LecturerStartExam, startedExam);
	        ClientUI.chat.accept(message);

	        // Hide the current window
	        ((Node) event.getSource()).getScene().getWindow().hide();
	    }
	}
	
	/**
	 * Method that check if the exam data are valid
	 * 
	 * @return return true if the data are valid and false otherwise
	 */
	public Boolean validExamData() {
	    // Check if an exam type is selected
	    if (examTypeComboBox.getSelectionModel().getSelectedItem() == null) {
	        ClientUI.display(DialogType.Warning, "Exam Type Field!", "You Have To Choose Exam Type, Online Or Manual.");
	        return false;
	    }

	    // Check if the exam code has 4 characters
	    if (examCodeTextField.getText().length() != 4) {
	        ClientUI.display(DialogType.Warning, "Exam Code Field!", "The Code You Have Entered Is Short, You Have To Set a 4-Character Code.");
	        return false;
	    }

	    // All exam data is valid
	    return true;
	}
	
	/**
	 * Handles the action when the exit button is clicked.
	 * 
	 * @param event The action event triggered by the exit button.
	 */
	@FXML
	public void handleExitButtonClicked(ActionEvent event) {
	    ((Node) event.getSource()).getScene().getWindow().hide();
	}

	@Override
	public void start(Stage primaryStage) throws Exception {
		Parent root = FXMLLoader.load(getClass().getResource("/gui/LecturerStartingExamForm.fxml"));

		Scene scene = new Scene(root);
		scene.getStylesheets().add(getClass().getResource("/style/createExamFormStyle.css").toExternalForm());

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