package DBControl;

import java.sql.*;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;

import controllers.ServerUI;
import entity.*;
import javafx.scene.control.Button;
import java.time.format.DateTimeFormatter;


public class ExamDBController {
	
	public static ArrayList<StudentExamGrade> getLecturerExamReport(ExamDone exam) {
		ArrayList<StudentExamGrade> examslist = new ArrayList<>();
		String sqlQuery = "SELECT studentID, grade "
				+ "FROM `cems`.`student_exams` "
				+ "where porgress_exam_id = ? AND examID = ? AND status = 'checked';";
		try {
			PreparedStatement ps = DBConnector.conn.prepareStatement(sqlQuery);
			ps.setInt(1, exam.getProgressId());
			ps.setString(2, exam.getExamID());
			ResultSet rs = ps.executeQuery();

			while (rs.next()) {
				String id = rs.getString(1);
				int grade = rs.getInt(2);
				
				StudentExamGrade studentExamGrade = new StudentExamGrade(id, grade);
				examslist.add(studentExamGrade);
			}
			return examslist;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		
		return null;
	}
	
	public static Boolean requestExtraTimeExam(ExtraTimeRequest request) {
		
		String sqlQuery = "INSERT INTO `cems`.`change_time_requests` "
				+ "(`exam_progress_id`,"
				+ "`requesterId`,"
				+ "`requesterName`,"
				+ "`pre_duration`,"
				+ "`re_duration`,"
				+ "`subject`,"
				+ "`course`,"
				+ "`reason`,"
				+ "`status`) "
				+ "VALUES "
				+ "(?, ?, ?, ?, ?, ?, ?, ?, ?);";
		try {
			PreparedStatement ps = DBConnector.conn.prepareStatement(sqlQuery);
			ps.setInt(1, request.getProgressId());
			ps.setString(2, request.getRequesterID());
			ps.setString(3, request.getRequesterName());
			ps.setInt(4, request.getTime());
			ps.setInt(5, request.getExtraTime());
			ps.setString(6, request.getSubject());
			ps.setString(7, request.getCourse());
			ps.setString(8, request.getReason());
			ps.setString(9, request.getStatus());
			ps.executeUpdate();

			return true;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return false;
	}
	
	public static ArrayList<ExamDone> getDoneExams(User user) {
		ArrayList<ExamDone> examslist = new ArrayList<>();
		String sqlQuery = "SELECT ED.*, E.subject, E.course "
				+ "FROM examsdone ED, exams E "
				+ "Where ED.examid = E.id AND E.Lecturer_ID = ?;";
		try {
			PreparedStatement ps = DBConnector.conn.prepareStatement(sqlQuery);
			ps.setString(1, user.getId());
			ResultSet rs = ps.executeQuery();

			while (rs.next()) {
				int progressId = rs.getInt(1);
				String id = rs.getString(2);
				int typeIndex = rs.getInt(3);
				String type;
				if (typeIndex == 0) {
					type = "Online";
				} else {
					type = "Manual";
				}
				int time = rs.getInt(4);
				int extraTime = rs.getInt(5);
				String operatorLecturer = rs.getString(6);
				String date = rs.getString(7);
				int numberOfStudents = rs.getInt(8);
				String subject = rs.getString(9);
				String course = rs.getString(10);
				
				ExamDone exam = new ExamDone(id, progressId, subject, course, type, time, extraTime, operatorLecturer, date, numberOfStudents);
				examslist.add(exam);
			}
			return examslist;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return null;
	}
	
	public static Boolean submitStudentExamGrade(SubmitedExamGrade submitedExamGrade) {
		String sqlQuery = "UPDATE `cems`.`student_exams` "
				+ "SET `grade` = ?, `lecturer_comment` = ?, `status` = ? "
				+ "WHERE `studentID` = ? AND `porgress_exam_id` = ? AND `examID` = ?;";
		try {
			System.out.println(submitedExamGrade);
			PreparedStatement ps = DBConnector.conn.prepareStatement(sqlQuery);
			ps.setString(1, Integer.toString(submitedExamGrade.getGrade()));
			ps.setString(2, submitedExamGrade.getComments());
			ps.setString(3, "checked");
			ps.setString(4, submitedExamGrade.getStudentID());
			ps.setInt(5, submitedExamGrade.getProgressID());
			ps.setString(6, submitedExamGrade.getExamID());
			ps.executeUpdate();

			return true;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return false;
	}
	
	
	public static StudentExamToCheck getStudentExamDone(StudentExam studentExam) {
		String getExamsSqlQuery = "select E.* " + 
				"FROM exams E " + 
				"WHERE E.id = ?";

		String getQuestionsSqlQuery = "select Q.idquest, Q.topic, Q.questtext, Q.answer1, Q.answer2, Q.answer3, Q.answer4, Q.correctanswer, Q.Lecturername, QE.questnumber, QE.questpoints " + 
				"from questions Q, questforexam QE " + 
				"where QE.examid = ? AND QE.questid = Q.idquest;";
		
		String getQuestionsAnswersSqlQuery = "select * " + 
				"from answersstudentforexam " + 
				"where s_exam_id = ? AND student_id = ?;";
		
		Exam exam = new Exam();
		StudentExamToCheck examDone;
		try {
			if (DBConnector.conn != null) {
				DBConnector.conn.setAutoCommit(false);

				PreparedStatement firstStatement = DBConnector.conn.prepareStatement(getExamsSqlQuery);
				firstStatement.setString(1, studentExam.getExamID());
				ResultSet rs = firstStatement.executeQuery();

				if (rs.next()) {
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

					exam = new Exam(examID, examSubjectID, examSubject, examCourseID, examCourse, examTime, numOfQuestions, examLecturerID,
							examLecturerName, commentsForLecturer, commentsForStudents);	
				}
				
				ArrayList<QuestionForExam> questions = new ArrayList<>();

				PreparedStatement SecondStatement = DBConnector.conn.prepareStatement(getQuestionsSqlQuery);
				SecondStatement.setString(1, studentExam.getExamID());
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
				
				ArrayList<StudentQuestionAnswer> questionsAnswers = new ArrayList<>();

				PreparedStatement ThirdStatement = DBConnector.conn.prepareStatement(getQuestionsAnswersSqlQuery);
				ThirdStatement.setInt(1, studentExam.getProgressID());
				ThirdStatement.setString(2, studentExam.getStudentID());
				
				System.out.println(studentExam.getProgressID());
				System.out.println(studentExam.getStudentID());
				
				ResultSet qars = ThirdStatement.executeQuery();
				
				while (qars.next()) {
					String questionID = qars.getString(3);
					int questionAnswer = qars.getInt(4);

					StudentQuestionAnswer answer = new StudentQuestionAnswer(questionID, questionAnswer);

					questionsAnswers.add(answer);
				}
				
				examDone = new StudentExamToCheck(studentExam.getStudentID(), studentExam.getProgressID(), exam, questionsAnswers);

				DBConnector.conn.commit();
				System.out.println("Transaction committed successfully");
				DBConnector.conn.setAutoCommit(true);

				return examDone;
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	
	public static ArrayList<StudentExam> getStudentsExams(User user) {
		String id = user.getId();
		
		ArrayList<StudentExam> studentsExamsList = new ArrayList<>();
		String sqlQuery = "SELECT SE.* "
				+ "FROM student_exams SE, exams E "
				+ "where SE.examID = E.id AND E.Lecturer_ID = ? AND SE.status = ?";
		try {
			PreparedStatement ps = DBConnector.conn.prepareStatement(sqlQuery);
			ps.setString(1, id);
			ps.setString(2, "unchecked");
			ResultSet rs = ps.executeQuery();

			while (rs.next()) {
				String studnetID = rs.getString(1);
				int progressID = rs.getInt(2);
				String examID = rs.getString(3);
				String subject = rs.getString(4);
				 String course = rs.getString(5);
				 String startTime = rs.getString(7);
				 String endTime = rs.getString(8);
				 String duration = rs.getString(9);
				 String status = rs.getString(12);
				 String grade;
				 if (status.equals("checked")) {
					 grade = rs.getString(10);
				 }else {
					 grade = "-";
				 }
				 String lecturerComments = rs.getString(9);

				StudentExam studentExams = new StudentExam(examID, subject, course, startTime, endTime, duration, grade, lecturerComments, status);
				studentExams.setStudentID(studnetID);
				studentExams.setProgressID(progressID);
				studentsExamsList.add(studentExams);
			}

			return studentsExamsList;
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

					Exam exam = new Exam(examID, examSubjectID, examSubject, examCourseID, examCourse, examTime, numOfQuestions, examLecturerID,
							examLecturerName, commentsForLecturer, commentsForStudents);

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

	public static Boolean lecturerStartExam(ExamToPerform exam) {

		String sqlQuery = "INSERT INTO `cems`.`examinprogress` "
				+ "(`examid`, " + "`type`, " + "`time`, " + "`code`, " + "`extratime`, " + "`status`, "
				+ "`operatorlecturer`, " + "`date`) " + "VALUES " + "(?, ?, ?, ?, ?, ?, ?, ?);";
		try {
			PreparedStatement ps = DBConnector.conn.prepareStatement(sqlQuery);
			ps.setString(1, exam.getExam().getExamID());
			ps.setInt(2, exam.getType());
			ps.setInt(3, Integer.parseInt(exam.getExam().getTime()));
			ps.setString(4, exam.getCode());
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
	
	public static void lockExam(ExamInProgress examToLock) {
		String updateExamSubmitExamSqlQuery = "UPDATE `cems`.`examinprogress` "
				+ "SET `status` = 'Locked' "
				+ "WHERE `examinprogressid` = ? AND `examid` = ? AND NOT exists ("
				+ "select E.porgress_exam_id "
				+ "from examprogressforstudent E "
				+ "where E.porgress_exam_id = examinprogressid AND E.exam_id = examid);";
		
		PreparedStatement updateStatusStatment;
		try {
			if (DBConnector.conn != null) {
				// Start the transaction
				DBConnector.conn.setAutoCommit(false);
				updateStatusStatment = DBConnector.conn.prepareStatement(updateExamSubmitExamSqlQuery);
				
				updateStatusStatment.setInt(1, examToLock.getProgressId());
				updateStatusStatment.setString(2, examToLock.getExamID());
				updateStatusStatment.executeUpdate();
	
				// Commit the transaction
				DBConnector.conn.commit();
				System.out.println("Transaction committed successfully");
				DBConnector.conn.setAutoCommit(true);
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
	}

	public static ArrayList<ExamInProgress> getInProgressExams(User user) {
		ArrayList<ExamInProgress> examslist = new ArrayList<>();
		String sqlQuery = "SELECT E.*, EX.id, EX.subject, EX.course "
				+ "FROM examinprogress E, exams EX "
				+ "where E.examid = EX.id AND EX.Lecturer_ID = ? AND E.status = ?";
		try {
			PreparedStatement ps = DBConnector.conn.prepareStatement(sqlQuery);
			ps.setString(1, user.getId());
			ps.setString(2, "open");
			ResultSet rs = ps.executeQuery();

			while (rs.next()) {
				int progressId = rs.getInt(1);
				int typeIndex = rs.getInt(3);
				String type;
				if (typeIndex == 0) {
					type = "Online";
				} else {
					type = "Manual";
				}
				int time = rs.getInt(4);
				String code = rs.getString(5);
				int extraTime = rs.getInt(6);
				String status = rs.getString(7);
				String operatorLecturer = rs.getString(8);
				String date = rs.getString(9);
				String id = rs.getString(12);
				String subject = rs.getString(13);
				String course = rs.getString(14);
				System.out.println(id);
				
				ExamInProgress exam = new ExamInProgress(id, progressId, subject, course, type, time, code, extraTime, status, operatorLecturer, date);
				examslist.add(exam);
			}
			return examslist;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return null;
	}

	public static Boolean submitExamAnswers(StudentSubmitedExam examData) {
		String updateStudentExamAnswersSqlQuery = "INSERT INTO `cems`.`answersstudentforexam` " + 
				"VALUES " + "(?, ?, ?, ?);";
		String setExamSqlQuery = "INSERT INTO `cems`.`student_exams` "
				+ "(`studentID`, "
				+ "`porgress_exam_id`, "
				+ "`examID`, "
				+ "`subject`, "
				+ "`course`, "
				+ "`date`, "
				+ "`start_time`, "
				+ "`submit_time`, "
				+ "`duration`, "
				+ "`grade`, "
				+ "`lecturer_comment`, "
				+ "`status`) "
				+ "VALUES "
				+ "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', 'unchecked');";
		
		String deleteExamFromProgressSqlQuery = "DELETE FROM `cems`.`examprogressforstudent` "
				+ "WHERE studentID = ? AND exam_id = ?;";
		
		String updateExamSubmitExamSqlQuery = "UPDATE `cems`.`examinprogress` "
				+ "SET `status` = 'Locked' "
				+ "WHERE `examinprogressid` = ? AND `examid` = ? AND NOT exists ("
				+ "select E.porgress_exam_id "
				+ "from examprogressforstudent E "
				+ "where E.porgress_exam_id = examinprogressid AND E.exam_id = examid);";
		
		String addToExamsDoneSqlQuery = "INSERT INTO `cems`.`examsdone` "
				+ "Select examinprogressid, examid, type, time, extratime, operatorlecturer, date, num_of_students "
				+ "from examinprogress "
				+ "WHERE `examinprogressid` = ? AND `examid` = ? AND NOT exists ("
				+ "select E.porgress_exam_id "
				+ "from examprogressforstudent E "
				+ "where E.porgress_exam_id = examinprogressid AND E.exam_id = examid);";
		
		PreparedStatement updateAnswersStatment;
		try {
			if (DBConnector.conn != null) {
				// Start the transaction
				DBConnector.conn.setAutoCommit(false);
				System.out.println("transaction started");
				updateAnswersStatment = DBConnector.conn.prepareStatement(updateStudentExamAnswersSqlQuery);
				
				for (StudentQuestionAnswer answer : examData.getAnswers()) {
					updateAnswersStatment.setInt(1, examData.getProgressId());
					updateAnswersStatment.setString(2, examData.getStudentID());
					updateAnswersStatment.setString(3, answer.getQuestionID());
					updateAnswersStatment.setInt(4, answer.getQuestionAnswer());
					updateAnswersStatment.executeUpdate();
				}
				
				PreparedStatement setExamStatment = DBConnector.conn.prepareStatement(setExamSqlQuery);
				setExamStatment.setString(1, examData.getStudentID());
				setExamStatment.setInt(2, examData.getProgressId());
				setExamStatment.setString(3, examData.getExamID());
				setExamStatment.setString(4, examData.getSubject());
				setExamStatment.setString(5, examData.getCourse());
				setExamStatment.setString(6, ServerUI.dateFormat());
				setExamStatment.setString(7, examData.getStartTime());
				setExamStatment.setString(8, examData.getEndTime());
				setExamStatment.setString(9, examData.getDuration());
				setExamStatment.setString(10, Integer.toString(examData.getExamGrade()));
				setExamStatment.executeUpdate();
				
				
				PreparedStatement deleteExamProgressStatment = DBConnector.conn.prepareStatement(deleteExamFromProgressSqlQuery);
				deleteExamProgressStatment.setString(1, examData.getStudentID());
				deleteExamProgressStatment.setString(2, examData.getExamID());
				
				deleteExamProgressStatment.executeUpdate();
				
				PreparedStatement updateExamStudentNumberStatment = DBConnector.conn.prepareStatement(updateExamSubmitExamSqlQuery);
				updateExamStudentNumberStatment.setInt(1, examData.getProgressId());
				updateExamStudentNumberStatment.setString(2, examData.getExamID());
				updateExamStudentNumberStatment.executeUpdate();
				
				PreparedStatement addToExamsDoneStatment = DBConnector.conn.prepareStatement(addToExamsDoneSqlQuery);
				addToExamsDoneStatment.setInt(1, examData.getProgressId());
				addToExamsDoneStatment.setString(2, examData.getExamID());
				addToExamsDoneStatment.executeUpdate();
				
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
	
	public static StudentExamInProgress getExamByCode(StudentStartExam student) {
		String checkExamSqlQuery = "SELECT E.porgress_exam_id "
				+ "FROM examprogressforstudent E, student_exams SE, examinprogress EIP "
				+ "WHERE E.studentID = ? "
				+ "   OR (SE.studentID = ? "
				+ "       AND SE.porgress_exam_id = EIP.examinprogressid "
				+ "       AND EIP.`code` = ? "
				+ "       AND EIP.examinprogressid = E.porgress_exam_id);";

		String getExamSqlQuery = "SELECT E.*, EIP.examinprogressid, EIP.type, EIP.extratime, EIP.status "
				+ "FROM examinprogress EIP, exams E "
				+ "where EIP.code = ? AND EIP.status = ? AND EIP.examid = E.id AND EIP.examID NOT IN("
				+ "select SE.examID "
				+ "from student_exams SE "
				+ "where SE.studentID = ?);";

		String getQuestionsSqlQuery = "select Q.idquest, Q.topic, Q.questtext, Q.answer1, Q.answer2, Q.answer3, Q.answer4, Q.correctanswer, Q.Lecturername, QE.questnumber, QE.questpoints "
				+ "from questions Q, questforexam QE " + "where QE.examid = ? AND QE.questid = Q.idquest;";

		String updateStudentExamSqlQuery = "INSERT INTO `cems`.`examprogressforstudent` " + 
				"(`porgress_exam_id`, "
				+ "`exam_id`," + 
				"`studentID`, " + 
				"`date`, " + 
				"`started_time`) " + 
				"VALUES " + 
				"(?, ?, ?, ?, ?);";
		
		String updateExamStudentNumberSqlQuery = "UPDATE `cems`.`examinprogress` SET num_of_students = num_of_students + 1 WHERE examinprogressid = ? AND examid = ?;";

		Exam exam = null;
		StudentExamInProgress studentExam = null;
		try {
			if (DBConnector.conn != null) {
				// Start the transaction
				DBConnector.conn.setAutoCommit(false);
				
				PreparedStatement checkStatement = DBConnector.conn.prepareStatement(checkExamSqlQuery);
				checkStatement.setString(1, student.getStudentID());
				checkStatement.setString(2, student.getStudentID());
				checkStatement.setString(3, student.getExamCode());
				ResultSet checkrs = checkStatement.executeQuery();
				
				if (checkrs.next()) {
					System.out.println(checkrs.getInt(1));
					return null;
				}
				
				PreparedStatement ps = DBConnector.conn.prepareStatement(getExamSqlQuery);
				ps.setString(1, student.getExamCode());
				ps.setString(2, "open");
				ps.setString(3, student.getStudentID());
				ResultSet rs = ps.executeQuery();
				
				System.out.println("Query 1 Completed");
				
				if (rs.next()) {
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

					exam = new Exam(examID, examSubjectID, examSubject, examCourseID, examCourse, examTime, numOfQuestions, examLecturerID,
							examLecturerName, commentsForLecturer, commentsForStudents);
//					exam = new Exam(rs.getString(1), rs.getString(2), rs.getString(3), rs.getString(4), rs.getInt(7),
//							rs.getString(5), rs.getString(6), rs.getString(7), rs.getString(8));

					studentExam = new StudentExamInProgress(rs.getInt(11), rs.getInt(12), rs.getInt(13), rs.getString(14));
					
					ArrayList<QuestionForExam> questions = new ArrayList<>();

					PreparedStatement SecondStatement = DBConnector.conn.prepareStatement(getQuestionsSqlQuery);
					SecondStatement.setString(1, exam.getExamID());
					ResultSet qrs = SecondStatement.executeQuery();
					
					System.out.println("Query 2 Completed");
					
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
					
					studentExam.setExam(exam);
				}else {
					return null;
				}
				LocalTime currentTime = LocalTime.now();
		        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
		        String formattedTime = currentTime.format(formatter);
		        LocalDate currentDate = LocalDate.now();
		        
				PreparedStatement ThirdStatement = DBConnector.conn.prepareStatement(updateStudentExamSqlQuery);
				System.out.println(studentExam.getProgressId());
				ThirdStatement.setInt(1, studentExam.getProgressId());
				ThirdStatement.setString(2, studentExam.getExam().getExamID());
				ThirdStatement.setString(3, student.getStudentID());
				ThirdStatement.setString(4, currentDate.toString());
				ThirdStatement.setString(5, formattedTime);
				
				ThirdStatement.executeUpdate();
				
				System.out.println("Query 3 Completed");
				
				PreparedStatement updateExamStudentNumberStatment = DBConnector.conn.prepareStatement(updateExamStudentNumberSqlQuery);
				updateExamStudentNumberStatment.setInt(1, studentExam.getProgressId());
				updateExamStudentNumberStatment.setString(2, studentExam.getExam().getExamID());
				updateExamStudentNumberStatment.executeUpdate();

				// Commit the transaction
				DBConnector.conn.commit();
				System.out.println("Transaction committed successfully");
				DBConnector.conn.setAutoCommit(true);
				return studentExam;
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return null;
	}

//	public static ArrayList<StudentExam> getStudentExams(User user) {
//
//		String id = user.getId();
//		ArrayList<StudentExam> studentExamsList = new ArrayList<>();
//		String sqlQuery = "SELECT * FROM student_exams where studentID = ?";
//		try {
//			PreparedStatement ps = DBConnector.conn.prepareStatement(sqlQuery);
//			ps.setString(1, id);
//			ResultSet rs = ps.executeQuery();
//
//			while (rs.next()) {
//				StudentExam studentExams = new StudentExam(rs.getString(5), rs.getString(3), rs.getString(2),
//						rs.getString(4), rs.getString(6), null);
//				studentExamsList.add(studentExams);
//			}
//			System.out.println(studentExamsList);
//			return studentExamsList;
//		} catch (SQLException e) {
//
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//
//		return null;
//	}

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
				System.out.println("subject ID : " + exam.getSubjectID());
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
}