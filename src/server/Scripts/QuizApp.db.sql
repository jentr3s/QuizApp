BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS `Users` (
	`Id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`Name`	TEXT NOT NULL,
	`RoleId`	TEXT,
	`Username`	TEXT NOT NULL UNIQUE,
	`Password`	TEXT NOT NULL
);
INSERT INTO `Users` VALUES (1,'admin','1','admin','admin');
INSERT INTO `Users` VALUES (2,'admin2','1','admin2','admin2');
CREATE TABLE IF NOT EXISTS `Quizzes` (
	`Id`	INTEGER NOT NULL UNIQUE,
	`Name`	TEXT NOT NULL,
	`Description`	TEXT,
	`PreparedBy`	TEXT,
	`IsActive`	INTEGER,
	PRIMARY KEY(`Id`)
);
INSERT INTO `Quizzes` VALUES (1,'Quiz1','Exercise 1','Jen Macaso',1);
CREATE TABLE IF NOT EXISTS `QuizResult` (
	`Id`	INTEGER NOT NULL UNIQUE,
	`QuizId`	INTEGER NOT NULL,
	`StudentName`	TEXT NOT NULL,
	`Result`	TEXT NOT NULL,
	`Answers`	TEXT NOT NULL,
	PRIMARY KEY(`Id`)
);
CREATE TABLE IF NOT EXISTS `Questions` (
	`Id`	INTEGER NOT NULL UNIQUE,
	`Name`	TEXT NOT NULL,
	`QuestionTypeId`	INTEGER NOT NULL,
	`Answer`	TEXT NOT NULL,
	`QuizId`	INTEGER,
	PRIMARY KEY(`Id`)
);
INSERT INTO `Questions` VALUES (1,'Which animal barks',1,'Dog',1);
INSERT INTO `Questions` VALUES (2,'10 + 1',2,'11',1);
INSERT INTO `Questions` VALUES (3,'Which animal swims',1,'Fish',1);
CREATE TABLE IF NOT EXISTS `QuestionType` (
	`Id`	INTEGER NOT NULL,
	`Name`	TEXT NOT NULL,
	`Description`	TEXT,
	PRIMARY KEY(`Id`)
);
INSERT INTO `QuestionType` VALUES (1,'Multiple Choice',NULL);
INSERT INTO `QuestionType` VALUES (2,'Fill in the blank',NULL);
CREATE TABLE IF NOT EXISTS `Options` (
	`Id`	INTEGER NOT NULL UNIQUE,
	`Name`	TEXT NOT NULL,
	`QuestionId`	INTEGER NOT NULL
);
INSERT INTO `Options` VALUES (1,'Dog',1);
INSERT INTO `Options` VALUES (2,'Fish',1);
INSERT INTO `Options` VALUES (3,'Cat',1);
INSERT INTO `Options` VALUES (4,'Bird',3);
INSERT INTO `Options` VALUES (5,'Goat',3);
COMMIT;
