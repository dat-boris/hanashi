import time
import json
from django.shortcuts import render
from django.utils.safestring import mark_safe

# TODO: hardcoded from
# https://www.flickr.com/services/api/explore/flickr.photosets.getList
# Validate at:
# https://www.flickr.com/services/api/explore/flickr.photosets.getPhotos
PHOTOSET_ID = {
    'train': 72157670779826611,
    'ice': 72157663357403996,
    'bug': 72157668589896064,
    'hk': 72157650070566351,
    'japan': 72157649654809407,
    'matt': 72157624454881254,
    'biketour': 72157698195581705
}

# biketrip
DEFAULT_ID = 72157698195581705

# def home(request):
#     return render(request, 'home.html', {})

def slideshow(request, name=''):
    return render(request, 'slideshow.html', {
        'room_name': mark_safe(name),
        'epoch': time.time(),
        'photoset_id': mark_safe(PHOTOSET_ID.get(name, DEFAULT_ID))
    })
