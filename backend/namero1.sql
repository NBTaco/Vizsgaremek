-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Ápr 16. 18:22
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

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
(5, 18),
(5, 39),
(5, 43),
(6, 19),
(6, 20),
(6, 23),
(6, 24),
(6, 31),
(6, 33),
(6, 34),
(6, 37),
(6, 40),
(6, 42),
(6, 43),
(6, 44),
(7, 23),
(7, 31),
(7, 36),
(7, 40),
(7, 41),
(8, 17),
(8, 18),
(8, 25),
(8, 26),
(8, 27),
(8, 28),
(8, 30),
(8, 35),
(8, 36),
(8, 38),
(8, 39),
(9, 35),
(9, 44),
(9, 45),
(9, 46),
(9, 47),
(9, 48),
(9, 49),
(9, 50),
(9, 51),
(9, 52),
(9, 53),
(9, 54),
(10, 21),
(10, 22),
(10, 34),
(11, 17),
(11, 18),
(11, 27),
(11, 28),
(12, 30),
(12, 39),
(13, 32),
(14, 41),
(15, 37),
(15, 42);

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
(5, 'Áram'),
(6, 'Elektromos szerszámok'),
(7, 'Fűrészek'),
(8, 'Kézi szerszámok'),
(9, 'Lámpák'),
(10, 'Kalapács'),
(11, 'Csavarhúzó'),
(12, 'Fogó'),
(13, 'Kőműves kellék'),
(14, 'Motoros eszköz'),
(15, 'Takarítóeszköz');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_price` int(11) NOT NULL DEFAULT 0,
  `status` varchar(50) NOT NULL DEFAULT 'in_progress',
  `created_at` varchar(10) NOT NULL,
  `billing_name` varchar(255) NOT NULL,
  `billing_phone` varchar(30) NOT NULL,
  `billing_country` varchar(100) NOT NULL,
  `billing_zip` varchar(20) NOT NULL,
  `billing_city` varchar(100) NOT NULL,
  `billing_address` varchar(255) NOT NULL
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
(17, 'Yato YT-0481 Bitfejkészlet', 3500, 3, 'Ütvefúrókhoz és csavarozókhoz szánt, strapabíró S2 acélból készült, 65 mm hosszú kétoldalú bitek (PH2).', '../kepek/17.png'),
(18, 'Ingco szigetelt csavarhúzó készlet', 6500, 10, '1000V-ig szigetelt szerszámok villanyszerelési munkákhoz. Tartalmaz lapos és csillagfejű kivitelt, illetve egy fáziskeresőt.', '../kepek/18.png'),
(19, 'Bosch EasyDrill 1200 fúrócsavarozó', 28000, 5, 'Könnyű, kompakt barkácsgép otthoni használatra. 12V-os rendszer, kétsebességes hajtóművel fúráshoz és csavarozáshoz.', '../kepek/19.png'),
(20, 'Bosch PSM 200 AES Multicsiszoló', 40000, 13, 'Sokoldalú rezgőcsiszoló, amely cserélhető talppal rendelkezik (háromszög és négyszög), így sarkokhoz és nagyobb felületekhez is jó.', '../kepek/20.png'),
(21, 'Gumikalapács (Fanyelű, fekete)', 2000, 20, 'Kíméletes ütvefejtést igénylő munkákhoz (pl. burkolás, bútorszerelés), ahol fontos, hogy ne sérüljön a munkadarab felülete.', '../kepek/21.png'),
(22, 'Szeghúzó kalapács (Üvegszálas nyéllel)', 4000, 2, 'Klasszikus ácskalapács, amelynek egyik fele szögelésre, a hasított másik fele pedig szegek kihúzására alkalmas.', '../kepek/22.png'),
(23, 'Makita HS7601 Körfűrész', 55000, 6, 'Profi 1200W-os kézi körfűrész, 190 mm-es tárcsaátmérővel. Pontos vágásokhoz fában, stabil alumínium talppal.', '../kepek/23.png'),
(24, 'HiKOKI G1813DA Akkus sarokcsiszoló', 60000, 5, '18V-os szénkefe nélküli (Brushless) motorral szerelt \"flex\", vágáshoz és csiszoláshoz, akkumulátoros kivitelben.', '../kepek/24.jpg'),
(25, 'Acél feszítővas (Pajszer)', 6000, 11, 'Edzett acélból készült karos szerszám bontási munkákhoz, emeléshez és szeghúzáshoz.', '../kepek/25.png'),
(26, 'SelTech Racsnis hajtókar készlet', 9000, 5, 'Irányváltós, finommechanikás racsnis kulcsok dugókulcsfejek meghajtásához, gumírozott markolattal.', '../kepek/26.png'),
(27, 'Dewalt DT71507-QZ 27 bitkészlet', 11000, 11, 'Kompakt, ütésálló tartóban lévő készlet, amely tartalmazza a leggyakoribb bitfejeket, mágneses bittartót és fúrószárakat is.', '../kepek/27.jpg'),
(28, 'Extol Premium csavarhúzó készlet (mágneses)', 5000, 4, 'Ergonomikus, gumírozott nyelű készlet CrV acélból. Általános ház körüli javításokhoz kiváló választás.', '../kepek/28.jpg'),
(29, 'Bosch IXO 7 akkus csavarozó', 16000, 12, 'A világ egyik legnépszerűbb mini csavarozója. USB-ről tölthető, ideális lapraszerelt bútorokhoz és finom munkákhoz.', '../kepek/29.jpg'),
(30, 'Knipex oldalcsípő fogó', 10000, 12, 'Professzionális német gyártmányú fogó. Precíz vágóélek lágy és kemény huzalokhoz egyaránt, 1000V-os szigeteléssel.', '../kepek/30.jpg'),
(31, 'Makita 4329 Dekopírfűrész', 30000, 10, 'Fordulatszám-szabályzós szúrófűrész. Íves és egyenes vágásokhoz fában, fémben vagy műanyagban, alacsony vibrációval.', '../kepek/31.jpg'),
(32, 'Kőműves fángli (Horganyzott, fanyelű)', 2500, 20, 'Malter és vakolat felhordására, keverésére szolgáló alapvető kőműves szerszám, tölcséres kialakítással.', '../kepek/32.jpg'),
(33, 'Hikoki DDF485Z akkus fúró-csavarozó', 45000, 8, 'Szénkefe nélküli (Brushless) motoros, masszív ipari gép. Magas nyomaték és hosszú élettartam jellemzi.', '../kepek/33.jpg'),
(34, 'Bosch GBH 2-28 F Professional fúrókalapács', 85000, 4, 'Erőteljes hálózati ütvefúró gép SDS-Plus befogással. Betonfúráshoz, véséshez tervezett professzionális eszköz.', '../kepek/34.jpg'),
(35, 'Rothenberger Industrial gázlámpa (forrasztópisztoly)', 12000, 12, 'Piezo gyújtással rendelkező kézi gázégő, amely barkács-forrasztáshoz, zsugorításhoz vagy akár konyhai célokra is használható.', '../kepek/35.jpg'),
(36, 'Stanley gipszkarton fűrész (szúrófűrész)', 4500, 4, 'Speciálisan edzett fogazatú kézi fűrész, amivel könnyen és gyorsan vághatók ki lyukak gipszkarton falakba (pl. szerelvénydobozoknak).', '../kepek/36.jpg'),
(37, 'Makita VC2512L Ipari porszívó', 65000, 5, 'Nedves és száraz felszívásra is alkalmas, \"L\" porosztályú porszívó. Gépre csatlakoztatható aljzattal rendelkezik a pormentes munkához.', '../kepek/37.jpg'),
(38, 'Bondhus imbuszkulcs készlet (Gömbvégű)', 9500, 9, 'Professzionális, amerikai gyártmányú készlet. A gömbvég lehetővé teszi a csavarozást akár 25°-os szögben is.', '../kepek/38.jpg'),
(39, 'Knipex racsnis kábelvágó', 10000, 13, 'Vastagabb réz- és alumíniumkábelek tiszta, roncsolásmentes vágására tervezett precíziós szerszám, nagy áttétellel.', '../kepek/39.jpg'),
(40, 'Bosch GKS 190 Kézi körfűrész', 55000, 6, '1400W-os motorral szerelt, kategóriájában az egyik legnagyobb vágási mélységgel (70 mm) rendelkező hálózati körfűrész.', '../kepek/40.jpg'),
(41, 'Hikoki MS 170 Motoros láncfűrész', 60000, 10, 'Belépő szintű, könnyű és megbízható benzinmotoros fűrész kerti munkákhoz, tüzifa aprításhoz.', '../kepek/41.jpg'),
(42, 'Makita DUB184Z Akkus légfúvó', 45000, 1, '18V-os, szénkefe nélküli motorral szerelt lombfúvó. Csendes, de erős légáramot biztosít a kert vagy műhely tisztításához.', '../kepek/42.jpg'),
(43, 'Fluke 115 Digitális multiméter', 50000, 13, 'Ipari standard mérőműszer villanyszerelőknek. True-RMS mérés, kompakt kialakítás és rendkívüli pontosság jellemzi.', '../kepek/43.jpg'),
(44, 'Hikoki M18 AL Akkus LED munkalámpa', 45000, 10, 'Nagy fényerejű, ütésálló házba szerelt területvilágító lámpa, amely az M18-as akkumulátorrendszerrel kompatibilis.', '../kepek/44.jpg'),
(45, 'Zita LED Kültéri fali lámpa', 12000, 10, 'Modern, letisztult formavilágú kültéri lámpa, amely felfelé és lefelé is világít (Up&Down), vízálló kivitelben.', '../kepek/45.jpg'),
(46, 'Lucie Mennyezeti lámpa (Kerek)', 25000, 3, 'Elegáns, alacsony profilú kerek mennyezeti lámpa, amely egyenletes szórt fényt biztosít nappaliba vagy hálószobába.', '../kepek/46.jpg'),
(47, 'Mateo LED Spot lámpatest', 8000, 30, 'Állítható fejű, falra vagy mennyezetre szerelhető spotlámpa, amely kiváló fókuszált fény biztosítására.', '../kepek/47.jpg'),
(48, 'Monza LED Sínrendszeres lámpa', 14000, 13, 'Sínre szerelhető, ipari stílusú spotlámpa, amely professzionális üzletvilágításhoz vagy modern galériákba ajánlott.', '../kepek/48.jpg'),
(49, 'Natalia Kristály csillár / Függesztett lámpa', 60000, 5, 'Klasszikus és modern elemeket ötvöző, elegáns függesztett lámpa, amely a fényt csillogó hatással töri meg.', '../kepek/49.jpg'),
(50, 'Nino Modern függesztett lámpa', 20000, 3, 'Minimalista stílusú, geometriai formákra épülő függesztett lámpatest, étkezőasztal fölé ideális választás.', '../kepek/50.jpg'),
(51, 'Noemie Falikar lámpa', 18000, 15, 'Kifinomult, hajlított karú fali lámpa textil vagy üveg búrával, olvasósarokba vagy éjjeli lámpának.', '../kepek/51.jpg'),
(52, 'Optimus Ipari LED Csarnokvilágító', 25000, 12, 'Nagy teljesítményű, robusztus lámpatest raktárak, műhelyek vagy garázsok erős megvilágításához.', '../kepek/52.jpg'),
(53, 'Rita Mennyezeti kristálylámpa', 18000, 9, 'Beépíthető vagy felületre szerelhető díszes lámpatest, amely exkluzív megjelenést kölcsönöz a térnek.', '../kepek/53.jpg'),
(54, 'Noxion 3-as süllyesztett Spot lámpa', 20000, 12, 'Gipszkartonba építhető, három darab állítható fejet tartalmazó lámpatest, fekete kerettel a modern hatásért.', '../kepek/54.jpg');

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
-- A tábla indexei `belongs`
--
ALTER TABLE `belongs`
  ADD PRIMARY KEY (`category_id`,`product_id`),
  ADD KEY `fk_belongs_product` (`product_id`);

--
-- A tábla indexei `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- A tábla indexei `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `fk_orders_user` (`user_id`);

--
-- A tábla indexei `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`order_id`,`product_id`),
  ADD KEY `fk_order_items_product` (`product_id`);

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
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT a táblához `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `belongs`
--
ALTER TABLE `belongs`
  ADD CONSTRAINT `fk_belongs_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`),
  ADD CONSTRAINT `fk_belongs_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Megkötések a táblához `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Megkötések a táblához `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  ADD CONSTRAINT `fk_order_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
