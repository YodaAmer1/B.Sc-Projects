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
 * Controller class for the ViewQuestionForm GUI.
 */
public class ViewQuestionFormController implements Initializable {

    @FXML
    private ImageView imageLogo = new ImageView();

    @FXML
    private ImageView imageExit = new ImageView();

    @FXML
    private Button updateQuestionButton;

    @FXML
    private Button deleteQuestionButton;

    @FXML
    private Button saveChangesButton;

    @FXML
    private Button backButton;

    @FXML
    private Label subjectName = new Label();

    @FXML
    private Label correctAnswerLabel = new Label();

    @FXML
    private ComboBox<String> correctQuestionComboBox = new ComboBox<>();

    @FXML
    private TextArea questionTextArea;

    @FXML
    private TextArea answerATextArea;

    @FXML
    private TextArea answerBTextArea;

    @FXML
    private TextArea answerCTextArea;

    @FXML
    private TextArea answerDTextArea;

    private double x, y;

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        correctQuestionComboBox.setItems(FXCollections.observableArrayList("Answer A", "Answer B", "Answer C", "Answer D"));

        // Set initial values based on ChatClient.question
        questionTextArea.setText(ClientUI.chat.client.question.getQuestionText());
        answerATextArea.setText(ClientUI.chat.client.question.getAnswer1());
        answerBTextArea.setText(ClientUI.chat.client.question.getAnswer2());
        answerCTextArea.setText(ClientUI.chat.client.question.getAnswer3());
        answerDTextArea.setText(ClientUI.chat.client.question.getAnswer4());
        subjectName.setText(ClientUI.chat.client.question.getQuestionSubject());
        correctAnswerLabel.setText(Integer.toString(ClientUI.chat.client.question.getCorrectAnswer()));
        correctQuestionComboBox.getSelectionModel().select(ClientUI.chat.client.question.getCorrectAnswer() - 1);
        correctQuestionComboBox.setVisible(false);

        // Set images for ImageView objects
        Image logoImage = new Image(getClass().getResourceAsStream("/images/logo_white.png"));
        Image exitImage = new Image(getClass().getResourceAsStream("/images/Exit.png"));
        imageLogo.setImage(logoImage);
        imageExit.setImage(exitImage);

        // Set text areas as non-editable
        questionTextArea.setEditable(false);
        answerATextArea.setEditable(false);
        answerBTextArea.setEditable(false);
        answerCTextArea.setEditable(false);
        answerDTextArea.setEditable(false);

        saveChangesButton.setVisible(false);
    }

    /**
     *  handles updateQuestionButton click
     * @param Event The event representing the button click.
     */
    @FXML
    public void handleUpdateQuestionButtonClicked(ActionEvent event) {
        correctAnswerLabel.setVisible(false);
        correctQuestionComboBox.setVisible(true);
        questionTextArea.setEditable(true);
        answerATextArea.setEditable(true);
        answerBTextArea.setEditable(true);
        answerCTextArea.setEditable(true);
        answerDTextArea.setEditable(true);

        updateQuestionButton.setVisible(false);
        saveChangesButton.setVisible(true);
    }

    /**
     * handles deleteQuestionButton click.
     * @param event The event representing the button click.
     */
    @FXML
    public void handleDeleteQuestionButtonClicked(ActionEvent event) {
        Question questionData = ClientUI.chat.client.question;
        questionData.setBtnViewQuestion(null);

        Message messageToServer = new Message(MessageType.DeleteQuestion, questionData);

        ClientUI.chat.accept(messageToServer);

        // Close the current window
        ((Node) event.getSource()).getScene().getWindow().hide();
    }

    /**
     * handles saveChangesButton click.
     * @param event The event representing the button click.
     */
    @FXML
    public void handleSaveChangesButtonClicked(ActionEvent event) {
    	//update newQuestionData with the selected Data from student.
        Question newQuestionData = ClientUI.chat.client.question;
        newQuestionData.setBtnViewQuestion(null);
        newQuestionData.setQuestionText(questionTextArea.getText());
        newQuestionData.setAnswer1(answerATextArea.getText());
        newQuestionData.setAnswer2(answerBTextArea.getText());
        newQuestionData.setAnswer3(answerCTextArea.getText());
        newQuestionData.setAnswer4(answerDTextArea.getText());
        
        newQuestionData.setCorrectAnswer(correctQuestionComboBox.getSelectionModel().getSelectedIndex() + 1);
        //send message to server to update question data
        Message messageToServer = new Message(MessageType.UpdateQuestionData, newQuestionData);

        ClientUI.chat.accept(messageToServer);
    }

    /**
     * Checks if the question data is valid.
     *
     * @return true if the question data is valid, false otherwise.
     */
    public Boolean validQuestionData() {
    	//check comboBox selected value is valid.
        if (correctQuestionComboBox.getSelectionModel().getSelectedIndex() == -1) {
            return false;
        //return false if any of these textFields is Empty.
        }
        if (questionTextArea.getText().isEmpty()) {
            return false;
        }
        if (answerATextArea.getText().isEmpty()) {
            return false;
        }
        if (answerBTextArea.getText().isEmpty()) {
            return false;
        }
        if (answerCTextArea.getText().isEmpty()) {
            return false;
        }
        if (answerDTextArea.getText().isEmpty()) {
            return false;
        }
        return true;
    }

    /**
     *handles exitButton click.
     * @param event The event representing the button click.
     */
    @FXML
    public void exitButton(ActionEvent event) {
        // Close the current window
        ((Node) event.getSource()).getScene().getWindow().hide();
    }

    /**
     * Starts the ViewQuestionForm stage.
     *
     * @param primaryStage the primary stage of the application
     * @throws Exception if an error occurs during the stage creation
     */
    public void start(Stage primaryStage) throws Exception {
        Parent root = FXMLLoader.load(getClass().getResource("/gui/ViewQuestionForm.fxml"));

        Scene scene = new Scene(root);
        scene.getStylesheets().add(getClass().getResource("/style/viewQuestionFormStyle.css").toExternalForm());
        primaryStage.setScene(scene);
        // Set stage borderless
        primaryStage.initStyle(StageStyle.UNDECORATED);

        // Drag the window when clicking and dragging the root pane
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