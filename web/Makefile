GCLOUD_PROJECT:=$(shell gcloud config list project --format="value(core.project)")

.PHONY: all
all: deploy

#-------------
# Docker commands
#-------------

.PHONY: build
build:
	docker build -t gcr.io/$(GCLOUD_PROJECT)/hanashi .

.PHONY: run
run: build
	docker run -p 8080:8080 --env-file .env -it gcr.io/$(GCLOUD_PROJECT)/hanashi

.PHONY: push
push: build
	gcloud docker -- push gcr.io/$(GCLOUD_PROJECT)/hanashi

#-------------
# Kubernetes commands
#-------------

.PHONY: create-cluster
create-cluster:
	gcloud container clusters create hanashi \
		--scope "https://www.googleapis.com/auth/userinfo.email","cloud-platform"

.PHONY: create-secret
create-secret:
	kubectl create secret generic django-env --from-file=./.env

.PHONY: deploy
deploy: push
	kubectl create -f hanashi.yaml

# The trick for updating
# https://github.com/kubernetes/kubernetes/issues/33664
.PHONY: update
update:
	kubectl patch deployment hanashi -p "{\"spec\":{\"template\":{\"metadata\":{\"labels\":{\"date\":\"`date +'%s'`\"}}}}}"

.PHONY: replace
replace:
	kubectl replace --force -f hanashi.yaml

.PHONY: delete
delete:
	kubectl delete rc hanashi
	kubectl delete service hanashi

# .PHONY: template
# template:
# 	sed -i ".tmpl" "s/\$$GCLOUD_PROJECT/$(GCLOUD_PROJECT)/g" hanashi.yaml

#-------------
# Bucket management
#-------------

.PHONY: create-bucket
create-bucket:
	gsutil mb gs://$(GCLOUD_PROJECT)
    gsutil defacl set public-read gs://$(GCLOUD_PROJECT)
