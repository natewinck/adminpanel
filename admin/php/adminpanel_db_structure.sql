-- phpMyAdmin SQL Dump
-- version 3.2.5
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jun 18, 2010 at 08:38 PM
-- Server version: 5.1.44
-- PHP Version: 5.3.2

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

CREATE TABLE `drafts` (
  `page_id` int(11) NOT NULL DEFAULT '0',
  `entry_id` int(11) DEFAULT NULL,
  `name` text NOT NULL,
  `data` longtext NOT NULL,
  `lockuid` int(11) DEFAULT '-1',
  `timestamp` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `entry_id` (`entry_id`),
  KEY `page_id` (`page_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `drafts`
--

INSERT INTO `drafts` VALUES(1, 36, 'A New Entry', 'eyJuYW1lU3R5bGUiOiIiLCJuZXdzcGFwZXIiOiJBIHBhcmFncmFwaCIsIm5ld3NwYXBlclN0eWxlIjoiIiwiaGVhZGVyIjoiQW5vdGhlciBoZWFkZXIiLCJoZWFkZXJTdHlsZSI6IiIsImNoZWNrYm94VGVzdCI6ZmFsc2UsImNoZWNrYm94VGVzdFN0eWxlIjoiIiwiaW1nMSI6bnVsbCwiaW1nMVN0eWxlIjoiIn0=', -1, '2010-06-18 20:36:56');

-- --------------------------------------------------------

--
-- Table structure for table `entries`
--

CREATE TABLE `entries` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Numeric ID',
  `name` text NOT NULL COMMENT 'Entry Name',
  `data` longtext COMMENT 'B64''d Serialized Data Array',
  `author` int(11) NOT NULL COMMENT 'Author''s UID',
  `rank` int(11) DEFAULT NULL COMMENT 'Rank Required to View',
  `draft` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Draft?',
  `page` int(11) NOT NULL COMMENT 'The Page Owning this Entry',
  `locked` tinyint(1) NOT NULL DEFAULT '0',
  `display` tinyint(11) NOT NULL DEFAULT '1' COMMENT 'Should be shown on website',
  `date_created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `date_modified` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `timestamp` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `AUTHORS` (`author`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=57 ;

--
-- Dumping data for table `entries`
--

INSERT INTO `entries` VALUES(1, 'Bleach', 'eyJuYW1lU3R5bGUiOiIiLCJuZXdzcGFwZXIiOiJTb21lIHRleHQgaGVyZSIsIm5ld3NwYXBlclN0eWxlIjoiIiwiaGVhZGVyIjoiQmxlYWNoIEhlYWRlciIsImhlYWRlclN0eWxlIjoiIiwiY2hlY2tib3hUZXN0IjpmYWxzZSwiY2hlY2tib3hUZXN0U3R5bGUiOiIiLCJpbWcxIjpudWxsLCJpbWcxU3R5bGUiOiIifQ==', -1, 0, 0, 1, 1, 1, '2010-06-15 15:54:17', '2010-06-18 20:36:53', '2010-06-18 20:36:54');
INSERT INTO `entries` VALUES(36, 'A New Entry', 'eyJuYW1lU3R5bGUiOiIiLCJuZXdzcGFwZXIiOiJBIHBhcmFncmFwaCIsIm5ld3NwYXBlclN0eWxlIjoiIiwiaGVhZGVyIjoiQW5vdGhlciBoZWFkZXIiLCJoZWFkZXJTdHlsZSI6IiIsImltZzEiOnsiYWxpZ24iOiIiLCJ3aWR0aCI6MH0sImltZzFTdHlsZSI6IiJ9', -1, NULL, 1, 1, 1, 1, '2010-06-15 15:54:17', '2010-06-18 20:33:57', '2010-06-18 20:36:56');
INSERT INTO `entries` VALUES(39, 'Boo', 'eyJuYW1lU3R5bGUiOiIiLCJuZXdzcGFwZXIiOiIiLCJuZXdzcGFwZXJTdHlsZSI6IiIsImhlYWRlciI6IiIsImhlYWRlclN0eWxlIjoiIiwiaW1nMSI6eyJzcmMiOiJodHRwOlwvXC9pbWFnZXMuYXBwbGUuY29tXC9ob21lXC9pbWFnZXNcL3Byb21vX21hY21pbmlfMjAxMDA2MTAuanBnIiwiYWxpZ24iOiIiLCJ3aWR0aCI6MjM2fSwiaW1nMVN0eWxlIjoiIn0=', -1, NULL, 0, 1, 1, 1, '2010-06-15 15:54:17', '2010-06-18 20:33:45', '2010-06-18 20:36:23');

-- --------------------------------------------------------

--
-- Table structure for table `pages`
--

CREATE TABLE `pages` (
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
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=31 ;

--
-- Dumping data for table `pages`
--

INSERT INTO `pages` VALUES(1, 'Bleach', 'eyJuYW1lU3R5bGUiOiIiLCJuZXdzcGFwZXIiOiJTb21lIHRleHQgaGVyZS4iLCJuZXdzcGFwZXJTdHlsZSI6IiIsImhlYWRlciI6IkEgYmlnIGhlYWRlciIsImhlYWRlclN0eWxlIjoiIn0=', 5, -1, 0, 1, 1, 'movies', '2010-06-18 20:38:26', 0);
INSERT INTO `pages` VALUES(2, 'About Us', 'eyJuYW1lU3R5bGUiOiIiLCJuZXdzcGFwZXIiOiJUaGlzIGlzIG5vdGhpbmcgdG8gcmVhZCByZWFsbHkuIiwibmV3c3BhcGVyU3R5bGUiOiIiLCJoZWFkZXIiOiJBIEhlYWRlciIsImhlYWRlclN0eWxlIjoiIn0=', -1, -1, 0, 0, 1, 'html5', '2010-06-18 20:32:43', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Unique ID of User',
  `username` text NOT NULL,
  `password` varchar(128) NOT NULL,
  `email` text NOT NULL,
  `rank` int(11) NOT NULL DEFAULT '0',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=12 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` VALUES(5, 'gotmacs', '59db80a271f3dfb43fe3f929890edd3a64b399ea445509efb36a36cae1606dc2', 'gotmacs@gmail.com', 0, '2010-06-18 20:36:54');
INSERT INTO `users` VALUES(4, 'gotmacs2', 'ceff8c81962a24ead24c04e50efa73c01d6fa2953cc55c88ba2b56b01593f397', 'gotmacs@gmail.com', 0, '2010-06-08 22:04:39');
INSERT INTO `users` VALUES(11, 'gotmacs', '59db80a271f3dfb43fe3f929890edd3a64b399ea445509efb36a36cae1606dc2', 'gotmacs@gmail.com', 0, '2010-06-12 23:16:21');
