# -*- coding: utf-8 -*-

import os
from ftplib import FTP

from Modules_Deployment.Version import Version
from Modules_Deployment.Deployment import Deployment
from Modules_Deployment.Mail import Mail

linkOfWebsiteOnline = ""

host = ""
password = ""
username = ""
projectName = os.path.split(os.getcwd())[1]

ftp = FTP()
port = 21
ftp.connect(host, port)
ftp.login(username, password)
filenameCV = "./"


Deployment.deleteAllFiles(ftp)
Deployment.uploadFiles(ftp, filenameCV)
ftp.quit()


if Version.checkIfIsBigVersion(Version.getVersion()):
    Mail("Le déploiement du projet " + projectName + " a fonctionné !",
            "Lien du site deployé: " + linkOfWebsiteOnline + "\n"
            "Version du site: " + Version.getVersion().encode('utf-8'))
