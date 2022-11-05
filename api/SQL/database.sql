-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.25-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for panel
CREATE DATABASE IF NOT EXISTS `panel` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `panel`;

-- Dumping structure for table panel.panel_tickets
CREATE TABLE IF NOT EXISTS `panel_tickets` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Staff` varchar(50) DEFAULT NULL,
  `Type` int(11) DEFAULT NULL,
  `UserData` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`UserData`)),
  `Date` timestamp NULL DEFAULT current_timestamp(),
  `AllowedStaff` int(11) DEFAULT NULL,
  `Reason` varchar(200) DEFAULT NULL,
  `Comment` longtext DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table panel.panel_tickets: ~14 rows (approximately)
INSERT INTO `panel_tickets` (`ID`, `Staff`, `Type`, `UserData`, `Date`, `AllowedStaff`, `Reason`, `Comment`) VALUES
	(1, 'Dani', 3, '[{"username": "asd", "steam": "steam:0123sd2310"}]', '2022-11-05 08:40:30', 1, 'Prueba ticket', 'Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket'),
	(2, 'Dani', 3, '[{"username": "abc", "steam": "steam:0123sd2320"}]', '2022-11-05 08:40:30', 1, 'Prueba ticket', 'Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket'),
	(3, 'Dani', 3, '[{"username": "abc", "steam": "steam:0123sd2320"}]', '2022-11-05 08:40:30', 1, 'Prueba ticket', 'Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket'),
	(4, 'Dani', 3, '[{"username": "abc", "steam": "steam:0123sd2320"}]', '2022-11-05 08:40:30', 1, 'Prueba ticket', 'Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket'),
	(5, 'Dani', 3, '[{"username": "abc", "steam": "steam:0123sd2320"}]', '2022-11-05 08:40:30', 1, 'Prueba ticket', 'Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket'),
	(6, 'Dani', 3, '[{"username": "abc", "steam": "steam:0123sd2320"}]', '2022-11-05 08:40:30', 1, 'Prueba ticket', 'Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket'),
	(7, 'Dani', 3, '[{"username": "abc", "steam": "steam:0123sd2320"}]', '2022-11-05 08:40:30', 1, 'Prueba ticket', 'Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket'),
	(8, 'Dani', 3, '[{"username": "abc", "steam": "steam:0123sd2320"}]', '2022-11-05 08:40:30', 1, 'Prueba ticket', 'Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket'),
	(9, 'Dani', 3, '[{"username": "abc", "steam": "steam:0123sd2320"}]', '2022-11-05 08:40:30', 1, 'Prueba ticket', 'Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket'),
	(10, 'Dani', 3, '[{"username": "abc", "steam": "steam:0123sd2320"}]', '2022-11-05 08:40:30', 1, 'Prueba ticket', 'Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket'),
	(11, 'Dani', 3, '[{"username": "abc", "steam": "steam:0123sd2320"}]', '2022-11-05 08:40:30', 1, 'Prueba ticket', 'Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket'),
	(12, 'Dani', 3, '[{"username": "abc", "steam": "steam:0123sd2320"}]', '2022-11-05 08:40:30', 1, 'Prueba ticket', 'Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket'),
	(13, 'Dani', 3, '[{"username": "abc", "steam": "steam:0123sd2320"}]', '2022-11-05 08:40:30', 1, 'Prueba ticket', 'Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket'),
	(14, 'Dani', 3, '[{"username": "abc", "steam": "steam:0123sd2320"}]', '2022-11-05 08:40:30', 1, 'Prueba ticket', 'Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket Prueba ticket');

-- Dumping structure for table panel.panel_users
CREATE TABLE IF NOT EXISTS `panel_users` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Username` varchar(30) NOT NULL DEFAULT '0',
  `Password` longtext NOT NULL,
  `JoinedDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `Permission` int(11) NOT NULL DEFAULT 0,
  `CreatedBy` varchar(30) NOT NULL DEFAULT '0',
  `Token` longtext NOT NULL,
  `IsDesktop` int(11) NOT NULL DEFAULT 0,
  `IsOnline` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table panel.panel_users: ~3 rows (approximately)
INSERT INTO `panel_users` (`ID`, `Username`, `Password`, `JoinedDate`, `Permission`, `CreatedBy`, `Token`, `IsDesktop`, `IsOnline`) VALUES
	(1, 'dani', 'd4bfe7a94dfec096105a5c6dad62379c', '2022-10-22 11:12:25', 5, 'SQL', '4627b254c35a8882c27a537f40b31cb3f922cb', 0, 0),
	(2, 'panel@panel.com', '8772f9ea83c0192093eaa9b7b3303c6e ', '2022-11-04 21:15:22', 5, 'Panel', '', 0, 0);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
