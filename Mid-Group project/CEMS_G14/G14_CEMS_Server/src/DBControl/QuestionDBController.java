package DBControl;

import java.sql.*;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import entity.*;
import javafx.scene.control.Button;
import java.time.format.DateTimeFormatter;


public class QuestionDBController {

	public static ArrayList<Question> getQuestionsList(String lecturerID) {
		String sqlQuery = "select Q.* " + "FROM questions Q " + "WHERE LEFT(Q.idquest, 2) IN ("
				+ "select DISTINCT C.subjectid " + "FROM lecturercourses L, courses C "
				+ "WHERE L.courseid = C.idcourse AND L.lecturerid = ?);";
		ArrayList<Question> questionList = new ArrayList<>();
		try {
			PreparedStatement ps = DBConnector.conn.prepareStatement(sqlQuery);
			ps.setString(1, lecturerID);
			ResultSet rs = ps.executeQuery();

			while (rs.next()) {
				String questionID = rs.getString(1);
				String questionSubject = rs.getString(2);
				String questionText = rs.getString(3);
				String answer1 = rs.getString(4);
				String answer2 = rs.getString(5);
				String answer3 = rs.getString(6);
				String answer4 = rs.getString(7);
				int correctAnswer = rs.getInt(8);
				String lecturerName = rs.getString(9);

				Question question = new Question(questionID, questionSubject, questionText, answer1, answer2, answer3,
						answer4, correctAnswer, lecturerName);

				questionList.add(question);
			}
			return questionList;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	public static Boolean deleteQuestion(String questionID) {
		String sqlQuery = "DELETE FROM `cems`.`questions` WHERE `idquest` = ?;";

		try {
			if (DBConnector.conn != null) {
				// Start the transaction
				DBConnector.conn.setAutoCommit(false);

				PreparedStatement statement = DBConnector.conn.prepareStatement(sqlQuery);
				statement.setString(1, questionID);
				statement.execute();

				// Commit the transaction
				DBConnector.conn.commit();
				System.out.println("Transaction committed successfully");
				DBConnector.conn.setAutoCommit(true);
				return true;
			}
		} catch (SQLException e) {
			e.printStackTrace();
			// Rollback the transaction in case of an error
			if (DBConnector.conn != null) {
				try {
					DBConnector.conn.rollback();
					System.out.println("Transaction rolled back");
				} catch (SQLException ex) {
					ex.printStackTrace();
				}
			}

		}
		return false;
	}

	public static Boolean updateQuestionData(Question question) {
		String sqlQuery = "UPDATE `cems`.`questions` SET `questtext` = ?, `answer1` = ?, `answer2` = ?, `answer3` = ?, `answer4` = ?, `correctanswer` = ? WHERE `idquest` = ?;";

		try {
			if (DBConnector.conn != null) {
				// Start the transaction
				DBConnector.conn.setAutoCommit(false);

				PreparedStatement statement = DBConnector.conn.prepareStatement(sqlQuery);
				statement.setString(1, question.getQuestionText());
				statement.setString(2, question.getAnswer1());
				statement.setString(3, question.getAnswer2());
				statement.setString(4, question.getAnswer3());
				statement.setString(5, question.getAnswer4());
				statement.setInt(6, question.getCorrectAnswer());
				statement.setString(7, question.getQuestionID());
				statement.execute();

				// Commit the transaction
				DBConnector.conn.commit();
				System.out.println("Transaction committed successfully");
				DBConnector.conn.setAutoCommit(true);
				return true;
			}
		} catch (SQLException e) {
			e.printStackTrace();
			// Rollback the transaction in case of an error
			if (DBConnector.conn != null) {
				try {
					DBConnector.conn.rollback();
					System.out.println("Transaction rolled back");
				} catch (SQLException ex) {
					ex.printStackTrace();
				}
			}

		}
		return false;
	}

	public static Boolean createNewQuestion(Question question) {
		String sqlQuery = "INSERT INTO `cems`.`questions` "
				+ "SELECT CONCAT(?, LPAD(IFNULL(maxquestnumber, 1), 3, '0')), ?, ?, ?, ?, ?, ?, ?, ?, IFNULL(maxquestnumber, 1) "
				+ "FROM (SELECT MAX(questnumber) + 1 AS maxquestnumber FROM questions) AS subquery;";
		try {
			if (DBConnector.conn != null) {
				// Start the transaction
				DBConnector.conn.setAutoCommit(false);

				PreparedStatement statement = DBConnector.conn.prepareStatement(sqlQuery);
				statement.setString(1, question.getSubjectID());
				statement.setString(2, question.getQuestionSubject());
				statement.setString(3, question.getQuestionText());
				statement.setString(4, question.getAnswer1());
				statement.setString(5, question.getAnswer2());
				statement.setString(6, question.getAnswer3());
				statement.setString(7, question.getAnswer4());
				statement.setInt(8, question.getCorrectAnswer());
				statement.setString(9, question.getLecturerName());
				statement.execute();

				// Commit the transaction
				DBConnector.conn.commit();
				System.out.println("Transaction committed successfully");
				DBConnector.conn.setAutoCommit(true);
				return true;
			}
		} catch (SQLException e) {
			e.printStackTrace();
			// Rollback the transaction in case of an error
			if (DBConnector.conn != null) {
				try {
					DBConnector.conn.rollback();
					System.out.println("Transaction rolled back");
				} catch (SQLException ex) {
					ex.printStackTrace();
				}
			}

		}
		return false;
	}
}