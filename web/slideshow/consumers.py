import sys
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class SlideshowConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['name']
        self.room_group_name = 'room_%s' % self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        # message = text_data_json['message']
        print("receive: {}".format(text_data), file=sys.stderr)
        data_json = json.loads(text_data)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'change_image',
                'payload': data_json
            }
        )

    # Receive message from room group
    async def change_image(self, event):
        print("change_image: {}".format(event), file=sys.stderr)
        payload = event['payload']

        # Send message to WebSocket
        await self.send(text_data=json.dumps(payload))
