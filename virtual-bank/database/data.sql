PRAGMA default_cache_size = 0;
PRAGMA cache_size = 0;
create table main."BANK_TRANSACTION"
(
    id       integer not null
        constraint id primary key autoincrement,
    clientId integer not null,
    amount   REAL default 0,
    datetime TEXT    not null
);