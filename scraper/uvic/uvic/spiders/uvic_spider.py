import scrapy
from uvic.items import Course
from uvic.items import Section
from uvic.items import Capacity


subject_list = [
    "ADMN", "AGEI", "ANTH", "ART", "AE", "AHVS", "ASTR",
    "BIOC", "BCMB", "BIOL", "BME", "BUS",
    "CS", "CHEM", "CYC", "CIVE", "COM", "CD", "CENG", "CSC",
    "DHUM", "DSST", "DR",
    "EDCI", "EOS", "ECON", "ED-D", "ELEC", "ENGR", "ENGL", "ENT", "ER", "ES", "EPHE",
    "FORB", "FRAN",
    "GEOG", "GMST", "GS", "GRS",
    "HINF", "HLTH", "HSTR", "HSD",
    "ICDG", "IED", "IGOV", "INGH", "IET", "INTD", "IB", "INTS",
    "LAW", "LING",
    "MRNE", "MGB", "MBA", "MATH", "MECH", "MEDI", "MICR", "MUS",
    "NRSC", "NURS", "NUNP", "NUHI",
    "PAAS", "PHIL", "PHYS", "POLI", "PSYC",
    "PADR", "PHSP",
    "SMGT", "SLST", "SDH", "SOCW", "SOCI", "SENG", "SPAN", "STAT", "SPP",
    "THEA",
    "WRIT"
]


class UvicSpider(scrapy.Spider):
    name = "uvic"
    start_urls = [
        'https://www.uvic.ca/BAN1P/bwckschd.p_disp_dyn_sched'
    ]

    # term():
    #   Selects the school term to use. Clicks submit
    def parse(self, response):
        return scrapy.FormRequest.from_response(
            response,
            formxpath="/html/body/div[3]/form",
            formdata={"p_term": "201705"},
            clickdata={"type": "submit"},
            callback=self.parse_subject
        )

    # subject():
    #   Selects the subject to query. Clicks submit
    def parse_subject(self, response):
        for subject in subject_list:
            yield scrapy.FormRequest.from_response(
                response,
                meta={"subj": subject},
                formxpath="/html/body/div[3]/form",
                formdata={
                    "sel_subj": ["dummy", subject]},
                clickdata={"type": "submit"},
                callback=self.parse_course
            )

    # courses():
    #   Currently runs the scrapy shell with response.
    def parse_course(self, response):

        # css selector for course general info in the format:
        # [description] - [crn] - [subject level] - [section]
        # e.g: Multi-Media Printmaking - 31244 - ART 334 - A01
        subject = response.meta['subj']
        level = ''
        previous_course = ''
        current_course = ''
        css_selector = response.css('th[scope~=colgroup] a::text')
        section_response_list = []

        for selector in css_selector:
            text = selector.extract()
            split_text = text.split('-')

            if subject != 'ED-D':
                course_name = split_text[-2]
            else:
                temp_1 = split_text[-2]
                temp_2 = split_text[-3]
                course_name = ''.join((temp_2, temp_1))

            course_name = course_name[1:]
            course_name = course_name[:-1]

            current_course = course_name

            if current_course != previous_course:
                course_n_l = course_name.split(" ")
                level = course_n_l[1]

                if len(split_text) == 4:
                    course_title = split_text[0]
                else:
                    course_title = ''
                    if subject == 'ED-D':
                        del split_text[-4:]
                    else:
                        del split_text[-3:]

                    for item in split_text:
                        course_title += item

                course_title = course_title[:-1]
                course = Course()
                course['name'] = course_name
                course['title'] = course_title

                section_url = '/BAN1P/bwckctlg.p_disp_listcrse?term_in=201705&subj_in=' + \
                    subject + '&crse_in=' + level + '&schd_in=%'

                section_response = response.follow(
                    section_url, self.parse_section, meta={'course': course})
                section_response_list.append(section_response)

            previous_course = current_course

        for section_response in section_response_list:
            yield section_response

    def parse_section(self, response):

        course = response.meta['course']

        selector = response.css('th[scope~=colgroup] a::text')

        title = course['title']
        name = course['name']

        yield {'name': name,
               'title': title}

    def parse_capacity(self, response):
        return 1

        # from scrapy.shell import inspect_response
        # inspect_response(response, self)
