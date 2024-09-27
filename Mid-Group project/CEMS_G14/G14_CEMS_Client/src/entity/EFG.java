package entity;
// Java program to create a Word document
// Importing Spire Word libraries

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;

import com.spire.doc.Document;
import com.spire.doc.FileFormat;
import com.spire.doc.Section;
import com.spire.doc.documents.BuiltinStyle;
import com.spire.doc.documents.HorizontalAlignment;
import com.spire.doc.documents.Paragraph;
import com.spire.doc.documents.ParagraphStyle;
import com.spire.doc.formatting.ParagraphFormat;

public class EFG {

	public Boolean createAndSaveExamDoc(StudentExamInProgress exam) {

		// create a Word document
		Document document = new Document();

		// Add a section
		Section section = document.addSection();

		// Customize a paragraph style
		ParagraphStyle style = new ParagraphStyle(document);

		// Paragraph name
		style.setName("paraStyle");
		// Paragraph format
		style.getCharacterFormat().setFontName("Arial");
		// Paragraph font size
		style.getCharacterFormat().setFontSize(11f);
		// Adding styles using inbuilt method
		document.getStyles().add(style);
		
		
		// Add a heading
		Paragraph heading = section.addParagraph();
		heading.appendText("CEMS");
		heading.applyStyle(BuiltinStyle.Heading_1);
		ParagraphFormat format = heading.getFormat();
		format.setHorizontalAlignment(HorizontalAlignment.Center);
		


		Paragraph examInfo = section.addParagraph();
		examInfo.appendText("Exam Code: " + exam.getExam().getExamID());
		examInfo.appendText(".\nSubject: " + exam.getExam().getSubjectID() + " - " +  exam.getExam().getSubject());
		examInfo.appendText(".\nCourse: " + exam.getExam().getCourseID() + " - " +  exam.getExam().getCourse());
		examInfo.appendText(".\nDuration: " + exam.getExam().getTime() + " Minutes");
		examInfo.appendText(".\nLecturer Name: " + exam.getExam().getLecturerName() + "");
		examInfo.applyStyle(BuiltinStyle.Heading_3);

		Paragraph instructions = section.addParagraph();
		instructions.appendText("\nInstructions:");
		instructions.applyStyle(BuiltinStyle.Heading_2);

		Paragraph instructionsText = section.addParagraph();
		instructionsText.appendText("1. This exam consists of [Insert Number of Questions] multiple-choice questions.\n");
		instructionsText.appendText("2. Each question has four answer choices, labeled A, B, C, and D.\n");
		instructionsText.appendText("3. Choose the letter corresponding to the correct answer for each question.\n");
		instructionsText.appendText("4. Only one answer is correct for each question.\n");
		instructionsText.appendText("6. Read each question carefully and select the best answer.\n");
		instructionsText.appendText("5. Mark your answers on this exam sheet.\n");
		instructionsText.appendText("6. When you finish the exam, you will get additional one minute to upload the exam sheet.");
		instructionsText.applyStyle(BuiltinStyle.Heading_6);

		Paragraph importantNote = section.addParagraph();
		importantNote.appendText("\nImportant Note:");
		importantNote.applyStyle(BuiltinStyle.Heading_2);

		Paragraph notes = section.addParagraph();
		notes.appendText(exam.getExam().getCommentsForStudents());
		notes.applyStyle(BuiltinStyle.Heading_6);
		
		ArrayList<QuestionForExam> questions = exam.getExam().getQuestions();
		
		Collections.sort(questions, new Comparator<QuestionForExam>() {
            @Override
            public int compare(QuestionForExam q1, QuestionForExam q2) {
                return Integer.compare(q1.getQuestionNumber(), q2.getQuestionNumber());
            }
        });
		
		for (QuestionForExam questionForExam : questions) {
			// Add a subheading
			Paragraph questionNumber = section.addParagraph();
			questionNumber.appendText("\nQuestion " + questionForExam.getQuestionNumber() + ": " + "(" + questionForExam.getPoints() + " Points).");
			questionNumber.applyStyle(BuiltinStyle.Heading_2);

			
			Paragraph question = section.addParagraph();
			question.appendText(questionForExam.getQuestionText());
			question.applyStyle(BuiltinStyle.Heading_5);
			// Adding paragraph 1
			Paragraph questionAnswers = section.addParagraph();
//			questionAnswers.appendText(questionForExam.getQuestionText());
			questionAnswers.appendText(" A. " + questionForExam.getAnswer1());
			questionAnswers.appendText("\n B. " + questionForExam.getAnswer2());
			questionAnswers.appendText("\n C. " + questionForExam.getAnswer3());
			questionAnswers.appendText("\n D. " + questionForExam.getAnswer4());
			questionAnswers.applyStyle("paraStyle");
		}
		
		
		// Apply built-in style to heading and subheadings
		// so that it is easily distinguishable
		

		// Iteration for white spaces
		for (int i = 0; i < section.getParagraphs().getCount(); i++) {

			// Automatically add whitespaces
			// to every paragraph in the file
			section.getParagraphs().get(i).getFormat().setAfterAutoSpacing(true);
		}

		// Save the document
		try {
			String home = System.getProperty("user.home");
			document.saveToFile(home + "/Downloads/CEMS_Exam_" + exam.getProgressId() + ".docx", FileFormat.Docx);
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println("Exam creating fail");
			return false;
		}
		System.out.println("Exam Created Successfuly");
		return true;
	}
}
