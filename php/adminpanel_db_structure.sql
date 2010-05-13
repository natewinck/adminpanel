-- phpMyAdmin SQL Dump
-- version 3.2.0.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: May 13, 2010 at 07:15 PM
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
  `page_id` int(11) NOT NULL DEFAULT '0',
  `entry_id` int(11) NOT NULL DEFAULT '-1',
  `name` text NOT NULL,
  `data` longtext NOT NULL,
  `lockuid` int(11) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`entry_id`),
  KEY `page_id` (`page_id`)
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
  `data` longtext COMMENT 'B64''d Serialized Data Array',
  `author` int(11) NOT NULL COMMENT 'Author''s UID',
  `rank` int(11) DEFAULT NULL COMMENT 'Rank Required to View',
  `draft` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Draft?',
  `page` int(11) NOT NULL COMMENT 'The Page Owning this Entry',
  `locked` tinyint(1) NOT NULL DEFAULT '0',
  `display` tinyint(11) NOT NULL DEFAULT '1' COMMENT 'Should be shown on website',
  `timestamp` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `AUTHORS` (`author`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `entries`
--

INSERT INTO `entries` (`id`, `name`, `data`, `author`, `rank`, `draft`, `page`, `locked`, `display`, `timestamp`) VALUES
(1, 'Bleach', 'YToyOntzOjk6Im5ld3NwYXBlciI7czo0MDQ6IjxzcGFuIGNsYXNzPSJBcHBsZS1zdHlsZS1zcGFuIiBzdHlsZT0iZm9udC1mYW1pbHk6IEFyaWFsLCBIZWx2ZXRpY2EsIHNhbnM7IGZvbnQtc2l6ZTogMTFweDsgIj48cCBzdHlsZT0idGV4dC1hbGlnbjoganVzdGlmeTsgbGluZS1oZWlnaHQ6IDE0cHg7IG1hcmdpbi10b3A6IDBweDsgbWFyZ2luLXJpZ2h0OiAwcHg7IG1hcmdpbi1ib3R0b206IDE0cHg7IG1hcmdpbi1sZWZ0OiAwcHg7IHBhZGRpbmctdG9wOiAwcHg7IHBhZGRpbmctcmlnaHQ6IDBweDsgcGFkZGluZy1ib3R0b206IDBweDsgcGFkZGluZy1sZWZ0OiAwcHg7ICI+PHNwYW4gY2xhc3M9IkFwcGxlLXN0eWxlLXNwYW4iIHN0eWxlPSJmb250LXNpemU6IHNtYWxsOyI+U29tZSBib2R5IHRleHQgdGhhdCBnb2VzIGhlcmUuPC9zcGFuPjwvcD48L3NwYW4+IjtzOjY6ImhlYWRlciI7czo4OiJBIGhlYWRlciI7fQ==', 124567, -1, 0, 1, 0, 1, '2010-05-12 22:39:32');

-- --------------------------------------------------------

--
-- Table structure for table `pages`
--

DROP TABLE IF EXISTS `pages`;
CREATE TABLE IF NOT EXISTS `pages` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Numeric ID',
  `name` text NOT NULL COMMENT 'Page Name',
  `data` longtext COMMENT 'B64''d Serialized Data Array',
  `author` int(11) NOT NULL COMMENT 'Author''s UID',
  `rank` int(11) DEFAULT NULL COMMENT 'Minimum Rank Required to View',
  `draft` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Draft?',
  `list` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'List?',
  `locked` tinyint(1) NOT NULL DEFAULT '0',
  `template` text COMMENT 'Template to be use',
  `timestamp` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `editable` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Is this page editable?',
  PRIMARY KEY (`id`),
  KEY `AUTHORS` (`author`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `pages`
--

INSERT INTO `pages` (`id`, `name`, `data`, `author`, `rank`, `draft`, `list`, `locked`, `template`, `timestamp`, `editable`) VALUES
(1, 'Bleach', '', 0, -1, 0, 1, 0, 'movies', '2010-05-12 14:38:45', 0),
(2, 'About', 'YToyOntzOjk6Im5ld3NwYXBlciI7czozODg6IjxzcGFuIGNsYXNzPSJBcHBsZS1zdHlsZS1zcGFuIiBzdHlsZT0iZm9udC1mYW1pbHk6IEFyaWFsLCBIZWx2ZXRpY2EsIHNhbnM7IGZvbnQtc2l6ZTogMTFweDsgIj48cCBzdHlsZT0idGV4dC1hbGlnbjoganVzdGlmeTsgbGluZS1oZWlnaHQ6IDE0cHg7IG1hcmdpbi10b3A6IDBweDsgbWFyZ2luLXJpZ2h0OiAwcHg7IG1hcmdpbi1ib3R0b206IDE0cHg7IG1hcmdpbi1sZWZ0OiAwcHg7IHBhZGRpbmctdG9wOiAwcHg7IHBhZGRpbmctcmlnaHQ6IDBweDsgcGFkZGluZy1ib3R0b206IDBweDsgcGFkZGluZy1sZWZ0OiAwcHg7ICI+PHNwYW4gY2xhc3M9IkFwcGxlLXN0eWxlLXNwYW4iIHN0eWxlPSJmb250LXNpemU6IHNtYWxsOyI+U29tZSB0ZXN0IHRleHQ8L3NwYW4+PC9wPjwvc3Bhbj4iO3M6NjoiaGVhZGVyIjtzOjg6IkFib3V0IFVzIjt9', 0, -1, 0, 0, 0, 'html5', '2010-05-12 22:39:00', 0);
