package entity;

public enum MessageType {
////////System Messages Type////////////
	//-- Messages From Client
	LogIn,
	LogOut,
	SystemExit,
	
	//-- Messages From Server
	LogInSucceeded,
	LogInFailed,
	LogOutSucceeded,
	
	
////////Exams Messages Type////////////
	CreateNewExam,
	InProgressExamsList,
	UpdateStatus,
	GetCoursesList,
	GetSubjectsList,
	GetExamsList,
	CreateExamSucceeded,
	CreateExamFail,
	LecturerStartExam,
	ExamStartedSuccessfuly,
	ExamStartFail,
	
	GetExamByCode,
	GetStudentExams,
	SubmitStudentOnlineExam,
	SubmitStudentManualExam,
	
	ExamSubmitSucceeded,
	ExamSubmitFail,
	
	GetStudentsExams,
	GetStudentExamToCheck,
	
	SubmitExamGrade,
	
	SubmitExamGradeSucceeded,
	SubmitExamGradeFailed,
	
	GetLecturerExamReport,
	
	LockExam,
	RequestExtraTime,
	RequestExtraSucceeded,
	RequestExtraFailed,
	
	GetDoneExams,
	
////////Questions Messages Type////////////
	//-- Messages From Client
	CreateNewQuestion,
	GetAllQuestion,
	UpdateQuestionData,
	DeleteQuestion,
	
	//-- Messages From Server
	CreateQuestionSucceeded,
	CreateQuestionFailed,
	QuestionList,
	QuestionUpdateSucceeded,
	QuestionUpdateFailed,
	QuestionDeleteSucceeded,
	QuestionDeleteFailed,
	
	//NEW TO REQUEST DH
	SearchRequest,
	ListNotExits,
	ListRequestsForDH,
	approveTheRequest,
	declineTheRequest,
	
	//New To STD Report DH
	ListStdReportsDH,
	//New To Lec Report DH
	ListLecReportsDH,
	//New To Lec Report DH
	ListCourseReportsDH,
	
	
	//NEW TO BANK EXAM DH
	GetCoursesListDH,
	GetSubjectsListDH,
	GetAllExamsListDH,
	GetExamData,
	GetAllExamQuestion,
	//NEW TO BANK QUISTIONS DH
	GetQuestionsListDH,
	
	GetUsersList;
}