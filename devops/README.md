
## GKE notes
- I keep getting this error
```bash
 
  gcp:container:Cluster (gke-cluster):
    error: googleapi: Error 403: Insufficient regional quota to satisfy request: resource "IN_USE_ADDRESSES": request requires '6.0' and is short '2.0'. project has a quota of '4.0' with '4.0' available. View and manage quotas at https://console.cloud.google.com/iam-admin/quotas?usage=USED&project=personal-kubernetes-269002., forbidden
```
unitl I set gcp:project and gpc:zone in pulumi stack config
