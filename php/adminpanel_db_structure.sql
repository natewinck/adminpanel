-- phpMyAdmin SQL Dump
-- version 3.2.5
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jun 04, 2010 at 12:10 AM
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

INSERT INTO `drafts` VALUES(1, 39, 'Boo', 'YTo3OntzOjk6Im5hbWVTdHlsZSI7czowOiIiO3M6OToibmV3c3BhcGVyIjtzOjMyOiJJJ20gd3JpdGluZyBzb21ldGhpbmcgcmlnaHQgbm93LiI7czoxNDoibmV3c3BhcGVyU3R5bGUiO3M6MDoiIjtzOjY6ImhlYWRlciI7czowOiIiO3M6MTE6ImhlYWRlclN0eWxlIjtzOjA6IiI7czo0OiJpbWcxIjthOjM6e3M6Mzoic3JjIjtzOjA6IiI7czo1OiJhbGlnbiI7czowOiIiO3M6NToid2lkdGgiO2k6MDt9czo5OiJpbWcxU3R5bGUiO3M6MDoiIjt9', -1, '2010-06-04 00:08:57');

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
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=57 ;

--
-- Dumping data for table `entries`
--

INSERT INTO `entries` VALUES(1, 'Bleach', 'YTo3OntzOjk6Im5hbWVTdHlsZSI7czozNzoiZm9udC13ZWlnaHQ6IGJvbGQ7IHRleHQtYWxpZ246IGxlZnQ7ICI7czo5OiJuZXdzcGFwZXIiO3M6MTMxOToiVGhpcyBpcyBhIHRlc3Qgc2VudGVuY2U8aW1nIHNyYz0iaHR0cDovL2ltYWdlcy5hcHBsZS5jb20vaG9tZS9pbWFnZXMvcHJvbW9faXBhZDNnXzIwMTAwNDMwLmpwZyIgYWx0PSIiIHN0eWxlPSJtYXJnaW4tdG9wOiAxOHB4OyBtYXJnaW4tcmlnaHQ6IDIycHg7IG1hcmdpbi1ib3R0b206IDE4cHg7IG1hcmdpbi1sZWZ0OiAyMnB4OyAiIGhlaWdodD0iMTAzIiB3aWR0aD0iMTU3Ij5UaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUZSB0ZXh0LiZuYnNwO1RoaXMgaXMgc29tZSB0ZXh0LiZuYnNwO1RoaXMgaXMgc29tZSB0ZXh0LiZuYnNwO1RoaXMgaXMgc29tZSB0ZXh0LiZuYnNwO1RoaXMgaXMgc29tZSB0ZXh0LiZuYnNwO1RoaXMgaXMgc288aW1nIHNyYz0iLi4vaW1hZ2VzL05XVGVtcGxhdGVzV2luZG93L2Nob29zZS5wbmciIGFsdD0iIiBzdHlsZT0ibWFyZ2luLXRvcDogMTBweDsgbWFyZ2luLXJpZ2h0OiAxM3B4OyBtYXJnaW4tYm90dG9tOiAxMHB4OyBtYXJnaW4tbGVmdDogMHB4OyAiIGFsaWduPSJsZWZ0IiBoZWlnaHQ9IjM0IiB3aWR0aD0iODUiPm1lIHRleHQuJm5ic3A7VGhpcyBpcyBzb21lIHRleHQuJm5ic3A7VGhpcyBpcyBzb21lIHRleHQuJm5ic3A7VGhpcyBpcyBzb21lIHRleHQuJm5ic3A7VGhpcyBpcyBzb21lIHRleHQuJm5ic3A7VGhpcyBpcyBzb21lIHRleHQuJm5ic3A7VGhpcyBpcyBzb21lIHRleHQuJm5ic3A7VGhpcyBpcyBzb21lIHRleHQuJm5ic3A7VGhpcyBpcyBzb21lIHRleHQuJm5ic3A7VGhpcyBpcyBzb21lIHRleHQuJm5ic3A7VGhpcyBpcyBzb21lIHRleHQuJm5ic3A7VGhpcyBpcyBzb21lIHRleHQuJm5ic3A7VGhpcyBpcyBzb21lIHRleHQuJm5ic3A7VGhpcyBpcyBzb21lIHRleHQuJm5ic3A7VGhpcyBpcyBzb21lIHRleHQuJm5ic3A7VGhpcyBpcyBzb21lIHRleHQuJm5ic3A7VGhpcyBpcyBzb21lIHRleHQuJm5ic3A7VGhpcyBpcyBzb21lIHRleHQuJm5ic3A7VGhpcyBpcyBzb20gdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDtUaGlzIGlzIHNvbWUgdGV4dC4mbmJzcDsiO3M6MTQ6Im5ld3NwYXBlclN0eWxlIjtzOjM3OiJmb250LXdlaWdodDogYm9sZDsgdGV4dC1hbGlnbjogbGVmdDsgIjtzOjY6ImhlYWRlciI7czoxMTI6IjxzcGFuIHN0eWxlPSJjb2xvcjogcmdiKDI0NiwgMzUsIDM1KTsiPkEgbmU8L3NwYW4+PHNwYW4gc3R5bGU9ImNvbG9yOiByZ2IoMjQ2LCAzNSwgMzUpOyI+dyZuYnNwO3RoaW5nPC9zcGFuPjxicj4iO3M6MTE6ImhlYWRlclN0eWxlIjtzOjM3OiJmb250LXdlaWdodDogYm9sZDsgdGV4dC1hbGlnbjogbGVmdDsgIjtzOjQ6ImltZzEiO2E6Mzp7czozOiJzcmMiO3M6NTQ6Imh0dHA6Ly9pbWFnZXMuYXBwbGUuY29tL2hvbWUvaW1hZ2VzL3Byb21vXzIwMTAwNDI3LmpwZyI7czo1OiJhbGlnbiI7czowOiIiO3M6NToid2lkdGgiO2k6MjM2O31zOjk6ImltZzFTdHlsZSI7czowOiIiO30=', 1, 0, 0, 1, 1, 1, '2010-06-04 00:10:41');
INSERT INTO `entries` VALUES(36, 'A New Entry', 'YTo3OntzOjk6Im5hbWVTdHlsZSI7czowOiIiO3M6OToibmV3c3BhcGVyIjtzOjE1OiJBIHBhcmFncmFwaDxicj4iO3M6MTQ6Im5ld3NwYXBlclN0eWxlIjtzOjA6IiI7czo2OiJoZWFkZXIiO3M6MTI6IkEgaGVhZGVyPGJyPiI7czoxMToiaGVhZGVyU3R5bGUiO3M6MDoiIjtzOjQ6ImltZzEiO2E6Mzp7czozOiJzcmMiO3M6NjU6Imh0dHA6Ly9pbWFnZXMuYXBwbGUuY29tL3N1cHBvcnQvaG9tZS9pbWFnZXMvaG9tZV9mZWF0dXJlZF9tYWMucG5nIjtzOjU6ImFsaWduIjtzOjA6IiI7czo1OiJ3aWR0aCI7aToxODA7fXM6OToiaW1nMVN0eWxlIjtzOjA6IiI7fQ==', -1, NULL, 0, 1, 1, 1, '2010-06-04 00:08:31');
INSERT INTO `entries` VALUES(39, 'Boo', 'YTo3OntzOjk6Im5hbWVTdHlsZSI7czowOiIiO3M6OToibmV3c3BhcGVyIjtzOjMyOiJJJ20gd3JpdGluZyBzb21ldGhpbmcgcmlnaHQgbm93LiI7czoxNDoibmV3c3BhcGVyU3R5bGUiO3M6MDoiIjtzOjY6ImhlYWRlciI7czowOiIiO3M6MTE6ImhlYWRlclN0eWxlIjtzOjA6IiI7czo0OiJpbWcxIjthOjM6e3M6Mzoic3JjIjtzOjA6IiI7czo1OiJhbGlnbiI7czowOiIiO3M6NToid2lkdGgiO2k6MDt9czo5OiJpbWcxU3R5bGUiO3M6MDoiIjt9', -1, NULL, 1, 1, 1, 1, '2010-06-04 00:08:57');

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

INSERT INTO `pages` VALUES(1, 'Bleach', 'YTo1OntzOjk6Im5hbWVTdHlsZSI7czowOiIiO3M6OToibmV3c3BhcGVyIjtzOjEzNjoiPGZvbnQgY2xhc3M9IkFwcGxlLXN0eWxlLXNwYW4iIGZhY2U9IidMdWNpZGEgR3JhbmRlJyI+PHNwYW4gY2xhc3M9IkFwcGxlLXN0eWxlLXNwYW4iIHN0eWxlPSJmb250LXNpemU6IHNtYWxsOyI+QSBwYXJhZ3JhcGg8L3NwYW4+PC9mb250PiI7czoxNDoibmV3c3BhcGVyU3R5bGUiO3M6MDoiIjtzOjY6ImhlYWRlciI7czowOiIiO3M6MTE6ImhlYWRlclN0eWxlIjtzOjA6IiI7fQ==', 1, -1, 0, 1, 1, 'movies', '2010-06-04 00:10:31', 0);
INSERT INTO `pages` VALUES(2, 'About Us', 'YTo1OntzOjk6Im5hbWVTdHlsZSI7czowOiIiO3M6OToibmV3c3BhcGVyIjtzOjI4MToiPHNwYW4gY2xhc3M9IkFwcGxlLXN0eWxlLXNwYW4iIHN0eWxlPSJmb250LWZhbWlseTogQXJpYWwsSGVsdmV0aWNhLHNhbnM7IGZvbnQtc2l6ZTogMTFweDsiPjxwIHN0eWxlPSJ0ZXh0LWFsaWduOiBqdXN0aWZ5OyBsaW5lLWhlaWdodDogMTRweDsgbWFyZ2luOiAwcHggMHB4IDE0cHg7IHBhZGRpbmc6IDBweDsiPjxzcGFuIGNsYXNzPSJBcHBsZS1zdHlsZS1zcGFuIiBzdHlsZT0iZm9udC1zaXplOiBzbWFsbDsiPjxiPjxpPlNvbWU8L2k+PC9iPiB0ZXN0IHRleHQ8L3NwYW4+PC9wPjwvc3Bhbj4iO3M6MTQ6Im5ld3NwYXBlclN0eWxlIjtzOjA6IiI7czo2OiJoZWFkZXIiO3M6ODoiQWJvdXQgVXAiO3M6MTE6ImhlYWRlclN0eWxlIjtzOjA6IiI7fQ==', -1, -1, 0, 0, 1, 'html5', '2010-06-04 00:08:57', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Unique ID of User',
  `username` text NOT NULL,
  `password` text NOT NULL,
  `email` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` VALUES(1, 'gotmacs', 'test', 'gotmacs@gmail.com', '2010-06-04 00:10:45');
INSERT INTO `users` VALUES(2, 'gotmacs2', 'test2', 'gotmacs@gmail.com', '2010-06-04 00:08:20');
