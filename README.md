## To install packages
  `npm install`

## To run the server
  `node app`

## environment 
  create .env file.
  Refer the env.example file for env variables 

## Create database
  CREATE SCHEMA `doodleblue_purchase` ;

## create user table
  CREATE TABLE `doodleblue_purchase`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `mobile` VARCHAR(45) NULL,
  `password` VARCHAR(250) NULL,
  `cdate` TIMESTAMP NULL,
  `mdate` TIMESTAMP NULL,
  `is_active` TINYINT NULL DEFAULT 1,
  `auth_token` VARCHAR(1000) NULL,
  PRIMARY KEY (`id`));

  ## create products table
  CREATE TABLE `doodleblue_purchase`.`products` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `product_name` VARCHAR(45) NOT NULL,
  `product_code` VARCHAR(45) NOT NULL,
  `quantity` INT NOT NULL,
  `cdate` TIMESTAMP NULL,
  `mdate` TIMESTAMP NULL,
  `status` VARCHAR(45) NULL,
  PRIMARY KEY (`id`));

  ## create order table
  CREATE TABLE `doodleblue_purchase`.`orders` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `customer` INT NOT NULL,
  `quantity` INT NOT NULL,
  `date` TIMESTAMP NOT NULL,
  `product` VARCHAR(45) NOT NULL,
  `cdate` TIMESTAMP NULL,
  `mdate` TIMESTAMP NULL,
  `status` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`));
  