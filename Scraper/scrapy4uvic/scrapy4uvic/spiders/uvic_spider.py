import scrapy
from scrapy.loader import ItemLoader
from scrapy4uvic.items import Course

class UvicSpider(scrapy.Spider):
    name = "uvic"

    def start_requests(self):
        urls = [
            'https://www.uvic.ca/BAN1P/bwckschd.p_disp_dyn_sched'
        ]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.term)

    # term():
    #   Selects the school term to use. Clicks submit
    def term(self, response):
        return scrapy.FormRequest.from_response(
        response,
        formxpath="/html/body/div[3]/form",
        formdata={
            "p_term" : "201705" },
        clickdata = { "type": "submit" },
        callback=self.subject
        )

    # subject():
    #   Selects the subject to query. Clicks submit
    def subject(self, response):
        return scrapy.FormRequest.from_response(
        response,
        formxpath="/html/body/div[3]/form",
        formdata={
            "sel_subj" : ["dummy", "ART"] },
        clickdata = { "type": "submit" },
        callback=self.courses
        )

    # courses():
    #   Currently runs the scrapy shell with response.
    def courses(self, response):
        from scrapy.shell import inspect_response
        inspect_response(response, self)
