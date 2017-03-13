# -*- coding: utf-8 -*-

import smtplib
from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText

def Mail(
        subject, message,
        destinary="",
	    sender="",
	    password=""):


	msg = MIMEMultipart()
	msg['From'] = sender
	msg['To'] = destinary
	msg['Subject'] = subject


	msg.attach(MIMEText(message, 'plain'))

	server = smtplib.SMTP('smtp.gmail.com', 587)
	server.starttls()
	server.login(sender, password)
	text = msg.as_string()
	server.sendmail(sender, destinary.split(','), text)
	server.quit()
