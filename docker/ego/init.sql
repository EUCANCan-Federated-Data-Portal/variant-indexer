--
-- PostgreSQL database cluster dump
--

-- Started on 2023-01-09 12:04:53 EST

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- User Configurations
--








--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1
-- Dumped by pg_dump version 15.0

-- Started on 2023-01-09 12:04:53 EST

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

-- Completed on 2023-01-09 12:04:53 EST

--
-- PostgreSQL database dump complete
--

--
-- Database "ego" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1
-- Dumped by pg_dump version 15.0

-- Started on 2023-01-09 12:04:53 EST

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

--
-- TOC entry 3541 (class 1262 OID 16384)
-- Name: ego; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE ego WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE ego OWNER TO postgres;

\connect ego

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

--
-- TOC entry 2 (class 3079 OID 16488)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 3542 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 886 (class 1247 OID 16540)
-- Name: aclmask; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.aclmask AS ENUM (
    'READ',
    'WRITE',
    'DENY'
);


ALTER TYPE public.aclmask OWNER TO postgres;

--
-- TOC entry 904 (class 1247 OID 16649)
-- Name: applicationtype; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.applicationtype AS ENUM (
    'CLIENT',
    'ADMIN'
);


ALTER TYPE public.applicationtype OWNER TO postgres;

--
-- TOC entry 913 (class 1247 OID 16670)
-- Name: languagetype; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.languagetype AS ENUM (
    'ENGLISH',
    'FRENCH',
    'SPANISH'
);


ALTER TYPE public.languagetype OWNER TO postgres;

--
-- TOC entry 925 (class 1247 OID 16797)
-- Name: providertype; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.providertype AS ENUM (
    'GOOGLE',
    'FACEBOOK',
    'LINKEDIN',
    'GITHUB',
    'ORCID',
    'KEYCLOAK'
);


ALTER TYPE public.providertype OWNER TO postgres;

--
-- TOC entry 907 (class 1247 OID 16655)
-- Name: statustype; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.statustype AS ENUM (
    'APPROVED',
    'REJECTED',
    'DISABLED',
    'PENDING'
);


ALTER TYPE public.statustype OWNER TO postgres;

--
-- TOC entry 910 (class 1247 OID 16664)
-- Name: usertype; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.usertype AS ENUM (
    'USER',
    'ADMIN'
);


ALTER TYPE public.usertype OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 230 (class 1259 OID 16771)
-- Name: applicationpermission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.applicationpermission (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    policy_id uuid,
    application_id uuid,
    access_level public.aclmask NOT NULL
);


ALTER TABLE public.applicationpermission OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16810)
-- Name: defaultprovidertripwire; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.defaultprovidertripwire (
    id public.providertype NOT NULL
);


ALTER TABLE public.defaultprovidertripwire OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16399)
-- Name: egoapplication; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.egoapplication (
    name character varying(255) NOT NULL,
    clientid character varying(255) NOT NULL,
    clientsecret character varying(255) NOT NULL,
    redirecturi text,
    description text,
    status public.statustype DEFAULT 'PENDING'::public.statustype NOT NULL,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    type public.applicationtype DEFAULT 'CLIENT'::public.applicationtype NOT NULL,
    errorredirecturi text
);


ALTER TABLE public.egoapplication OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16424)
-- Name: egogroup; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.egogroup (
    name character varying(255) NOT NULL,
    description character varying(255),
    status public.statustype DEFAULT 'PENDING'::public.statustype NOT NULL,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL
);


ALTER TABLE public.egogroup OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16410)
-- Name: egouser; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.egouser (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying(255),
    type public.usertype DEFAULT 'USER'::public.usertype NOT NULL,
    firstname text DEFAULT ''::text NOT NULL,
    lastname text DEFAULT ''::text NOT NULL,
    createdat timestamp without time zone NOT NULL,
    lastlogin timestamp without time zone,
    status public.statustype DEFAULT 'PENDING'::public.statustype NOT NULL,
    preferredlanguage public.languagetype,
    providertype public.providertype DEFAULT 'GOOGLE'::public.providertype NOT NULL,
    providersubjectid character varying(255) NOT NULL
);


ALTER TABLE public.egouser OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16389)
-- Name: flyway_schema_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.flyway_schema_history (
    installed_rank integer NOT NULL,
    version character varying(50),
    description character varying(200) NOT NULL,
    type character varying(20) NOT NULL,
    script character varying(1000) NOT NULL,
    checksum integer,
    installed_by character varying(100) NOT NULL,
    installed_on timestamp without time zone DEFAULT now() NOT NULL,
    execution_time integer NOT NULL,
    success boolean NOT NULL
);


ALTER TABLE public.flyway_schema_history OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16437)
-- Name: groupapplication; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.groupapplication (
    group_id uuid NOT NULL,
    application_id uuid NOT NULL
);


ALTER TABLE public.groupapplication OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16574)
-- Name: grouppermission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.grouppermission (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    policy_id uuid,
    group_id uuid,
    access_level public.aclmask NOT NULL
);


ALTER TABLE public.grouppermission OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16790)
-- Name: inittripwire; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inittripwire (
    initialized integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.inittripwire OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16547)
-- Name: policy; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.policy (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    owner uuid,
    name character varying(255) NOT NULL
);


ALTER TABLE public.policy OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16740)
-- Name: refreshtoken; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refreshtoken (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    jti uuid NOT NULL,
    issuedate timestamp without time zone NOT NULL,
    expirydate timestamp without time zone NOT NULL
);


ALTER TABLE public.refreshtoken OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16605)
-- Name: token; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.token (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(2048) NOT NULL,
    owner uuid NOT NULL,
    issuedate timestamp without time zone DEFAULT now() NOT NULL,
    isrevoked boolean DEFAULT false NOT NULL,
    description character varying(255),
    expirydate timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.token OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16620)
-- Name: tokenscope; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tokenscope (
    token_id uuid NOT NULL,
    policy_id uuid NOT NULL,
    access_level public.aclmask NOT NULL
);


ALTER TABLE public.tokenscope OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16472)
-- Name: userapplication; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.userapplication (
    user_id uuid NOT NULL,
    application_id uuid NOT NULL
);


ALTER TABLE public.userapplication OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16455)
-- Name: usergroup; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usergroup (
    user_id uuid NOT NULL,
    group_id uuid NOT NULL
);


ALTER TABLE public.usergroup OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16559)
-- Name: userpermission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.userpermission (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    policy_id uuid,
    user_id uuid,
    access_level public.aclmask NOT NULL
);


ALTER TABLE public.userpermission OWNER TO postgres;

--
-- TOC entry 3533 (class 0 OID 16771)
-- Dependencies: 230
-- Data for Name: applicationpermission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.applicationpermission (id, policy_id, application_id, access_level) FROM stdin;
\.


--
-- TOC entry 3535 (class 0 OID 16810)
-- Dependencies: 232
-- Data for Name: defaultprovidertripwire; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.defaultprovidertripwire (id) FROM stdin;
GOOGLE
\.


--
-- TOC entry 3521 (class 0 OID 16399)
-- Dependencies: 218
-- Data for Name: egoapplication; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.egoapplication (name, clientid, clientsecret, redirecturi, description, status, id, type, errorredirecturi) FROM stdin;
indexer	indexer	indexersecret	na	\N	APPROVED	51bfd367-5aae-49f1-95d0-8af7fe3be2a5	CLIENT	na
\.


--
-- TOC entry 3523 (class 0 OID 16424)
-- Dependencies: 220
-- Data for Name: egogroup; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.egogroup (name, description, status, id) FROM stdin;
DATA_READ	Read Permissions for Song and Score	APPROVED	c6f6f700-299f-4c9c-b4e3-fdd2faba26a8
DATA_WRITE	Write Permissions for Song and Score	APPROVED	1f85373e-c664-4ec0-a255-9bb0c01d328d
\.


--
-- TOC entry 3522 (class 0 OID 16410)
-- Dependencies: 219
-- Data for Name: egouser; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.egouser (id, email, type, firstname, lastname, createdat, lastlogin, status, preferredlanguage, providertype, providersubjectid) FROM stdin;
\.


--
-- TOC entry 3520 (class 0 OID 16389)
-- Dependencies: 217
-- Data for Name: flyway_schema_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.flyway_schema_history (installed_rank, version, description, type, script, checksum, installed_by, installed_on, execution_time, success) FROM stdin;
1	1	initial database	SQL	V1__initial_database.sql	-556387533	postgres	2023-01-09 15:11:50.698346	78	t
2	1.1	complete uuid migration	SPRING_JDBC	db.migration.V1_1__complete_uuid_migration	\N	postgres	2023-01-09 15:11:50.82358	213	t
3	1.2	acl expansion	SQL	V1_2__acl_expansion.sql	-125082215	postgres	2023-01-09 15:11:51.068648	28	t
4	1.3	string to date	SPRING_JDBC	db.migration.V1_3__string_to_date	\N	postgres	2023-01-09 15:11:51.108606	61	t
5	1.4	score integration	SQL	V1_4__score_integration.sql	323452398	postgres	2023-01-09 15:11:51.185294	15	t
6	1.5	table renaming	SQL	V1_5__table_renaming.sql	480984865	postgres	2023-01-09 15:11:51.214803	24	t
7	1.6	add not null constraint	SQL	V1_6__add_not_null_constraint.sql	1562044084	postgres	2023-01-09 15:11:51.251497	21	t
8	1.7	token modification	SQL	V1_7__token_modification.sql	-11736908	postgres	2023-01-09 15:11:51.285757	9	t
9	1.8	application types	SQL	V1_8__application_types.sql	-1894533468	postgres	2023-01-09 15:11:51.303806	6	t
10	1.9	new enum types	SQL	V1_9__new_enum_types.sql	1135272560	postgres	2023-01-09 15:11:51.318681	69	t
11	1.10	remove apps from apitokens	SQL	V1_10__remove_apps_from_apitokens.sql	-1412739333	postgres	2023-01-09 15:11:51.420378	9	t
12	1.11	add expiry date api tokens	SQL	V1_11__add_expiry_date_api_tokens.sql	-774407414	postgres	2023-01-09 15:11:51.449191	6	t
13	1.12	egoapplication unique constraints	SQL	V1_12__egoapplication_unique_constraints.sql	1415229200	postgres	2023-01-09 15:11:51.465307	9	t
14	1.13	fname lname not null constraints	SQL	V1_13__fname_lname_not_null_constraints.sql	148150980	postgres	2023-01-09 15:11:51.485627	8	t
15	1.14	indices	SQL	V1_14__indices.sql	1170056158	postgres	2023-01-09 15:11:51.544975	58	t
16	1.15	add refresh token table	SQL	V1_15__add_refresh_token_table.sql	-82612493	postgres	2023-01-09 15:11:51.611793	12	t
17	1.15.5	remove duplicate joins	SQL	V1_15_5__remove_duplicate_joins.sql	246155551	postgres	2023-01-09 15:11:51.638346	18	t
18	1.16	add primary key constraint to associations	SQL	V1_16__add_primary_key_constraint_to_associations.sql	812789727	postgres	2023-01-09 15:11:51.668536	17	t
19	1.17	add application permissions	SQL	V1_17__add_application_permissions.sql	-1643216609	postgres	2023-01-09 15:11:51.701258	23	t
20	1.18	ego init	SQL	V1_18__ego_init.sql	-10808138	postgres	2023-01-09 15:11:51.734383	8	t
21	1.19	add identity provider to user	SQL	V1_19__add_identity_provider_to_user.sql	-2041141263	postgres	2023-01-09 15:11:51.755123	19	t
22	1.20	keycloak provider type	SQL	V1_20__keycloak_provider_type.sql	1853977499	postgres	2023-01-09 15:11:51.796175	11	t
23	1.21	add application error redirect	SQL	V1_21__add_application_error_redirect.sql	-2027596411	postgres	2023-01-09 15:11:51.803565	7	t
\.


--
-- TOC entry 3524 (class 0 OID 16437)
-- Dependencies: 221
-- Data for Name: groupapplication; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.groupapplication (group_id, application_id) FROM stdin;
1f85373e-c664-4ec0-a255-9bb0c01d328d	51bfd367-5aae-49f1-95d0-8af7fe3be2a5
\.


--
-- TOC entry 3529 (class 0 OID 16574)
-- Dependencies: 226
-- Data for Name: grouppermission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.grouppermission (id, policy_id, group_id, access_level) FROM stdin;
3d9158d8-50cd-44fb-b811-033b90dac19a	f18613f0-6b21-49b9-ae21-dc039e47fde1	c6f6f700-299f-4c9c-b4e3-fdd2faba26a8	READ
574fad13-91e4-4fa1-8d9d-fd462bff3307	2b2d7119-db32-43e4-807e-1970c46fa314	1f85373e-c664-4ec0-a255-9bb0c01d328d	WRITE
74f067b2-40f2-4094-9ad5-f6b988943a61	f18613f0-6b21-49b9-ae21-dc039e47fde1	1f85373e-c664-4ec0-a255-9bb0c01d328d	WRITE
d53d29d7-dc32-448d-804c-88ce82573e43	2b2d7119-db32-43e4-807e-1970c46fa314	c6f6f700-299f-4c9c-b4e3-fdd2faba26a8	READ
\.


--
-- TOC entry 3534 (class 0 OID 16790)
-- Dependencies: 231
-- Data for Name: inittripwire; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inittripwire (initialized) FROM stdin;
\.


--
-- TOC entry 3527 (class 0 OID 16547)
-- Dependencies: 224
-- Data for Name: policy; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.policy (id, owner, name) FROM stdin;
f18613f0-6b21-49b9-ae21-dc039e47fde1	\N	song
2b2d7119-db32-43e4-807e-1970c46fa314	\N	score
\.


--
-- TOC entry 3532 (class 0 OID 16740)
-- Dependencies: 229
-- Data for Name: refreshtoken; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refreshtoken (id, user_id, jti, issuedate, expirydate) FROM stdin;
\.


--
-- TOC entry 3530 (class 0 OID 16605)
-- Dependencies: 227
-- Data for Name: token; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.token (id, name, owner, issuedate, isrevoked, description, expirydate) FROM stdin;
\.


--
-- TOC entry 3531 (class 0 OID 16620)
-- Dependencies: 228
-- Data for Name: tokenscope; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tokenscope (token_id, policy_id, access_level) FROM stdin;
\.


--
-- TOC entry 3526 (class 0 OID 16472)
-- Dependencies: 223
-- Data for Name: userapplication; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.userapplication (user_id, application_id) FROM stdin;
\.


--
-- TOC entry 3525 (class 0 OID 16455)
-- Dependencies: 222
-- Data for Name: usergroup; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usergroup (user_id, group_id) FROM stdin;
\.


--
-- TOC entry 3528 (class 0 OID 16559)
-- Dependencies: 225
-- Data for Name: userpermission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.userpermission (id, policy_id, user_id, access_level) FROM stdin;
\.


--
-- TOC entry 3353 (class 2606 OID 16776)
-- Name: applicationpermission applicationpermission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applicationpermission
    ADD CONSTRAINT applicationpermission_pkey PRIMARY KEY (id);


--
-- TOC entry 3360 (class 2606 OID 16814)
-- Name: defaultprovidertripwire defaultprovidertripwire_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.defaultprovidertripwire
    ADD CONSTRAINT defaultprovidertripwire_pkey PRIMARY KEY (id);


--
-- TOC entry 3303 (class 2606 OID 16409)
-- Name: egoapplication egoapplication_clientid_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.egoapplication
    ADD CONSTRAINT egoapplication_clientid_key UNIQUE (clientid);


--
-- TOC entry 3305 (class 2606 OID 16725)
-- Name: egoapplication egoapplication_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.egoapplication
    ADD CONSTRAINT egoapplication_name_key UNIQUE (name);


--
-- TOC entry 3307 (class 2606 OID 16516)
-- Name: egoapplication egoapplication_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.egoapplication
    ADD CONSTRAINT egoapplication_pkey PRIMARY KEY (id);


--
-- TOC entry 3313 (class 2606 OID 16434)
-- Name: egogroup egogroup_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.egogroup
    ADD CONSTRAINT egogroup_name_key UNIQUE (name);


--
-- TOC entry 3315 (class 2606 OID 16518)
-- Name: egogroup egogroup_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.egogroup
    ADD CONSTRAINT egogroup_pkey PRIMARY KEY (id);


--
-- TOC entry 3309 (class 2606 OID 16418)
-- Name: egouser egouser_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.egouser
    ADD CONSTRAINT egouser_pkey PRIMARY KEY (id);


--
-- TOC entry 3311 (class 2606 OID 16809)
-- Name: egouser egouser_providertype_providersubjectid_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.egouser
    ADD CONSTRAINT egouser_providertype_providersubjectid_key UNIQUE (providertype, providersubjectid);


--
-- TOC entry 3300 (class 2606 OID 16396)
-- Name: flyway_schema_history flyway_schema_history_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flyway_schema_history
    ADD CONSTRAINT flyway_schema_history_pk PRIMARY KEY (installed_rank);


--
-- TOC entry 3317 (class 2606 OID 16770)
-- Name: groupapplication groupapplication_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groupapplication
    ADD CONSTRAINT groupapplication_pkey PRIMARY KEY (group_id, application_id);


--
-- TOC entry 3335 (class 2606 OID 16578)
-- Name: grouppermission grouppermission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grouppermission
    ADD CONSTRAINT grouppermission_pkey PRIMARY KEY (id);


--
-- TOC entry 3358 (class 2606 OID 16795)
-- Name: inittripwire inittripwire_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inittripwire
    ADD CONSTRAINT inittripwire_pkey PRIMARY KEY (initialized);


--
-- TOC entry 3326 (class 2606 OID 16553)
-- Name: policy policy_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.policy
    ADD CONSTRAINT policy_name_key UNIQUE (name);


--
-- TOC entry 3328 (class 2606 OID 16551)
-- Name: policy policy_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.policy
    ADD CONSTRAINT policy_pkey PRIMARY KEY (id);


--
-- TOC entry 3347 (class 2606 OID 16748)
-- Name: refreshtoken refreshtoken_jti_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refreshtoken
    ADD CONSTRAINT refreshtoken_jti_key UNIQUE (jti);


--
-- TOC entry 3349 (class 2606 OID 16744)
-- Name: refreshtoken refreshtoken_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refreshtoken
    ADD CONSTRAINT refreshtoken_pkey PRIMARY KEY (id);


--
-- TOC entry 3351 (class 2606 OID 16746)
-- Name: refreshtoken refreshtoken_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refreshtoken
    ADD CONSTRAINT refreshtoken_user_id_key UNIQUE (user_id);


--
-- TOC entry 3341 (class 2606 OID 16647)
-- Name: token token_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT token_name_key UNIQUE (name);


--
-- TOC entry 3343 (class 2606 OID 16614)
-- Name: token token_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT token_pkey PRIMARY KEY (id);


--
-- TOC entry 3324 (class 2606 OID 16768)
-- Name: userapplication userapplication_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userapplication
    ADD CONSTRAINT userapplication_pkey PRIMARY KEY (user_id, application_id);


--
-- TOC entry 3322 (class 2606 OID 16766)
-- Name: usergroup usergroup_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usergroup
    ADD CONSTRAINT usergroup_pkey PRIMARY KEY (group_id, user_id);


--
-- TOC entry 3333 (class 2606 OID 16563)
-- Name: userpermission userpermission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userpermission
    ADD CONSTRAINT userpermission_pkey PRIMARY KEY (id);


--
-- TOC entry 3301 (class 1259 OID 16397)
-- Name: flyway_schema_history_s_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX flyway_schema_history_s_idx ON public.flyway_schema_history USING btree (success);


--
-- TOC entry 3354 (class 1259 OID 16787)
-- Name: idx_applicationpermission_application; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_applicationpermission_application ON public.applicationpermission USING btree (application_id);


--
-- TOC entry 3355 (class 1259 OID 16789)
-- Name: idx_applicationpermission_both; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_applicationpermission_both ON public.applicationpermission USING btree (application_id, policy_id);


--
-- TOC entry 3356 (class 1259 OID 16788)
-- Name: idx_applicationpermission_policy; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_applicationpermission_policy ON public.applicationpermission USING btree (policy_id);


--
-- TOC entry 3336 (class 1259 OID 16736)
-- Name: idx_grouppermission_both; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_grouppermission_both ON public.grouppermission USING btree (group_id, policy_id);


--
-- TOC entry 3337 (class 1259 OID 16734)
-- Name: idx_grouppermission_group; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_grouppermission_group ON public.grouppermission USING btree (group_id);


--
-- TOC entry 3338 (class 1259 OID 16735)
-- Name: idx_grouppermission_policy; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_grouppermission_policy ON public.grouppermission USING btree (policy_id);


--
-- TOC entry 3339 (class 1259 OID 16737)
-- Name: idx_token_owner; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_token_owner ON public.token USING btree (owner);


--
-- TOC entry 3344 (class 1259 OID 16738)
-- Name: idx_tokenscope; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tokenscope ON public.tokenscope USING btree (token_id, policy_id, access_level);


--
-- TOC entry 3345 (class 1259 OID 16739)
-- Name: idx_tokenscope_policy; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tokenscope_policy ON public.tokenscope USING btree (policy_id);


--
-- TOC entry 3318 (class 1259 OID 16730)
-- Name: idx_usergroup_both; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usergroup_both ON public.usergroup USING btree (user_id, group_id);


--
-- TOC entry 3319 (class 1259 OID 16729)
-- Name: idx_usergroup_group; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usergroup_group ON public.usergroup USING btree (group_id);


--
-- TOC entry 3320 (class 1259 OID 16728)
-- Name: idx_usergroup_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usergroup_user ON public.usergroup USING btree (user_id);


--
-- TOC entry 3329 (class 1259 OID 16733)
-- Name: idx_userpermission_both; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_userpermission_both ON public.userpermission USING btree (user_id, policy_id);


--
-- TOC entry 3330 (class 1259 OID 16732)
-- Name: idx_userpermission_policy; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_userpermission_policy ON public.userpermission USING btree (policy_id);


--
-- TOC entry 3331 (class 1259 OID 16731)
-- Name: idx_userpermission_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_userpermission_user ON public.userpermission USING btree (user_id);


--
-- TOC entry 3376 (class 2606 OID 16782)
-- Name: applicationpermission applicationpermission_application_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applicationpermission
    ADD CONSTRAINT applicationpermission_application_fkey FOREIGN KEY (application_id) REFERENCES public.egoapplication(id);


--
-- TOC entry 3377 (class 2606 OID 16777)
-- Name: applicationpermission applicationpermission_policy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applicationpermission
    ADD CONSTRAINT applicationpermission_policy_fkey FOREIGN KEY (policy_id) REFERENCES public.policy(id);


--
-- TOC entry 3361 (class 2606 OID 16524)
-- Name: groupapplication groupapplication_application_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groupapplication
    ADD CONSTRAINT groupapplication_application_fkey FOREIGN KEY (application_id) REFERENCES public.egoapplication(id);


--
-- TOC entry 3362 (class 2606 OID 16519)
-- Name: groupapplication groupapplication_group_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groupapplication
    ADD CONSTRAINT groupapplication_group_fkey FOREIGN KEY (group_id) REFERENCES public.egogroup(id);


--
-- TOC entry 3370 (class 2606 OID 16584)
-- Name: grouppermission grouppermission_group_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grouppermission
    ADD CONSTRAINT grouppermission_group_fkey FOREIGN KEY (group_id) REFERENCES public.egogroup(id);


--
-- TOC entry 3371 (class 2606 OID 16579)
-- Name: grouppermission grouppermission_policy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grouppermission
    ADD CONSTRAINT grouppermission_policy_fkey FOREIGN KEY (policy_id) REFERENCES public.policy(id);


--
-- TOC entry 3367 (class 2606 OID 16554)
-- Name: policy policy_owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.policy
    ADD CONSTRAINT policy_owner_fkey FOREIGN KEY (owner) REFERENCES public.egogroup(id);


--
-- TOC entry 3375 (class 2606 OID 16749)
-- Name: refreshtoken refreshtoken_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refreshtoken
    ADD CONSTRAINT refreshtoken_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.egouser(id);


--
-- TOC entry 3372 (class 2606 OID 16615)
-- Name: token token_owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT token_owner_fkey FOREIGN KEY (owner) REFERENCES public.egouser(id);


--
-- TOC entry 3373 (class 2606 OID 16628)
-- Name: tokenscope tokenscope_policy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokenscope
    ADD CONSTRAINT tokenscope_policy_fkey FOREIGN KEY (policy_id) REFERENCES public.policy(id);


--
-- TOC entry 3374 (class 2606 OID 16623)
-- Name: tokenscope tokenscope_token_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokenscope
    ADD CONSTRAINT tokenscope_token_fkey FOREIGN KEY (token_id) REFERENCES public.token(id);


--
-- TOC entry 3365 (class 2606 OID 16534)
-- Name: userapplication userapplication_application_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userapplication
    ADD CONSTRAINT userapplication_application_fkey FOREIGN KEY (application_id) REFERENCES public.egoapplication(id);


--
-- TOC entry 3366 (class 2606 OID 16483)
-- Name: userapplication userapplication_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userapplication
    ADD CONSTRAINT userapplication_user_fkey FOREIGN KEY (user_id) REFERENCES public.egouser(id);


--
-- TOC entry 3363 (class 2606 OID 16529)
-- Name: usergroup usergroup_group_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usergroup
    ADD CONSTRAINT usergroup_group_fkey FOREIGN KEY (group_id) REFERENCES public.egogroup(id);


--
-- TOC entry 3364 (class 2606 OID 16466)
-- Name: usergroup usergroup_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usergroup
    ADD CONSTRAINT usergroup_user_fkey FOREIGN KEY (user_id) REFERENCES public.egouser(id);


--
-- TOC entry 3368 (class 2606 OID 16564)
-- Name: userpermission userpermission_policy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userpermission
    ADD CONSTRAINT userpermission_policy_fkey FOREIGN KEY (policy_id) REFERENCES public.policy(id);


--
-- TOC entry 3369 (class 2606 OID 16569)
-- Name: userpermission userpermission_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userpermission
    ADD CONSTRAINT userpermission_user_fkey FOREIGN KEY (user_id) REFERENCES public.egouser(id);


-- Completed on 2023-01-09 12:04:54 EST

--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1
-- Dumped by pg_dump version 15.0

-- Started on 2023-01-09 12:04:54 EST

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

-- Completed on 2023-01-09 12:04:54 EST

--
-- PostgreSQL database dump complete
--

-- Completed on 2023-01-09 12:04:54 EST

--
-- PostgreSQL database cluster dump complete
--

