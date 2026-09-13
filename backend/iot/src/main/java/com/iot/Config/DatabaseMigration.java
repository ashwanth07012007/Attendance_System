package com.iot.Config;

import jakarta.annotation.PostConstruct;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseMigration {

    private final JdbcTemplate jdbc;

    public DatabaseMigration(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @PostConstruct
    public void migrate() {
        // Drop stale user_id column from attendance if it exists
        Boolean hasUserIdCol = jdbc.queryForObject(
            "SELECT EXISTS (SELECT 1 FROM information_schema.columns " +
            "WHERE table_name='attendance' AND column_name='user_id')",
            Boolean.class
        );
        if (Boolean.TRUE.equals(hasUserIdCol)) {
            jdbc.execute("ALTER TABLE attendance DROP COLUMN user_id");
        }

        // Drop old users table if it exists (replaced by app_users)
        jdbc.execute("DROP TABLE IF EXISTS users CASCADE");
    }
}
