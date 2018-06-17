GCLOUD_PROJECT:=$(shell gcloud config list project --format="value(core.project)")
APP_NAME=hanashi
ZONE=us-central1-b

.PHONY: all
all: deploy

.PHONY: run
dev:
	honcho run -e .env python manage.py runserver

#-------------
# Docker commands
#-------------

.PHONY: build
build:
	docker build -t gcr.io/$(GCLOUD_PROJECT)/$(APP_NAME) .

.PHONY: run
run: build
	docker run -p 8080:80 --env-file .env -it gcr.io/$(GCLOUD_PROJECT)/$(APP_NAME)

.PHONY: push
push: build
	gcloud docker -- push gcr.io/$(GCLOUD_PROJECT)/$(APP_NAME)

#-------------
# Kubernetes commands
#-------------

.PHONY: create-cluster
create-cluster:
	gcloud container clusters create $(APP_NAME) \
		--scopes "https://www.googleapis.com/auth/userinfo.email","cloud-platform" \
		--num-nodes 3 --zone "$(ZONE)"
	gcloud container clusters get-credentials $(APP_NAME) --zone "$(ZONE)"

# docs for conf file: https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-files
.PHONY: create-secret
create-secret:
	kubectl delete secret django-env || true
	cat .env | sed "s/^/--from-literal=/" | xargs kubectl create secret generic django-env
	kubectl describe secrets/django-env

.PHONY: deploy
deploy: push
	kubectl create -f $(APP_NAME).yaml

# The trick for updating
# https://github.com/kubernetes/kubernetes/issues/33664
.PHONY: update
update: push
	kubectl patch deployment $(APP_NAME) -p "{\"spec\":{\"template\":{\"metadata\":{\"labels\":{\"date\":\"`date +'%s'`\"}}}}}"

.PHONY: replace
replace:
	kubectl replace --force -f $(APP_NAME).yaml

.PHONY: delete
delete:
	kubectl delete rc $(APP_NAME)
	kubectl delete service $(APP_NAME)

# .PHONY: template
# template:
# 	sed -i ".tmpl" "s/\$$GCLOUD_PROJECT/$(GCLOUD_PROJECT)/g" $(APP_NAME).yaml

#-------------
# Bucket management
#-------------

.PHONY: create-bucket
create-bucket:
	gsutil mb gs://$(GCLOUD_PROJECT)
    gsutil defacl set public-read gs://$(GCLOUD_PROJECT)

.PHONY: collectstatic
collectstatic:
	python manage.py collectstatic --no-input
	babel --presets react -x ".jsx" static/slideshow/app.jsx > static/slideshow/app.js
	gsutil rsync -R static/ gs://$(GCLOUD_PROJECT)/static
	gsutil acl ch -r -u AllUsers:R gs://$(GCLOUD_PROJECT)
