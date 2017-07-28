import scrapy
import uuid
from uvic.items import Course
from uvic.items import Section
from uvic.items import Capacity


SUBJECT_LIST = [
    "ADMN", "AGEI", "ANTH", "ART", "AE", "AHVS", "ASTR",
    "BIOC", "BCMB",
    "BIOL", "BME", "BUS",
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

TERM = '201801'


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
            formdata={"p_term": TERM},
            clickdata={"type": "submit"},
            callback=self.parse_subject
        )

    # subject():
    #   Selects the subject to query. Clicks submit
    def parse_subject(self, response):
        for subject in SUBJECT_LIST:
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

                id_string = TERM + course_name
                id_string = str(id_string)
                course_id = uuid.uuid3(uuid.NAMESPACE_DNS, id_string)

                course['courseID'] = str(course_id)
                course['term'] = TERM
                course['name'] = course_name
                course['title'] = course_title

                # yield course
                section_url = '/BAN1P/bwckctlg.p_disp_listcrse?term_in=' + TERM + '&subj_in=' + \
                    subject + '&crse_in=' + level + '&schd_in=%'

                section_response = response.follow(
                    section_url, self.parse_section, meta={'course': course, 'subj': subject})
                section_response_list.append(section_response)

            previous_course = current_course

        for section_response in section_response_list:
            yield section_response

    def parse_section(self, response):

        section_title = response.css('th[scope~=colgroup] a::text')
        capacity_response_list = []
        title_list = []
        course = response.meta['course']
        course_id = course['courseID']
        # course['section_list'] = []

        for selector in section_title:
            text = selector.extract()
            split_text = text.split('-')
            section_crn = ''

            if response.meta['subj'] != 'ED-D':
                section_crn = split_text[-3]
            else:
                section_crn = split_text[-4]

            section_crn = section_crn[1:]
            section_crn = section_crn[:-1]
            section_abrv = split_text[-1]
            title_list.append({
                'crn': section_crn,
                'abrv': section_abrv
            })

        table_rows = response.css(
            '.datadisplaytable .datadisplaytable tr:nth-child(3)')

        i = 0
        for row_text in table_rows:
            row = row_text.css('::text').extract()

            if row[3] != 'TBA':
                time = row[3].split('-')
                start_time = time[0][:-1]
                end_time = time[1][1:]
            else:
                start_time = row[3]
                end_time = row[3]

            row[13] = ''.join(row[13:])
            row[13] = row[13][:-1]

            section = Section()

            section['courseID'] = course_id
            section['crn'] = title_list[i]['crn']
            section['section'] = title_list[i]['abrv']
            section['units'] = ''
            section['start_time'] = start_time
            section['end_time'] = end_time
            section['days'] = row[5]
            section['location'] = row[7]
            section['schedule_type'] = row[11]
            section['instructor'] = row[13]

            capacity_url = '/BAN1P/bwckschd.p_disp_detail_sched?term_in=' + \
                TERM + '&crn_in=' + title_list[i]['crn']
            capacity_response = response.follow(
                capacity_url, self.parse_capacity, meta={'course': course, 'section': section})
            capacity_response_list.append(capacity_response)

            i += 1
            # yield section
        for capacity_response in capacity_response_list:
            yield capacity_response

    def parse_capacity(self, response):

        course = response.meta['course']
        section = response.meta['section']
        crn = section['crn']

        capacity = Capacity()

        capacity_rows = response.css('.datadisplaytable .datadisplaytable tr')
        row = capacity_rows.css('::text').extract()

        if len(row) > 0:
            capacity['crn'] = crn
            capacity['capacity'] = row[12]
            capacity['actual'] = row[14]
            capacity['remaining'] = row[16]
            capacity['waitlist_capacity'] = row[21]
            capacity['waitlist_actual'] = row[23]
            capacity['waitlist_remaining'] = row[25]

        # section['capacity'] = dict(capacity)
        # course['section_list'].append(dict(section))

        yield capacity
