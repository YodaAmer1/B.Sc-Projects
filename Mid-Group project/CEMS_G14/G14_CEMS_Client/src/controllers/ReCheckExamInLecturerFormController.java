package controllers;

import java.net.URL;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.ResourceBundle;

import client.ChatClient;
import client.ClientUI;
import entity.Message;
import entity.MessageType;
import entity.QuestionForExam;
import entity.StudentQuestionAnswer;
import entity.StudentSubmitedExam;
import entity.SubmitedExamGrade;
import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.ToggleGroup;
import javafx.scene.control.Button;
import javafx.scene.control.CheckBox;
import javafx.scene.control.ToggleButton;
import javafx.scene.control.Label;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.scene.control.TextFormatter;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.Pane;
import javafx.scene.layout.RowConstraints;
import javafx.stage.Stage;
import javafx.stage.StageStyle;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;

public class ReCheckExamInLecturerFormController implements Initializable {
	//all FXML GUI variables on this stage.
	@FXML
	private Pane editGradepnl;
	
	@FXML
	private Pane questionsPane;

	@FXML
	private ImageView imageLogo = new ImageView();

	@FXML
	private ImageView imageSubmitButtonLogo = new ImageView();
	
	@FXML
	private ImageView imageAnswerLogo = new ImageView();

	@FXML
	private ImageView imageExit = new ImageView();

	@FXML
	private Button submitExamButton;

	@FXML
	private Button nextQuestionButton;

	@FXML
	private Button previousQuestionButton;
	
	@FXML
	private Button btnEditGrade;

	@FXML
	private Button BackButton;
	
	@FXML
	private TextField examGrade;

	@FXML
	private TextArea reasonTextArea;
	
	@FXML
	private Label qurstionNumberLabel = new Label();

	@FXML
	private Label qurstionPointsLabel = new Label();
	
	@FXML
	private Label qurstionAnswerPointsLabel = new Label();
	
	@FXML
	private Label qurstionTextLabel = new Label();

	@FXML
	private Label notesLabel = new Label();

	@FXML
	private CheckBox answerACheckBox;

	@FXML
	private CheckBox answerBCheckBox;

	@FXML
	private CheckBox answerCCheckBox;

	@FXML
	private CheckBox answerDCheckBox;

	@FXML
	private GridPane questionsGridPane;

	private int[] studentAnswers; // Array to store student's answers for each question
	private int numOfQuestions; // Number of questions in the exam
	private ToggleButton[] questionButtons; // Array of question buttons
	private int questionNumber; // Current question number
	private ArrayList<QuestionForExam> questions; // List of questions in the exam
	private ArrayList<StudentQuestionAnswer> questionsAnswers; // List of student's answers for each question
	private Boolean editGradeOpen; // Flag indicating if the grade editing is open
	private double x, y; // Coordinates

	/**
	 * Initializes the controller after its root element has been completely processed.
	 *
	 * @param location  The location used to resolve relative paths for the root object, or null if the location is not known.
	 * @param resources The resources used to localize the root object, or null if the root object was not localized.
	 */
	@Override
	public void initialize(URL location, ResourceBundle resources) {
	    editGradeOpen = false;
	    questions = ClientUI.chat.client.examToCheck.getExam().getQuestions();
	    questionsAnswers = ClientUI.chat.client.examToCheck.getAnswers();
	    numOfQuestions = ClientUI.chat.client.examToCheck.getExam().getNumOfQuestions();
	    String notes = ClientUI.chat.client.examToCheck.getExam().getCommentsForLecturer();

	    if (notes != null) {
	        notesLabel.setText(notes);
	    } else {
	        notesLabel.setText("There are no notes.\nGood Luck!");
	    }

	    questionNumber = 1;

	    // Sort questions based on question number
	    Collections.sort(questions, new Comparator<QuestionForExam>() {
	        @Override
	        public int compare(QuestionForExam q1, QuestionForExam q2) {
	            return Integer.compare(q1.getQuestionNumber(), q2.getQuestionNumber());
	        }
	    });

	    qurstionPointsLabel.setText("(" + questions.get(0).getPoints() + " Points).");
	    qurstionTextLabel.setText(questions.get(0).getQuestionText());
	    answerACheckBox.setText(questions.get(0).getAnswer1());
	    answerBCheckBox.setText(questions.get(0).getAnswer2());
	    answerCCheckBox.setText(questions.get(0).getAnswer3());
	    answerDCheckBox.setText(questions.get(0).getAnswer4());
	    answerACheckBox.setDisable(true);
	    answerBCheckBox.setDisable(true);
	    answerCCheckBox.setDisable(true);
	    answerDCheckBox.setDisable(true);
	    answerACheckBox.setOpacity(1);
	    answerBCheckBox.setOpacity(1);
	    answerCCheckBox.setOpacity(1);
	    answerDCheckBox.setOpacity(1);

	    studentAnswers = new int[numOfQuestions];

	    // Create a TextFormatter to limit input to numbers
	    TextFormatter<String> textFormatter = new TextFormatter<>(change -> {
	        String newText = change.getControlNewText();
	        if (newText.matches("[0-9]*")) {
	            return change;
	        }
	        return null; // Reject the change if the input is not a number
	    });

	    examGrade.setTextFormatter(textFormatter);

	    int examTotalGrade = 0;
	    for (int i = 0; i < studentAnswers.length; i++) {
	        studentAnswers[i] = -1;
	        for (StudentQuestionAnswer quest : questionsAnswers) {
	            if (quest.getQuestionID().equals(questions.get(i).getQuestionID())) {
	                studentAnswers[i] = quest.getQuestionAnswer();
	                if (quest.getQuestionAnswer() == questions.get(i).getCorrectAnswer()) {
	                    examTotalGrade += questions.get(i).getPoints();
	                }
	                break;
	            }
	        }
	    }
	    examGrade.setText("" + examTotalGrade);

	    setQuestionCheckBox(questionNumber);
	    questionButtons = new ToggleButton[numOfQuestions];

	    initQuestionsButtons();

	    questionButtons[0].setSelected(true);

	    Image logoImage = new Image(getClass().getResourceAsStream("/images/logo_white.png"));
	    Image submitButtonLogoImage = new Image(getClass().getResourceAsStream("/images/Checkmark_64.png"));
	    Image exitImage = new Image(getClass().getResourceAsStream("/images/Exit.png"));
	    imageLogo.setImage(logoImage);
	    imageSubmitButtonLogo.setImage(submitButtonLogoImage);
	    imageExit.setImage(exitImage);

	    questionsPane.toFront();
	}


	/**
	 * Sets the state of the question checkboxes based on the student's answer.
	 *
	 * @param questionNumber The number of the question.
	 */
	private void setQuestionCheckBox(int questionNumber) {
	    final int number = questionNumber;
	    switch (studentAnswers[number - 1]) {
	        case 1:
	            answerACheckBox.setSelected(true);
	            answerBCheckBox.setSelected(false);
	            answerCCheckBox.setSelected(false);
	            answerDCheckBox.setSelected(false);
	            break;
	        case 2:
	            answerBCheckBox.setSelected(true);
	            answerACheckBox.setSelected(false);
	            answerCCheckBox.setSelected(false);
	            answerDCheckBox.setSelected(false);
	            break;
	        case 3:
	            answerCCheckBox.setSelected(true);
	            answerACheckBox.setSelected(false);
	            answerBCheckBox.setSelected(false);
	            answerDCheckBox.setSelected(false);
	            break;
	        case 4:
	            answerDCheckBox.setSelected(true);
	            answerACheckBox.setSelected(false);
	            answerBCheckBox.setSelected(false);
	            answerCCheckBox.setSelected(false);
	            break;
	        default:
	            answerACheckBox.setSelected(false);
	            answerBCheckBox.setSelected(false);
	            answerCCheckBox.setSelected(false);
	            answerDCheckBox.setSelected(false);
	            break;
	    }
	    if (studentAnswers[questionNumber - 1] == questions.get(questionNumber - 1).getCorrectAnswer()) {
	        Image answerImage = new Image(getClass().getResourceAsStream("/images/Check_64.png"));
	        imageAnswerLogo.setImage(answerImage);
	        qurstionAnswerPointsLabel.setText("(" + questions.get(questionNumber - 1).getPoints() + " Points)");
	        qurstionAnswerPointsLabel.setStyle("-fx-Text-fill: #30aa34");
	    } else {
	        Image answerImage = new Image(getClass().getResourceAsStream("/images/circled_x_64.png"));
	        imageAnswerLogo.setImage(answerImage);
	        qurstionAnswerPointsLabel.setText("(0 Points)");
	        qurstionAnswerPointsLabel.setStyle("-fx-Text-fill: #c72814");
	    }
	}

	/**
	 * Initializes the question buttons for the exam.
	 */
	private void initQuestionsButtons() {
	    questionsGridPane.getChildren().clear();

	    ToggleGroup questionButtonsGroup = new ToggleGroup();

	    questionButtonsGroup.selectedToggleProperty().addListener((observable, oldValue, newValue) -> {
	        if (newValue != null) {
	            ToggleButton focused = (ToggleButton) newValue;
	            int questionNumber = Integer.parseInt(focused.getText());
	            String buttonStyle = focused.getStyle();
	            focused.setStyle(buttonStyle + "-fx-border-color: #f5f5f5; " + "-fx-border-radius: 5;");
	            qurstionPointsLabel.setText("(" + questions.get(questionNumber - 1).getPoints() + " Points).");
	            qurstionTextLabel.setText(questions.get(questionNumber - 1).getQuestionText());
	            answerACheckBox.setText(questions.get(questionNumber - 1).getAnswer1());
	            answerBCheckBox.setText(questions.get(questionNumber - 1).getAnswer2());
	            answerCCheckBox.setText(questions.get(questionNumber - 1).getAnswer3());
	            answerDCheckBox.setText(questions.get(questionNumber - 1).getAnswer4());
	        }
	        if (newValue == null) {
	            if (oldValue != null) {
	                ToggleButton focused = (ToggleButton) oldValue;
	                focused.setSelected(true);
	            }
	        } else {
	            if (oldValue != null) {
	                ToggleButton focused = (ToggleButton) oldValue;
	                focused.setStyle(null);
	                int questionNumber = Integer.parseInt(focused.getText());
	                if (studentAnswers[questionNumber - 1] == questions.get(questionNumber - 1).getCorrectAnswer()) {
	                    focused.setStyle(
	                            "-fx-font-family: 'Arial Rounded MT Bold'; " + "-fx-background-color: #00e737; "
	                                    + "-fx-background-radius: 5; " + "-fx-text-fill : #f5f5f5;");
	                } else {
	                    focused.setStyle(
	                            "-fx-font-family: 'Arial Rounded MT Bold'; " + "-fx-background-color: #ed5f4d; "
	                                    + "-fx-background-radius: 5; " + "-fx-text-fill : #f5f5f5;");
	                }
	            }
	        }
	    });

	    int numOfRows;
	    if ((numOfQuestions % 7) == 0) {
	        numOfRows = (numOfQuestions / 7);
	    } else {
	        numOfRows = (numOfQuestions / 7) + 1;
	    }

	    // Create row constraints
	    RowConstraints rowConstraints = new RowConstraints();
	    rowConstraints.setPercentHeight(0); // 4 rows with equal height

	    // Apply row constraints to each row
	    for (int i = 0; i < numOfRows; i++) {
	        questionsGridPane.getRowConstraints().add(rowConstraints);
	    }

	    for (int i = 0; i < numOfQuestions; i++) {
	        final int j = i + 1;
	        ToggleButton btn = new ToggleButton("" + j);
	        btn.setPrefHeight(35);
	        btn.setPrefWidth(35);
	        btn.getStyleClass().add("question-btn-number");
	        if (studentAnswers[i] == questions.get(i).getCorrectAnswer()) {
	            btn.setStyle(
	                    "-fx-font-family: 'Arial Rounded MT Bold'; " + "-fx-background-color: #00e737; "
	                            + "-fx-background-radius: 5; " + "-fx-text-fill : #f5f5f5;");
	        } else {
	            btn.setStyle(
	                    "-fx-font-family: 'Arial Rounded MT Bold'; " + "-fx-background-color: #ed5f4d; "
	                            + "-fx-background-radius: 5; " + "-fx-text-fill : #f5f5f5;");
	        }

	        btn.setOnAction(event -> {
	            questionNumber = j;
	            qurstionNumberLabel.setText("" + j);
	            setQuestionCheckBox(j);
	        });
	        btn.setToggleGroup(questionButtonsGroup);
	        questionButtons[i] = btn;
	        questionsGridPane.add(btn, i % 7, i / 7);
	    }
	}

	/**
	 * Handles the event when the submit exam grade button is clicked.
	 *
	 * @param event The event representing the button click.
	 */
	@FXML
	public void handleSubmitExamGradeButtonClicked(ActionEvent event) {
	    // Retrieve relevant information from the examToCheck object
	    String studentID = ClientUI.chat.client.examToCheck.getStudentId();
	    int progressId = ClientUI.chat.client.examToCheck.getProgressId();
	    String examID = ClientUI.chat.client.examToCheck.getExam().getExamID();

	    // Parse the exam grade from the input field
	    int grade = Integer.parseInt(examGrade.getText());

	    // Retrieve comment from the text area
	    String comment = reasonTextArea.getText();

	    // Create a SubmitedExamGrade object with the collected information
	    SubmitedExamGrade submitedExamGrade = new SubmitedExamGrade(studentID, progressId, examID, grade, comment);

	    // Print the submitedExamGrade object
	    System.out.println(submitedExamGrade);

	    // Create a Message object to submit the exam grade
	    Message messageToServer = new Message(MessageType.SubmitExamGrade, submitedExamGrade);

	    // Send the message to the server
	    ClientUI.chat.accept(messageToServer);

	    // Create a new message to request the student's exams
	    messageToServer = new Message(MessageType.GetStudentsExams, ClientUI.chat.client.user);

	    // Send the message to the server
	    ClientUI.chat.accept(messageToServer);
	}

	/**
	 * Handles the event when the edit grade button is clicked.
	 *
	 * @param event The event representing the button click.
	 */
	@FXML
	public void handleEditGradeButtonClicked(ActionEvent event) {
	    // Check if the edit grade panel is open
	    if (editGradeOpen) {
	        // If it is open, change the button text to "Edit Grade"
	        btnEditGrade.setText("Edit Grade");

	        // Bring the questions panel to the front
	        questionsPane.toFront();

	        // Set editGradeOpen flag to false
	        editGradeOpen = false;
	    } else {
	        // If it is closed, change the button text to "See Questions"
	        btnEditGrade.setText("See Questions");

	        // Bring the edit grade panel to the front
	        editGradepnl.toFront();

	        // Set editGradeOpen flag to true
	        editGradeOpen = true;
	    }
	}

	/**
	 * Handles the event when the next question button is clicked.
	 *
	 * @param event The event representing the button click.
	 */
	@FXML
	public void handleNextQuestionButtonClicked(ActionEvent event) {
	    // Check if there is a next question available
	    if (questionNumber < numOfQuestions) {
	        // Increment the question number
	        questionNumber++;

	        // Select the corresponding question button
	        questionButtons[questionNumber - 1].setSelected(true);

	        // Update the question number label
	        qurstionNumberLabel.setText("" + questionNumber);

	        // Update the question points label
	        qurstionPointsLabel.setText("(" + questions.get(questionNumber - 1).getPoints() + " Points).");

	        // Update the question text label
	        qurstionTextLabel.setText(questions.get(questionNumber - 1).getQuestionText());

	        // Update the answer checkboxes with the respective answer options
	        answerACheckBox.setText(questions.get(questionNumber - 1).getAnswer1());
	        answerBCheckBox.setText(questions.get(questionNumber - 1).getAnswer2());
	        answerCCheckBox.setText(questions.get(questionNumber - 1).getAnswer3());
	        answerDCheckBox.setText(questions.get(questionNumber - 1).getAnswer4());

	        // Set the checkbox for the current question
	        setQuestionCheckBox(questionNumber);
	    }
	}

	/**
	 * Handles the event when the previous question button is clicked.
	 *
	 * @param event The event representing the button click.
	 */
	@FXML
	public void handlePreviousQuestionButtonClicked(ActionEvent event) {
	    // Check if there is a previous question available
	    if (questionNumber > 1) {
	        // Decrement the question number
	        questionNumber--;

	        // Select the corresponding question button
	        questionButtons[questionNumber - 1].setSelected(true);

	        // Update the question number label
	        qurstionNumberLabel.setText("" + questionNumber);

	        // Update the question points label
	        qurstionPointsLabel.setText("(" + questions.get(questionNumber - 1).getPoints() + " Points).");

	        // Update the question text label
	        qurstionTextLabel.setText(questions.get(questionNumber - 1).getQuestionText());

	        // Update the answer checkboxes with the respective answer options
	        answerACheckBox.setText(questions.get(questionNumber - 1).getAnswer1());
	        answerBCheckBox.setText(questions.get(questionNumber - 1).getAnswer2());
	        answerCCheckBox.setText(questions.get(questionNumber - 1).getAnswer3());
	        answerDCheckBox.setText(questions.get(questionNumber - 1).getAnswer4());

	        // Set the checkbox for the current question
	        setQuestionCheckBox(questionNumber);
	    }
	}

	/**
	 * Handles the event when the exit button is clicked.
	 *
	 * @param event The event representing the button click.
	 */
	@FXML
	public void exitButton(ActionEvent event) {
	    // Close the current window
	    ((Node) event.getSource()).getScene().getWindow().hide();
	}

	public void start(Stage primaryStage) throws Exception {
		Parent root = FXMLLoader.load(getClass().getResource("/gui/ReCheckExamLecturerForm.fxml"));

		Scene scene = new Scene(root);
		scene.getStylesheets()
				.add(getClass().getResource("/style/ExamInProgressStudentFormStyle.css").toExternalForm());
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