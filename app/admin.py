from django.contrib import admin

from .models.assignment import Assignment
from .models.manager import Manager
from .models.facility import Facility
from .models.solution import Solution
from .models.tag import Tag, Option, TagValue
from .models.media import Media
from .models.poll import WorkGroup

admin.site.register(Manager)
admin.site.register(Facility)
admin.site.register(Solution)
admin.site.register(Tag)
admin.site.register(Option)
admin.site.register(TagValue)
admin.site.register(Media)
admin.site.register(WorkGroup)
admin.site.register(Assignment)
