# KIMERA
## Kubernetes Infrastructure for Managed Evaluation and Resource Access
**KIMERA** (**K**ubernetes **I**nfrastructure for **M**anaged **E**valuation and **R**esource **A**ccess) is a cloud-based platform for Information Retrieval (IR) evaluation. It extends the Evaluation-as-a-Service model into Evaluation-in-the-Cloud, enabling researchers to code and execute systems directly via their browsers. Built on Docker and Kubernetes, KIMERA provides a scalable, secure, and fault-tolerant environment for IR experiments. It monitors resource usage, ensures reproducibility, and facilitates access to external computational resources, such as quantum computers. KIMERA has been used in QuantumCLEF, as well as for Quantum Computing tutorials at ECIR and SIGIR conferences.

## The infrastructure components
<center>

![KIMERA Pipeline](https://raw.githubusercontent.com/MjPaxter/KIMERA/main/images/Infrastructure.png)
</center>


# Instructions to setup the infrastructure
We provide here the instructions to setup the infrastructure on a Ubuntu machine. The setup requires admin privileges.

## Installing Docker and microk8s
The infrastructure requires **Docker** and **microk8s** installed in your system. This can be done with the following commands:

```
sudo apt-get install docker.io
sudo snap install microk8s --classic
```

## Bootstrap microk8s

To start microk8s, it is sufficient to run the following command:
```
sudo microk8s start
```

Some of the infrastructure components are already provided by **microk8s**. These include but are not limited to the **nginx** base component and  the **DNS** server. To enable the required components, it is sufficient to execute the following commands:

```
sudo microk8s enable hostpath-storage
sudo microk8s enable ingress
sudo microk8s enable dns
sudo microk8s enable registry
sudo microk8s enable cert-manager
```

## General settings components
We need to create the opportune components that will store our secrets and meta-data. To do so, please go into the `/generalsettings` folder. There you can find some files that define these components. As you can see, you have to modify some of their fields according to your scenario (e.g., the database name, the API secret tokens,...). Once done, run the following commands:
```
sudo microk8s kubectl apply -f configmap.yaml
sudo microk8s kubectl apply -f certificate.yaml
sudo microk8s kubectl apply -f secrets.yaml
```


## Nginx configuration
We need to configure the nginx component. To do so, please go into the `/nginx` folder. There you can find the `nginx.yaml` file that defines it. As you can see, you have to modify some of its fields according to your scenario (e.g., the host website,...). 

**DO NOT EDIT THE OTHER FILE! IT IS A TEMPLATE THAT WILL BE USED LATER WHEN ADDING RESEARCH GROUPS TO THE INFRASTRUCTURE** 

Once done, run the following commands:
```
sudo microk8s kubectl apply -f nginx.yaml
```




## Building the Docker images
Now the **microk8s** infrastructure is up and running, however we still miss many of its fundamental components. In particular, we need to deploy the database, the web application, the dispatcher, and the workspaces.

### Database
We start by deploying the database. Please, go into the `/database` folder. There you can find the definition of the database component already pre-compiled. Thus, you can run the following command:
```
sudo microk8s kubectl apply -f database.yaml
```

### Web application
Then, please go into the `/webapp` folder. You now have to build the web application Docker image. In practice, this can be done by building the image, saving it as a `.tar` file and importing it into the microk8s in-built registry. This can be done as follows:

```
sudo docker build . -t webapp
sudo docker save webapp > webapp.tar
sudo microk8s ctr image import webapp.tar
```

Then, please run the following command:
```
sudo microk8s kubectl apply -f webapp.yaml
```


### Dispatcher
Then, please go into the `/dispatcher` folder. You now have to build the dispatcher Docker image. In practice, this can be done by building the image, saving it as a `.tar` file and importing it into the microk8s in-built registry. This can be done as follows:

```
sudo docker build . -t dispatcher
sudo docker save dispatcher > dispatcher.tar
sudo microk8s ctr image import dispatcher.tar
```

Then, please run the following command:
```
sudo microk8s kubectl apply -f dispatcher.yaml
```


### Workspace
Then, please go into the `/groups` folder. You now have to build the workspace Docker image. In practice, this can be done by building the image, saving it as a `.tar` file and importing it into the microk8s in-built registry. This can be done as follows:

```
sudo docker build . -t workspace
sudo docker save workspace > workspace.tar
sudo microk8s ctr image import workspace.tar
```

## Datasets

Before starting adding groups, you can set up the datasets for the tasks. The datasets will be available in the `/storages/datasets` folder. This folder will be shared among all groups in read-only mode. Please, add the datasets to that folder (they can be edited at any moment). Then go into the `/groups/` folder and run:
```
sudo microk8s kubectl apply -f storage_datasets.yaml
```

## Adding groups


The infrastructure is now ready. You should be able to access the maintenance area  with the default credentials:
```
Username: Admin
Password: AdminPassword
```

Here you can edit the tasks and add groups for the tasks with web forms.

Once you have added a task, you can proceed adding groups. Please, compile the web form with the group data.

Once you have compiled it, you should see the group data among the other groups you have already added. The group data has been saved in the database but it is now necessary to add a workspace for the group. To do so, please go into the `/groups` folder. Run the python script `group_helper.py` which will prompt you to insert the group data. The script will automatically produce a corresponding `.yaml` file that you can find inside the `/groups/generated_files` folder. Furthermore it also updates the `/nginx/nginx.yaml` file accordingly. Finally, it creates a folder where the group data will be stored.

Now, to make these updates effective, please go into the `/groups/generated_files` folder and run:
```
sudo microk8s kubectl apply -f [groupname].yaml
```
where **groupname** is the name of the group you just added.

Then, please go into the `/nginx` folder and run:
```
sudo microk8s kubectl apply -f nginx.yaml
```

These steps should be repeated for each group you want to add.

# Bonus 
Here you can find some bonus commands that might be helpful when setting up the infrastructure.

## Resetting the infrastructure
In case you want to clear the infrastructure at some point, you can run:

```
sudo microk8s reset
```

## Clearing the Docker cache
When building the containers, Docker will produce a build cache to speed up the next building phases. While this is helpful, the cache can **dramatically** increase its size to several GBs after a few builds. To clear this cache, please run:

```
sudo docker buildx prune --all
```

## Clearing the Docker unused images
To see the available Docker images please run:
```
sudo docker images
```
If you have updated some images, you might find some unused images in the list. To remove them (and possibly save disk space), please run:

```
sudo docker image prune
```