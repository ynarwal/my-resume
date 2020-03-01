import { Config } from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import * as random from "@pulumi/random";


const config = new Config();

/// Docker config
export const dockerUsername = config.require("dockerUsername");
export const dockerPassword = config.require("dockerPassword");

export const name = "ynarwal";

export const masterVersion = '1.15.8-gke.2';


// nodeCount is the number of cluster nodes to provision. Defaults to 3 if unspecified.
export const nodeCount = config.getNumber("nodeCount") || 3;

// nodeMachineType is the machine type to use for cluster nodes. Defaults to n1-standard-1 if unspecified.
// See https://cloud.google.com/compute/docs/machine-types for more details on available machine types.
export const nodeMachineType = config.get("nodeMachineType") || "n1-standard-1";

// username is the admin username for the cluster.
export const username = config.get("masterUserName") || "admin";

// password is the password for the admin user in the cluster.
// If a password is not set, a strong random password will be generated.
export const password = config.get("masterPassword") || new random.RandomPassword(
    "password", { length: 20, special: true }).result;


