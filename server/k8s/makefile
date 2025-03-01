#kubectl describe svc express-prisma-service
#gcloud compute addresses --region=us-central1 create my-static-ip
#gcloud compute addresses describe my-static-ip --region=us-central1 --format="get(address)"
all: cdl delete apply
crush:
	gcloud container clusters create --machine-type=e2-medium --region=us-central1-a crush-on-k8s

cdl:
	gcloud container clusters get-credentials crush-on-k8s --zone=us-central1-a --project=learn-vm-442206

apply:
	kubectl apply -f all.yaml

delete:
	kubectl delete -f all.yaml

logs:
	kubectl logs -f -l app=express-app -c express-app