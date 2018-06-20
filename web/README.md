# Hanashi Django App

This is the folder for the main django webapp.

The app is deployed via Kubernetes to GCE.

See [hanashi.yaml](hanashi.yaml) for info on Kubernetes setup.

## Deploying

```
# Build new docker image
make build

# Push docker image to Docker registry
make push

# Update kubernetes cluster
make update
```

After this, you can monitor the status of the deploy via:
```
$ kubectl get deployment
NAME      DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
hanashi   2         2         2            2           2d
```

And to access the IP, uses:
```
# Get external IPs
$ kubectl get service
```