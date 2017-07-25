import scrapy
import os
from scrapy4uvic.items import Course

subject_list = [
                "ADMN","AGEI","ANTH","ART","AE","AHVS","ASTR",
                "BIOC","BCMB","BIOL","BME","BUS","CS","CHEM",
                "CYC","CIVE","COM","CD","CENG","CSC","DHUM",
                "DSST","DR","EDCI","EOS","ECON","ED-D","ELEC",
                "ENGR","ENGL","ENT","ER","ES","EPHE","FORB",
                "FRAN","GEOG","GMST","GS","GRS","HINF","HLTH",
                "HSTR","HSD","ICDG","IED","IGOV","INGH","IET",
                "INTD","IB","INTS","LAW","LING","MRNE","MGB",
                "MBA","MATH","MECH","MEDI","MICR","MUS","NRSC",
                "NURS","NUNP","NUHI","PAAS","PHIL","PHYS","POLI",
                "PSYC","PADR","PHSP","SMGT","SLST","SDH","SOCW",
                "SOCI","SENG","SPAN","STAT","SPP","THEA","WRIT"
                ]

filename = 'summer2017.json'
with open(filename, 'w') as f:
    f.write('[')
count = 1
url = ''

def write():
    with open(filename, 'w') as f:
        f.write(listofcourses)

class UvicSpider(scrapy.Spider):
    name = "uvic"

    def start_requests(self):
        urls = [
            'https://www.uvic.ca/BAN1P/bwckschd.p_disp_dyn_sched',
        ]
        global url
        url = urls[0]
        yield scrapy.Request(url=url, callback=self.term)

    # term():
    #   Selects the school term to use. Clicks submit
    def term(self, response):

        yield scrapy.FormRequest.from_response(
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
        global count
        for subject_option in subject_list :
            yield scrapy.FormRequest.from_response(
            response,
            meta = {"subj": subject_option},
            formxpath="/html/body/div[3]/form",
            formdata={
                "sel_subj" : ["dummy", subject_option] },
            clickdata = { "type": "submit" },
            callback=self.courses
            )

    # courses():
    #   Currently runs the scrapy shell with response.
    def courses(self, response):

        # css selector for course general info in the format:
        # [description] - [crn] - [subject level] - [section]
        # e.g: Multi-Media Printmaking - 31244 - ART 334 - A01
        #
        # response.css('th[scope~=colgroup] a::text')
        global count
        x = response.css('th[scope~=colgroup] a::text')
        for selector in x:
            text = selector.extract()
            split_text = text.split('-')

            if response.meta['subj'] != 'ED-D':
                course = split_text[-2]
            else:
                temp1 = split_text[-2]
                temp2 = split_text[-3]
                course = ''.join((temp2,temp1))

            course = course[1:]
            course = course[:-1]

            course_and_level = ''.join(('"', course, '",'))

            with open(filename, 'a') as f:
                f.write(course_and_level)

        print(count)
        if count == 84:
            print("adding closing bracket")
            with open(filename, 'rb+') as filehandle:
                filehandle.seek(-1, os.SEEK_END)
                filehandle.truncate()

            with open(filename, 'a') as f:
                f.write(']')
        count += 1 
        # css selector for course schedule information:
        #

        #from scrapy.shell import inspect_response
        #inspect_response(response, self)
