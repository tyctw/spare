-- A saved score's optional free-text field is a personal note, not an
-- admissions area. Rename it so the stored schema matches the user interface.
alter table public.member_score_records rename column region to note;
