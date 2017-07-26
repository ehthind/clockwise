import scrapy

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

    def parse(self, response):
        return scrapy.FormRequest.from_response(
            response,
            formxpath="/html/body/div[3]/form",
            formdata={"p_term": "201705"},
            clickdata={"type": "submit"},
            callback=self.subject
        )

    def subject(self, response):
        for subject in subject_list:
            yield scrapy.FormRequest.from_response(
                response,
                meta={"subj": subject},
                formxpath="/html/body/div[3]/form",
                formdata={
                    "sel_subj": ["dummy", subject]},
                clickdata={"type": "submit"},
                callback=self.courses
            )

    def courses(self, response):
        x = response.css('th[scope~=colgroup] a::text')
        text = x[0].extract()
        yield {'text': text}

        # from scrapy.shell import inspect_response
        # inspect_response(response, self)
