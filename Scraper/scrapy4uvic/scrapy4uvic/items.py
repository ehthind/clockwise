# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class Scrapy4UvicItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    pass

class Course(scrapy.Item):
    title = scrapy.Field()
    time = scrapy.Field()
    days = scrapy.Field()
    where = scrapy.Field()
    dateRange = scrapy.Field()
    classType = scrapy.Field()
    instructor = scrapy.Field()
