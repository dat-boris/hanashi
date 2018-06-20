import time
import json
from django.shortcuts import render
from django.utils.safestring import mark_safe

# def home(request):
#     return render(request, 'home.html', {})

def slideshow(request, name=''):
    return render(request, 'slideshow.html', {
        'room_name_json': mark_safe(json.dumps(name)),
        'epoch': time.time()
    })
