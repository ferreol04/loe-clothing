-- ============================================================
-- Limite raisonnable de longueur sur les champs du formulaire de
-- contact, pour empêcher l'envoi de charges abusives via l'API
-- (au-delà du formulaire du site, ex. appels directs à l'API REST).
-- À exécuter dans Supabase → SQL Editor.
-- ============================================================

alter table messages
  add constraint messages_name_length check (char_length(name) <= 100),
  add constraint messages_email_length check (email is null or char_length(email) <= 255),
  add constraint messages_message_length check (char_length(message) <= 2000);
