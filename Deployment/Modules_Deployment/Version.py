# -*- coding: utf-8 -*-

import os
import json
import re

class Version(object):

    @staticmethod
    def getVersion():
        with open(os.path.realpath('package.json')) as data_file:
            data = json.load(data_file)

        return data["version"]

    @staticmethod
    def checkIfIsBigVersion(version):
        version = version.split(".", 1)

        if all(v == '0' for v in re.findall(r'\d+', version[1])):
            print "Nouvelle grosse version"
            return True
        else:
            print "Version intermédiaire"
            return False
