package controllers;

//Import statements

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FilenameFilter;
import java.io.IOException;
import java.net.URL;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.ResourceBundle;
import client.ChatClient;
import client.ClientController;
import client.ClientUI;
import entity.*;
import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.stage.Stage;
import javafx.stage.StageStyle;
import javafx.stage.FileChooser;


/**
 * The ManualExamController class is responsible for managing the manual exam form in the user interface.
 * It handles actions such as downloading and uploading the exam file, submitting the exam.
 */

public class ManualExamController implements Initializable {
	//Timer for Exam
	Thread thread;
	int timerTime;
	//all FXML GUI variables for this stage.
	@FXML
	private ImageView imageLogo = new ImageView();
	
	@FXML
	private ImageView downloadButtonLogo = new ImageView();
	
	@FXML
	private ImageView imageBtnUpload = new ImageView();

	@FXML
	private ImageView imageSubmitButtonLogo = new ImageView();

	@FXML
	private ImageView imageExit = new ImageView();

	@FXML
	private Button submitExamButton;

	@FXML
	private Button btnDownloadExam;
	
	@FXML
	private Button btnUploadExam;

	@FXML
	private Button btnExit;

	@FXML
	private Label reamainingTimeLabel = new Label();
	
	@FXML
	private Label examLockedLabel = new Label();
	
	@FXML
	private Label goodLuckLabel = new Label();

	@FXML
	private Label notesLabel = new Label();

	@FXML
	private Label examStatusLabel = new Label();

	StudentExam examCopy;
	
	private double x, y;

	/**
	 * flag to know if the user uploaded at least one test
	 */
	static boolean flagForUploadedExam = false;
	/**
	 * array byte of the uploaded word document file.
	 */
	static byte[] arrByteManualExamUpload;
	
	private int examDuration;
	
	private String startTime;
	
	private String endTime;
	
	/**
     * Initializes the controller class.
     * @param location  The location used to resolve relative paths for the root object.
     * @param resources The resources used to localize the root object.
     */
	@Override
	public void initialize(URL location, ResourceBundle resources) {
		
		notesLabel.setText(ClientUI.chat.client.studentExamInProgress.getExam().getCommentsForStudents());

		Image logoImage = new Image(getClass().getResourceAsStream("/images/logo_white.png"));
		Image downloadLogoImage = new Image(getClass().getResourceAsStream("/images/download_64.png"));
		Image uploadLogoImage = new Image(getClass().getResourceAsStream("/images/upload_64.png"));
		Image submitButtonLogoImage = new Image(getClass().getResourceAsStream("/images/Checkmark_64.png"));
		Image exitImage = new Image(getClass().getResourceAsStream("/images/Exit.png"));
		imageLogo.setImage(logoImage);
		downloadButtonLogo.setImage(downloadLogoImage);
		imageBtnUpload.setImage(uploadLogoImage);
		imageSubmitButtonLogo.setImage(submitButtonLogoImage);
		imageExit.setImage(exitImage);
		
		goodLuckLabel.setVisible(false);
		examLockedLabel.setVisible(false);

	}

	/**
     * Handles the action when the download exam button is clicked,The method download an exam to the student computer.
     *
     */
	@FXML
	public void handleClickDwnldExamBtn() {
		//set image
		Image gifImage = new Image(getClass().getResourceAsStream("/images/loading-gif.gif"));
		downloadButtonLogo.setImage(gifImage);
		//get exam duration time.
		int examDur = Integer.parseInt(ClientUI.chat.client.studentExamInProgress.getExam().getTime()) + ClientUI.chat.client.studentExamInProgress.getExtraTime();
		ClientUI.chat.client.studentExamInProgress.setExtraTime(0);
		
		EFG examFileGenerator = new EFG();
		//new thread to run downloading exam from the system.
		new Thread(new Runnable() {
			
			@Override
			public void run() {
				// TODO Auto-generated method stub
				//set download target
				if (examFileGenerator.createAndSaveExamDoc(ClientUI.chat.client.studentExamInProgress)) {
					String home = System.getProperty("user.home");
					Platform.runLater(() -> {
						examTimer(examDur);
						ClientUI.display(DialogType.Success, "The Exam Have Been Downloaded!", 
								"The Exam Downloaded To the Downloads Folder\n"
								+ "Path: " + home + "\\Downloads"
								);
						Image downloadLogoImage = new Image(getClass().getResourceAsStream("/images/download_64.png"));
						downloadButtonLogo.setImage(downloadLogoImage);
						//run timer
						startTime = ClientUI.timeFormat();
					});
				//show warning if there is an error
				} else {
					Platform.runLater(() -> {
						ClientUI.display(DialogType.Error, "Downloading Error!", 
								"There Was An Error While Downloading The Exam!\n"
								+ "Try Again."
								);
					});
				}
			}
		}).start();
		
	}
	

    /**
     * Handles the action when the upload exam button is clicked, The method uploads an exam from the student computer.
     */

	@FXML
	public void handleClickUpldExamBtn() {
		try {
			FileChooser fileChooser = new FileChooser();
			// Set the initial directory to the downloads folder
			String userHome = System.getProperty("user.home");
			Path downloadsPath = Paths.get(userHome, "Downloads");
			fileChooser.setInitialDirectory(downloadsPath.toFile());
			//choose only word doc.
			fileChooser.getExtensionFilters().add(new FileChooser.ExtensionFilter("Word document", "*.docx"));
			File fileToUpload = fileChooser.showOpenDialog(ClientUI.primaryStage);
			if (fileToUpload == null)
				return; // in case that the user click cancel in choose upload file (Manual test)
			arrByteManualExamUpload = new byte[(int) fileToUpload.length()];
			FileInputStream fis = new FileInputStream(fileToUpload);
			BufferedInputStream bis = new BufferedInputStream(fis);
			bis.read(arrByteManualExamUpload, 0, arrByteManualExamUpload.length);
			//create new exam to upload to.
			examCopy = new StudentExam();
			examCopy.setArrByteManualTestUpload(arrByteManualExamUpload);

			 System.out.println(arrByteManualExamUpload);
			bis.close();
			flagForUploadedExam = true;
			Image uploadSuccededLogoImage = new Image(getClass().getResourceAsStream("/images/Check_64.png"));
			imageBtnUpload.setImage(uploadSuccededLogoImage);
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		    
	}
	
	 /**
     * Handles the action when the submit exam button is clicked.
     * @param event The action event.
     */
	@FXML
	public void handleSubmitExamButtonClicked(ActionEvent event) {
		if(flagForUploadedExam) {
			submitExam();
			ClientUI.display(DialogType.Success, "Good Luck!", "Exam Submitted Successfully!");
			
		}else {
			ClientUI.display(DialogType.Warning, "Have Attention!", "Please Upload Exam file!");
		}
	}


	/**
     * Handles the action when the exit button is clicked.
     * @param event The action event.
     */
	@FXML
	public void handleExitButtonClicked(ActionEvent event) {
		((Node) event.getSource()).getScene().getWindow().hide();
		try {
			ClientUI.primaryStage = new Stage();
			new StudentMainMenuController().start(ClientUI.primaryStage);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	 /**
     * Starts the manual exam form.
     * @param primaryStage The primary stage for the application.
     * @throws Exception If an exception occurs during the start process.
     */
	public void start(Stage primaryStage) throws Exception {

		Parent root = FXMLLoader.load(getClass().getResource("/gui/ManualExamForm.fxml"));

		Scene scene = new Scene(root);

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
     * Starts the timer for the exam.
     * @param Time The total time for the exam in seconds.
     */
	private void examTimer(int Time) {
		//init exam time variables.
		timerTime = Time * 60;
		examDuration = 0;
		
		//start new thread
		thread = new Thread(new Runnable() {
			int extraTime = 60;
			
			@Override
			public void run() {
				//count down timer.
				while (timerTime > 0 ) {
					timerTime--;
					examDuration++;
					Platform.runLater(new Runnable() {

						@Override
						public void run() {
							//handle extra time request.
							if (ClientUI.chat.client.studentExamInProgress.getExtraTime() > 0) {
								timerTime += (ClientUI.chat.client.studentExamInProgress.getExtraTime() * 60);
								ClientUI.chat.client.studentExamInProgress.setExtraTime(0);
							}
							//handle lock request.
							if (ClientUI.chat.client.studentExamInProgress.getStatus().equals("Locked")) {
								submitExam();
								return;
							}
							//set exam time style.
							if (timerTime < 60) {
								if (timerTime % 2 != 0) {
									reamainingTimeLabel.setStyle("-fx-text-fill: #c72814;");
								} else {
									reamainingTimeLabel.setStyle("-fx-text-fill: #6b4ad6;");
								}
							}
							reamainingTimeLabel.setText(String.format("%02d:%02d", timerTime / 60, timerTime % 60));
						}
					});

					try {
						Thread.sleep(1000); // Sleep for 1 second
					} catch (InterruptedException e) {
						e.printStackTrace();
					}
				}
				Platform.runLater(() -> {
					ClientUI.display(DialogType.Warning, "The Time Over!", "You Have Additional 1 Minute To Upload The Exam File, After That The Upload Option Will Locked!\nGood Luck!");
				});
				reamainingTimeLabel.setStyle("-fx-text-fill: #6b4ad6;");
				//count down extra 1 min extra time.
				while (extraTime > 0) {
					extraTime--;
					Platform.runLater(() -> {
						reamainingTimeLabel.setText(String.format("%02d:%02d", extraTime / 60, extraTime % 60));
					});

					try {
						Thread.sleep(1000); // Sleep for 1 second
					} catch (InterruptedException e) {
						e.printStackTrace();
					}
				}
				goodLuckLabel.setVisible(true);
				examLockedLabel.setVisible(true);
				btnUploadExam.setDisable(true);
				btnDownloadExam.setDisable(true);
				submitExamButton.setDisable(true);

				Platform.runLater(() -> {
					ClientUI.display(DialogType.Warning, "The Additional Time Over!", "Time Over, We are Sorry There Is No Way To Upload Your Exam File!");
				});
			}
		});
		thread.start();
	}
	
	/**
	 * Submits the exam and handles the necessary actions after submission.
	 */
	private void submitExam() {
	    int gradeInExam = 0;

	    // Calculate exam duration in hours
	    double examDurationInHours = (double) examDuration / 60;
	    String examStudentDuration = String.format("%.2f", examDurationInHours);

	    // Create StudentSubmitedExam object with relevant data
	    StudentSubmitedExam submitedExam = new StudentSubmitedExam(
	    		ClientUI.chat.client.user.getId(),
	    		ClientUI.chat.client.studentExamInProgress.getProgressId(),
	    		ClientUI.chat.client.studentExamInProgress.getExam().getExamID(),
	    		ClientUI.chat.client.studentExamInProgress.getExam().getSubject(),
	    		ClientUI.chat.client.studentExamInProgress.getExam().getCourse(),
	            examStudentDuration,
	            startTime,
	            endTime,
	            gradeInExam,
	            null
	    );

	    // Stop the exam timer thread
	    thread.stop();

	    // Update UI elements and disable buttons
	    endTime = ClientUI.timeFormat();
	    btnUploadExam.setDisable(true);
	    btnDownloadExam.setDisable(true);
	    submitExamButton.setDisable(true);
	    goodLuckLabel.setVisible(true);
	    examLockedLabel.setVisible(true);
	    submitExamButton.setText("Exam Submitted");
	    Image submitLockedLogoImage = new Image(getClass().getResourceAsStream("/images/lock_64.png"));
	    imageSubmitButtonLogo.setImage(submitLockedLogoImage);
	    reamainingTimeLabel.setStyle("-fx-text-fill: #00b92c;");

	    // Send message to submit the exam
	    Message message = new Message(MessageType.SubmitStudentManualExam, submitedExam);
	    // ClientUI.chat.accept(message);
	}

}