
import * as k8s from '@pulumi/kubernetes';
import * as gcp from '@pulumi/gcp';
import { clusterProvider } from './cluster';
import { namespaceName } from './resume';


export const ipAddress = new gcp.compute.Address('static-ip', {
    name: 'static-ip'
});



export const nginxIngress = new k8s.helm.v2.Chart('nginx-ingress-controller', {
    namespace: namespaceName,
    repo: "stable",
    version: "1.6.18",
    chart: "nginx-ingress",
    values: {
      rbac: {
        create: true,
      },
      controller: {
        replicaCount: 2,
        service: {
          omitClusterIP: true,
          loadBalancerIP: ipAddress.address,
          externalTrafficPolicy: 'Local',
        },
        metrics: {
          enabled: true,
          service: {
            omitClusterIP: true,
            annotations: {
              'prometheus.io/scrape': 'true',
              'prometheus.io/port': '10254',
            },
          },
        },
        stats: {
          enabled: true,
          service: {
            omitClusterIP: true,
          }
        },
        affinity: {
          podAntiAffinity: {
            preferredDuringSchedulingIgnoredDuringExecution: [{
              weight: 1,
              podAffinityTerm: {
                topologyKey: 'kubernetes.io/hostname',
                labelSelector: {
                  matchExpressions: [{
                    key: 'app',
                    operator: 'In',
                    values: ['nginx-ingress'],
                  }, {
                    key: 'component',
                    operator: 'In',
                    values: ['controller']
                  }],
                },
              },
            }],
          },
        },
      },
      defaultBackend: {
        enabled: false,
      }
    },
  }, {
    providers: {
      kubernetes: clusterProvider,
    },
  });