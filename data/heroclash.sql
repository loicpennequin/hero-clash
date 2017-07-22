-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Client :  127.0.0.1
-- Généré le :  Sam 22 Juillet 2017 à 14:01
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
  `mdef` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Contenu de la table `classes`
--

INSERT INTO `classes` (`id`, `name`, `portrait`, `basic`, `price`, `health`, `mana`, `atk`, `matk`, `def`, `mdef`) VALUES
(1, 'Pyromancer', '/assets/img/pyromancer.png', 1, NULL, 150, 200, 20, 60, 20, 30),
(2, 'Archer', '/assets/img/archer.png', 1, NULL, 180, 120, 50, 30, 20, 20),
(3, 'Knight', '/assets/img/knight.png', 1, NULL, 270, 120, 40, 25, 45, 30);

-- --------------------------------------------------------

--
-- Structure de la table `effects`
--

DROP TABLE IF EXISTS `effects`;
CREATE TABLE `effects` (
  `id` int(11) NOT NULL,
  `name` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `heroes`
--

DROP TABLE IF EXISTS `heroes`;
CREATE TABLE `heroes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '0',
  `skill1` int(11) DEFAULT NULL,
  `skill2` int(11) DEFAULT NULL,
  `skill3` int(11) DEFAULT NULL,
  `skill4` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Contenu de la table `heroes`
--

INSERT INTO `heroes` (`id`, `user_id`, `class_id`, `active`, `skill1`, `skill2`, `skill3`, `skill4`) VALUES
(1, 1, 1, 0, NULL, NULL, NULL, NULL),
(2, 1, 2, 0, NULL, NULL, NULL, NULL),
(3, 1, 3, 0, NULL, NULL, NULL, NULL);

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
(1, 1, 1),
(2, 2, 4);

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
  `attack` tinyint(1) DEFAULT NULL,
  `heal` tinyint(1) DEFAULT NULL,
  `effect` tinyint(1) DEFAULT NULL,
  `effect_id` int(11) DEFAULT NULL,
  `power` int(11) NOT NULL,
  `cooldown` int(11) NOT NULL,
  `ratio` float NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Contenu de la table `skills`
--

INSERT INTO `skills` (`id`, `class_id`, `basic`, `price`, `name`, `description`, `cost`, `attack`, `heal`, `effect`, `effect_id`, `power`, `cooldown`, `ratio`) VALUES
(1, 1, 1, NULL, 'Fire Ball', 'Target : Enemy <br>\r\nEffect : Throws a fireball at target, ealing 30+(60% of Matk) damage', 30, 1, NULL, NULL, NULL, 30, 1, 0.6),
(2, 1, 0, 200, 'Flame Ground', 'Target : all ennemies <br>\r\nEffect : burn the ground beneath all ennemies, setting them ablaze. Ennemies are dealt 20(+30%) damage each turn for three turns.', 45, 1, NULL, NULL, NULL, 20, 4, 0.3),
(3, 1, 0, 200, 'Fire Wall', 'Target: self <br>\r\nEffect: Summon a wall of flames in front of you that lasts for 2 turns. Any enemy attacking you takes 40(+60%Matk) damage.', 40, 0, NULL, 1, NULL, 40, 5, 0.6),
(4, 2, 1, NULL, 'Power Shot', 'Target: Enemy\r\nEffect: launches a powerful arrow at target, dealing 60+(30%Matk)damage and reducing their Def by 10 for 2 turns.', 40, 1, NULL, 1, NULL, 60, 5, 0.3);

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
  `gold` int(11) NOT NULL DEFAULT '0',
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
(1, 'Daria', '$2a$10$hlUnuz8iHQcZcLPMwSFi2OSqH91iQTNCAvzpVyd1M0QVXoPqP/21S', 'test@test.test', 0, 0, 0, 0, 1200, 1, 2, 3);

--
-- Index pour les tables exportées
--

--
-- Index pour la table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `effects`
--
ALTER TABLE `effects`
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT pour la table `effects`
--
ALTER TABLE `effects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `heroes`
--
ALTER TABLE `heroes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT pour la table `heroes_skills`
--
ALTER TABLE `heroes_skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT pour la table `skills`
--
ALTER TABLE `skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
