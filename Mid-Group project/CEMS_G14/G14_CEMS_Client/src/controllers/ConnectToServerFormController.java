package controllers;

import javafx.application.Application;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.TextField;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Pane;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;
import javafx.stage.StageStyle;

import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;

import client.ClientController;
import client.ClientUI;
import entity.DialogType;

/**
 * Controller class for the ConnectToServerForm.fxml.
 */
public class ConnectToServerFormController extends Application implements Initializable {
	//all the images that will appear in this stage.
    @FXML
    private ImageView sideImage;

    @FXML
    private ImageView imgBtnExit;

    @FXML
    private TextField serverIPTextField;

    @FXML
    private TextField serverPortTextField;
    //all the buttons in this stage.
    @FXML
    private Button ConnectButton;

    @FXML
    private Button QuitButton;
    //stage dimensions
    private double x, y;

    /**
     * Gets the IP address entered in the serverIPTextField.
     *
     * @return The IP address text.
     */
    private String getIPText() {
        return serverIPTextField.getText();
    }

    /**
     * Gets the port number entered in the serverPortTextField.
     *
     * @return The port number.
     */
    private int getPortText() {
        return Integer.parseInt(serverPortTextField.getText());
    }

    /**
     * Handles the ConnectButton click event.
     *
     * @param event The ActionEvent triggered by the ConnectButton.
     * @throws Exception if there is an error during connection setup.
     */
    public void handleConnectClick(ActionEvent event) throws Exception {
        String ip;
        int port;
        //get IP and port from textFields.
        ip = getIPText(); 
        port = getPortText();
        //check IP TextFileds is filled.
        if (ip.trim().isEmpty()) {
            ClientUI.display(DialogType.Warning, "Have Attention!", "You must enter an IP Address.");
            System.out.println("You must enter an IP Address");
        } else {
            try {
                // Create a new ClientController for communication with the server
                ClientUI.chat = new ClientController(ip, port);
                ((Node) event.getSource()).getScene().getWindow().hide(); // hiding primary window
                ClientUI.primaryStage.getScene().getWindow().hide();
                ClientUI.primaryStage = new Stage();
                // Start the login form controller
                new LoginFormController().start(ClientUI.primaryStage);

            } catch (IOException exception) {
                ClientUI.display(DialogType.Error, "Connection Setup Fail!",
                        "Can't setup connection!");
                System.out.println("Error: Can't setup connection!");
            }
        }
    }

    /**
     * Handles the QuitButton click event.
     */
    public void handleExitButton() {
        System.exit(0);
    }

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        // Load and set images for buttons
        Image exitImage = new Image(getClass().getResourceAsStream("/images/Exit_Purple_64.png"));
        Image serverImage = new Image(getClass().getResourceAsStream("/images/Server.png"));
        sideImage.setImage(serverImage);
        imgBtnExit.setImage(exitImage);

        // Set default values for IP address and port fields
        serverIPTextField.setText("127.0.0.1");
        serverPortTextField.setText("5555");
    }

    @Override
    public void start(Stage primaryStage) throws Exception {
        // Load the ConnectToServerForm.fxml file
        Parent root = FXMLLoader.load(getClass().getResource("/gui/ConnectToServerForm.fxml"));

        // Create a new scene with the root node
        Scene scene = new Scene(root);
        scene.getStylesheets().add(getClass().getResource("/style/connectToServerStyle.css").toExternalForm());

        primaryStage.setScene(scene);
        // Set stage borderless
        primaryStage.initStyle(StageStyle.UNDECORATED);

        // Enable dragging of the window
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