import * as cluster from './cluster'
import './cert-maanger';
import './ingress';
import './resume';

export const kubeconfig = cluster.k8sConfig;
