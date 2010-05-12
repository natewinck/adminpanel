-- phpMyAdmin SQL Dump
-- version 3.2.4
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: May 12, 2010 at 02:56 PM
-- Server version: 5.1.37
-- PHP Version: 5.2.11

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `adminpanel`
--

-- --------------------------------------------------------

--
-- Table structure for table `pages`
--

CREATE TABLE `pages` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Numeric ID',
  `name` text NOT NULL COMMENT 'Page Name',
  `data` text COMMENT 'B64''d Serialized Data Array',
  `author` int(11) NOT NULL COMMENT 'Author''s UID',
  `rank` int(11) DEFAULT NULL COMMENT 'Minimum Rank Required to View',
  `draft` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Draft?',
  `list` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'List?',
  `locked` tinyint(1) NOT NULL DEFAULT '0',
  `template` text COMMENT 'Template to be used',
  `timestamp` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `pages`
--

INSERT INTO `pages` VALUES(1, 'Bleach', '', 0, -1, 0, 1, 0, 'movies', '2010-05-12 14:38:45');
INSERT INTO `pages` VALUES(2, 'About', NULL, 0, -1, 1, 0, 0, 'html5', '2010-05-12 14:34:41');
