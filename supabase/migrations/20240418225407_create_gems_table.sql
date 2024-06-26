create table "public"."gems" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "profile_id" uuid,
    "title" text,
    "audio_url" text,
    "duration" numeric,
    "fulfilled" boolean,
    "public" boolean,
    "tags" text,
    "summary" text,
    "transcript" text,
    "additional_info" text,
    "author" text
);


alter table "public"."gems" enable row level security;

CREATE UNIQUE INDEX gems_pkey ON public.gems USING btree (id);

alter table "public"."gems" add constraint "gems_pkey" PRIMARY KEY using index "gems_pkey";

alter table "public"."gems" add constraint "gems_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) not valid;

alter table "public"."gems" validate constraint "gems_profile_id_fkey";

create policy "Enable insert for authenticated users only"
on "public"."gems"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."gems"
as permissive
for select
to public
using (true);



