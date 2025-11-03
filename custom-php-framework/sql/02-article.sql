create table article
(
    id               integer not null
        constraint article_pk
            primary key autoincrement,
    title            text not null,
    content          text not null,
    author           text not null,
    publication_date datetime not null
);