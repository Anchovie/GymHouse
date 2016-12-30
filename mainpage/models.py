from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
from datetime import datetime
import calendar


def get_user_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<pk>/<filename>
    print("returning:")
    print('user_{0}/{1}'.format(instance.user.pk, filename))
    return 'user_{0}/{1}'.format(instance.user.pk, filename)

BEGINNER =      '1'
INTERMEDIATE =  '2'
ADVANCED =      '3'
EXPERT =        '4'

LEVEL_TYPE_CHOICES = (
    (BEGINNER,      'Beginner'),
    (INTERMEDIATE,  'Intermediate'),
    (ADVANCED,      'Advanced'),
    (EXPERT,        'Expert'),
)

REGULAR =       'REG'
TRAINER =       'TRN'
ADMIN =         'ADM'

STATUS_CHOICES = (
    (REGULAR,   'Regular'),
    (TRAINER,   'Trainer'),
    (ADMIN,     'Admin'),
)

HOUR08 = '8'
HOUR09 = '9'
HOUR10 = '10'
HOUR11 = '11'
HOUR12 = '12'
HOUR13 = '13'
HOUR14 = '14'
HOUR15 = '15'
HOUR16 = '16'
HOUR17 = '17'
HOUR18 = '18'
HOUR19 = '19'
HOUR20 = '20'

HOUR_CHOICES = (
    (HOUR08, '08:00'),
    (HOUR09, '09:00'),
    (HOUR10, '10:00'),
    (HOUR11, '11:00'),
    (HOUR12, '12:00'),
    (HOUR13, '13:00'),
    (HOUR14, '14:00'),
    (HOUR15, '15:00'),
    (HOUR16, '16:00'),
    (HOUR17, '17:00'),
    (HOUR18, '18:00'),
    (HOUR19, '19:00'),
    (HOUR20, '20:00'),
)

EVENT = 'E'
CLASS = 'C'

ENTRY_CHOICES = (
    (EVENT, 'Event'),
    (CLASS, 'Class'),
)

class Days(models.Model):
    MONDAY = '0'
    TUESDAY = '1'
    WEDNESDAY = '2'
    THURSDAY = '3'
    FRIDAY = '4'
    SATURDAY = '5'
    SUNDAY = '6'

    DAY_CHOICES = (
        (MONDAY, 'Monday'),
        (TUESDAY, 'Tuesday'),
        (WEDNESDAY,'Wednesday'),
        (THURSDAY, 'Thursday'),
        (FRIDAY, 'Friday'),
        (SATURDAY,'Saturday'),
        (SUNDAY, 'Sunday'),
    )
    name = models.CharField(max_length=10, default = "Monday")
    day = models.CharField(
            max_length=1,
            choices = DAY_CHOICES,
            default = MONDAY
    )

    def save(self, *args, **kwargs):
        if not self.name:
            self.name = calendar.day_name[self.day]
        super(Days, self).save(*args, **kwargs)

    def __unicode__(self):
        return self.name





"""
    This is the user's profile. It extends default django user model, which
    handles some stuff by itself. In the final version all personal data
    will be here (for the virtual online personal trainer), OR we could
    create a new model e.g. "Personal Info" or such, so this model wouldn't
    get so crowded.
"""
class Profile(models.Model):

    class Meta:
        permissions = (
            ("can_create", "Can create new events and classes"),
            )

    user = models.OneToOneField(
            User,
            on_delete=models.CASCADE
    )
    #status = models.ForeignKey(UserStatus, related_name='User_status')
    status = models.CharField(
            max_length = 3,
            choices = STATUS_CHOICES,
            default = REGULAR,
            help_text='Choose your user type. Regular users cannot create entries'
                    ' [THIS FIELD IS VISIBLE FOR TESTING PURPOSES]'
    )
    #level = models.ForeignKey(Level, related_name='Training_level_of_user')
    level = models.CharField(
            max_length=1,
            choices = LEVEL_TYPE_CHOICES,
            default = BEGINNER
    )
    date_created = models.DateTimeField(
            auto_now=True
    )


    first_name = models.CharField(
            max_length=15,
            default='NOFNAME'
    )
    last_name = models.CharField(
            max_length=20,
            default='NOFNAME'
    )
    age = models.IntegerField(
            blank=True,
            null=True,
            help_text='Please enter age. [optional]'
    )
    height = models.IntegerField(
            blank=True,
            null=True,
            help_text='Please enter height in cm. [optional]'
    )
    weight = models.IntegerField(
            blank=True,
            null=True,
            help_text='Please enter weight in kg. [optional]'
    )
    heart_rate = models.IntegerField(
            blank=True,
            null=True,
            help_text='Please enter your resting heart rate. [optional]'
    )
    """
    bmi = models.IntegerField(
            default=((weight)/(height/100)^2),
            blank=True,
            null=True,
            help_text='Your body mass index'
    )
    """
    image = models.ImageField(
            upload_to=get_user_path,
            blank=True,
            null=True,
            help_text='Add your profile picture [optional]'
    )

    registrations = models.ManyToManyField(
            "Registration",
            related_name='Registrations_of_user',
            blank=True
    )


    def __unicode__(self):
        return self.first_name


"""
    This is the Event model. It should be used for one-time events or special classes, NOT
    for regular weekly classes.
"""
class Event(models.Model):
    #event_id = models.IntegerField()
    id = models.AutoField(
            primary_key=True
    )
    name = models.CharField(
            max_length=40
    )
    description = models.CharField(
            max_length=200
    )
    date = models.DateField()
    date_created = models.DateTimeField(
            auto_now=True
    )
    creator = models.ForeignKey(
            Profile,
            related_name='Creator_of_event',
            blank=True,
            null=True
    )
    participants = models.ManyToManyField(
            Profile,
            related_name='Participants_of_event',
            blank=True #No user yet, so ''
    )
    trainer = models.ForeignKey(
            Profile,
            related_name='Trainer_of_event'
    )
    # level = models.ForeignKey(Level, related_name='Training_level_of_event')
    level = models.CharField(
            max_length=1,
            choices = LEVEL_TYPE_CHOICES,
            default = BEGINNER
    )

    time = models.CharField(
           max_length=5,
           choices = HOUR_CHOICES,
           default = HOUR08
    )


    def __unicode__(self):
        return self.name


"""
    This is the Class model. It is used for recurring weekly classes.
"""
class Class(models.Model):
    name = models.CharField(
            max_length=40
    )
    description = models.CharField(
            max_length=200
    )
    creator = models.ForeignKey(
            Profile,
            related_name='Creator_of_class',
            blank=True,
            null=True
    )
    trainer = models.ForeignKey(
            Profile,
            related_name='Trainer_of_class'
    )
    level = models.CharField(
            max_length=1,
            choices = LEVEL_TYPE_CHOICES,
            default = BEGINNER
    )
    date_created = models.DateTimeField(
            auto_now=True
    )

    begin_date = models.DateField(
    )

    end_date = models.DateField(
    )

    weekly_recurrence = models.BooleanField(
            default=False
    )
    times_per_week = models.PositiveIntegerField(
            default=1,
            validators=[
                MaxValueValidator(7),
                MinValueValidator(1)
            ]
    )

    days = models.ManyToManyField(
            Days,
            related_name='days_of_class',
    )

    """
    days = models.CharField(
            max_length=1,
            choices = DAY_CHOICES,
            default = MONDAY
    )
    """
    # time = models.TimeField(
    #         default=datetime.time(8, 00),#CHECK THIS
    #         unique_for_date=True

    # )

    time = models.CharField(
            max_length=5,
            choices = HOUR_CHOICES,
            default = HOUR08
    )
    def __unicode__(self):
        return self.name


class Registration(models.Model):
    name = models.CharField(
            max_length=40
    )
    description = models.CharField(
            max_length=200
    )
    entryType = models.CharField(
            max_length=1,
            choices = ENTRY_CHOICES,
            default = CLASS,
    )

    trainer = models.ForeignKey(
            Profile,
            related_name='Trainer_of_entry',
            null=True,
            blank=True
    )
    level = models.CharField(
            max_length=1,
            choices = LEVEL_TYPE_CHOICES,
            default = BEGINNER
    )
    date_created = models.DateTimeField(
            auto_now=True
    )
    date = models.DateField(
            default=datetime.now,
            blank=True
    )
    time = models.CharField(
           max_length=5,
           choices = HOUR_CHOICES,
           default = HOUR08
    )


    owner = models.ForeignKey(
            Profile,
            related_name='Profile_of_entry',
            blank=True,
            null=True
    )

    comment = models.CharField(
            max_length=300,
            blank=True,
    )
    passed = models.BooleanField(
            default=False,
    )

    def __unicode__(self):
        return self.name
