DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='attendance' AND column_name='user_id') THEN
        ALTER TABLE attendance DROP COLUMN user_id;
    END IF;
END $$;

DROP TABLE IF EXISTS users CASCADE;
