package DBControl;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
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

public class ClientDBController {

///////////////////////////////////////////Department Head ////////////////////////////////////////////////////////////

	public static ArrayList<DurationRequest> getRequestList() {

		ArrayList<DurationRequest> RequestList = new ArrayList<>(); // WHERE `status` = '0'
		String sqlQuery = "SELECT * FROM change_time_requests WHERE `status` = '0'";
		Statement st;
		try {
			st = DBConnector.conn.createStatement();
			ResultSet rs = st.executeQuery(sqlQuery);

			while (rs.next()) {
				DurationRequest request = new DurationRequest(rs.getInt(1), rs.getInt(2), rs.getInt(3), rs.getString(4),
						rs.getInt(5), rs.getInt(6), rs.getString(7), rs.getString(8), rs.getString(9),
						rs.getString(10));
				RequestList.add(request);
			}
			return RequestList;
		} catch (SQLException e) {
// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return null;
	}

	public static Boolean updateRequestStatusInDataApprove(DurationRequest request) {
		String sqlQuery = "UPDATE `cems`.`change_time_requests` SET `status` = ? WHERE `id_request` = ?";
		System.out.print("THE SQL" + sqlQuery);
		try {
			if (DBConnector.conn != null) {
// Start the transaction
				DBConnector.conn.setAutoCommit(false);
				PreparedStatement statement = DBConnector.conn.prepareStatement(sqlQuery);
				String done = "1";
				statement.setString(1, done);
				statement.setInt(2, request.getRequestID());
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

	public static Boolean updateRequestStatusInDataDecline(DurationRequest request) {
		String sqlQuery = "UPDATE `cems`.`change_time_requests` SET `status` = ? WHERE `id_request` = ?";

		try {
			if (DBConnector.conn != null) {
// Start the transaction
				DBConnector.conn.setAutoCommit(false);

				PreparedStatement statement = DBConnector.conn.prepareStatement(sqlQuery);
				String done = "2";
				statement.setString(1, done);
				statement.setInt(2, request.getRequestID());
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

	public static ArrayList<Subject> getSubejctListDH() {

		ArrayList<Subject> subejctListDH = new ArrayList<>();
		String sqlQuery = "SELECT DISTINCT S.* FROM courses C, subjects S WHERE S.subjectid = C.subjectid";

		Statement st;
		try {
			st = DBConnector.conn.createStatement();
			ResultSet rs = st.executeQuery(sqlQuery);

			while (rs.next()) {
				Subject subject = new Subject(rs.getString(1), rs.getString(2));
				subejctListDH.add(subject);
			}
			return subejctListDH;
		} catch (SQLException e) {
// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return null;
	}

	public static ArrayList<Course> getCoursesListDH() {

		ArrayList<Course> CourseListDH = new ArrayList<>();
		String sqlQuery = "select DISTINCT C.* FROM courses C";

		Statement st;
		try {
			st = DBConnector.conn.createStatement();
			ResultSet rs = st.executeQuery(sqlQuery);

			while (rs.next()) {
				Course courses = new Course(rs.getString(1), rs.getString(2), rs.getString(3));
				CourseListDH.add(courses);
			}
			return CourseListDH;
		} catch (SQLException e) {
// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return null;
	}

	public static ArrayList<Exam> getAllExamsListForDH() {
		String getSqlQuery = "select E.* FROM exams E WHERE SUBSTRING(E.id, 3, 2) IN (select DISTINCT C.idcourse From courses C )";

		ArrayList<Exam> ExamListDH = new ArrayList<>();
		try {
			if (DBConnector.conn != null) {
				DBConnector.conn.setAutoCommit(false);

				PreparedStatement firstStatement = DBConnector.conn.prepareStatement(getSqlQuery);
//firstStatement.setString(1, lecturerID);
				ResultSet rs = firstStatement.executeQuery();

				while (rs.next()) {
					String examID = rs.getString(1);
					String examSubjectID = examID.substring(0, 2);
					String examSubject = rs.getString(2);
					String examCourseID = examID.substring(2, 4);
					String examCourse = rs.getString(3);
					String examTime = rs.getString(4);
					String examLecturerID = rs.getString(5);
					String examLecturerName = rs.getString(6);
					int numOfQuestions = rs.getInt(7);
					String commentsForLecturer = rs.getString(8);
					String commentsForStudents = rs.getString(9);

					Exam exam = new Exam(examID, examSubjectID, examSubject, examCourseID, examCourse, examTime,
							numOfQuestions, examLecturerID, examLecturerName, commentsForLecturer, commentsForStudents);

					ExamListDH.add(exam);
				}

				DBConnector.conn.commit();
				System.out.println("Transaction committed successfully");
				DBConnector.conn.setAutoCommit(true);

				return ExamListDH;
			}
		} catch (SQLException e) {
// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	public static ArrayList<QuestionForExam> getQuestionExamsList(String examID) {
		ArrayList<QuestionForExam> QuestionList = new ArrayList<>();
		String sqlQuery = "select DISTINCT Q.* , QE.questpoints FROM questions Q, questforexam QE WHERE QE.questid = Q.idquest AND QE.examid =?";
		try {
			PreparedStatement ps = DBConnector.conn.prepareStatement(sqlQuery);
			ps.setString(1, examID);
			ResultSet rs = ps.executeQuery();

			while (rs.next()) {

				QuestionForExam questionForExam = new QuestionForExam(rs.getString(1), rs.getString(2), rs.getString(3),
						rs.getString(4), rs.getString(5), rs.getString(6), rs.getString(7), rs.getInt(8),
						rs.getString(9), rs.getInt(10), rs.getInt(11));
				QuestionList.add(questionForExam);

			}
			return QuestionList;
		} catch (SQLException e) {
// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return null;
	}

//////////QESTIONS LIST DH
	public static ArrayList<Question> getQuestionsListDH() {
		String sqlQuery = "select Q.* FROM questions Q WHERE LEFT(Q.idquest, 2) IN (select DISTINCT C.subjectid FROM courses C )";
		ArrayList<Question> questionListDH = new ArrayList<>();
		try {
			PreparedStatement ps = DBConnector.conn.prepareStatement(sqlQuery);
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

				questionListDH.add(question);
			}

			return questionListDH;
		} catch (SQLException e) {
// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

///////Lecture report for department head
	public static ArrayList<LectureReport> getLectureReportList(String lecturerID) {
		String sqlQuery = "SELECT E.id, E.course, E.subject, E.time, ED.date, ED.num_of_students, ED.examinprogressid "
				+ "FROM exams E, examsdone ED "
				+ "WHERE ED.examid = E.id AND E.Lecturer_ID = ?";

		ArrayList<LectureReport> lectureReportList = new ArrayList<>();

		try (PreparedStatement statement = DBConnector.conn.prepareStatement(sqlQuery)) {
			statement.setString(1, lecturerID);

			try (ResultSet resultSet = statement.executeQuery()) {
				while (resultSet.next()) {
					String examID = resultSet.getString("id");
					String course = resultSet.getString("course");
					String subject = resultSet.getString("subject");
					String time = resultSet.getString("time");
					String examDate = resultSet.getString("date");
					int studentCount = resultSet.getInt("num_of_students");
					int progressID = resultSet.getInt("examinprogressid");

					LectureReport lectureReport = new LectureReport(examID, course, subject, time, examDate,
							studentCount, progressID);
					lectureReportList.add(lectureReport);
				}
				return lectureReportList;

			}
		} catch (SQLException e) {
			e.printStackTrace();
		}

		return null;
	}

///////Student Report for department head
	

	public static ArrayList<StudentReport> getStudentReportList(String studentID) {
		String sqlQuery = "SELECT E.id, ED.operatorlecturer, E.time, SE.date, ED.type, E.course, SE.lecturer_comment, SE.grade, E.subject "
				+ "FROM exams E, student_exams SE, examsdone ED "
				+ "WHERE SE.porgress_exam_id = ED.examinprogressid AND ED.examid = E.id AND SE.studentID = ?";
		ArrayList<StudentReport> StdReportList = new ArrayList<>();

		try {
			PreparedStatement statement = DBConnector.conn.prepareStatement(sqlQuery);
			statement.setString(1, studentID);
			ResultSet rs = statement.executeQuery();

			while (rs.next()) {
				String type = rs.getString(5);
				if (type.equals("0")) {
					type = "Online";
				}else {
					type = "Manual";
				}
				
				StudentReport stdReportList = new StudentReport(rs.getString(1), rs.getString(2), rs.getString(3),
						rs.getString(4), type, rs.getString(6), rs.getString(7), rs.getString(8),
						rs.getString(9));
				StdReportList.add(stdReportList);
			}
			return StdReportList;
		} catch (SQLException e) {
// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

//////////////////////Course Report _________________________
	public static ArrayList<CoruseReport> getCourseReportList(String courseID) {

		String sqlQuery = "SELECT C.idcourse, C.course, C.subjectid, E.id, E.subject, E.Lecturer_ID, E.Lecturer_name, ED.date, ED.num_of_students, ED.examinprogressid "
				+ "FROM courses C, exams E, examsdone ED "
				+ "WHERE C.course = E.course AND E.id = ED.examid AND C.idcourse = ?";
		System.out.println("after SQL in clientDB");

		ArrayList<CoruseReport> courseReportList = new ArrayList<>();
		try {
			PreparedStatement statement = DBConnector.conn.prepareStatement(sqlQuery);
			statement.setString(1, courseID);
			ResultSet rs = statement.executeQuery();

			while (rs.next()) {
				CoruseReport cReportList = new CoruseReport(rs.getString(1), rs.getString(2), rs.getString(3),
						rs.getString(4), rs.getString(5), rs.getString(6), rs.getString(7), rs.getString(8),
						rs.getInt(9), rs.getInt(10));
				courseReportList.add(cReportList);
			}
			return courseReportList;
		} catch (SQLException e) {
// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	public static ArrayList<User> getUsersList() {
		String sqlQuery = "SELECT * FROM users";
		ArrayList<User> userList = new ArrayList<>();
		Statement st;
		try {
			st = DBConnector.conn.createStatement();
			ResultSet rs = st.executeQuery(sqlQuery);
			while (rs.next()) {
				String username = rs.getString(1);
				String password = rs.getString(2);
				int role = rs.getInt(3);
				String firstName = rs.getString(4);
				String lastName = rs.getString(5);
				String faculty = rs.getString(6);
				String id = rs.getString(7);
				int isLogedIn = rs.getInt(8);
				User Userdata = new User(username, password, role, firstName, lastName, faculty, id, isLogedIn);
				userList.add(Userdata);

			}
			return userList;
		} catch (SQLException e) {
// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
//////////////////////////////////////////END//////////////////////////////////////////////

	public static void importUsersData(String filePath) {
		try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
			String line = reader.readLine();
			for (int i = 0; i < 4; i++) {
				switch (line) {
				case "Subjects:":
					String deleteSubjectTableSql = "DELETE FROM cems.subjects";
					try {
						PreparedStatement deleteSubjectStatement = DBConnector.conn
								.prepareStatement(deleteSubjectTableSql);
						deleteSubjectStatement.executeUpdate();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					while ((line = reader.readLine()) != null && !(line.equals("Courses:"))
							&& !(line.equals("Lecturer Courses:")) && !(line.equals("Users:"))) {
						// Split the line into columns assuming tab-delimited data
						String[] columns = line.split("\t");

						// Prepare the SQL INSERT statement
						String sql = "INSERT INTO cems.subjects VALUES (?, ?)";

						try (PreparedStatement statement = DBConnector.conn.prepareStatement(sql)) {
							// Set the values for each column
							statement.setString(1, columns[0]);
							statement.setString(2, columns[1]);

							// Execute the INSERT statement
							statement.executeUpdate();
						} catch (SQLException e) {
							e.printStackTrace();
						}
					}
					System.out.println("Subjects data imported successfully.");
					break;

				case "Courses:":
					String deleteCoursesTableSql = "DELETE FROM cems.courses";
					try {
						PreparedStatement deleteCoursesStatement = DBConnector.conn
								.prepareStatement(deleteCoursesTableSql);
						deleteCoursesStatement.executeUpdate();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					while ((line = reader.readLine()) != null && !(line.equals("Subjects:"))
							&& !(line.equals("Lecturer Courses:")) && !(line.equals("Users:"))) {
						// Split the line into columns assuming tab-delimited data
						String[] columns = line.split("\t");

						// Prepare the SQL INSERT statement
						String sql = "INSERT INTO cems.courses VALUES (?, ?, ?)";

						try (PreparedStatement statement = DBConnector.conn.prepareStatement(sql)) {
							// Set the values for each column
							statement.setString(1, columns[0]);
							statement.setString(2, columns[1]);
							statement.setString(3, columns[2]);

							// Execute the INSERT statement
							statement.executeUpdate();
						} catch (SQLException e) {
							e.printStackTrace();
						}
					}

					System.out.println("Courses data imported successfully.");
					break;
				case "Users:":
					String deleteUsersTableSql = "DELETE FROM cems.users";
					try {
						PreparedStatement deleteUsersStatement = DBConnector.conn.prepareStatement(deleteUsersTableSql);
						deleteUsersStatement.executeUpdate();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					while ((line = reader.readLine()) != null && !(line.equals("Subjects:"))
							&& !(line.equals("Courses:")) && !(line.equals("Lecturer Courses:"))) {
						// Split the line into columns assuming tab-delimited data
						String[] columns = line.split("\t");

						// Prepare the SQL INSERT statement
						String sql = "INSERT INTO cems.users VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

						try (PreparedStatement statement = DBConnector.conn.prepareStatement(sql)) {
							// Set the values for each column
							statement.setString(1, columns[0]);
							statement.setString(2, columns[1]);
							statement.setString(3, columns[2]);
							statement.setString(4, columns[3]);
							statement.setString(5, columns[4]);
							statement.setString(6, columns[5]);
							statement.setString(7, columns[6]);
							statement.setString(8, columns[7]);

							// Execute the INSERT statement
							statement.executeUpdate();
						} catch (SQLException e) {
							e.printStackTrace();
						}
					}

					System.out.println("Users imported successfully.");
					break;
				case "Lecturer Courses:":
					String deleteLecturerCoursesTableSql = "DELETE FROM cems.lecturercourses";
					try {
						PreparedStatement deleteLecturerCoursesStatement = DBConnector.conn
								.prepareStatement(deleteLecturerCoursesTableSql);
						deleteLecturerCoursesStatement.executeUpdate();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					while ((line = reader.readLine()) != null && !(line.equals("Subjects:"))
							&& !(line.equals("Courses:")) && !(line.equals("Users:"))) {
						// Split the line into columns assuming tab-delimited data
						String[] columns = line.split("\t");

						// Prepare the SQL INSERT statement
						String sql = "INSERT INTO cems.lecturercourses VALUES (?, ?)";

						try (PreparedStatement statement = DBConnector.conn.prepareStatement(sql)) {
							// Set the values for each column
							statement.setString(1, columns[0]);
							statement.setString(2, columns[1]);

							// Execute the INSERT statement
							statement.executeUpdate();
						} catch (SQLException e) {
							e.printStackTrace();
						}
					}

					System.out.println("Lecturer Courses data imported successfully.");

					break;

				default:
					break;
				}
			}

		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public static Boolean lecturerStartExam(ExamToPerform exam) {

		String sqlQuery = "INSERT INTO `cems`.`examinprogress` " + "(`examid`, " + "`type`, " + "`time`, " + "`code`, "
				+ "`extratime`, " + "`status`, " + "`operatorlecturer`, " + "`date`) " + "VALUES "
				+ "(?, ?, ?, ?, ?, ?, ?, ?);";
		try {
			PreparedStatement ps = DBConnector.conn.prepareStatement(sqlQuery);
			ps.setString(1, exam.getExam().getExamID());
			ps.setInt(2, 0);
			ps.setInt(3, Integer.parseInt(exam.getExam().getTime()));
			ps.setInt(4, 4450);
			ps.setInt(5, 0);
			ps.setString(6, "open");
			ps.setString(7, exam.getLecturerName());
			ps.setString(8, "12/6/2023 16:24");
			ps.executeUpdate();

			return true;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return false;
	}

	public static User authLogIn(User user) {
		String username = user.getUsername();
		String password = user.getPassword();

		String sqlQuery = "SELECT * FROM users where username = '" + username + "' and password = '" + password + "'";
		Statement st;
		try {
			st = DBConnector.conn.createStatement();
			ResultSet rs = st.executeQuery(sqlQuery);
			if (rs.next()) {
				int role = rs.getInt(3);
				String firstName = rs.getString(4);
				String lastName = rs.getString(5);
				String faculty = rs.getString(6);
				String id = rs.getString(7);
				int isLogedIn = rs.getInt(8);
				User newUser = new User(username, password, role, firstName, lastName, faculty, id, isLogedIn);

				String sqlUpdateQuery = "UPDATE users SET userStatus = ? where id = ?;";
				PreparedStatement ps = DBConnector.conn.prepareStatement(sqlUpdateQuery);
				ps.setString(1, String.valueOf(1));
				ps.setString(2, String.valueOf(id));
				ps.executeUpdate();

				return newUser;
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	public static void logOut(User user) {
		String sqlUpdateQuery = "UPDATE users SET userStatus = ? where id = ?;";
		PreparedStatement ps;
		try {
			ps = DBConnector.conn.prepareStatement(sqlUpdateQuery);
			ps.setString(1, String.valueOf(0));
			ps.setString(2, String.valueOf(user.getId()));
			ps.executeUpdate();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public static ArrayList<Subject> getSubjectsList(String lecturerID) {

		ArrayList<Subject> subjectslist = new ArrayList<>();
		String sqlQuery = "select DISTINCT S.* " + "FROM lecturercourses L, courses C, subjects S "
				+ "WHERE S.subjectid = C.subjectid AND L.courseid = C.idcourse AND L.lecturerid = ?;";
		try {
			PreparedStatement ps = DBConnector.conn.prepareStatement(sqlQuery);
			ps.setString(1, lecturerID);
			ResultSet rs = ps.executeQuery();

			while (rs.next()) {
				Subject subject = new Subject(rs.getString(1), rs.getString(2));
				subjectslist.add(subject);
			}
			return subjectslist;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return null;
	}

	public static ArrayList<Course> getCoursesList(String lecturerID) {

		ArrayList<Course> courseslist = new ArrayList<>();
		String sqlQuery = "select DISTINCT C.* " + "FROM lecturercourses L, courses C "
				+ "WHERE L.courseid = C.idcourse AND L.lecturerid = ?;";
		try {
			PreparedStatement ps = DBConnector.conn.prepareStatement(sqlQuery);
			ps.setString(1, lecturerID);
			ResultSet rs = ps.executeQuery();

			while (rs.next()) {
				Course course = new Course(rs.getString(1), rs.getString(2), rs.getString(3));
				courseslist.add(course);
			}
			return courseslist;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return null;
	}

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

	public static ArrayList<Exam> getExamsList(String lecturerID) {
		String getExamsSqlQuery = "select E.* " + "FROM exams E " + "WHERE SUBSTRING(E.id, 3, 2) IN ("
				+ "select DISTINCT C.idcourse " + "FROM lecturercourses L, courses C "
				+ "WHERE L.courseid = C.idcourse AND L.lecturerid = ?);";

		String getQuestionsSqlQuery = "select Q.idquest, Q.topic, Q.questtext, Q.answer1, Q.answer2, Q.answer3, Q.answer4, Q.correctanswer, Q.Lecturername, QE.questnumber, QE.questpoints "
				+ "from questions Q, questforexam QE " + "where QE.examid = ? AND QE.questid = Q.idquest;";
		ArrayList<Exam> examsList = new ArrayList<>();
		try {
			if (DBConnector.conn != null) {
				DBConnector.conn.setAutoCommit(false);

				PreparedStatement firstStatement = DBConnector.conn.prepareStatement(getExamsSqlQuery);
				firstStatement.setString(1, lecturerID);
				ResultSet rs = firstStatement.executeQuery();

				while (rs.next()) {
					String examID = rs.getString(1);
					String examSubjectID = examID.substring(0, 2);
					String examSubject = rs.getString(2);
					String examCourseID = examID.substring(2, 4);
					String examCourse = rs.getString(3);
					String examTime = rs.getString(4);
					String examLecturerID = rs.getString(5);
					String examLecturerName = rs.getString(6);
					int numOfQuestions = rs.getInt(7);
					String commentsForLecturer = rs.getString(8);
					String commentsForStudents = rs.getString(9);

					Exam exam = new Exam(examID, examSubjectID, examSubject, examCourseID, examCourse, examTime,
							numOfQuestions, examLecturerID, examLecturerName, commentsForLecturer, commentsForStudents);

					examsList.add(exam);
				}
				for (Exam exam : examsList) {
					ArrayList<QuestionForExam> questions = new ArrayList<>();

					PreparedStatement SecondStatement = DBConnector.conn.prepareStatement(getQuestionsSqlQuery);
					SecondStatement.setString(1, exam.getExamID());
					ResultSet qrs = SecondStatement.executeQuery();
					while (qrs.next()) {
						String questionID = qrs.getString(1);
						String questionSubject = qrs.getString(2);
						String questionText = qrs.getString(3);
						String answer1 = qrs.getString(4);
						String answer2 = qrs.getString(5);
						String answer3 = qrs.getString(6);
						String answer4 = qrs.getString(7);
						int correctAnswer = qrs.getInt(8);
						String lecturerName = qrs.getString(9);
						int questionNumber = qrs.getInt(10);
						int questionPoints = qrs.getInt(11);

						QuestionForExam addedQuestion = new QuestionForExam(questionID, questionSubject, questionText,
								answer1, answer2, answer3, answer4, correctAnswer, lecturerName, questionNumber,
								questionPoints);

						questions.add(addedQuestion);
					}

					exam.setQuestions(questions);
				}

				DBConnector.conn.commit();
				System.out.println("Transaction committed successfully");
				DBConnector.conn.setAutoCommit(true);

				return examsList;
			}
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

	public static ArrayList<StudentExam> getStudentExams(User user) {

		String id = user.getId();
		ArrayList<StudentExam> studentExamsList = new ArrayList<>();
		String sqlQuery = "SELECT * FROM student_exams where studentID = ?";
		try {
			PreparedStatement ps = DBConnector.conn.prepareStatement(sqlQuery);
			ps.setString(1, id);
			ResultSet rs = ps.executeQuery();

			while (rs.next()) {
				String studnetID = rs.getString(1);
				int progressID = rs.getInt(2);
				String examID = rs.getString(3);
				String subject = rs.getString(4);
				String course = rs.getString(5);
				String date = rs.getString(6);
				String startTime = rs.getString(7);
				String endTime = rs.getString(8);
				String duration = rs.getString(9);
				String status = rs.getString(12);
				String grade;
				if (status.equals("checked")) {
					grade = rs.getString(10);
				} else {
					grade = "-";
				}
				String lecturerComments = rs.getString(11);

				StudentExam studentExams = new StudentExam(examID, subject, course, startTime, endTime, duration, grade,
						lecturerComments, status);
				studentExams.setStudentID(studnetID);
				studentExams.setProgressID(progressID);
				studentExamsList.add(studentExams);
			}
			System.out.println(studentExamsList);
			return studentExamsList;
		} catch (SQLException e) {

			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return null;
	}

	/**
	 *
	 * @param exam
	 * @return
	 */
	public static Boolean createNewExam(Exam exam) {
		String createExamSqlQuery = "INSERT INTO `cems`.`exams` "
				+ "SELECT CONCAT(?, ?, LPAD(IFNULL(maxexamnumber, 1), 2, '0')), ?, ?, ?, ?, ?, ?, ?, ?, IFNULL(maxexamnumber, 1) "
				+ "FROM (SELECT MAX(examnumber) + 1 AS maxexamnumber FROM exams) AS subquery;";
		String addQuestionsSqlQuery = "INSERT INTO `cems`.`questforexam` "
				+ "select ?, CONCAT(?, ?, LPAD(IFNULL(maxexamnumber, 1), 2, '0')), ?, ? "
				+ "from (SELECT MAX(examnumber) AS maxexamnumber FROM exams) AS subquery;";
		PreparedStatement firstStatement;

		try {
			if (DBConnector.conn != null) {
				// Start the transaction
				DBConnector.conn.setAutoCommit(false);
				System.out.println("transaction started");
				firstStatement = DBConnector.conn.prepareStatement(createExamSqlQuery);
				firstStatement.setString(1, exam.getSubjectID());
				firstStatement.setString(2, exam.getCourseID());
				firstStatement.setString(3, exam.getSubject());
				firstStatement.setString(4, exam.getCourse());
				firstStatement.setString(5, exam.getTime());
				firstStatement.setString(6, exam.getLecturerID());
				firstStatement.setString(7, exam.getLecturerName());
				firstStatement.setInt(8, exam.getNumOfQuestions());
				firstStatement.setString(9, exam.getCommentsForLecturer());
				firstStatement.setString(10, exam.getCommentsForStudents());
				firstStatement.executeUpdate();
				System.out.println("statment 1 executed");

				PreparedStatement SecondStatement = DBConnector.conn.prepareStatement(addQuestionsSqlQuery);
				for (QuestionForExam question : exam.getQuestions()) {
					SecondStatement.setString(1, question.getQuestionID());
					SecondStatement.setString(2, exam.getSubjectID());
					SecondStatement.setString(3, exam.getCourseID());
					SecondStatement.setInt(4, question.getQuestionNumber());
					SecondStatement.setInt(5, question.getPoints());
					SecondStatement.executeUpdate();
				}

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