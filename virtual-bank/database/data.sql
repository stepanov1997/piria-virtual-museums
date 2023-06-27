PRAGMA default_cache_size = 0;
PRAGMA cache_size = 0;
CREATE TABLE main."CLIENT"
(
    id         INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name       TEXT    NOT NULL,
    surname    TEXT    NOT NULL,
    cardNumber TEXT    NOT NULL,
    cardType   TEXT    NOT NULL,
    cardExpire TEXT    NOT NULL,
    pin        TEXT    NOT NULL,
    balance    REAL    DEFAULT 0.0
);

CREATE TABLE main."BANK_TRANSACTION"
(
    id       INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    clientId INTEGER NOT NULL REFERENCES CLIENT(id),
    amount   REAL    DEFAULT 0,
    datetime TEXT    NOT NULL
);

INSERT INTO main."CLIENT" (name, surname, cardNumber, cardType, cardExpire, pin, balance)
VALUES ('John', 'Doe', '1234567812345678', 'VISA', '12/25', '1234', 1000),
       ('Virtual', 'Museum', '8765432187654321', 'MASTERCARD', '08/24', '5678', 1000),
       ('Michael', 'Johnson', '5555444433332222', 'AMERICAN EXPRESS', '06/26', '9876', 1000);

INSERT INTO main."BANK_TRANSACTION" (clientId, amount, datetime)
VALUES (1, 100.00, '2023-06-27 09:00:00'),
       (1, 50.00, '2023-06-27 14:30:00'),
       (2, 75.50, '2023-06-27 12:15:00'),
       (3, 200.00, '2023-06-27 16:45:00');