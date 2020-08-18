ALTER TABLE vocab_submissions
ADD accepted boolean DEFAULT 0;

ALTER TABLE vocab_requests
ADD submission_id int DEFAULT NULL;
