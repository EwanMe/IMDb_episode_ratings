.PHONY: dev-up
dev-up: COMPOSE_OVERRIDE=docker-compose.dev.yml
dev-up: compose-up

.PHONY: dev-down
dev-down: COMPOSE_OVERRIDE=docker-compose.dev.yml
dev-down: compose-down

.PHONY: prod-up
prod-up: COMPOSE_OVERRIDE=docker-compose.prod.yml
prod-up: compose-up

.PHONY: prod-down
prod-down: COMPOSE_OVERRIDE=docker-compose.prod.yml
prod-down: compose-down


.PHONY: compose-up
compose-up:
	docker compose -f docker-compose.yml -f ${COMPOSE_OVERRIDE} up --build --detach --force-recreate

.PHONY: compose-down
compose-down:
	docker compose -f docker-compose.yml -f ${COMPOSE_OVERRIDE} down