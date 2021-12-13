DROP DATABASE IF EXISTS digitalBank;

CREATE DATABASE digitalBank;

USE digitalBank;

CREATE TABLE accounts(
    id INT AUTO_INCREMENT,
    cpf CHAR(11) UNIQUE NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `password` VARCHAR(8) NOT NULL,
    balance DECIMAL(14, 2) UNSIGNED DEFAULT 0.00,
    PRIMARY KEY (id)
) engine = InnoDB;
