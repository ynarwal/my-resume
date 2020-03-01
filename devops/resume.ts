import * as k8s from '@pulumi/kubernetes';
import * as docker from '@pulumi/docker';
import * as config from './config';
import { clusterProvider } from './cluster';

const name = 'resume';

// Create a Kubernetes Namespace
const ns = new k8s.core.v1.Namespace(name, {}, { provider: clusterProvider });
const certManagerNamespace = new k8s.core.v1.Namespace('cert-manager', {}, { provider: clusterProvider });

// Export the Namespace name
export const namespaceName = ns.metadata.name;


const appImage = new docker.Image(name, {
  imageName: 'docker.io/ynarwal01/resume',
  build: "../",
  registry: {
      server: "docker.io",
      username: config.dockerUsername,
      password: config.dockerPassword,
  },
});

const appLabels = { appClass: name };
const deployment = new k8s.apps.v1.Deployment(name,
    {
        metadata: {
            namespace: namespaceName,
            labels: appLabels,
        },
        spec: {
            replicas: 1,
            selector: { matchLabels: appLabels },
            template: {
                metadata: {
                    labels: appLabels,
                },
                spec: {
                    containers: [
                        {
                            name: name,
                            image: appImage.imageName,
                            ports: [{ name: "http", containerPort: 8000}],
                        },
                    ],
                },
            },
        },
    },
    {
        provider: clusterProvider,
    },
);



// Export the Deployment name
export const deploymentName = deployment.metadata.name;

  

const service = new k8s.core.v1.Service(name, {
    metadata: {
        name: name,
        labels: appLabels,
        namespace: namespaceName,
      },
    spec: {
        type: "NodePort",
        selector: appLabels,
        ports: [{ protocol: "TCP", nodePort: 30040, port: 8888, targetPort: 8000 }],
      }
  }, { provider: clusterProvider });



export const resumeIngress = new k8s.extensions.v1beta1.Ingress(name, {
    metadata: {
      name: name,
      labels: appLabels,
      namespace: namespaceName,
      annotations: {
          "kubernetes.io/tls-acme": "true",
          "kubernetes.io/ingress.class": "nginx",
      },
  },
  spec: {
    rules: [{
        host: "ynarwal.me",
        http: {
            paths: [{
                path: "/",
                backend: { serviceName: "resume", servicePort: 8888 }
            }]
        }
    }],
    tls: [{
        secretName: "ynarwal-tls-secret",
        hosts: ["ynarwal.me"]
    }],
  }
}, { provider: clusterProvider });

