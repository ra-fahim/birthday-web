-- Optional cleanup: removes the member-to-member chat tables created by the old 005_social_chat.sql.
-- WARNING: this permanently deletes all existing conversations and messages. Skip it if you want to keep that data.
drop table if exists public.messages cascade;
drop table if exists public.conversations cascade;
