-- phpMyAdmin SQL Dump
-- version 3.2.5
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: May 31, 2010 at 11:23 PM
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
  `timestamp` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `AUTHORS` (`author`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=39 ;

--
-- Dumping data for table `entries`
--

INSERT INTO `entries` VALUES(1, 'Bleach', 'YTo3OntzOjk6Im5hbWVTdHlsZSI7czozNzoiZm9udC13ZWlnaHQ6IGJvbGQ7IHRleHQtYWxpZ246IGxlZnQ7ICI7czo5OiJuZXdzcGFwZXIiO3M6MTMwNDoiVGhpcyBpcyBhIHRlc3Qgc2VudGVuY2U8aW1nIHNyYz0iaHR0cDovL2ltYWdlcy5hcHBsZS5jb20vaG9tZS9pbWFnZXMvcHJvbW9faXBhZDNnXzIwMTAwNDMwLmpwZyIgYWx0PSIiIHN0eWxlPSJtYXJnaW4tdG9wOiAxOHB4OyBtYXJnaW4tcmlnaHQ6IDIycHg7IG1hcmdpbi1ib3R0b206IDE4cHg7IG1hcmdpbi1sZWZ0OiAyMnB4OyAiIGhlaWdodD0iMTA3IiB3aWR0aD0iMTYzIj5UaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvPGltZyBzcmM9Ii4uL2ltYWdlcy9OV1RlbXBsYXRlc1dpbmRvdy9jaG9vc2UucG5nIiBhbHQ9IiIgc3R5bGU9Im1hcmdpbjogMTBweCAxM3B4IDEwcHggMHB4OyIgYWxpZ249ImxlZnQiIGhlaWdodD0iMzQiIHdpZHRoPSI4NSI+bWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDsiO3M6MTQ6Im5ld3NwYXBlclN0eWxlIjtzOjM3OiJmb250LXdlaWdodDogYm9sZDsgdGV4dC1hbGlnbjogbGVmdDsgIjtzOjY6ImhlYWRlciI7czoxMTI6IjxzcGFuIHN0eWxlPSJjb2xvcjogcmdiKDI0NiwgMzUsIDM1KTsiPkEgbmU8L3NwYW4+PHNwYW4gc3R5bGU9ImNvbG9yOiByZ2IoMjQ2LCAzNSwgMzUpOyI+dyZuYnNwO3RoaW5nPC9zcGFuPjxicj4iO3M6MTE6ImhlYWRlclN0eWxlIjtzOjM3OiJmb250LXdlaWdodDogYm9sZDsgdGV4dC1hbGlnbjogbGVmdDsgIjtzOjQ6ImltZzEiO2E6Mzp7czozOiJzcmMiO3M6NTQ6Imh0dHA6Ly9pbWFnZXMuYXBwbGUuY29tL2hvbWUvaW1hZ2VzL3Byb21vXzIwMTAwNDI3LmpwZyI7czo1OiJhbGlnbiI7czowOiIiO3M6NToid2lkdGgiO2k6MjM2O31zOjk6ImltZzFTdHlsZSI7czowOiIiO30=', 0, 0, 0, 1, 1, 1, '2010-05-31 23:23:11');
INSERT INTO `entries` VALUES(36, 'A New Entry', 'YTo3OntzOjk6Im5hbWVTdHlsZSI7czowOiIiO3M6OToibmV3c3BhcGVyIjtzOjE1OiJBIHBhcmFncmFwaDxicj4iO3M6MTQ6Im5ld3NwYXBlclN0eWxlIjtzOjA6IiI7czo2OiJoZWFkZXIiO3M6MTI6IkEgaGVhZGVyPGJyPiI7czoxMToiaGVhZGVyU3R5bGUiO3M6MDoiIjtzOjQ6ImltZzEiO2E6Mzp7czozOiJzcmMiO3M6NjU6Imh0dHA6Ly9pbWFnZXMuYXBwbGUuY29tL3N1cHBvcnQvaG9tZS9pbWFnZXMvaG9tZV9mZWF0dXJlZF9tYWMucG5nIjtzOjU6ImFsaWduIjtzOjA6IiI7czo1OiJ3aWR0aCI7aToxODA7fXM6OToiaW1nMVN0eWxlIjtzOjA6IiI7fQ==', -1, NULL, 0, 1, 1, 1, '2010-05-31 23:22:18');

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

INSERT INTO `pages` VALUES(1, 'Bleach', '', 0, -1, 0, 1, 1, 'movies', '2010-05-31 23:23:17', 0);
INSERT INTO `pages` VALUES(2, 'About Us', 'YTo1OntzOjk6Im5hbWVTdHlsZSI7czowOiIiO3M6OToibmV3c3BhcGVyIjtzOjI4MToiPHNwYW4gY2xhc3M9IkFwcGxlLXN0eWxlLXNwYW4iIHN0eWxlPSJmb250LWZhbWlseTogQXJpYWwsSGVsdmV0aWNhLHNhbnM7IGZvbnQtc2l6ZTogMTFweDsiPjxwIHN0eWxlPSJ0ZXh0LWFsaWduOiBqdXN0aWZ5OyBsaW5lLWhlaWdodDogMTRweDsgbWFyZ2luOiAwcHggMHB4IDE0cHg7IHBhZGRpbmc6IDBweDsiPjxzcGFuIGNsYXNzPSJBcHBsZS1zdHlsZS1zcGFuIiBzdHlsZT0iZm9udC1zaXplOiBzbWFsbDsiPjxiPjxpPlNvbWU8L2k+PC9iPiB0ZXN0IHRleHQ8L3NwYW4+PC9wPjwvc3Bhbj4iO3M6MTQ6Im5ld3NwYXBlclN0eWxlIjtzOjA6IiI7czo2OiJoZWFkZXIiO3M6ODoiQWJvdXQgVXAiO3M6MTE6ImhlYWRlclN0eWxlIjtzOjA6IiI7fQ==', -1, -1, 0, 0, 1, 'html5', '2010-05-31 23:21:57', 0);
