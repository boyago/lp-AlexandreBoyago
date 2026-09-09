CREATE TABLE IF NOT EXISTS metrics_events (
  id CHAR(36) PRIMARY KEY,
  time BIGINT NOT NULL,
  visitor CHAR(64) NOT NULL,
  session CHAR(64) NOT NULL,
  name VARCHAR(32) NOT NULL,
  page VARCHAR(16) NOT NULL,
  section_id VARCHAR(24) NOT NULL DEFAULT '',
  game_id VARCHAR(24) NOT NULL DEFAULT '',
  button_id VARCHAR(48) NOT NULL DEFAULT '',
  depth SMALLINT NOT NULL DEFAULT 0,
  INDEX metrics_time (time)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS metrics_limits (
  bucket VARCHAR(120) PRIMARY KEY,
  hits INT NOT NULL,
  expires BIGINT NOT NULL,
  INDEX metrics_expiry (expires)
) ENGINE=InnoDB;
