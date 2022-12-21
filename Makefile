dev:
	docker-compose up -d
	npm run dev

db:
	docker-compose up -d postgres

es:
	docker-compose up -d rollcall

kafka:
	docker-compose up -d broker

up:
	docker-compose up -d

down:
	docker-compose down