FROM ubuntu:24.04

# Update Repo dan Install SSH server
RUN apt-get update && apt-get install openssh-server -y
# Menambahkan direktori /run/sshd
RUN mkdir -p /run/sshd
# Membuat user non-root
RUN useradd -m -d /home/raihaninkam -s /usr/bin/bash raihaninkam
# Copy Public key dari client ke server
COPY access_secret.pub /home/raihaninkam/.ssh/authorized_keys
# security hardening
RUN sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin no/' /etc/ssh/sshd_config
RUN sed -i 's/#PubKeyAuthentication no/PubKeyAuthentication yes/' /etc/ssh/sshd_config

CMD [ "/usr/sbin/sshd", "-D", "-e" ]
