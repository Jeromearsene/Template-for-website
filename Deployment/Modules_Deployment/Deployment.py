# -*- coding: utf-8 -*-

import os.path, os
from ftplib import error_perm

class Deployment(object):

    @staticmethod
    def deleteAllFiles(ftp):
        for n in ftp.nlst():
            try:
                if n not in ('.', '..'):
                    print('Working on..' + n)
                    try:
                        ftp.delete(n)
                        print('Deleted...' + n)
                    except Exception:
                        print(n + ' Not deleted, we suspect its a directory, changing to ' + n)
                        ftp.cwd(n)
                        Deployment.deleteAllFiles(ftp)
                        ftp.cwd('..')
                        print('Trying to remove directory ..' + n)
                        ftp.rmd(n)
                        print('Directory, ' + n + ' Removed')
            except Exception:
                print('Trying to remove directory ..' + n)
                ftp.rmd(n)
                print('Directory, ' + n + ' Removed')


    @staticmethod
    def uploadFiles(ftp, path):
        for name in os.listdir(path):
            localpath = os.path.join(path, name)
            if os.path.isfile(localpath):
                print("STOR", name, localpath)
                ftp.storbinary('STOR ' + name, open(localpath, 'rb'))
            elif os.path.isdir(localpath):
                print("MKD", name)

                try:
                    ftp.mkd(name)

                # ignore "directory already exists"
                except error_perm as e:
                    if not e.args[0].startswith('550'):
                        raise

                print("CWD", name)
                ftp.cwd(name)
                Deployment.uploadFiles(ftp, localpath)
                print("CWD", "..")
                ftp.cwd("..")
