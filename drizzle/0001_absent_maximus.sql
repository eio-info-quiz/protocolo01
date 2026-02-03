CREATE TABLE `quiz_responses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(255),
	`baby_age` varchar(100) NOT NULL,
	`wake_ups` varchar(100) NOT NULL,
	`sleep_method` varchar(255) NOT NULL,
	`has_routine` varchar(50) NOT NULL,
	`mother_feeling` varchar(255) NOT NULL,
	`tried_other_methods` varchar(50) NOT NULL,
	`fbclid` varchar(500),
	`completed_at` timestamp NOT NULL DEFAULT (now()),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quiz_responses_id` PRIMARY KEY(`id`)
);
