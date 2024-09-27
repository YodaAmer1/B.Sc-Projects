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

/**
 * Controller class for the Create Question Form.
 * Handles user interactions and actions related to creating a new question.
 */
public class CreateQuestionFormController extends Application implements Initializable {
	//all FXML GUI variables for this stage.
    @FXML
    private ImageView imageLogo = new ImageView();

    @FXML
    private ImageView imageExit = new ImageView();

    @FXML
    private Button CreateQuestionButton;

    @FXML
    private Button BackButton;

    @FXML
    private Button selectAllCourses;

    @FXML
    private ComboBox<Subject> subjectNameComboBox = new ComboBox<>();

    private ObservableList<Subject> subjectList = FXCollections.observableArrayList();

    @FXML
    private ComboBox<String> CorrectQuestionComboBox = new ComboBox<>();

    @FXML
    private TextArea QuestionTextArea;

    @FXML
    private TextArea AnswerATextArea;

    @FXML
    private TextArea AnswerBTextArea;

    @FXML
    private TextArea AnswerCTextArea;

    @FXML
    private TextArea AnswerDTextArea;
    //stage dimensions
    private double x, y;

    /**
     * Initializes the controller after its root element has been completely processed.
     * This method is automatically called by the FXMLLoader.
     *
     * @param location  The location used to resolve relative paths for the root object, or null if the location is not known.
     * @param resources The resources used to localize the root object, or null if the root object was not localized.
     */
    @Override
    public void initialize(URL location, ResourceBundle resources) {
        CorrectQuestionComboBox.setItems(FXCollections.observableArrayList("Answer A", "Answer B", "Answer C", "Answer D"));

        Image logoImage = new Image(getClass().getResourceAsStream("/images/logo_white.png"));
        Image exitImage = new Image(getClass().getResourceAsStream("/images/Exit.png"));
        imageLogo.setImage(logoImage);
        imageExit.setImage(exitImage);

        getSubjectsList();
    }

    /**
     * Retrieves the list of subjects from the server and populates the subjectNameComboBox.
     */
    private void getSubjectsList() {
        Message message = new Message(MessageType.GetSubjectsList, ClientUI.chat.client.user.getId());
        ClientUI.chat.accept(message);

        for (Subject subject : ClientUI.chat.client.subjectsList) {
            subjectList.add(subject);
        }
        subjectNameComboBox.setItems(subjectList);
    }

    /**
     * Handles the event when the "Create Question" button is clicked.
     *
     * @param event The action event triggered by clicking the button.
     */
    @FXML
    public void handleCreateQuestionButtonClicked(ActionEvent event) {
        if (ValidQuestionData()) {
            Subject subject = subjectNameComboBox.getSelectionModel().getSelectedItem();
            int correctAnswer = CorrectQuestionComboBox.getSelectionModel().getSelectedIndex() + 1;

            Question newQuestion = new Question(subject.getTopicID(), subject.getTopic(), QuestionTextArea.getText(), AnswerATextArea.getText(), AnswerBTextArea.getText(), AnswerCTextArea.getText(), AnswerDTextArea.getText(), correctAnswer, ClientUI.chat.client.user.getUsername());
            Message messageToServer = new Message(MessageType.CreateNewQuestion, newQuestion);

            ClientUI.chat.accept(messageToServer);
        }
    }

    /**
     * Validates the question data to ensure all required fields are filled.
     *
     * @return True if the question data is valid, false otherwise.
     */
    public Boolean ValidQuestionData() {
        if (subjectNameComboBox.getSelectionModel().getSelectedIndex() == -1) {
            return false;
        }
        if (CorrectQuestionComboBox.getSelectionModel().getSelectedIndex() == -1) {
            return false;
        //if one of the text areas is empty return false.
        }
        if (QuestionTextArea.getText().isEmpty()) {
            return false;
        }
        if (AnswerATextArea.getText().isEmpty()) {
            return false;
        }
        if (AnswerBTextArea.getText().isEmpty()) {
            return false;
        }
        if (AnswerCTextArea.getText().isEmpty()) {
            return false;
        }
        if (AnswerDTextArea.getText().isEmpty()) {
            return false;
        }
        return true;
    }

    /**
     * Handles the event when the "Exit" button is clicked.
     *
     * @param event The action event triggered by clicking the button.
     */
    @FXML
    public void exitButton(ActionEvent event) {
        ((Node) event.getSource()).getScene().getWindow().hide();
    }

    @Override
    public void start(Stage primaryStage) throws Exception {
        // TODO Auto-generated method stub
        Parent root = FXMLLoader.load(getClass().getResource("/gui/CreateQuestionForm.fxml"));

        Scene scene = new Scene(root);
        scene.getStylesheets().add(getClass().getResource("/style/createQuestionFormStyle.css").toExternalForm());

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