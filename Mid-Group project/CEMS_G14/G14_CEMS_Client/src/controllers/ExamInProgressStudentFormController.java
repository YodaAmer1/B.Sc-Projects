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

public class ExamInProgressStudentFormController implements Initializable {
	//all FXML GUI variables for this stage.
	@FXML
	private Pane examLockedPnl;
	
	@FXML
	private Pane questionsPane;

	@FXML
	private ImageView imageLogo = new ImageView();

	@FXML
	private ImageView imageSubmitButtonLogo = new ImageView();

	@FXML
	private ImageView imageExit = new ImageView();

	@FXML
	private Button submitExamButton;

	@FXML
	private Button nextQuestionButton;

	@FXML
	private Button previousQuestionButton;

	@FXML
	private Button BackButton;

	@FXML
	private Label qurstionNumberLabel = new Label();

	@FXML
	private Label qurstionPointsLabel = new Label();
	
	@FXML
	private Label qurstionTextLabel = new Label();

	///
	@FXML
	private Label examStatusText = new Label();

	@FXML
	private Label examIDText = new Label();

	@FXML
	private Label examSubjectText = new Label();

	@FXML
	private Label examCourseText = new Label();

	@FXML
	private Label examStartText = new Label();

	@FXML
	private Label examEndText = new Label();
	
	@FXML
	private Label examDurationText = new Label();

	@FXML
	private Label examNumOfQuestionsText = new Label();
	

	//
	
	@FXML
	private Label reamainingTimeLabel = new Label();

	@FXML
	private Label notesLabel = new Label();

	@FXML
	private Label examStatusLabel = new Label();

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

	private int[] studentAnswers;

	/**
	 * The total number of questions in the exam.
	 */
	private int numOfQuestions;

	private ToggleButton[] questionButtons;

	/**
	 * The current question number.
	 */
	private int questionNumber;

	/**
	 * A flag indicating whether the question switcher is active.
	 */
	private Boolean questionSwitcher;

	/**
	 * The list of questions for the exam.
	 */
	private ArrayList<QuestionForExam> questions;

	private double x, y;

	private String startTime;

	private String endTime;

	private Thread timerThread;

	/**
	 * The remaining time on the exam timer.
	 */
	private int timerTime;

	private int examDuration;

	@Override
	public void initialize(URL location, ResourceBundle resources) {
		questionSwitcher = false;
		
		questions = ClientUI.chat.client.studentExamInProgress.getExam().getQuestions();
		
		numOfQuestions = ClientUI.chat.client.studentExamInProgress.getExam().getNumOfQuestions();
		
		String notes = ClientUI.chat.client.studentExamInProgress.getExam().getCommentsForStudents();
		
		if(notes != null) {
			notesLabel.setText(notes);
		} else {
			notesLabel.setText("There is no Notes.\nGood Luck!");
		}
		

		questionNumber = 1;
		
		Collections.sort(questions, new Comparator<QuestionForExam>() {
            @Override
            public int compare(QuestionForExam q1, QuestionForExam q2) {
                return Integer.compare(q1.getQuestionNumber(), q2.getQuestionNumber());
            }
        });
		
		qurstionPointsLabel.setText("("+ questions.get(0).getPoints() + " Points).");
		qurstionTextLabel.setText(questions.get(0).getQuestionText());
		answerACheckBox.setText(questions.get(0).getAnswer1());
		answerBCheckBox.setText(questions.get(0).getAnswer2());
		answerCCheckBox.setText(questions.get(0).getAnswer3());
		answerDCheckBox.setText(questions.get(0).getAnswer4());

		studentAnswers = new int[numOfQuestions];

		for (int i = 0; i < studentAnswers.length; i++) {
			studentAnswers[i] = -1;
		}
		
		int time = Integer.parseInt(ClientUI.chat.client.studentExamInProgress.getExam().getTime()) + ClientUI.chat.client.studentExamInProgress.getExtraTime();
		ClientUI.chat.client.studentExamInProgress.setExtraTime(0);

		initCheckBoxButtons();

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
		startTime = ClientUI.timeFormat();
		examTimer(time);

	}

	/**
	 * Initializes the checkbox buttons for answer options.
	 */
	private void initCheckBoxButtons() {
	    // Listener for answer A checkbox
	    answerACheckBox.selectedProperty().addListener((observable, oldValue, newValue) -> {
	        if (newValue) {
	            // Update student answer and unselect other checkboxes
	            studentAnswers[questionNumber - 1] = 1;
	            answerBCheckBox.setSelected(false);
	            answerCCheckBox.setSelected(false);
	            answerDCheckBox.setSelected(false);
	        } else {
	            if (!questionSwitcher) {
	                // If the checkbox is unchecked and question switcher is inactive, reset student answer
	                studentAnswers[questionNumber - 1] = -1;
	            }
	        }
	    });

	    // Listener for answer B checkbox
	    answerBCheckBox.selectedProperty().addListener((observable, oldValue, newValue) -> {
	        if (newValue) {
	            // Update student answer and unselect other checkboxes
	            studentAnswers[questionNumber - 1] = 2;
	            answerACheckBox.setSelected(false);
	            answerCCheckBox.setSelected(false);
	            answerDCheckBox.setSelected(false);
	        } else {
	            if (!questionSwitcher) {
	                // If the checkbox is unchecked and question switcher is inactive, reset student answer
	                studentAnswers[questionNumber - 1] = -1;
	            }
	        }
	    });

	    // Listener for answer C checkbox
	    answerCCheckBox.selectedProperty().addListener((observable, oldValue, newValue) -> {
	        if (newValue) {
	            // Update student answer and unselect other checkboxes
	            studentAnswers[questionNumber - 1] = 3;
	            answerBCheckBox.setSelected(false);
	            answerACheckBox.setSelected(false);
	            answerDCheckBox.setSelected(false);
	        } else {
	            if (!questionSwitcher) {
	                // If the checkbox is unchecked and question switcher is inactive, reset student answer
	                studentAnswers[questionNumber - 1] = -1;
	            }
	        }
	    });

	    // Listener for answer D checkbox
	    answerDCheckBox.selectedProperty().addListener((observable, oldValue, newValue) -> {
	        if (newValue) {
	            // Update student answer and unselect other checkboxes
	            studentAnswers[questionNumber - 1] = 4;
	            answerBCheckBox.setSelected(false);
	            answerCCheckBox.setSelected(false);
	            answerACheckBox.setSelected(false);
	        } else {
	            if (!questionSwitcher) {
	                // If the checkbox is unchecked and question switcher is inactive, reset student answer
	                studentAnswers[questionNumber - 1] = -1;
	            }
	        }
	    });
	}

	/**
	 * Sets the checkbox for the specified question number based on the student's answer.
	 *
	 * @param questionNumber The question number.
	 */
	private void setQuestionCheckBox(int questionNumber) {
	    questionSwitcher = true;
	    final int number = questionNumber;
	    switch (studentAnswers[number - 1]) {
	        case 1:
	            answerACheckBox.setSelected(true);
	            break;
	        case 2:
	            answerBCheckBox.setSelected(true);
	            break;
	        case 3:
	            answerCCheckBox.setSelected(true);
	            break;
	        case 4:
	            answerDCheckBox.setSelected(true);
	            break;
	        default:
	            // If no answer is selected, unselect all checkboxes
	            answerACheckBox.setSelected(false);
	            answerBCheckBox.setSelected(false);
	            answerCCheckBox.setSelected(false);
	            answerDCheckBox.setSelected(false);
	            break;
	    }
	    questionSwitcher = false;
	}

	/**
	 * Initializes the question buttons and their functionality.
	 */
	private void initQuestionsButtons() {
	    questionsGridPane.getChildren().clear();

	    ToggleGroup questionButtonsGroup = new ToggleGroup();

	    questionButtonsGroup.selectedToggleProperty().addListener((observable, oldValue, newValue) -> {
	        if (newValue != null) {
	            ToggleButton focused = (ToggleButton) newValue;
	            int questionNumber = Integer.parseInt(focused.getText());

	            // Update the question and answer options displayed based on the selected question
	            focused.setStyle("-fx-font-family: 'Arial Rounded MT Bold'; " + "-fx-background-color: #5d39d2; "
	                    + "-fx-background-radius: 5; " + "-fx-border-color: #f5f5f5; " + "-fx-border-radius: 5; "
	                    + "-fx-text-fill : #f5f5f5;");
	            qurstionPointsLabel.setText("(" + questions.get(questionNumber - 1).getPoints() + " Points).");
	            qurstionTextLabel.setText(questions.get(questionNumber - 1).getQuestionText());
	            answerACheckBox.setText(questions.get(questionNumber - 1).getAnswer1());
	            answerBCheckBox.setText(questions.get(questionNumber - 1).getAnswer2());
	            answerCCheckBox.setText(questions.get(questionNumber - 1).getAnswer3());
	            answerDCheckBox.setText(questions.get(questionNumber - 1).getAnswer4());
	        }

	        // Handle deselection of a question button
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

	                // Set the style for the previously selected question button based on the student's answer
	                if (studentAnswers[questionNumber - 1] != -1) {
	                    focused.setStyle(
	                            "-fx-font-family: 'Arial Rounded MT Bold'; " + "-fx-background-color: #947ce1; "
	                                    + "-fx-background-radius: 5; " + "-fx-text-fill : #f5f5f5;");
	                } else {
	                    focused.setStyle(null);
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
	 * Handles the event when the "Submit Exam" button is clicked.
	 * Sets the exam screen to display "Exam Submitted" and calls the submitExam() method.
	 *
	 * @param event The event triggered by clicking the "Submit Exam" button.
	 */
	@FXML
	public void handleSubmitExamButtonClicked(ActionEvent event) {
	    setExamScreen("Exam Submitted");
	    submitExam();
	}

	/**
	 * Handles the event when the "Next Question" button is clicked.
	 * Switches to the next question if available and updates the displayed question and answer options.
	 *
	 * @param event The event triggered by clicking the "Next Question" button.
	 */
	@FXML
	public void handleNextQuestionButtonClicked(ActionEvent event) {
	    if (questionNumber < numOfQuestions) {
	        questionNumber++;
	        questionButtons[questionNumber - 1].setSelected(true);
	        qurstionNumberLabel.setText("" + questionNumber);
	        qurstionPointsLabel.setText("(" + questions.get(questionNumber - 1).getPoints() + " Points).");
	        qurstionTextLabel.setText(questions.get(questionNumber - 1).getQuestionText());
	        answerACheckBox.setText(questions.get(questionNumber - 1).getAnswer1());
	        answerBCheckBox.setText(questions.get(questionNumber - 1).getAnswer2());
	        answerCCheckBox.setText(questions.get(questionNumber - 1).getAnswer3());
	        answerDCheckBox.setText(questions.get(questionNumber - 1).getAnswer4());
	        setQuestionCheckBox(questionNumber);
	    }
	}


	/**
	 * Handles the event when the "Previous Question" button is clicked.
	 * Switches to the previous question if available and updates the displayed question and answer options.
	 *
	 * @param event The event triggered by clicking the "Previous Question" button.
	 */
	@FXML
	public void handlePreviousQuestionButtonClicked(ActionEvent event) {
	    if (questionNumber > 1) {
	        questionNumber--;
	        questionButtons[questionNumber - 1].setSelected(true);
	        qurstionNumberLabel.setText("" + questionNumber);
	        qurstionPointsLabel.setText("(" + questions.get(questionNumber - 1).getPoints() + " Points).");
	        qurstionTextLabel.setText(questions.get(questionNumber - 1).getQuestionText());
	        answerACheckBox.setText(questions.get(questionNumber - 1).getAnswer1());
	        answerBCheckBox.setText(questions.get(questionNumber - 1).getAnswer2());
	        answerCCheckBox.setText(questions.get(questionNumber - 1).getAnswer3());
	        answerDCheckBox.setText(questions.get(questionNumber - 1).getAnswer4());
	        setQuestionCheckBox(questionNumber);
	    }
	}

	/**
	 * Handles the event when the "Exit" button is clicked.
	 * Closes the current window and opens the Student Main Menu window.
	 *
	 * @param event The event triggered by clicking the "Exit" button.
	 */
	@FXML
	public void exitButton(ActionEvent event) {
	    // Close the current window
	    ((Node) event.getSource()).getScene().getWindow().hide();
	    
	    // Open the Student Main Menu window
	    try {
	        ClientUI.primaryStage = new Stage();
	        new StudentMainMenuController().start(ClientUI.primaryStage);
	    } catch (Exception e) {
	        e.printStackTrace();
	    }
	}

	public void start(Stage primaryStage) throws Exception {
		Parent root = FXMLLoader.load(getClass().getResource("/gui/ExamInProgressStudentForm.fxml"));

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

	/**
	 * Starts the exam timer with the specified time duration.
	 *
	 * @param Time The duration of the exam in minutes.
	 */
	private void examTimer(int Time) {
	    timerTime = Time * 60;
	    examDuration = 0;

	    timerThread = new Thread(new Runnable() {

	        @Override
	        public void run() {
	            // Exam timer countdown
	            while (timerTime > 0) {
	                timerTime--;
	                examDuration++;
	                Platform.runLater(() -> {
	                    // Check for extra time
	                    if (ClientUI.chat.client.studentExamInProgress.getExtraTime() > 0) {
	                        timerTime += (ClientUI.chat.client.studentExamInProgress.getExtraTime() * 60);
	                        ClientUI.chat.client.studentExamInProgress.setExtraTime(0);
	                    }
	                    // Check if the exam is locked
	                    if (ClientUI.chat.client.studentExamInProgress.getStatus().equals("Locked")) {
	                        setExamScreen("Exam Locked");
	                        submitExam();
	                        return;
	                    }
	                    // Change text color based on remaining time
	                    if (timerTime < 60) {
	                        if (timerTime % 2 != 0) {
	                            reamainingTimeLabel.setStyle("-fx-text-fill: #c72814;");
	                        } else {
	                            reamainingTimeLabel.setStyle("-fx-text-fill: #6b4ad6;");
	                        }
	                    }
	                    reamainingTimeLabel.setText(String.format("%02d:%02d", timerTime / 60, timerTime % 60));
	                });

	                try {
	                    Thread.sleep(1000); // Sleep for 1 second
	                } catch (InterruptedException e) {
	                    e.printStackTrace();
	                }
	            }
	            // Handle time over
	            Platform.runLater(() -> {
	                setExamScreen("Time Over");
	                submitExam();
	            });
	        }
	    });
	    timerThread.start();
	}

	/**
	 * Sets the exam screen based on the given status.
	 * Updates the displayed information about the exam.
	 *
	 * @param status The status of the exam (e.g., "Exam Locked", "Time Over").
	 */
	private void setExamScreen(String status) {
	    LocalTime currentTime = LocalTime.now();
	    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
	    endTime = currentTime.format(formatter);
	    examStatusText.setText(status);
	    examIDText.setText(ClientUI.chat.client.studentExamInProgress.getExam().getExamID());
	    examSubjectText.setText(ClientUI.chat.client.studentExamInProgress.getExam().getSubject());
	    examCourseText.setText(ClientUI.chat.client.studentExamInProgress.getExam().getCourse());
	    examStartText.setText(startTime);
	    examEndText.setText(endTime);

	    int examDurationHour = examDuration / 3600;
	    int examDurationMin = examDuration / 60;
	    int examDurationSec = examDuration % 60;

	    examDurationText.setText("" + examDurationHour + " Hours, " + examDurationMin + " Minutes, " + examDurationSec + " Seconds.");

	    int numOfAnswers = 0;

	    for (int answer : studentAnswers) {
	        if (answer != -1) {
	            numOfAnswers++;
	        }
	    }

	    examNumOfQuestionsText.setText(Integer.toString(numOfAnswers));
	    questionsGridPane.setDisable(true);
	    examLockedPnl.toFront();
	    questionsPane.setVisible(false);

	    Image submitButtonLogoImage = new Image(getClass().getResourceAsStream("/images/lock_64.png"));
	    imageSubmitButtonLogo.setImage(submitButtonLogoImage);
	    submitExamButton.setText("Exam Submitted");
	    submitExamButton.setDisable(true);
	}

	/**
	 * Submits the exam.
	 * Calculates the grade for the exam and sends the student's answers to the server.
	 */
	private void submitExam() {
	    int gradeInExam = 0;

	    ArrayList<StudentQuestionAnswer> studentExamAnswers = new ArrayList<>();

	    for (int i = 0; i < questions.size(); i++) {
	        QuestionForExam question = questions.get(i);
	        StudentQuestionAnswer answers = new StudentQuestionAnswer(question.getQuestionID(), studentAnswers[i]);
	        studentExamAnswers.add(answers);
	        if (question.getCorrectAnswer() == studentAnswers[i]) {
	            gradeInExam += question.getPoints();
	        }
	    }

	    double examDurationInHours = (double) examDuration / 60;
	    String examStudentDuration = String.format("%.2f", examDurationInHours);

	    StudentSubmitedExam submitedExam = new StudentSubmitedExam(ClientUI.chat.client.user.getId(), ClientUI.chat.client.studentExamInProgress.getProgressId(), ClientUI.chat.client.studentExamInProgress.getExam().getExamID(), ClientUI.chat.client.studentExamInProgress.getExam().getSubject(), ClientUI.chat.client.studentExamInProgress.getExam().getCourse(), examStudentDuration, startTime, endTime, gradeInExam, studentExamAnswers);
	    timerThread.stop();
	    reamainingTimeLabel.setStyle("-fx-text-fill: #00b92c;");
	    Message message = new Message(MessageType.SubmitStudentOnlineExam, submitedExam);
	    ClientUI.chat.accept(message);
	}
}