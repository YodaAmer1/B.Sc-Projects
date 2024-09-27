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

public class ViewStudentExamFormController implements Initializable {
	//all FXML GUI variables for this stage.
	@FXML
	private Pane editGradepnl;
	
	@FXML
	private Pane questionsPane;

	// The image that will appear in this stage.
	@FXML
	private ImageView imageLogo = new ImageView();
	
	@FXML
	private ImageView imageAnswerLogo = new ImageView();

	@FXML
	private ImageView imageExit = new ImageView();

	@FXML
	private Button nextQuestionButton;

	@FXML
	private Button previousQuestionButton;

	@FXML
	private Button BackButton;
	
	@FXML
	private Label examIDLabel = new Label();
	
	@FXML
	private Label lecturerLabel = new Label();
	
	@FXML
	private Label totalGradeLabel = new Label();
	
	@FXML
	private Label durationLabel = new Label();
	
	@FXML
	private Label questionNumberLabel = new Label();

	@FXML
	private Label questionPointsLabel = new Label();
	
	@FXML
	private Label questionAnswerPointsLabel = new Label();
	
	@FXML
	private Label questionTextLabel = new Label();

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

	private int[] studentAnswers; // Array to store the student's answers for each question

	int numOfQuestions; // Number of questions in the exam

	private ToggleButton[] questionButtons; // Array to store the buttons representing each question

	private int questionNumber; // Current question number

	private ArrayList<QuestionForExam> questions; // List of questions in the exam

	private ArrayList<StudentQuestionAnswer> questionsAnswers; // List of answers provided by the student

	private Boolean editGradeOpen; // Flag indicating whether the grade is being edited

	private double x, y; // Coordinates used for UI positioning

	/**
	 * Initialize the UI components and data when the scene is loaded.
	 *
	 * @param location   The location used to resolve relative paths for the root object, or null if the location is not known.
	 * @param resources  The resources used to localize the root object, or null if the root object was not localized.
	 */
	@Override
	public void initialize(URL location, ResourceBundle resources) {
	    editGradeOpen = false;

	    // Get the exam, answers, and number of questions from the ChatClient
	    questions = ClientUI.chat.client.examToCheck.getExam().getQuestions();
	    questionsAnswers = ClientUI.chat.client.examToCheck.getAnswers();
	    numOfQuestions = ClientUI.chat.client.examToCheck.getExam().getNumOfQuestions();

	    // Set the initial values for the UI components
	    notesLabel.setText(ClientUI.chat.client.viewExam.getLecturerComments());
	    questionNumber = 1;
	    Collections.sort(questions, new Comparator<QuestionForExam>() {
	        @Override
	        public int compare(QuestionForExam q1, QuestionForExam q2) {
	            return Integer.compare(q1.getQuestionNumber(), q2.getQuestionNumber());
	        }
	    });
	    // Set the text and options for the first question
	    questionPointsLabel.setText("(" + questions.get(0).getPoints() + " Points).");
	    questionTextLabel.setText(questions.get(0).getQuestionText());
	    answerACheckBox.setText(questions.get(0).getAnswer1());
	    answerBCheckBox.setText(questions.get(0).getAnswer2());
	    answerCCheckBox.setText(questions.get(0).getAnswer3());
	    answerDCheckBox.setText(questions.get(0).getAnswer4());
	    // Disable and set opacity for the answer checkboxes
	    answerACheckBox.setDisable(true);
	    answerBCheckBox.setDisable(true);
	    answerCCheckBox.setDisable(true);
	    answerDCheckBox.setDisable(true);
	    answerACheckBox.setOpacity(1);
	    answerBCheckBox.setOpacity(1);
	    answerCCheckBox.setOpacity(1);
	    answerDCheckBox.setOpacity(1);

	    // Initialize the studentAnswers array and populate it with the student's answers
	    studentAnswers = new int[numOfQuestions];
	    for (int i = 0; i < studentAnswers.length; i++) {
	        studentAnswers[i] = -1;
	        for (StudentQuestionAnswer quest : questionsAnswers) {
	            if (quest.getQuestionID().equals(questions.get(i).getQuestionID())) {
	                studentAnswers[i] = quest.getQuestionAnswer();
	                break;
	            }
	        }
	    }

	    // Set values for the duration, exam ID, lecturer, and total grade labels
	    durationLabel.setText(ClientUI.chat.client.viewExam.getDuration());
	    examIDLabel.setText(ClientUI.chat.client.examToCheck.getExam().getExamID());
	    lecturerLabel.setText(ClientUI.chat.client.examToCheck.getExam().getLecturerName());
	    totalGradeLabel.setText("" + ClientUI.chat.client.viewExam.getGrade() + "/100");

	    setQuestionCheckBox(questionNumber); // Set the selected answer checkboxes for the first question

	    questionButtons = new ToggleButton[numOfQuestions];
	    initQuestionsButtons(); // Initialize the question buttons

	    questionButtons[0].setSelected(true); // Select the first question button

	    // Set images for logo and exit button
	    Image logoImage = new Image(getClass().getResourceAsStream("/images/logo_white.png"));
	    Image exitImage = new Image(getClass().getResourceAsStream("/images/Exit.png"));
	    imageLogo.setImage(logoImage);
	    imageExit.setImage(exitImage);

	    questionsPane.toFront(); // Set the questions pane as the topmost layer
	}

	/**
	 * Set the selected answer checkboxes based on the student's answer for a question.
	 *
	 * @param questinNumber The question number for which to set the selected answer checkboxes.
	 */
	private void setQuestionCheckBox(int questinNumber) {
	    final int number = questinNumber;
	    // Set the selected answer checkboxes based on the student's answer
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

	    // Set the image and points label based on the correctness of the student's answer
	    if (studentAnswers[questionNumber - 1] == questions.get(questionNumber - 1).getCorrectAnswer()) {
	        Image answerImage = new Image(getClass().getResourceAsStream("/images/Check_64.png"));
	        imageAnswerLogo.setImage(answerImage);
	        questionAnswerPointsLabel.setText("(" + questions.get(questionNumber - 1).getPoints() + " Points)");
	        questionAnswerPointsLabel.setStyle("-fx-Text-fill: #30aa34"); // Set text color to green
	    } else {
	        Image answerImage = new Image(getClass().getResourceAsStream("/images/circled_x_64.png"));
	        imageAnswerLogo.setImage(answerImage);
	        questionAnswerPointsLabel.setText("(0 Points)");
	        questionAnswerPointsLabel.setStyle("-fx-Text-fill: #c72814"); // Set text color to red
	    }
	}

	/**
	 * Initialize the question buttons and add them to the questions grid pane.
	 */
	private void initQuestionsButtons() {
	    questionsGridPane.getChildren().clear();

	    ToggleGroup questionButtonsGroup = new ToggleGroup();

	    // Listener for the selected toggle button in the question buttons group
	    questionButtonsGroup.selectedToggleProperty().addListener((observable, oldValue, newValue) -> {
	        if (newValue != null) {
	            ToggleButton focused = (ToggleButton) newValue;
	            int questionNumber = Integer.parseInt(focused.getText());
	            String buttonStyle = focused.getStyle();
	            focused.setStyle(buttonStyle + "-fx-border-color: #f5f5f5; " + "-fx-border-radius: 5;");
	            questionPointsLabel.setText("(" + questions.get(questionNumber - 1).getPoints() + " Points).");
	            questionTextLabel.setText(questions.get(questionNumber - 1).getQuestionText());
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

	    // Create question buttons and add them to the questions grid pane
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
	            questionNumberLabel.setText("" + j);
	            setQuestionCheckBox(j);
	        });
	        btn.setToggleGroup(questionButtonsGroup);
	        questionButtons[i] = btn;
	        questionsGridPane.add(btn, i % 7, i / 7);
	    }
	}

	/**
	 * Handler for the "Next Question" button click event.
	 * Selects the next question and updates the question details.
	 *
	 * @param event The action event triggered by clicking the "Next Question" button.
	 */
	@FXML
	public void handleNextQuestionButtonClicked(ActionEvent event) {
	    if (questionNumber < numOfQuestions) {
	        questionNumber++;
	        questionButtons[questionNumber - 1].setSelected(true); // Select the next question button
	        questionNumberLabel.setText("" + questionNumber);
	        setQuestionCheckBox(questionNumber);
	    }
	}

	/**
	 * Handler for the "Previous Question" button click event.
	 * Selects the previous question and updates the question details.
	 *
	 * @param event The action event triggered by clicking the "Previous Question" button.
	 */
	@FXML
	public void handlePreviousQuestionButtonClicked(ActionEvent event) {
	    if (questionNumber > 1) {
	        questionNumber--;
	        questionButtons[questionNumber - 1].setSelected(true); // Select the previous question button
	        questionNumberLabel.setText("" + questionNumber);
	        setQuestionCheckBox(questionNumber);
	    }
	}

	public void start(Stage primaryStage) throws Exception {
		Parent root = FXMLLoader.load(getClass().getResource("/gui/ViewStudentExamForm.fxml"));

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
	
	@FXML
	public void handleExitButtonClicked(ActionEvent event) {
		// Close the current window
        ((Node) event.getSource()).getScene().getWindow().hide();
	}
	
}