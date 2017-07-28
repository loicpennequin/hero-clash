-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Client :  127.0.0.1
-- Généré le :  Ven 28 Juillet 2017 à 23:25
-- Version du serveur :  5.7.14
-- Version de PHP :  5.6.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `heroclash`
--
CREATE DATABASE IF NOT EXISTS `heroclash` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `heroclash`;

-- --------------------------------------------------------

--
-- Structure de la table `classes`
--

DROP TABLE IF EXISTS `classes`;
CREATE TABLE `classes` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `portrait` varchar(150) NOT NULL,
  `basic` tinyint(4) NOT NULL,
  `price` int(11) DEFAULT NULL,
  `health` int(11) NOT NULL,
  `mana` int(11) NOT NULL,
  `atk` int(11) NOT NULL,
  `matk` int(11) NOT NULL,
  `def` int(11) NOT NULL,
  `mdef` int(11) NOT NULL,
  `speed` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Contenu de la table `classes`
--

INSERT INTO `classes` (`id`, `name`, `portrait`, `basic`, `price`, `health`, `mana`, `atk`, `matk`, `def`, `mdef`, `speed`) VALUES
(1, 'Pyromancer', '/assets/img/pyromancer.png', 1, NULL, 150, 200, 20, 60, 20, 30, 50),
(2, 'Archer', '/assets/img/archer.png', 1, NULL, 180, 120, 50, 30, 20, 20, 65),
(3, 'Knight', '/assets/img/knight.png', 1, NULL, 270, 120, 40, 25, 45, 30, 40),
(4, 'Assasin', '/assets/img/assasin.png', 0, 1000, 120, 120, 60, 50, 10, 10, 75),
(5, 'Dummy', '/assets/img/dummy.png', 0, 0, 300, 0, 0, 0, 0, 0, 999),
(6, 'barbarian', '/assets/img/barbarian.png', 0, 1000, 210, 80, 50, 10, 20, 0, 40),
(7, 'Blood Lord', 'assets/img/bloodlord.png', 0, 1500, 140, 220, 10, 50, 20, 20, 0),
(8, 'Fencer', 'assets/img/fencer.png', 0, 1500, 160, 130, 40, 40, 30, 20, 60),
(9, 'Priest', '/assets/img/priest.png', 0, 1000, 130, 200, 20, 30, 30, 40, 50),
(10, 'Champion', '/assets/img/champion.png', 0, 1500, 160, 150, 40, 40, 30, 30, 50),
(11, 'Monk', '/assets/img/monk.png', 0, 1500, 220, 160, 20, 30, 40, 40, 20),
(12, 'Sorceress', '/assets/img/sorceress.png', 0, 1500, 150, 250, 20, 70, 10, 30, 45);

-- --------------------------------------------------------

--
-- Structure de la table `heroes`
--

DROP TABLE IF EXISTS `heroes`;
CREATE TABLE `heroes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `skill1` int(11) DEFAULT NULL,
  `skill2` int(11) DEFAULT NULL,
  `skill3` int(11) DEFAULT NULL,
  `skill4` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Contenu de la table `heroes`
--

INSERT INTO `heroes` (`id`, `user_id`, `class_id`, `skill1`, `skill2`, `skill3`, `skill4`) VALUES
(1, 0, 5, NULL, NULL, NULL, NULL),
(2, 0, 5, NULL, NULL, NULL, NULL),
(3, 0, 5, NULL, NULL, NULL, NULL),
(4, 1, 1, 6, 7, 8, NULL),
(5, 1, 2, NULL, NULL, NULL, NULL),
(6, 1, 3, NULL, NULL, NULL, NULL),
(7, 1, 4, NULL, NULL, NULL, NULL),
(8, 1, 6, NULL, NULL, NULL, NULL),
(9, 1, 7, NULL, NULL, NULL, NULL),
(10, 1, 8, 11, NULL, NULL, NULL),
(11, 1, 9, NULL, NULL, NULL, NULL),
(12, 1, 10, NULL, NULL, NULL, NULL),
(13, 1, 11, 9, NULL, NULL, NULL),
(14, 1, 12, 10, 12, NULL, NULL),
(15, 2, 2, NULL, NULL, NULL, NULL),
(16, 2, 3, NULL, NULL, NULL, NULL),
(17, 2, 1, 6, 8, 7, NULL),
(18, 2, 12, 10, NULL, 12, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `heroes_skills`
--

DROP TABLE IF EXISTS `heroes_skills`;
CREATE TABLE `heroes_skills` (
  `id` int(11) NOT NULL,
  `hero_id` int(11) NOT NULL,
  `skill_id` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Contenu de la table `heroes_skills`
--

INSERT INTO `heroes_skills` (`id`, `hero_id`, `skill_id`) VALUES
(18, 14, 12),
(17, 10, 11),
(16, 14, 10),
(15, 13, 9),
(14, 4, 8),
(13, 4, 7),
(12, 4, 6),
(11, 1, 6),
(19, 17, 6),
(20, 17, 7),
(21, 17, 8),
(22, 18, 10),
(23, 18, 12);

-- --------------------------------------------------------

--
-- Structure de la table `skills`
--

DROP TABLE IF EXISTS `skills`;
CREATE TABLE `skills` (
  `id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `basic` tinyint(1) NOT NULL,
  `price` int(11) DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `cost` int(11) NOT NULL,
  `damagevalue` int(11) DEFAULT NULL,
  `damageratio` float DEFAULT NULL,
  `healvalue` int(11) DEFAULT NULL,
  `healratio` float DEFAULT NULL,
  `dotvalue` int(11) DEFAULT NULL,
  `dotduration` int(11) DEFAULT NULL,
  `dotratio` float DEFAULT NULL,
  `hotvalue` int(11) DEFAULT NULL,
  `hotduration` int(11) DEFAULT NULL,
  `hotratio` float DEFAULT NULL,
  `buff1value` int(11) DEFAULT NULL,
  `buff2value` int(11) DEFAULT NULL,
  `buff3value` int(11) DEFAULT NULL,
  `buff4value` int(11) DEFAULT NULL,
  `buff1stat` varchar(11) DEFAULT NULL,
  `buff2stat` varchar(11) DEFAULT NULL,
  `buff3stat` varchar(11) DEFAULT NULL,
  `buff4stat` varchar(11) DEFAULT NULL,
  `debuff1value` int(11) DEFAULT NULL,
  `debuff2value` int(11) DEFAULT NULL,
  `debuff3value` int(11) DEFAULT NULL,
  `debuff4value` int(11) DEFAULT NULL,
  `debuff1stat` varchar(11) DEFAULT NULL,
  `debuff2stat` varchar(11) DEFAULT NULL,
  `debuff3stat` varchar(11) DEFAULT NULL,
  `debuff4stat` varchar(11) DEFAULT NULL,
  `statmodifierduration` int(11) DEFAULT NULL,
  `statmodifierratio` float DEFAULT NULL,
  `cooldown` int(11) NOT NULL,
  `target` varchar(30) NOT NULL,
  `effects` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Contenu de la table `skills`
--

INSERT INTO `skills` (`id`, `class_id`, `basic`, `price`, `name`, `description`, `cost`, `damagevalue`, `damageratio`, `healvalue`, `healratio`, `dotvalue`, `dotduration`, `dotratio`, `hotvalue`, `hotduration`, `hotratio`, `buff1value`, `buff2value`, `buff3value`, `buff4value`, `buff1stat`, `buff2stat`, `buff3stat`, `buff4stat`, `debuff1value`, `debuff2value`, `debuff3value`, `debuff4value`, `debuff1stat`, `debuff2stat`, `debuff3stat`, `debuff4stat`, `statmodifierduration`, `statmodifierratio`, `cooldown`, `target`, `effects`) VALUES
(6, 1, 1, NULL, 'Fire Ball', 'Target : Enemy </br>\r\nCooldown : 2 turns </br>\r\nEffect : throw a fiery projectile at target enemy, dealing 30 +(60% Matk).', 40, 30, 0.6, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3, 'single', 'damage'),
(7, 1, 1, NULL, 'Flame Pillar', 'Target : Enemies </br>\r\nCooldown: 4 turns </br>\r\nEffect : Summon a pillar of raging flames, damaging all enemies for 30 + (30% MATK) damage.', 60, 30, 0.3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5, 'aoe', 'damage'),
(8, 1, 1, NULL, 'Flame Ground', 'Target: Enemies </br>\r\nCooldown : 5 turns </br>\r\nEffect: Set the ground beneath the enemy team ablaze, damagin them for 15(+25% MATK) every turn for 3 turns.', 60, NULL, NULL, NULL, NULL, 15, 3, 0.25, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 6, 'aoe', 'dot'),
(9, 11, 1, NULL, 'Tranquility', 'Target : Allies </br>\r\nCooldown: 7 turns </br>\r\nEffect: Monk channels his inner peacefulness and spreads it to nearby allies, healing them for 15+(30% of MATK) every turn for 5 turns.', 65, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 5, 0.3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 8, 'faoe', 'hot'),
(10, 12, 1, NULL, 'Arcane Focus', 'Target: self </br>\r\nCooldown: 4 turns </br>\r\nEffect: Sorceress gather her Inner magical power, increasing her MATK by 50% for until the end of next turn.', 30, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'matk', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, 0.5, 5, 'self', 'buff'),
(11, 8, 1, NULL, 'Expose Weak Spots', 'Target : Enemy </br>\r\nCooldown : 4 turns </br>\r\nEffect : Using his duelist instincts, Fencer strikes his opponent for 25(+20% MATK) damage and reduce his DEF and MDEF by 10 + (15% MATK) for 3 turns.', 40, 25, 0.2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 10, 10, NULL, NULL, 'def', 'mdef', NULL, NULL, 3, 0.15, 5, 'single', 'damage debuff'),
(12, 12, 1, NULL, 'Magic Missile', 'Target : Enemy </br>\r\nCooldown : 1turn\r\nEffect : Throw a powerful bolt of magic energy at target, dealing 15(+90% MATK) damage.', 40, 15, 0.9, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, 'single', 'damage');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `login` varchar(24) NOT NULL,
  `password` varchar(100) NOT NULL,
  `email` varchar(50) NOT NULL,
  `gold` int(11) NOT NULL DEFAULT '999999',
  `games` int(11) NOT NULL DEFAULT '0',
  `wins` int(11) NOT NULL DEFAULT '0',
  `losses` int(11) NOT NULL DEFAULT '0',
  `elo` int(11) NOT NULL DEFAULT '1200',
  `team_slot1` int(11) DEFAULT NULL,
  `team_slot2` int(11) DEFAULT NULL,
  `team_slot3` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Contenu de la table `users`
--

INSERT INTO `users` (`id`, `login`, `password`, `email`, `gold`, `games`, `wins`, `losses`, `elo`, `team_slot1`, `team_slot2`, `team_slot3`) VALUES
(1, 'Daria', '$2a$10$qaGwKWAgmvjjmAW6fq8lWOKqIajQniJPVOBGAoC/fshJY0wJwfILO', 'test@test.test', 998499, 0, 0, 0, 1200, 8, 14, 13),
(2, 'Test', '$2a$10$SF1mKJ7bdnlKfJTzaqRCvuNaNiAw4WrKq1MEQaUh4w7oM.pS.L4uW', 'test@test.com', 998499, 0, 0, 0, 1200, 15, 16, 17);

--
-- Index pour les tables exportées
--

--
-- Index pour la table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `heroes`
--
ALTER TABLE `heroes`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `heroes_skills`
--
ALTER TABLE `heroes_skills`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `skills`
--
ALTER TABLE `skills`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `classes`
--
ALTER TABLE `classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT pour la table `heroes`
--
ALTER TABLE `heroes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
--
-- AUTO_INCREMENT pour la table `heroes_skills`
--
ALTER TABLE `heroes_skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;
--
-- AUTO_INCREMENT pour la table `skills`
--
ALTER TABLE `skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
