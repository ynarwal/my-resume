
import * as k8s from '@pulumi/kubernetes';
import { clusterProvider } from './cluster';

const namespace = new k8s.core.v1.Namespace('cert-manager-namespace', {
    metadata: {
      name: 'cert-manager',
      labels: {
        'certmanager.k8s.io/disable-validation': 'true',
      },
    },
  }, { provider: clusterProvider });
  
  const crds = new k8s.yaml.ConfigFile('cert-manager-custom-resource-definitions', {
    file: 'https://raw.githubusercontent.com/jetstack/cert-manager/release-0.8/deploy/manifests/00-crds.yaml',
  }, {
    providers: {
      kubernetes: clusterProvider,
    },
  });
  
const certIssuer = new k8s.apiextensions.CustomResource('cert-issuer', {
    apiVersion: 'certmanager.k8s.io/v1alpha1',
    kind: 'ClusterIssuer',
    metadata: {
        namespace: namespace.metadata.name,
        name: 'cert-issuer',
    },
    spec: {
        acme: {
        server: 'https://acme-v02.api.letsencrypt.org/directory',
        email: 'ynarwal10@gmail.com',
        http01: {},
        privateKeySecretRef: {
            name: 'letsencrypt-production',
        },
        solvers: [{
            http01: {
            ingress: {
                class: 'nginx',
            },
            },
        }],
        },
    },
}, {
    provider: clusterProvider,
    dependsOn: crds,
});
  
export const certManager = new k8s.helm.v2.Chart('cert-manager', {
    namespace: 'cert-manager',
    version: 'v0.8.1',
    chart: 'cert-manager',
    fetchOpts: {
        repo: 'https://charts.jetstack.io',
    },
    values: {
        ingressShim: {
        defaultIssuerKind: 'ClusterIssuer',
        defaultIssuerName: 'cert-issuer',
        }
    }
    }, {
    dependsOn: certIssuer,
    providers: {
        kubernetes: clusterProvider,
    },
});
  