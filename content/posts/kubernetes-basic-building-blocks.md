---
title: "Kubernetes, the Simple Version: The Basic Building Blocks"
date: 2026-07-21
tags: ["kubernetes", "devops", "containers"]
---

Kubernetes has a reputation for being intimidating, and honestly, a lot of that reputation is earned — the docs throw a dozen new nouns at you before you've even deployed anything. But the core ideas underneath it aren't that different from things I already knew as a sysadmin. This is my attempt at explaining the basic pieces the way I wish someone had explained them to me first — no YAML gymnastics, just what each thing is and why it exists.

## The cluster

A cluster is just the whole Kubernetes setup — a group of machines working together to run your containers. Think of it the way you'd think of a server farm or a VM host cluster in the Microsoft world: a pool of compute that Kubernetes manages on your behalf, so you stop thinking in terms of individual machines and start thinking in terms of "run this workload somewhere in here."

## Nodes

A node is one machine in that cluster — could be a physical server, more commonly a VM. Nodes are where your actual workloads run. There are two flavors:

- **Control plane nodes** — the "brains." They make decisions: what runs where, what's healthy, what needs restarting.
- **Worker nodes** — where your actual application containers run.

If you've managed a hypervisor cluster before, this maps pretty closely to the management layer vs. the compute hosts.

## Pods

This is the one that trips people up first, because it's a Kubernetes-specific concept with no obvious sysadmin equivalent. A pod is the smallest deployable unit in Kubernetes — not a container itself, but a wrapper around one or more containers that need to run together, sharing the same network and storage.

Most of the time, a pod holds exactly one container. You can think of a single-container pod as "one running instance of my app." The wrapper exists so Kubernetes has a consistent unit to schedule, network, and manage, even in the less common case where you've got a couple of tightly coupled containers that need to live side by side.

## Deployments

Pods are disposable — deliberately so. If a pod dies, Kubernetes doesn't try to nurse it back to health; it just replaces it. A **Deployment** is what actually manages that: you tell it "I want 3 copies of this pod running," and the Deployment makes sure that's always true. Pod crashes, node dies, doesn't matter — the Deployment notices the count is off and brings it back to 3.

This is also how rolling updates work. Push a new image version, and the Deployment gradually swaps old pods for new ones rather than killing everything at once.

## ReplicaSets

You'll see this term come up, so it's worth a quick mention: a **ReplicaSet** is the thing that actually enforces "keep N pods running." In practice, you almost never create one directly — a Deployment creates and manages a ReplicaSet for you behind the scenes. Think of it as an implementation detail you don't usually need to touch.

## Services

Pods come and go, and every time one gets replaced, it gets a new internal IP address. That's a problem if other parts of your application need a stable way to reach it. A **Service** solves this by giving a group of pods one fixed address to be reached at, and routing traffic to whichever pods are currently healthy and running.

If you're coming from a load-balancer-in-front-of-a-VM-pool mental model, that's basically what a Service is doing — just automatically kept in sync with pods appearing and disappearing.

## Namespaces

A **Namespace** is a way of splitting one cluster into logical sections — think of it like folders, or like separate resource groups in Azure. You might have a `dev` namespace and a `prod` namespace on the same cluster, keeping resources organized and access scoped, without needing entirely separate clusters for every environment.

## Try it yourself with minikube

Reading about these is fine, but seeing them actually appear is better. If you've got [minikube](https://minikube.sigs.k8s.io/) installed, this walks through spinning up a local cluster and poking at each piece as you go.

Start the cluster:

```bash
minikube start
```

**Cluster and nodes** — check what you just created:

```bash
kubectl cluster-info
kubectl get nodes
```

With minikube you'll typically see just one node doing double duty as both control plane and worker — that's fine for learning, real clusters usually split these roles across multiple machines.

**Deployment** — create one, and watch it bring pods into existence:

```bash
kubectl create deployment demo --image=nginx --replicas=3
kubectl get deployments
kubectl get pods
```

**ReplicaSet** — see the thing the Deployment created behind the scenes:

```bash
kubectl get replicasets
```

**Pods** — kill one on purpose and watch the Deployment replace it:

```bash
kubectl get pods
kubectl delete pod <pod-name-from-above>
kubectl get pods
```

You should see the pod count go back to 3 almost immediately — that's the Deployment doing its job.

**Service** — expose the deployment and give it a stable address:

```bash
kubectl expose deployment demo --port=80 --type=NodePort
kubectl get services
minikube service demo --url
```

That last command gives you a URL you can actually hit in a browser or with `curl`, proving the Service is routing traffic to your pods.

**Namespace** — create one and run something inside it:

```bash
kubectl create namespace staging
kubectl get pods -n staging
kubectl create deployment demo-staging --image=nginx -n staging
kubectl get pods -n staging
```

Notice `kubectl get pods` on its own won't show you the staging pods — they're scoped to that namespace, which is the whole point.

When you're done poking around:

```bash
minikube stop
```

## How it fits together

Roughly, the flow looks like this: a **cluster** is made of **nodes**. You describe your app as a **Deployment**, which creates and maintains **pods** (via a ReplicaSet, behind the scenes) across those nodes. A **Service** gives those pods a stable way to be reached. **Namespaces** keep it all organized when one cluster is hosting more than one thing.

That's really the core of it. Everything else in Kubernetes — ConfigMaps, Secrets, Ingress, StatefulSets, and so on — builds on top of these six ideas rather than replacing them. Once these click, the rest of the ecosystem gets a lot less mysterious.
