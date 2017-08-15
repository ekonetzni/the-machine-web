import requests
import json
import base64

def read_file():
	with open("/Users/ekonetzni/Desktop/1-IS.jpg", "rb") as image_file:
		encoded_string = base64.b64encode(image_file.read())
        return encoded_string


def run():
	payload = {
		'name': 'test',
      	'title': 'Test',
      	'bas64': read_file()
	}

	r = requests.post(
			'http://localhost:3000',
			data=json.dumps(payload)
		)

	print r.text;

run()