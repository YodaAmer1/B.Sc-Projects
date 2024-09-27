CREATE DATABASE  IF NOT EXISTS `cems` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `cems`;
-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: localhost    Database: cems
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `answersstudentforexam`
--

DROP TABLE IF EXISTS `answersstudentforexam`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `answersstudentforexam` (
  `s_exam_id` int NOT NULL,
  `student_id` varchar(45) NOT NULL,
  `quest_id` varchar(45) NOT NULL,
  `student_answer` int DEFAULT NULL,
  PRIMARY KEY (`s_exam_id`,`student_id`,`quest_id`),
  KEY `answersStudentS_idFK_idx` (`student_id`),
  KEY `answersQuestS_idFK_idx` (`quest_id`),
  CONSTRAINT `answersQuestS_idFK` FOREIGN KEY (`quest_id`) REFERENCES `questions` (`idquest`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `answersStudentS_idFK` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `examinprogress1_idFK` FOREIGN KEY (`s_exam_id`) REFERENCES `examinprogress` (`examinprogressid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answersstudentforexam`
--

LOCK TABLES `answersstudentforexam` WRITE;
/*!40000 ALTER TABLE `answersstudentforexam` DISABLE KEYS */;
/*!40000 ALTER TABLE `answersstudentforexam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `change_time_requests`
--

DROP TABLE IF EXISTS `change_time_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `change_time_requests` (
  `id_request` int NOT NULL AUTO_INCREMENT,
  `exam_progress_id` int NOT NULL,
  `requesterId` int DEFAULT NULL,
  `requesterName` varchar(45) DEFAULT NULL,
  `pre_duration` int DEFAULT NULL,
  `re_duration` int NOT NULL,
  `subject` varchar(45) DEFAULT NULL,
  `course` varchar(45) DEFAULT NULL,
  `reason` varchar(45) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_request`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `change_time_requests`
--

LOCK TABLES `change_time_requests` WRITE;
/*!40000 ALTER TABLE `change_time_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `change_time_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `idcourse` varchar(45) NOT NULL,
  `course` varchar(100) DEFAULT NULL,
  `subjectid` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idcourse`),
  KEY `subject_idFK` (`subjectid`),
  CONSTRAINT `subject_idFK` FOREIGN KEY (`subjectid`) REFERENCES `subjects` (`subjectid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `examinprogress`
--

DROP TABLE IF EXISTS `examinprogress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `examinprogress` (
  `examinprogressid` int NOT NULL AUTO_INCREMENT,
  `examid` varchar(45) NOT NULL,
  `type` int DEFAULT '0',
  `time` int DEFAULT NULL,
  `code` varchar(45) DEFAULT NULL,
  `extratime` int DEFAULT '0',
  `status` varchar(45) DEFAULT NULL,
  `operatorlecturer` varchar(45) DEFAULT NULL,
  `date` varchar(45) DEFAULT NULL,
  `num_of_students` int DEFAULT '0',
  `num_of_submited_students` int DEFAULT '0',
  PRIMARY KEY (`examinprogressid`,`examid`),
  KEY `examIDFK_idx` (`examid`),
  CONSTRAINT `examIDFK` FOREIGN KEY (`examid`) REFERENCES `exams` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=136 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `examinprogress`
--

LOCK TABLES `examinprogress` WRITE;
/*!40000 ALTER TABLE `examinprogress` DISABLE KEYS */;
/*!40000 ALTER TABLE `examinprogress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `examprogressforstudent`
--

DROP TABLE IF EXISTS `examprogressforstudent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `examprogressforstudent` (
  `porgress_exam_id` int NOT NULL,
  `exam_id` varchar(45) NOT NULL,
  `studentID` varchar(45) NOT NULL,
  `date` varchar(45) DEFAULT NULL,
  `started_time` varchar(45) DEFAULT NULL,
  `submit_time` varchar(45) DEFAULT NULL,
  `duration` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`porgress_exam_id`,`studentID`),
  KEY `FKstudentProg_ID_idx` (`studentID`),
  KEY `examinporgress2_idFK` (`porgress_exam_id`,`exam_id`),
  CONSTRAINT `examinporgress2_idFK` FOREIGN KEY (`porgress_exam_id`, `exam_id`) REFERENCES `examinprogress` (`examinprogressid`, `examid`),
  CONSTRAINT `FKstudentProg_ID` FOREIGN KEY (`studentID`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `examprogressforstudent`
--

LOCK TABLES `examprogressforstudent` WRITE;
/*!40000 ALTER TABLE `examprogressforstudent` DISABLE KEYS */;
/*!40000 ALTER TABLE `examprogressforstudent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exams`
--

DROP TABLE IF EXISTS `exams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exams` (
  `id` varchar(45) NOT NULL,
  `subject` varchar(45) DEFAULT NULL,
  `course` varchar(45) DEFAULT NULL,
  `time` varchar(45) DEFAULT NULL,
  `Lecturer_ID` varchar(45) DEFAULT NULL,
  `Lecturer_name` varchar(45) DEFAULT NULL,
  `num_of_questions` int DEFAULT NULL,
  `comment_for_lecturer` longtext,
  `comments_for_student` longtext,
  `examnumber` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idFK_Lecturer_idx` (`Lecturer_ID`),
  CONSTRAINT `idFK_Lecturer` FOREIGN KEY (`Lecturer_ID`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exams`
--

LOCK TABLES `exams` WRITE;
/*!40000 ALTER TABLE `exams` DISABLE KEYS */;
/*!40000 ALTER TABLE `exams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `examsdone`
--

DROP TABLE IF EXISTS `examsdone`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `examsdone` (
  `examinprogressid` int NOT NULL AUTO_INCREMENT,
  `examid` varchar(45) NOT NULL,
  `type` int DEFAULT '0',
  `time` int DEFAULT NULL,
  `extratime` int DEFAULT '0',
  `operatorlecturer` varchar(45) DEFAULT NULL,
  `date` varchar(45) DEFAULT NULL,
  `num_of_students` int DEFAULT '0',
  PRIMARY KEY (`examinprogressid`,`examid`),
  KEY `examIDFK_idx` (`examid`),
  CONSTRAINT `examIDFK_idx` FOREIGN KEY (`examid`) REFERENCES `exams` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=132 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `examsdone`
--

LOCK TABLES `examsdone` WRITE;
/*!40000 ALTER TABLE `examsdone` DISABLE KEYS */;
/*!40000 ALTER TABLE `examsdone` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lecturercourses`
--

DROP TABLE IF EXISTS `lecturercourses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lecturercourses` (
  `lecturerid` varchar(45) NOT NULL,
  `courseid` varchar(45) NOT NULL,
  PRIMARY KEY (`lecturerid`,`courseid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lecturercourses`
--

LOCK TABLES `lecturercourses` WRITE;
/*!40000 ALTER TABLE `lecturercourses` DISABLE KEYS */;
/*!40000 ALTER TABLE `lecturercourses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questforexam`
--

DROP TABLE IF EXISTS `questforexam`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questforexam` (
  `questid` varchar(45) NOT NULL,
  `examid` varchar(45) NOT NULL,
  `questnumber` int NOT NULL DEFAULT '0',
  `questpoints` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`questid`,`examid`),
  KEY `answerFKquestions_idx` (`questid`),
  KEY `examid` (`examid`),
  CONSTRAINT `questforexam_ibfk_1` FOREIGN KEY (`examid`) REFERENCES `exams` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questforexam`
--

LOCK TABLES `questforexam` WRITE;
/*!40000 ALTER TABLE `questforexam` DISABLE KEYS */;
/*!40000 ALTER TABLE `questforexam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questions` (
  `idquest` varchar(45) NOT NULL,
  `topic` varchar(45) DEFAULT NULL,
  `questtext` longtext,
  `answer1` varchar(45) DEFAULT NULL,
  `answer2` varchar(45) DEFAULT NULL,
  `answer3` varchar(45) DEFAULT NULL,
  `answer4` varchar(45) DEFAULT NULL,
  `correctanswer` int NOT NULL,
  `Lecturername` varchar(45) DEFAULT NULL,
  `questnumber` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`idquest`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_exams`
--

DROP TABLE IF EXISTS `student_exams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_exams` (
  `studentID` varchar(45) NOT NULL,
  `porgress_exam_id` int NOT NULL,
  `examID` varchar(45) NOT NULL,
  `subject` varchar(45) DEFAULT NULL,
  `course` varchar(45) DEFAULT NULL,
  `date` varchar(45) DEFAULT NULL,
  `start_time` varchar(45) DEFAULT NULL,
  `submit_time` varchar(45) DEFAULT NULL,
  `duration` varchar(45) DEFAULT NULL,
  `grade` varchar(45) DEFAULT '0',
  `lecturer_comment` varchar(45) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`studentID`,`porgress_exam_id`,`examID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_exams`
--

LOCK TABLES `student_exams` WRITE;
/*!40000 ALTER TABLE `student_exams` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_exams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subjects` (
  `subjectid` varchar(45) NOT NULL,
  `subject` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`subjectid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subjects`
--

LOCK TABLES `subjects` WRITE;
/*!40000 ALTER TABLE `subjects` DISABLE KEYS */;
/*!40000 ALTER TABLE `subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `username` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `role` int NOT NULL,
  `firstname` varchar(45) DEFAULT NULL,
  `lastname` varchar(45) DEFAULT NULL,
  `faculty` varchar(45) DEFAULT NULL,
  `id` varchar(45) NOT NULL,
  `userStatus` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-19 20:25:33
