from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
import datetime

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


MONDAY =        '0'
TUESDAY =       '1'
WEDNESDAY =     '2'
THURSDAY =      '3'
FRIDAY =        '4'
SATURDAY =      '5'
SUNDAY =        '6'

DAY_CHOICES = (
    (MONDAY,    u'Monday'),
    (TUESDAY,   u'Tuesday'),
    (WEDNESDAY, u'Wednesday'),
    (THURSDAY,  u'Thursday'),
    (FRIDAY,    u'Friday'),
    (SATURDAY,  u'Saturday'),
    (SUNDAY,    u'Sunday'),
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

"""
class Level(models.Model):
    

    training_level = models.CharField(
        max_length=1,
        choices = LEVEL_TYPE_CHOICES,
        default = BEGINNER,
    )

    def is_beginner(self):
        return self.training_level == BEGINNER

    

class UserStatus(models.Model):
    

    status = models.CharField(
        max_length = 3,
        choices = STATUS_CHOICES,
        default = REGULAR,
    )


    def is_regular(self):
        return self.status == REGULAR

"""

"""
    This is the user's profile. It extends default django user model, which 
    handles some stuff by itself. In the final version all personal data
    will be here (for the virtual online personal trainer), OR we could 
    create a new model e.g. "Personal Info" or such, so this model wouldn't 
    get so crowded.
"""
class Profile(models.Model):
    user = models.OneToOneField(
            User, 
            on_delete=models.CASCADE
    )
    #status = models.ForeignKey(UserStatus, related_name='User_status')
    status = models.CharField(
            max_length = 3, 
            choices = STATUS_CHOICES, 
            default = REGULAR
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
            help_text='Please enter age'
    )
    height = models.IntegerField(
            blank=True, 
            null=True, 
            help_text='Please enter height in cm.'
    )
    weight = models.IntegerField(
            blank=True, 
            null=True, 
            help_text='Please enter weight in kg'
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
                MaxValueValidator(5),
                MinValueValidator(1)
            ]
    )
    days = models.CharField(
            max_length=1, 
            choices = DAY_CHOICES, 
            default = MONDAY
    )

    # time = models.TimeField(
    #         default=datetime.time(8, 00),#CHECK THIS
    #         unique_for_date=True

    # )

    time = models.CharField(
            max_length=4, 
            choices = HOUR_CHOICES, 
            default = HOUR08
    )
    def __unicode__(self):
        return self.name





