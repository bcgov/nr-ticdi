--
-- PostgreSQL database dump
--

-- Dumped from database version 15.6
-- Dumped by pg_dump version 15.7

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
-- Name: USERS; Type: SCHEMA; Schema: -; Owner: nr-ticdi
--

-- CREATE SCHEMA "USERS";


ALTER SCHEMA "USERS" OWNER TO "nr-ticdi";

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: nr-ticdi
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO "nr-ticdi";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: flyway_schema_history; Type: TABLE; Schema: USERS; Owner: nr-ticdi
--

-- CREATE TABLE "USERS".flyway_schema_history (
--     installed_rank integer NOT NULL,
--     version character varying(50),
--     description character varying(200) NOT NULL,
--     type character varying(20) NOT NULL,
--     script character varying(1000) NOT NULL,
--     checksum integer,
--     installed_by character varying(100) NOT NULL,
--     installed_on timestamp without time zone DEFAULT now() NOT NULL,
--     execution_time integer NOT NULL,
--     success boolean NOT NULL
-- );


-- ALTER TABLE "USERS".flyway_schema_history OWNER TO "nr-ticdi";

--
-- Name: document_data; Type: TABLE; Schema: public; Owner: nr-ticdi
--

CREATE TABLE public.document_data (
    id integer NOT NULL,
    dtid integer,
    template_id integer,
    status character varying,
    active boolean,
    create_userid character varying,
    update_userid character varying,
    create_timestamp timestamp without time zone DEFAULT now() NOT NULL,
    update_timestamp timestamp without time zone DEFAULT now() NOT NULL,
    "documentTypeId" integer
);


ALTER TABLE public.document_data OWNER TO "nr-ticdi";

--
-- Name: document_data_id_seq; Type: SEQUENCE; Schema: public; Owner: nr-ticdi
--

CREATE SEQUENCE public.document_data_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.document_data_id_seq OWNER TO "nr-ticdi";

--
-- Name: document_data_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nr-ticdi
--

ALTER SEQUENCE public.document_data_id_seq OWNED BY public.document_data.id;


--
-- Name: document_data_log; Type: TABLE; Schema: public; Owner: nr-ticdi
--

CREATE TABLE public.document_data_log (
    id integer NOT NULL,
    dtid integer,
    document_type_id integer,
    document_data_id integer,
    document_template_id integer,
    request_app_user character varying,
    request_json character varying,
    create_userid character varying,
    update_userid character varying,
    create_timestamp timestamp without time zone DEFAULT now(),
    update_timestamp timestamp without time zone DEFAULT now()
);


ALTER TABLE public.document_data_log OWNER TO "nr-ticdi";

--
-- Name: document_data_log_id_seq; Type: SEQUENCE; Schema: public; Owner: nr-ticdi
--

CREATE SEQUENCE public.document_data_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.document_data_log_id_seq OWNER TO "nr-ticdi";

--
-- Name: document_data_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nr-ticdi
--

ALTER SEQUENCE public.document_data_log_id_seq OWNED BY public.document_data_log.id;


--
-- Name: document_data_provision; Type: TABLE; Schema: public; Owner: nr-ticdi
--

CREATE TABLE public.document_data_provision (
    id integer NOT NULL,
    "documentTypeProvisionId" integer,
    "documentProvisionId" integer,
    "documentDataId" integer
);


ALTER TABLE public.document_data_provision OWNER TO "nr-ticdi";

--
-- Name: document_data_provision_id_seq; Type: SEQUENCE; Schema: public; Owner: nr-ticdi
--

CREATE SEQUENCE public.document_data_provision_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.document_data_provision_id_seq OWNER TO "nr-ticdi";

--
-- Name: document_data_provision_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nr-ticdi
--

ALTER SEQUENCE public.document_data_provision_id_seq OWNED BY public.document_data_provision.id;


--
-- Name: document_data_variable; Type: TABLE; Schema: public; Owner: nr-ticdi
--

CREATE TABLE public.document_data_variable (
    id integer NOT NULL,
    data_variable_value character varying,
    "documentVariableId" integer,
    "documentDataId" integer
);


ALTER TABLE public.document_data_variable OWNER TO "nr-ticdi";

--
-- Name: document_data_variable_id_seq; Type: SEQUENCE; Schema: public; Owner: nr-ticdi
--

CREATE SEQUENCE public.document_data_variable_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.document_data_variable_id_seq OWNER TO "nr-ticdi";

--
-- Name: document_data_variable_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nr-ticdi
--

ALTER SEQUENCE public.document_data_variable_id_seq OWNED BY public.document_data_variable.id;


--
-- Name: document_template; Type: TABLE; Schema: public; Owner: nr-ticdi
--

CREATE TABLE public.document_template (
    id integer NOT NULL,
    template_version integer NOT NULL,
    template_author character varying NOT NULL,
    active_flag boolean NOT NULL,
    is_deleted boolean NOT NULL,
    mime_type character varying NOT NULL,
    file_name character varying NOT NULL,
    the_file character varying NOT NULL,
    comments character varying NOT NULL,
    create_userid character varying NOT NULL,
    update_userid character varying NOT NULL,
    create_timestamp timestamp without time zone DEFAULT now() NOT NULL,
    update_timestamp timestamp without time zone DEFAULT now() NOT NULL,
    "documentTypeId" integer
);


ALTER TABLE public.document_template OWNER TO "nr-ticdi";

--
-- Name: document_template_id_seq; Type: SEQUENCE; Schema: public; Owner: nr-ticdi
--

CREATE SEQUENCE public.document_template_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.document_template_id_seq OWNER TO "nr-ticdi";

--
-- Name: document_template_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nr-ticdi
--

ALTER SEQUENCE public.document_template_id_seq OWNED BY public.document_template.id;


--
-- Name: document_type; Type: TABLE; Schema: public; Owner: nr-ticdi
--

CREATE TABLE public.document_type (
    id integer NOT NULL,
    name character varying NOT NULL,
    created_by character varying,
    created_date timestamp without time zone,
    create_userid character varying NOT NULL,
    update_userid character varying NOT NULL,
    create_timestamp timestamp without time zone DEFAULT now() NOT NULL,
    update_timestamp timestamp without time zone DEFAULT now() NOT NULL,
    prefix character varying(50) DEFAULT ''::character varying,
    active boolean
);


ALTER TABLE public.document_type OWNER TO "nr-ticdi";

--
-- Name: document_type_id_seq; Type: SEQUENCE; Schema: public; Owner: nr-ticdi
--

CREATE SEQUENCE public.document_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.document_type_id_seq OWNER TO "nr-ticdi";

--
-- Name: document_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nr-ticdi
--

ALTER SEQUENCE public.document_type_id_seq OWNED BY public.document_type.id;


--
-- Name: document_type_provision; Type: TABLE; Schema: public; Owner: nr-ticdi
--

CREATE TABLE public.document_type_provision (
    id integer NOT NULL,
    associated boolean NOT NULL,
    sequence_value integer,
    type character varying,
    "documentTypeId" integer,
    "provisionId" integer,
    "provisionGroupId" integer
);


ALTER TABLE public.document_type_provision OWNER TO "nr-ticdi";

--
-- Name: document_type_provision_id_seq; Type: SEQUENCE; Schema: public; Owner: nr-ticdi
--

CREATE SEQUENCE public.document_type_provision_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.document_type_provision_id_seq OWNER TO "nr-ticdi";

--
-- Name: document_type_provision_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nr-ticdi
--

ALTER SEQUENCE public.document_type_provision_id_seq OWNED BY public.document_type_provision.id;


--
-- Name: provision; Type: TABLE; Schema: public; Owner: nr-ticdi
--

CREATE TABLE public.provision (
    id integer NOT NULL,
    provision_name character varying,
    free_text character varying,
    help_text character varying,
    category character varying,
    active_flag boolean,
    is_deleted boolean,
    create_userid character varying,
    update_userid character varying,
    create_timestamp timestamp without time zone DEFAULT now() NOT NULL,
    update_timestamp timestamp without time zone DEFAULT now() NOT NULL,
    list_items text[] DEFAULT '{}'::text[]
);


ALTER TABLE public.provision OWNER TO "nr-ticdi";

--
-- Name: provision_group; Type: TABLE; Schema: public; Owner: nr-ticdi
--

CREATE TABLE public.provision_group (
    id integer NOT NULL,
    provision_group integer,
    provision_group_text character varying,
    max integer,
    "documentTypeId" integer
);


ALTER TABLE public.provision_group OWNER TO "nr-ticdi";

--
-- Name: provision_group_id_seq; Type: SEQUENCE; Schema: public; Owner: nr-ticdi
--

CREATE SEQUENCE public.provision_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.provision_group_id_seq OWNER TO "nr-ticdi";

--
-- Name: provision_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nr-ticdi
--

ALTER SEQUENCE public.provision_group_id_seq OWNED BY public.provision_group.id;


--
-- Name: provision_id_seq; Type: SEQUENCE; Schema: public; Owner: nr-ticdi
--

CREATE SEQUENCE public.provision_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.provision_id_seq OWNER TO "nr-ticdi";

--
-- Name: provision_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nr-ticdi
--

ALTER SEQUENCE public.provision_id_seq OWNED BY public.provision.id;


--
-- Name: provision_variable; Type: TABLE; Schema: public; Owner: nr-ticdi
--

CREATE TABLE public.provision_variable (
    id integer NOT NULL,
    variable_name character varying,
    variable_value character varying,
    help_text character varying,
    create_userid character varying,
    update_userid character varying,
    create_timestamp timestamp without time zone DEFAULT now() NOT NULL,
    update_timestamp timestamp without time zone DEFAULT now() NOT NULL,
    "provisionId" integer
);


ALTER TABLE public.provision_variable OWNER TO "nr-ticdi";

--
-- Name: provision_variable_id_seq; Type: SEQUENCE; Schema: public; Owner: nr-ticdi
--

CREATE SEQUENCE public.provision_variable_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.provision_variable_id_seq OWNER TO "nr-ticdi";

--
-- Name: provision_variable_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nr-ticdi
--

ALTER SEQUENCE public.provision_variable_id_seq OWNED BY public.provision_variable.id;


--
-- Name: document_data id; Type: DEFAULT; Schema: public; Owner: nr-ticdi
--

ALTER TABLE ONLY public.document_data ALTER COLUMN id SET DEFAULT nextval('public.document_data_id_seq'::regclass);


--
-- Name: document_data_log id; Type: DEFAULT; Schema: public; Owner: nr-ticdi
--

ALTER TABLE ONLY public.document_data_log ALTER COLUMN id SET DEFAULT nextval('public.document_data_log_id_seq'::regclass);


--
-- Name: document_data_provision id; Type: DEFAULT; Schema: public; Owner: nr-ticdi
--

ALTER TABLE ONLY public.document_data_provision ALTER COLUMN id SET DEFAULT nextval('public.document_data_provision_id_seq'::regclass);


--
-- Name: document_data_variable id; Type: DEFAULT; Schema: public; Owner: nr-ticdi
--

ALTER TABLE ONLY public.document_data_variable ALTER COLUMN id SET DEFAULT nextval('public.document_data_variable_id_seq'::regclass);


--
-- Name: document_template id; Type: DEFAULT; Schema: public; Owner: nr-ticdi
--

ALTER TABLE ONLY public.document_template ALTER COLUMN id SET DEFAULT nextval('public.document_template_id_seq'::regclass);


--
-- Name: document_type id; Type: DEFAULT; Schema: public; Owner: nr-ticdi
--

ALTER TABLE ONLY public.document_type ALTER COLUMN id SET DEFAULT nextval('public.document_type_id_seq'::regclass);


--
-- Name: document_type_provision id; Type: DEFAULT; Schema: public; Owner: nr-ticdi
--

ALTER TABLE ONLY public.document_type_provision ALTER COLUMN id SET DEFAULT nextval('public.document_type_provision_id_seq'::regclass);


--
-- Name: provision id; Type: DEFAULT; Schema: public; Owner: nr-ticdi
--

ALTER TABLE ONLY public.provision ALTER COLUMN id SET DEFAULT nextval('public.provision_id_seq'::regclass);


--
-- Name: provision_group id; Type: DEFAULT; Schema: public; Owner: nr-ticdi
--

ALTER TABLE ONLY public.provision_group ALTER COLUMN id SET DEFAULT nextval('public.provision_group_id_seq'::regclass);


--
-- Name: provision_variable id; Type: DEFAULT; Schema: public; Owner: nr-ticdi
--

ALTER TABLE ONLY public.provision_variable ALTER COLUMN id SET DEFAULT nextval('public.provision_variable_id_seq'::regclass);


--
-- Name: flyway_schema_history flyway_schema_history_pk; Type: CONSTRAINT; Schema: USERS; Owner: nr-ticdi
--

-- ALTER TABLE ONLY "USERS".flyway_schema_history
--     ADD CONSTRAINT flyway_schema_history_pk PRIMARY KEY (installed_rank);


--
-- Name: document_data PK_document_data; Type: CONSTRAINT; Schema: public; Owner: nr-ticdi
--

ALTER TABLE ONLY public.document_data
    ADD CONSTRAINT "PK_document_data" PRIMARY KEY (id);


--
-- Name: document_data_log PK_document_data_log; Type: CONSTRAINT; Schema: public; Owner: nr-ticdi
--

ALTER TABLE ONLY public.document_data_log
    ADD CONSTRAINT "PK_document_data_log" PRIMARY KEY (id);


--
-- Name: document_data_provision PK_document_data_provision; Type: CONSTRAINT; Schema: public; Owner: nr-ticdi
--

ALTER TABLE ONLY public.document_data_provision
    ADD CONSTRAINT "PK_document_data_provision" PRIMARY KEY (id);


--
-- Name: document_data_variable PK_document_data_variable; Type: CONSTRAINT; Schema: public; Owner: nr-ticdi
--

ALTER TABLE ONLY public.document_data_variable
    ADD CONSTRAINT "PK_document_data_variable" PRIMARY KEY (id);


--
-- Name: document_template PK_document_template; Type: CONSTRAINT; Schema: public; Owner: nr-ticdi
--

ALTER TABLE ONLY public.document_template
    ADD CONSTRAINT "PK_document_template" PRIMARY KEY (id);


--
-- Name: document_type PK_document_type; Type: CONSTRAINT; Schema: public; Owner: nr-ticdi
--

ALTER TABLE ONLY public.document_type
    ADD CONSTRAINT "PK_document_type" PRIMARY KEY (id);


--
-- Name: document_type_provision PK_document_type_provision; Type: CONSTRAINT; Schema: public; Owner: nr-ticdi
--

ALTER TABLE ONLY public.document_type_provision
    ADD CONSTRAINT "PK_document_type_provision" PRIMARY KEY (id);


--
-- Name: provision PK_provision; Type: CONSTRAINT; Schema: public; Owner: nr-ticdi
--

ALTER TABLE ONLY public.provision
    ADD CONSTRAINT "PK_provision" PRIMARY KEY (id);


--
-- Name: provision_group PK_provision_group; Type: CONSTRAINT; Schema: public; Owner: nr-ticdi
--

ALTER TABLE ONLY public.provision_group
    ADD CONSTRAINT "PK_provision_group" PRIMARY KEY (id);


--
-- Name: provision_variable PK_provision_variable; Type: CONSTRAINT; Schema: public; Owner: nr-ticdi
--

ALTER TABLE ONLY public.provision_variable
    ADD CONSTRAINT "PK_provision_variable" PRIMARY KEY (id);


--
-- Name: flyway_schema_history_s_idx; Type: INDEX; Schema: USERS; Owner: nr-ticdi
--

-- CREATE INDEX flyway_schema_history_s_idx ON "USERS".flyway_schema_history USING btree (success);


--
-- Name: document_data FK_document_data_document_type; Type: FK CONSTRAINT; Schema: public; Owner: nr-ticdi
--

ALTER TABLE ONLY public.document_data
    ADD CONSTRAINT "FK_document_data_document_type" FOREIGN KEY ("documentTypeId") REFERENCES public.document_type(id);


--
-- Name: document_data_provision FK_document_data_provision_document_data; Type: FK CONSTRAINT; Schema: public; Owner: nr-ticdi
--

ALTER TABLE ONLY public.document_data_provision
    ADD CONSTRAINT "FK_document_data_provision_document_data" FOREIGN KEY ("documentDataId") REFERENCES public.document_data(id) ON DELETE CASCADE;


--
-- Name: document_data_provision FK_document_data_provision_document_type_provision; Type: FK CONSTRAINT; Schema: public; Owner: nr-ticdi
--

ALTER TABLE ONLY public.document_data_provision
    ADD CONSTRAINT "FK_document_data_provision_document_type_provision" FOREIGN KEY ("documentTypeProvisionId") REFERENCES public.document_type_provision(id) ON DELETE CASCADE;


--
-- Name: document_data_provision FK_document_data_provision_provision; Type: FK CONSTRAINT; Schema: public; Owner: nr-ticdi
--

ALTER TABLE ONLY public.document_data_provision
    ADD CONSTRAINT "FK_document_data_provision_provision" FOREIGN KEY ("documentProvisionId") REFERENCES public.provision(id);


--
-- Name: document_data_variable FK_document_data_variable_document_data; Type: FK CONSTRAINT; Schema: public; Owner: nr-ticdi
--

ALTER TABLE ONLY public.document_data_variable
    ADD CONSTRAINT "FK_document_data_variable_document_data" FOREIGN KEY ("documentDataId") REFERENCES public.document_data(id) ON DELETE CASCADE;


--
-- Name: document_data_variable FK_document_data_variable_provision_variable; Type: FK CONSTRAINT; Schema: public; Owner: nr-ticdi
--

ALTER TABLE ONLY public.document_data_variable
    ADD CONSTRAINT "FK_document_data_variable_provision_variable" FOREIGN KEY ("documentVariableId") REFERENCES public.provision_variable(id) ON DELETE CASCADE;


--
-- Name: document_template FK_document_template_document_type; Type: FK CONSTRAINT; Schema: public; Owner: nr-ticdi
--

ALTER TABLE ONLY public.document_template
    ADD CONSTRAINT "FK_document_template_document_type" FOREIGN KEY ("documentTypeId") REFERENCES public.document_type(id);


--
-- Name: document_type_provision FK_document_type_provision_document_type; Type: FK CONSTRAINT; Schema: public; Owner: nr-ticdi
--

ALTER TABLE ONLY public.document_type_provision
    ADD CONSTRAINT "FK_document_type_provision_document_type" FOREIGN KEY ("documentTypeId") REFERENCES public.document_type(id);


--
-- Name: document_type_provision FK_document_type_provision_provision; Type: FK CONSTRAINT; Schema: public; Owner: nr-ticdi
--

ALTER TABLE ONLY public.document_type_provision
    ADD CONSTRAINT "FK_document_type_provision_provision" FOREIGN KEY ("provisionId") REFERENCES public.provision(id);


--
-- Name: document_type_provision FK_document_type_provision_provision_group; Type: FK CONSTRAINT; Schema: public; Owner: nr-ticdi
--

ALTER TABLE ONLY public.document_type_provision
    ADD CONSTRAINT "FK_document_type_provision_provision_group" FOREIGN KEY ("provisionGroupId") REFERENCES public.provision_group(id);


--
-- Name: provision_group FK_provision_group_document_type; Type: FK CONSTRAINT; Schema: public; Owner: nr-ticdi
--

ALTER TABLE ONLY public.provision_group
    ADD CONSTRAINT "FK_provision_group_document_type" FOREIGN KEY ("documentTypeId") REFERENCES public.document_type(id);


--
-- Name: provision_variable FK_provision_variable_provision; Type: FK CONSTRAINT; Schema: public; Owner: nr-ticdi
--

ALTER TABLE ONLY public.provision_variable
    ADD CONSTRAINT "FK_provision_variable_provision" FOREIGN KEY ("provisionId") REFERENCES public.provision(id);


--
-- PostgreSQL database dump complete
--

