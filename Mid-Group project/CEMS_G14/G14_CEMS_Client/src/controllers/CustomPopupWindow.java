package controllers;

import java.awt.Dialog;
import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;

import entity.DialogType;
import javafx.application.Application;
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
import javafx.scene.text.Text;
import javafx.stage.Modality;
import javafx.stage.Stage;
import javafx.stage.StageStyle;

/**
 * Controller class for the custom popup window.
 * Handles the display and functionality of a custom dialog.
 */
public class CustomPopupWindow implements Initializable {
	//all FXML GUI variables for this stage.
    @FXML
    private Button btnExit;

    @FXML
    private ImageView imageExit = new ImageView();

    @FXML
    private ImageView imgDialog = new ImageView();

    @FXML
    private Label lblTitle;

    @FXML
    private Label lblBody;

    private double x, y;

    /**
     * Starts and displays the custom popup window.
     *
     * @param primaryStage ,The primary stage of the application.
     * @param type, The type of dialog.
     * @param title ,The title of the dialog.
     * @param body ,The body text of the dialog.
     */
    public void start(Stage primaryStage, DialogType type, String title, String body) {
        try {
            Stage popupStage = new Stage();
            FXMLLoader loader = new FXMLLoader(getClass().getResource("/gui/Dialog.fxml"));
            Parent root = loader.load();
            Scene scene = new Scene(root);

            CustomPopupWindow controller = loader.getController();
            controller.setType(type);
            controller.setText(title, body);

            popupStage.initModality(Modality.APPLICATION_MODAL);
            popupStage.initOwner(primaryStage);
            popupStage.setScene(scene);
            popupStage.initStyle(StageStyle.UNDECORATED);

            root.setOnMousePressed(event -> {
                x = event.getSceneX();
                y = event.getSceneY();
            });
            root.setOnMouseDragged(event -> {
                popupStage.setX(event.getScreenX() - x);
                popupStage.setY(event.getScreenY() - y);
            });

            popupStage.showAndWait();

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * Handles the event when the exit button is clicked.
     *
     * @param event The action event triggered by clicking the button.
     */
    public void handleExitBtnClick(ActionEvent event) {
        ((Node) event.getSource()).getScene().getWindow().hide();
        System.out.println("Closing the Dialog");
    }

    /**
     * Initializes the controller after its root element has been completely processed.
     * This method is automatically called by the FXMLLoader.
     *
     * @param location  The location used to resolve relative paths for the root object, or null if the location is not known.
     * @param resources The resources used to localize the root object, or null if the root object was not localized.
     */
    @Override
    public void initialize(URL location, ResourceBundle resources) {
        Image exitImage = new Image(getClass().getResourceAsStream("/images/close_window_white_64.png"));
        imageExit.setImage(exitImage);
    }

    /**
     * Sets the type of dialog and updates the dialog image accordingly.
     *
     * @param type The type of dialog.
     */
    public void setType(DialogType type) {
        Image image;
        switch (type) {
            case Success:
                image = new Image(getClass().getResourceAsStream("/images/success_64.png"));
                imgDialog.setImage(image);
                break;
            case Error:
                image = new Image(getClass().getResourceAsStream("/images/error_64.png"));
                imgDialog.setImage(image);
                break;
            case Attention:
                image = new Image(getClass().getResourceAsStream("/images/info_64.png"));
                imgDialog.setImage(image);
                break;
            case Warning:
                image = new Image(getClass().getResourceAsStream("/images/warning_64.png"));
                imgDialog.setImage(image);
                break;
        }
    }

    /**
     * Sets the title and body text of the dialog.
     *
     * @param title The title text.
     * @param body  The body text.
     */
    public void setText(String title, String body) {
        lblTitle.setText(title);
        lblBody.setText(body);
    }
}
