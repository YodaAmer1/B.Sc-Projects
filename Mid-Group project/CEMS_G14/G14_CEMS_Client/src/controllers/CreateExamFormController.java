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

public class CreateExamFormController extends Application implements Initializable {
	//all FXML GUI variables that appears in this stage.
	@FXML
	private Pane pnlQuestionsList;

	private static final DataFormat SERIALIZED_MIME_TYPE = new DataFormat("application/x-java-serialized-object");

	@FXML
	private TextField questionSearch;

	@FXML
	private ImageView imageLogo = new ImageView();

	@FXML
	private ImageView imageExit = new ImageView();

////////////////Pane Added Questions////////////////////////////

	@FXML
	private Pane pnlAddedQuestions;

	@FXML
	private TableView<QuestionForExam> QuestionsTableView;

	@FXML
	private TableColumn QuestionNumberColumn;

	@FXML
	private TableColumn<QuestionForExam, String> idColumn;

	@FXML
	private TableColumn<QuestionForExam, String> addedQuestionTextColumn;

	@FXML
	private TableColumn<QuestionForExam, Button> viewQuestionColumn;

	@FXML
	private TableColumn<QuestionForExam, TextField> selectedColumn;

	private ObservableList<QuestionForExam> addedQuestionsList;

	@FXML
	private Button addNewQuestionButton;

	@FXML
	private Button removeQuestionButton;

	@FXML
	private Button CreateExamButton;

	@FXML
	private Button addQuestionButton;

	@FXML
	private Button exitButton;

	@FXML
	private Button backButton;

	@FXML
	private ComboBox<Subject> subjectNameComboBox = new ComboBox<>();
	private ObservableList<Subject> subjectList = FXCollections.observableArrayList();

	@FXML
	private ComboBox<Course> CourseNameComboBox = new ComboBox<>();
	private ObservableList<Course> courseList = FXCollections.observableArrayList();

	@FXML
	private TextField DurationTextField;

	@FXML
	private TextArea TeacherNotesTextArea;

	@FXML
	private TextArea StudentsNotesTextArea;

	@FXML
	private TableView<Question> questionsTableView;

	@FXML
	private TableColumn<Question, String> questionIDColumn;

	@FXML
	private TableColumn<Question, String> questionTextColumn;

	@FXML
	private TableColumn<Question, String> questionLecturerColumn;

	@FXML
	private TableColumn<Question, Button> questionViewButtonColumn;

	private ObservableList<Question> questionsList = FXCollections.observableArrayList();

	private FilteredList<Question> filteredData;

	private SortedList<Question> sortedData;
    //stage dimensions
	private double x, y;

	@Override
	public void initialize(URL location, ResourceBundle resources) {
	    // Set the logo image and exit image
	    Image logoImage = new Image(getClass().getResourceAsStream("/images/logo_white.png"));
	    Image exitImage = new Image(getClass().getResourceAsStream("/images/Exit.png"));
	    imageLogo.setImage(logoImage);
	    imageExit.setImage(exitImage);

	    // Disable certain buttons and controls
	    addNewQuestionButton.setDisable(true);
	    removeQuestionButton.setDisable(true);
	    addQuestionButton.setDisable(true);

	    // Retrieve the list of subjects and populate the subjectNameComboBox
	    getSubjectsList();

	    // Retrieve the list of courses
	    getCoursesList();

	    // Initialize columns for the questionsTableView
	    initializeQuestionsTableColumns();

	    // Populate the questionsTableView with questions
	    fillQuestionsTable();

	    // Initialize columns for the addedQuestionsList
	    initializeAddedQuestionsTableColumns();

	    // Disable the CourseNameComboBox until a subject is selected
	    CourseNameComboBox.setDisable(true);

	    // Event handler for subjectNameComboBox selection change
	    subjectNameComboBox.setOnAction(event -> {
	        CourseNameComboBox.setDisable(false);
	        Subject selectedSubject = subjectNameComboBox.getSelectionModel().getSelectedItem();

	        // Filter the CourseNameComboBox by selected subject
	        filterCourseComboBoxBySubject(selectedSubject);

	        // Filter the questionsTableView by selected subject
	        filterQuestionTableBySubject(selectedSubject);

	        // Enable the addNewQuestionButton
	        addNewQuestionButton.setDisable(false);

	        // Clear and populate the addedQuestionsList and QuestionsTableView
	        addedQuestionsList.clear();
	        QuestionsTableView.getItems().clear();
	        QuestionsTableView.getItems().addAll(addedQuestionsList);
	    });

	    pnlAddedQuestions.toFront();
	}

	/**
	 * Retrieves the list of subjects from the server and populates the subjectNameComboBox.
	 */
	private void getSubjectsList() {
	    // Send a message to the server to get the subjects list
	    Message message = new Message(MessageType.GetSubjectsList, ClientUI.chat.client.user.getId());
	    ClientUI.chat.accept(message);

	    // Add the retrieved subjects to the subjectList
	    for (Subject subject : ClientUI.chat.client.subjectsList) {
	        subjectList.add(subject);
	    }

	    // Set the subjectList as the items of subjectNameComboBox
	    subjectNameComboBox.setItems(subjectList);
	}

	/**
	 * Retrieves the list of courses from the server.
	 */
	private void getCoursesList() {
	    // Send a message to the server to get the courses list
	    Message message = new Message(MessageType.GetCoursesList, ClientUI.chat.client.user.getId());
	    ClientUI.chat.accept(message);
	}

	/**
	 * Initializes the columns for the addedQuestionsList TableView.
	 */
	private void initializeAddedQuestionsTableColumns() {
	    // Initialize the QuestionNumberColumn
	    QuestionNumberColumn.setCellValueFactory(
	        new Callback<CellDataFeatures<QuestionForExam, QuestionForExam>, ObservableValue<QuestionForExam>>() {
	            @Override
	            public ObservableValue<QuestionForExam> call(CellDataFeatures<QuestionForExam, QuestionForExam> p) {
	                return new ReadOnlyObjectWrapper(p.getValue());
	            }
	        });

	    // Set a cell factory for the QuestionNumberColumn to display question numbers
	    QuestionNumberColumn.setCellFactory(
	        new Callback<TableColumn<QuestionForExam, QuestionForExam>, TableCell<QuestionForExam, QuestionForExam>>() {
	            @Override
	            public TableCell<QuestionForExam, QuestionForExam> call(
	                TableColumn<QuestionForExam, QuestionForExam> param) {
	                return new TableCell<QuestionForExam, QuestionForExam>() {
	                    @Override
	                    protected void updateItem(QuestionForExam item, boolean empty) {
	                        super.updateItem(item, empty);

	                        if (this.getTableRow() != null && item != null) {
	                            setText((this.getTableRow().getIndex() + 1) + "");
	                        } else {
	                            setText("");
	                        }
	                    }
	                };
	            }
	        });
	    QuestionNumberColumn.setSortable(false);

	    // Initialize the idColumn, addedQuestionTextColumn, viewQuestionColumn, and selectedColumn
	    idColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getQuestionID()));
	    addedQuestionTextColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getQuestionText()));
	    viewQuestionColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getBtnViewQuestion()));
	    selectedColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getQuestionPoints()));

	    // Set a row factory for the QuestionsTableView to enable drag-and-drop functionality
	    QuestionsTableView.setRowFactory(tv -> {
	        TableRow<QuestionForExam> row = new TableRow<>();

	        // Set event handlers for drag-and-drop operations
	        row.setOnDragDetected(event -> {
	            // Start drag-and-drop operation
	            if (!row.isEmpty()) {
	                Integer index = row.getIndex();
	                Dragboard db = row.startDragAndDrop(TransferMode.MOVE);
	                db.setDragView(row.snapshot(null, null));
	                ClipboardContent cc = new ClipboardContent();
	                cc.put(SERIALIZED_MIME_TYPE, index);
	                db.setContent(cc);
	                event.consume();
	            }
	        });

	        row.setOnDragOver(event -> {
	            // Accept the drag-over event
	            Dragboard db = event.getDragboard();
	            if (db.hasContent(SERIALIZED_MIME_TYPE)) {
	                if (row.getIndex() != ((Integer) db.getContent(SERIALIZED_MIME_TYPE)).intValue()) {
	                    event.acceptTransferModes(TransferMode.COPY_OR_MOVE);
	                    event.consume();
	                }
	            }
	        });

	        row.setOnDragDropped(event -> {
	            // Handle the drop event
	            Dragboard db = event.getDragboard();
	            if (db.hasContent(SERIALIZED_MIME_TYPE)) {
	                int draggedIndex = (Integer) db.getContent(SERIALIZED_MIME_TYPE);
	                QuestionForExam draggedPerson = QuestionsTableView.getItems().remove(draggedIndex);

	                int dropIndex;

	                if (row.isEmpty()) {
	                    dropIndex = QuestionsTableView.getItems().size();
	                } else {
	                    dropIndex = row.getIndex();
	                }

	                QuestionsTableView.getItems().add(dropIndex, draggedPerson);

	                event.setDropCompleted(true);
	                QuestionsTableView.getSelectionModel().select(dropIndex);
	                event.consume();
	            }
	        });

	        return row;
	    });

	    // Add a listener for the selected Question in the QuestionsTableView
	    QuestionsTableView.getSelectionModel().selectedItemProperty().addListener((observable, oldValue, newValue) -> {
	        if (newValue != null) {
	            removeQuestionButton.setDisable(false);
	        } else {
	            removeQuestionButton.setDisable(true);
	        }
	    });

	    // Create an observable list for added questions and populate the QuestionsTableView
	    addedQuestionsList = FXCollections.observableArrayList();
	    QuestionsTableView.getItems().addAll(addedQuestionsList);
	}

	@FXML
	public void handleAddNewQuestionButton(ActionEvent event) {
	    pnlQuestionsList.toFront();
	}

	/**
	 * Handles the event when the "Add Question" button is clicked.
	 *
	 * @param event The action event triggered by clicking the button.
	 */
	@FXML
	public void handleAddQuestionButton(ActionEvent event) {
	    // Get the selected question from the table view
	    Question selectedQuestion = questionsTableView.getSelectionModel().getSelectedItem();
	    
	    if (selectedQuestion != null) {
	        // Create a new QuestionForExam object based on the selected question
	        QuestionForExam addedQuestion = new QuestionForExam(selectedQuestion);
	        addedQuestion.setBtnViewQuestion(selectedQuestion.getBtnViewQuestion());
	        addedQuestion.setQuestionPoints(new TextField());

	        // Remove any existing questions with the same ID from the added questions list
	        questionsList.removeIf(element -> (element.getQuestionID().equals(addedQuestion.getQuestionID())));

	        // Add the new question to the added questions list
	        addedQuestionsList.add(addedQuestion);
	        
	        // Clear and update the table view with the added questions list
	        QuestionsTableView.getItems().clear();
	        QuestionsTableView.getItems().addAll(addedQuestionsList);
	        
	        // Clear the selection in the questions table view
	        questionsTableView.getSelectionModel().clearSelection();
	    }
	}

	/**
	 * Handles the event when the "Remove Question" button is clicked.
	 *
	 * @param event The action event triggered by clicking the button.
	 */
	@FXML
	public void handleRemoveQuestionButton(ActionEvent event) {
	    // Get the selected question from the table view
	    QuestionForExam selectedQuestion = QuestionsTableView.getSelectionModel().getSelectedItem();
	    
	    if (selectedQuestion != null) {
	        selectedQuestion.setViewButtonAction();
	        Question removedQuestion = selectedQuestion.getQuestion();

	        // Remove the selected question from the added questions list
	        addedQuestionsList.removeIf(element -> (element.getQuestionID().equals(removedQuestion.getQuestionID())));

	        // Add the removed question back to the original questions list
	        questionsList.add(removedQuestion);
	        
	        // Clear and update the table view with the added questions list
	        QuestionsTableView.getItems().clear();
	        QuestionsTableView.getItems().addAll(addedQuestionsList);
	        
	        // Clear the selection in the questions table view
	        QuestionsTableView.getSelectionModel().clearSelection();
	    }
	}

	/**
	 * Handles the event when the "Create Exam" button is clicked.
	 *
	 * @param event The action event triggered by clicking the button.
	 */
	@FXML
	public void handleCreateExamButtonClicked(ActionEvent event) {
	    if (ValidExamData()) {
	        // Extract the necessary data for creating a new exam
	        String id = "";
	        String subjectID = subjectNameComboBox.getSelectionModel().getSelectedItem().getTopicID();
	        String subject = subjectNameComboBox.getSelectionModel().getSelectedItem().getTopic();
	        String courseID = CourseNameComboBox.getSelectionModel().getSelectedItem().getCourseID();
	        String course = CourseNameComboBox.getSelectionModel().getSelectedItem().getCourse();
	        String duration = DurationTextField.getText();
	        int numOfQuestions = addedQuestionsList.size();
	        String lecturerID = ClientUI.chat.client.user.getId();
	        String lecturerName = ClientUI.chat.client.user.getFirstName() + " " + ClientUI.chat.client.user.getLastName();
	        String commentsForLecturer = TeacherNotesTextArea.getText();
	        String commentsForStudents = StudentsNotesTextArea.getText();

	        // Create a new exam object
	        Exam newExam = new Exam(id, subjectID, subject, courseID, course, duration, numOfQuestions, lecturerID, lecturerName, commentsForLecturer, commentsForStudents);

	        ArrayList<QuestionForExam> questionsList = new ArrayList<>();

	        // Prepare the questions for the exam
	        for (QuestionForExam questionForExam : addedQuestionsList) {
	            QuestionForExam addedQuestion = questionForExam;
	            int points = Integer.parseInt(addedQuestion.getQuestionPoints().getText());
	            addedQuestion.setPoints(points);
	            addedQuestion.setQuestionNumber(addedQuestionsList.indexOf(questionForExam) + 1);
	            addedQuestion.setBtnViewQuestion(null);
	            addedQuestion.setQuestionPoints(null);
	            questionsList.add(addedQuestion);
	        }

	        // Set the questions for the new exam
	        newExam.setQuestions(questionsList);

	        // Send a message to the server to create the new exam
	        Message messageToServer = new Message(MessageType.CreateNewExam, newExam);
	        ClientUI.chat.accept(messageToServer);
	    }
	}
	
	/**
	 * Method that check if the exam data are valid
	 * 
	 * @return return true if the data are valid and false otherwise
	 */
	public Boolean ValidExamData() {
	    if (subjectNameComboBox.getSelectionModel().getSelectedItem() == null) {
	        ClientUI.display(DialogType.Attention, "Subject Field Required!", "Attention! Subject Field Must Be Filled!");
	        return false;
	    }
	    if (CourseNameComboBox.getSelectionModel().getSelectedItem() == null) {
	        ClientUI.display(DialogType.Attention, "Course Field Required!", "Attention! Course Field Must Be Filled!");
	        return false;
	    }
	    if (DurationTextField.getText().isEmpty()) {
	        ClientUI.display(DialogType.Attention, "Duration Field Required!", "Attention! Duration Field Must Be Filled!");
	        return false;
	    } else {
	        try {
	            int num = Integer.parseInt(DurationTextField.getText());
	        } catch (Exception e) {
	            ClientUI.display(DialogType.Error, "Invalid Duration Field Input!", "Attention! You Must Insert The Exam Duration In Minutes (Numbers Only e.g. \"60\" For 1 Hour)!");
	            return false;
	        }
	    }
	    if (addedQuestionsList.isEmpty()) {
	        ClientUI.display(DialogType.Attention, "Questions Association Required!", "Attention! You Must Association Questions For The Exam!");
	        return false;
	    }
	    int totalPoints = 0;
	    for (QuestionForExam questionForExam : addedQuestionsList) {
	        try {
	            int points = Integer.parseInt(questionForExam.getQuestionPoints().getText());
	            if (points > 100 || points <= 0) {
	                ClientUI.display(DialogType.Error, "Invalid Points Field Input!", "Attention! You Must Insert Number For Question Points Between 1 And 100!");
	                return false;
	            }
	            totalPoints += points;
	        } catch (Exception e) {
	            ClientUI.display(DialogType.Error, "Invalid Points Field Input!", "Attention! You Must Insert Number For Question Points (e.g. \"20\")!");
	            return false;
	        }
	    }
	    if (totalPoints != 100) {
	        ClientUI.display(DialogType.Error, "Invalid Points Fields Input!", "Attention! The Total Questions Points Must Equal To 100!");
	        return false;
	    }
	    return true;
	}
	
	private void initializeQuestionsTableColumns() {
		//initialize the Questions Table Columns
		//initialize the Questions ID Table Columns
		questionIDColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getQuestionID()));
		//initialize the Questions Lecturer Table Columns
		questionLecturerColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getLecturerName()));
		//initialize the Questions Text Table Columns
		questionTextColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getQuestionText()));
		//initialize the Questions View Button Table Columns - Button to view the question Data
		questionViewButtonColumn.setCellValueFactory(cellData -> new ReadOnlyObjectWrapper<>(cellData.getValue().getBtnViewQuestion()));
		
		// Wrap the ObservableList in a FilteredList (initially display all data).
		filteredData = new FilteredList<>(questionsList, b -> true);

		// Set the filter Predicate whenever the filter changes.
		questionSearch.textProperty().addListener((observable, oldValue, newValue) -> {
			filteredData.setPredicate(question -> {
				
				// If filter text is empty, display all persons.
				if (newValue == null || newValue.isEmpty()) {
					return true;
				}

				// Compare data of every question with filter text.
				String lowerCaseFilter = newValue.toLowerCase();

				if (question.getQuestionID().toLowerCase().indexOf(lowerCaseFilter) != -1) {
					return true; // Filter matches question id.
				} else if (question.getLecturerName().toLowerCase().indexOf(lowerCaseFilter) != -1) {
					return true; // Filter matches lecturer.
				} else if (question.getQuestionText().toLowerCase().indexOf(lowerCaseFilter) != -1) {
					return true; // Filter matches question Text.
				} else
					return false; // Does not match.
			});
		});

		// Wrap the FilteredList in a SortedList.
		sortedData = new SortedList<>(filteredData);

		// Bind the SortedList comparator to the TableView comparator.
		// Otherwise, sorting the TableView would have no effect.
		sortedData.comparatorProperty().bind(questionsTableView.comparatorProperty());

		// Add listener for selected question
		questionsTableView.getSelectionModel().selectedItemProperty().addListener((observable, oldValue, newValue) -> {
			if (newValue != null) {
				addQuestionButton.setDisable(false);
			} else {
				addQuestionButton.setDisable(true);
			}
		});
	}

	private void fillQuestionsTable() {
		questionsList.clear();

		//Build message to send to the server
		Message message = new Message(MessageType.GetAllQuestion, ClientUI.chat.client.user.getId());
		ClientUI.chat.accept(message);
		//loop on questions and add them to Table.
		ArrayList<Question> questionsArray = ClientUI.chat.client.questionsList;
		for (Question quest : questionsArray) {
			Button viewButton = new Button("View");
			viewButton.setOnAction(event -> {
				Platform.runLater(() -> {
					try {
						ClientUI.display(DialogType.Attention, "Question Details",
								"Question Subject: " + quest.getQuestionSubject() + "\n\n* Question Text: \n"
										+ quest.getQuestionText() + "\n\n* Answers: " + "\n1: " + quest.getAnswer1()
										+ "\n2: " + quest.getAnswer2() + "\n3: " + quest.getAnswer3() + "\n4: "
										+ quest.getAnswer4() + "\n\n* Correct Answer: " + quest.getCorrectAnswer());

					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				});
			});
			quest.setBtnViewQuestion(viewButton);
		}
		questionsList.addAll(questionsArray);

		// Add sorted (and filtered) data to the table.
		questionsTableView.setItems(sortedData);
	}

	
	
	/**
	 * method that filter the question table by subject
	 * 
	 * @param subject - the Subject that want to filter the table to
	 */
	private void filterQuestionTableBySubject(Subject subject) {
		//get question data
		ArrayList<Question> questionsArray = ClientUI.chat.client.questionsList;
		ArrayList<Question> filteredQuestionsArray = new ArrayList<>();
		for (Question quest : questionsArray) {
			//bypass questions that's not suitable to view.
			if (!quest.getSubjectID().startsWith(subject.getTopicID())) {
				continue;
			}

			Button viewButton = new Button("View");
			viewButton.setOnAction(event -> {
				Platform.runLater(() -> {
					try {
						ClientUI.display(DialogType.Attention, "Question Details",
								"Question Subject: " + quest.getQuestionSubject() + "\n\n* Question Text: \n"
										+ quest.getQuestionText() + "\n\n* Answers: " + "\n1: " + quest.getAnswer1()
										+ "\n2: " + quest.getAnswer2() + "\n3: " + quest.getAnswer3() + "\n4: "
										+ quest.getAnswer4() + "\n\n* Correct Answer: " + quest.getCorrectAnswer());

					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				});
			});
			quest.setBtnViewQuestion(viewButton);
			filteredQuestionsArray.add(quest);
		}
		questionsList.clear();
		questionsList.addAll(filteredQuestionsArray);
	}


	/**
	 * method that filter the courses combo box by subject
	 * 
	 * @param subject - the Subject that want to filter the table to.
	 */
	private void filterCourseComboBoxBySubject(Subject subject) {
		courseList.clear();
		//loop and add selected courses after filtering by topic.
		for (Course course : ClientUI.chat.client.coursesList) {
			if (course.getSubjectID().equals(subject.getTopicID())) {
				courseList.add(course);
			}
		}
		
		CourseNameComboBox.setItems(courseList);
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
		Parent root = FXMLLoader.load(getClass().getResource("/gui/CreateExamForm.fxml"));

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

	/**
	 * Handles the event when the "Back" button is clicked.
	 *
	 * @param event The action event triggered by clicking the button.
	 */
	@FXML
	public void handleBackButtonClicked(ActionEvent event) {
	    pnlAddedQuestions.toFront();
	}
}