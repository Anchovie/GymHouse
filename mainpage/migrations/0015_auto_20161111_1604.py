# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2016-11-11 14:04
from __future__ import unicode_literals

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mainpage', '0014_days_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='class',
            name='times_per_week',
            field=models.PositiveIntegerField(default=1, validators=[django.core.validators.MaxValueValidator(7), django.core.validators.MinValueValidator(1)]),
        ),
    ]