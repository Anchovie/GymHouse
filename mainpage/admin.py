from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User

from .models import Profile
from .models import Event
from .models import Class
from .models import Days
from .models import Registration
#from .models import Level
#from .models import UserStatus





# Define an inline admin descriptor for Employee model
# which acts a bit like a singleton
class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'profile'

# Define a new User admin
class UserAdmin(BaseUserAdmin):
    inlines = (ProfileInline, )

class EventAdmin(admin.ModelAdmin):
    readonly_fields = ('date_created',)

class ClassAdmin(admin.ModelAdmin):
    readonly_fields = ('date_created',)

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)

# Register other models
admin.site.register(Event, EventAdmin)
admin.site.register(Class, ClassAdmin)
admin.site.register(Days)
admin.site.register(Registration)

#admin.site.register(Level)
#admin.site.register(UserStatus)

# Register your models here.
