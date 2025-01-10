

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."meal_category" AS ENUM (
    'Carnes',
    'Pescados',
    'Vegetariano',
    'Pasta',
    'Sopas',
    'Ensaladas'
);


ALTER TYPE "public"."meal_category" OWNER TO "postgres";


CREATE TYPE "public"."meal_type" AS ENUM (
    'desayuno',
    'comida',
    'cena',
    'snack'
);


ALTER TYPE "public"."meal_type" OWNER TO "postgres";


CREATE TYPE "public"."unit_type" AS ENUM (
    'sobre',
    'gramo',
    'unidad',
    'pizca',
    'cucharada',
    'cucharadita'
);


ALTER TYPE "public"."unit_type" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."ingredients" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL
);


ALTER TABLE "public"."ingredients" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "full_name" "text" NOT NULL,
    "user_type" "text" NOT NULL,
    "specialization" "text",
    "license_number" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "profiles_user_type_check" CHECK (("user_type" = ANY (ARRAY['user'::"text", 'nutritionist'::"text"])))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."recipe_ingredients" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "recipe_id" "uuid",
    "ingredient_id" "uuid",
    "quantity" numeric NOT NULL,
    "unit" "public"."unit_type" NOT NULL
);


ALTER TABLE "public"."recipe_ingredients" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."recipes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "side_dish" "text",
    "meal_type" "public"."meal_type" NOT NULL,
    "category" "public"."meal_category" NOT NULL,
    "servings" integer NOT NULL,
    "calories" "text",
    "energy_kj" "text",
    "fats" "text",
    "saturated_fats" "text",
    "carbohydrates" "text",
    "sugars" "text",
    "fiber" "text",
    "proteins" "text",
    "sodium" "text",
    "prep_time" "text",
    "instructions" "jsonb" NOT NULL,
    "url" "text",
    "pdf_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."recipes" OWNER TO "postgres";


ALTER TABLE ONLY "public"."ingredients"
    ADD CONSTRAINT "ingredients_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."ingredients"
    ADD CONSTRAINT "ingredients_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."recipe_ingredients"
    ADD CONSTRAINT "recipe_ingredients_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."recipe_ingredients"
    ADD CONSTRAINT "recipe_ingredients_recipe_id_ingredient_id_key" UNIQUE ("recipe_id", "ingredient_id");



ALTER TABLE ONLY "public"."recipes"
    ADD CONSTRAINT "recipes_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."recipes"
    ADD CONSTRAINT "recipes_pkey" PRIMARY KEY ("id");



CREATE OR REPLACE TRIGGER "update_profiles_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "update_recipes_updated_at" BEFORE UPDATE ON "public"."recipes" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."recipe_ingredients"
    ADD CONSTRAINT "recipe_ingredients_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."recipe_ingredients"
    ADD CONSTRAINT "recipe_ingredients_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE CASCADE;



CREATE POLICY "Solo admins pueden modificar ingredientes" ON "public"."ingredients" TO "authenticated" USING (("auth"."uid"() IN ( SELECT "profiles"."user_id"
   FROM "public"."profiles"
  WHERE ("profiles"."user_type" = 'nutritionist'::"text"))));



CREATE POLICY "Solo admins pueden modificar recetas" ON "public"."recipes" TO "authenticated" USING (("auth"."uid"() IN ( SELECT "profiles"."user_id"
   FROM "public"."profiles"
  WHERE ("profiles"."user_type" = 'nutritionist'::"text"))));



CREATE POLICY "Solo admins pueden modificar recipe_ingredients" ON "public"."recipe_ingredients" TO "authenticated" USING (("auth"."uid"() IN ( SELECT "profiles"."user_id"
   FROM "public"."profiles"
  WHERE ("profiles"."user_type" = 'nutritionist'::"text"))));



CREATE POLICY "Todos pueden leer ingredientes" ON "public"."ingredients" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Todos pueden leer recetas" ON "public"."recipes" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Todos pueden leer recipe_ingredients" ON "public"."recipe_ingredients" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Users can insert own profile" ON "public"."profiles" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can read all profiles" ON "public"."profiles" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Users can read own profile" ON "public"."profiles" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own profile" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."ingredients" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."recipe_ingredients" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."recipes" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




















































































































































































GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "service_role";


















GRANT ALL ON TABLE "public"."ingredients" TO "anon";
GRANT ALL ON TABLE "public"."ingredients" TO "authenticated";
GRANT ALL ON TABLE "public"."ingredients" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."recipe_ingredients" TO "anon";
GRANT ALL ON TABLE "public"."recipe_ingredients" TO "authenticated";
GRANT ALL ON TABLE "public"."recipe_ingredients" TO "service_role";



GRANT ALL ON TABLE "public"."recipes" TO "anon";
GRANT ALL ON TABLE "public"."recipes" TO "authenticated";
GRANT ALL ON TABLE "public"."recipes" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
