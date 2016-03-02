# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"

  config.vm.network "private_network", ip: "192.168.100.100"

  config.vm.provider "virtualbox" do |vb|
    vb.cpus = 1
    vb.memory = 512
  end
  
  #Create a swap file (npm install might require more memory temporary)
  config.vm.provision :shell, inline: "sudo fallocate -l 1G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile"
  
  #Make the swapfile permanent
  config.vm.provision :shell, inline: "sudo echo '/swapfile   none    swap    sw    0   0' >> /etc/fstab" 	

  config.vm.provision :shell, inline: "sudo apt-get update"
  config.vm.provision :docker
  config.vm.provision :docker_compose, yml: ["/vagrant/docker-compose.yml","/vagrant/docker-compose.dev.yml"] , run: "always"

end
