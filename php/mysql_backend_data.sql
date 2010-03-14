-- phpMyAdmin SQL Dump
-- version 3.2.0.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Mar 14, 2010 at 10:02 PM
-- Server version: 5.1.36
-- PHP Version: 5.3.0

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
-- Table structure for table `drafts`
--

DROP TABLE IF EXISTS `drafts`;
CREATE TABLE IF NOT EXISTS `drafts` (
  `page_id` int(11) DEFAULT NULL,
  `entry_id` int(11) DEFAULT NULL,
  `name` text NOT NULL,
  `data` text NOT NULL,
  `lock` int(11) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `drafts`
--


-- --------------------------------------------------------

--
-- Table structure for table `entries`
--

DROP TABLE IF EXISTS `entries`;
CREATE TABLE IF NOT EXISTS `entries` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Numeric ID',
  `name` text NOT NULL COMMENT 'Entry Name',
  `data` text COMMENT 'B64''d Serialized Data Array',
  `author` int(11) NOT NULL COMMENT 'Author''s UID',
  `rank` int(11) DEFAULT NULL COMMENT 'Rank Required to View',
  `draft` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Draft?',
  `page` int(11) NOT NULL COMMENT 'The Page Owning this Entry',
  `locked` tinyint(1) NOT NULL DEFAULT '0',
  `timestamp` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `entries`
--

INSERT INTO `entries` (`id`, `name`, `data`, `author`, `rank`, `draft`, `page`, `locked`, `timestamp`) VALUES
(1, 'Bleach', NULL, 0, -1, 0, 1, 0, '2010-03-14 16:32:52');

-- --------------------------------------------------------

--
-- Table structure for table `pages`
--

DROP TABLE IF EXISTS `pages`;
CREATE TABLE IF NOT EXISTS `pages` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Numeric ID',
  `name` text NOT NULL COMMENT 'Page Name',
  `data` text COMMENT 'B64''d Serialized Data Array',
  `author` int(11) NOT NULL COMMENT 'Author''s UID',
  `rank` int(11) DEFAULT NULL COMMENT 'Minimum Rank Required to View',
  `draft` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Draft?',
  `list` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'List?',
  `locked` tinyint(1) NOT NULL DEFAULT '0',
  `timestamp` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `pages`
--

INSERT INTO `pages` (`id`, `name`, `data`, `author`, `rank`, `draft`, `list`, `locked`, `timestamp`) VALUES
(1, 'Anime', NULL, 0, -1, 0, 1, 0, '0000-00-00 00:00:00');
