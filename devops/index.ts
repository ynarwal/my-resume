import * as cluster from './cluster'
import './cert-manager';
import * as ingress from './ingress';
import './resume';

export const kubeconfig = cluster.k8sConfig;
export const resumeIngressControllerIp = ingress.ipAddress.address;