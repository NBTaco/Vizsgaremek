-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Feb 13. 10:51
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `namero1`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `belongs`
--

CREATE TABLE `belongs` (
  `category_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `belongs`
--

INSERT INTO `belongs` (`category_id`, `product_id`) VALUES
(2, 1),
(2, 2),
(1, 3),
(2, 4),
(2, 5),
(1, 6),
(2, 7),
(2, 8),
(1, 9),
(1, 10),
(1, 11);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `categories`
--

INSERT INTO `categories` (`category_id`, `name`) VALUES
(1, 'power tools'),
(2, 'simple tools');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_price` int(11) NOT NULL,
  `status` varchar(50) NOT NULL,
  `created_at` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `order_items`
--

CREATE TABLE `order_items` (
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `subtotal` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `stock` int(11) NOT NULL,
  `description` text NOT NULL,
  `image_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `products`
--

INSERT INTO `products` (`product_id`, `product_name`, `price`, `stock`, `description`, `image_url`) VALUES
(1, 'Bitfejkészlet', 6999, 2, 'Professzionális 32 részes készlet strapabíró S2 acélból, minden típusú csavarozási feladathoz.', '../kepek/1.png'),
(2, 'Csavarhúzó', 6750, 6, 'Mágneses hegyű, ergonomikus markolatú csavarhúzó készlet a kényelmes és precíz munkavégzésért.', '../kepek/2.png'),
(3, 'Csavarozógép', 4500, 4, 'Könnyű és kompakt akkumulátoros csavarozó, beépített LED világítással a sötét sarkokhoz.', '../kepek/3.png'),
(4, 'Gumikalapács', 3000, 5, 'Kíméletes ütéseket biztosító szerszám, ideális burkoláshoz és bútor összeszereléshez.', '../kepek/4.png'),
(5, 'Kalapács', 1500, 6, 'Klasszikus acélfejű kalapács rezgéscsillapító nyéllel, ház körüli munkákhoz elengedhetetlen.', '../kepek/5.png'),
(6, 'Korfűrész', 10000, 7, 'Nagy teljesítményű körfűrész precíz vágásokhoz, állítható dőlésszöggel és mélységgel.', '../kepek/6.png'),
(7, 'Pajszer', 12300, 8, 'Edzett acél feszítővas, amely a legnehezebb bontási munkálatok során sem hagy cserben.', '../kepek/7.png'),
(8, 'Racsni', 7000, 3, 'Finomfogazású kilincsműves kulcs, amely szűk helyeken is hatékony munkát tesz lehetővé.', '../kepek/8.png'),
(9, 'Sarokcsiszoló', 6500, 2, 'Sokoldalú szerszám vágáshoz és csiszoláshoz, biztonsági védőburkolattal és pótfogantyúval.', '../kepek/9.png'),
(10, 'Vésőgép', 5400, 4, 'Nagy ütőerejű elektromos vésőgép beton és téglafalak bontásához, SDS-Plus befogóval.', '../kepek/10.png'),
(11, 'Csiszológép', 12300, 1, 'Excenteres csiszoló porelszívó tartállyal a tökéletesen sima fafelületek eléréséhez.', '../kepek/11.png');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password_hash`, `role`) VALUES
(1, 'admin', 'admin@gmail.com', '$2a$10$ObQGeonWFnh1OjnBAtLk/eOnmqW4f04CM7.APuBNMXFy0jWT4fNIq', 'admin');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- A tábla indexei `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`);

--
-- A tábla indexei `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `password_hash` (`password_hash`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
