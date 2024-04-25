alter table "public"."gems" add column "action_items" text[];

alter table "public"."gems" add column "bible_verses" text[];

alter table "public"."gems" add column "follow_up" text[];

alter table "public"."gems" add column "main_points" text[];

alter table "public"."gems" add column "related_topics" text[];

alter table "public"."gems" add column "stories" text[];

CREATE TRIGGER "gem-to-pipedream" AFTER INSERT ON public.gems FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://eofky564q3q548o.m.pipedream.net', 'POST', '{"Content-type":"application/json"}', '{}', '1000');


