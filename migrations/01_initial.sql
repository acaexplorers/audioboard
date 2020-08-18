DROP TABLE IF EXISTS `vocab_requests`;
DROP TABLE IF EXISTS `vocab_submissions`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE vocab_requests(
    id int NOT NULL AUTO_INCREMENT,
    author_uuid varchar(191) NOT NULL,
    submitted boolean DEFAULT FALSE,
    submitter_uuid varchar(191),
    transcription boolean NOT NULL,
    title varchar(255) NOT NULL,
    content TEXT,
    notes TEXT,
    audiofilepath varchar(255),
    tags TEXT,
    PRIMARY KEY (id)
);


CREATE TABLE `users` (
    id int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    name varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    email varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    password varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    remember_token varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    created_at timestamp NULL DEFAULT NULL,
    updated_at timestamp NULL DEFAULT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE `users`
ADD UNIQUE KEY `users_email_unique` (`email`);

INSERT INTO users
(
    name,
    email,
    password
) VALUES (
    'IJustDev',
    'ijustdev@royalzsoftware.de',
    'test'
);

CREATE TABLE vocab_submissions (
    id int NOT NULL AUTO_INCREMENT,
    request_id varchar (191) NOT NULL,
    author_uuid varchar (191) NOT NULL,
    content TEXT,
    audiofilepath varchar(255),
    PRIMARY KEY (id)
);
