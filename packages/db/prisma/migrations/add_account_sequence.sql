-- Create sequence for regular account numbers starting at 5001
CREATE SEQUENCE IF NOT EXISTS regular_account_number_seq START 5001;

-- Create function to get next account number
CREATE OR REPLACE FUNCTION get_next_account_number(user_role TEXT)
RETURNS INTEGER AS $$
BEGIN
  -- If it's the first super admin, return 1
  IF user_role = 'SUPER_ADMIN' AND NOT EXISTS (SELECT 1 FROM accounts WHERE account_number = 1) THEN
    RETURN 1;
  END IF;
  
  -- For all other users, use the sequence starting at 5001
  RETURN nextval('regular_account_number_seq');
END;
$$ LANGUAGE plpgsql; 