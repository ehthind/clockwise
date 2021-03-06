# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class Course(scrapy.Item):
    courseID = scrapy.Field()
    term = scrapy.Field()
    name = scrapy.Field()
    title = scrapy.Field()
    pass


class Section(scrapy.Item):
    courseID = scrapy.Field()
    crn = scrapy.Field()
    section = scrapy.Field()
    units = scrapy.Field()
    schedule_type = scrapy.Field()
    days = scrapy.Field()
    start_time = scrapy.Field()
    end_time = scrapy.Field()
    instructor = scrapy.Field()
    location = scrapy.Field()
    pass


class Capacity(scrapy.Item):
    crn = scrapy.Field()
    capacity = scrapy.Field()
    actual = scrapy.Field()
    remaining = scrapy.Field()
    waitlist_capacity = scrapy.Field()
    waitlist_actual = scrapy.Field()
    waitlist_remaining = scrapy.Field()
    pass
