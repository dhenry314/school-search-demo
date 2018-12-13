const express = require('express');
const rp = require('request-promise');
const path = require('path');

const app = express();
require('dotenv').config()
const baseURI = 'https://api.data.gov/ed/collegescorecard/v1/schools.json'
const apiKey = process.env.APIKEY
const fieldDefs = {
	defaults: ['id'],
	school: ['name','alias','city','state','zip','school_url'],
	latest: {
		student: {
			enrollment: ['all'],
			demographics: {
				race_ethnicity: ['nhpi','non_resident_alien','black_2000','aian_2000','hispanic_prior_2009','asian','black','api_2000','hispanic_2000','unknown_2000','unknown','white_non_hispanic','black_non_hispanic','asian_pacific_islander','white','two_or_more','hispanic','aian','aian_prior_2009','white_2000']
			}
		},
		academics: {
			program_percentage: ['education','mathematics','business_marketing','communications_technology','language','visual_performing','engineering_technology','parks_recreation_fitness','agriculture','security_law_enforcement','computer','precision_production','humanities','library','psychology','social_science','legal','english','construction','military','communication','public_administration_social_service','architecture','ethnic_cultural_gender','resources','health','engineering','history','theology_religious_vocation','transportation','physical_science','science_technology','biological','family_consumer_science','philosophy_religious','personal_culinary','multidiscipline','mechanic_repair_technology']
		},
		cost: {
			net_price: {
				public: {
					by_income_level: ['0-48000','30001-75000','30001-48000','75000-plus','0-30000','75001-110000','110001-plus','48001-75000']
				}
			}
		}
	}
}

const marshallSchool = (data) => {
    let school = {
	    id: data['id'],
	    school: {
		    name: data['school.name'],
		    alias: data['school.alias'],
		    city: data['school.city'],
		    state: data['school.state'],
		    zip: data['school.zip'],
		    school_url: data['school.school_url']
		},
	    latest: {
		    student: {
			    enrollment: {
					all: data['latest.student.enrollment.all']
				},
				demographics: {
					race_ethnicity: {
						nhpi: data['latest.student.demographics.race_ethnicity.nhpi'],
						non_resident_alien: data['latest.student.demographics.race_ethnicity.non_resident_alien'],
						black_2000: data['latest.student.demographics.race_ethnicity.black_2000'],
						aian_2000: data['latest.student.demographics.race_ethnicity.aian_2000'],
						hispanic_prior_2009: data['latest.student.demographics.race_ethnicity.hispanic_prior_2009'],
						asian: data['latest.student.demographics.race_ethnicity.asian'],
						black: data['latest.student.demographics.race_ethnicity.black'],
						api_2000: data['latest.student.demographics.race_ethnicity.api_2000'],
						hispanic_2000: data['latest.student.demographics.race_ethnicity.hispanic_2000'],
						unknown_2000: data['latest.student.demographics.race_ethnicity.unknown_2000'],
						unknown: data['latest.student.demographics.race_ethnicity.unknown'],
						white_non_hispanic: data['latest.student.demographics.race_ethnicity.white_non_hispanic'],
						black_non_hispanic: data['latest.student.demographics.race_ethnicity.black_non_hispanic'],
						asian_pacific_islander: data['latest.student.demographics.race_ethnicity.asian_pacific_islander'],
						white: data['latest.student.demographics.race_ethnicity.white'],
						two_or_more: data['latest.student.demographics.race_ethnicity.two_or_more'],
						hispanic: data['latest.student.demographics.race_ethnicity.hispanic'],
						aian: data['latest.student.demographics.race_ethnicity.aian'],
						aian_prior_2009: data['latest.student.demographics.race_ethnicity.aian_prior_2009'],
						white_2000: data['latest.student.demographics.race_ethnicity.white_2000']
					}
				}
			},
		    academics: {
			    program_percentage: {
					education: data['latest.academics.program_percentage.education'],
					mathematics: data['latest.academics.program_percentage.mathematics'],
					business_marketing: data['latest.academics.program_percentage.business_marketing'],
					communications_technology: data['latest.academics.program_percentage.communications_technology'],
					language: data['latest.academics.program_percentage.language'],
					visual_performing: data['latest.academics.program_percentage.visual_performing'],
					engineering_technology: data['latest.academics.program_percentage.engineering_technology'],
					parks_recreation_fitness: data['latest.academics.program_percentage.parks_recreation_fitness'],
					agriculture: data['latest.academics.program_percentage.agriculture'],
					security_law_enforcement: data['latest.academics.program_percentage.security_law_enforcement'],
					computer: data['latest.academics.program_percentage.computer'],
					precision_production: data['latest.academics.program_percentage.precision_production'],
					humanities: data['latest.academics.program_percentage.humanities'],
					library: data['latest.academics.program_percentage.library'],
					psychology: data['latest.academics.program_percentage.psychology'],
					social_science: data['latest.academics.program_percentage.social_science'],
					legal: data['latest.academics.program_percentage.legal'],
					english: data['latest.academics.program_percentage.english'],
					construction: data['latest.academics.program_percentage.construction'],
					military: data['latest.academics.program_percentage.military'],
					communication: data['latest.academics.program_percentage.communication'],
					public_administration_social_service: data['latest.academics.program_percentage.public_administration_social_service'],
					architecture: data['latest.academics.program_percentage.architecture'],
					ethnic_cultural_gender: data['latest.academics.program_percentage.ethnic_cultural_gender'],
					resources: data['latest.academics.program_percentage.resources'],
					health: data['latest.academics.program_percentage.health'],
					engineering: data['latest.academics.program_percentage.engineering'],
					history: data['latest.academics.program_percentage.history'],
					theology_religious_vocation: data['latest.academics.program_percentage.theology_religious_vocation'],
					transportation: data['latest.academics.program_percentage.transportation'],
					physical_science: data['latest.academics.program_percentage.physical_science'],
					science_technology: data['latest.academics.program_percentage.science_technology'],
					biological: data['latest.academics.program_percentage.biological'],
					family_consumer_science: data['latest.academics.program_percentage.family_consumer_science'],
					philosophy_religious: data['latest.academics.program_percentage.philosophy_religious'],
					personal_culinary: data['latest.academics.program_percentage.personal_culinary'],
					multidiscipline: data['latest.academics.program_percentage.multidiscipline'],
					mechanic_repair_technology: data['latest.academics.program_percentage.mechanic_repair_technology']
				}
		    },
		    cost: {
			    net_price: {
				    public: {
					    by_income_level: {
							'0-48000': data['latest.cost.net_price.public.by_income_level.0-48000'],
							'30001-75000': data['latest.cost.net_price.public.by_income_level.30001-75000'],
							'30001-48000': data['latest.cost.net_price.public.by_income_level.30001-48000'],
							'75000-plus': data['latest.cost.net_price.public.by_income_level.75000-plus'],
							'0-30000': data['latest.cost.net_price.public.by_income_level.0-30000'],
							'75001-110000': data['latest.cost.net_price.public.by_income_level.75001-110000'],
							'110001-plus': data['latest.cost.net_price.public.by_income_level.110001-plus'],
							'48001-75000': data['latest.cost.net_price.public.by_income_level.48001-75000']
						}
				    }
			    }
		    }
	    }
    }
    return school;
}


const makeFields = (defs) => {
    let fields = [];
    for (const key in defs) {
        let value = defs[key];
        if (key == 'defaults') {
			for (k in value) { 
			   fields.push(value[k]);
		    }
		} else {
			if (value instanceof Array) {
				for (k in value) {
				    fieldName = key + "." + value[k]
			        fields.push(fieldName)
			    }
			} else {
		        subFields = makeFields(value);
				for (subK in subFields) {
                    fieldName = key + "." + subFields[subK];
					fields.push(fieldName);
				}
		    }
		}
	}
	return fields;
};

app.use(express.static('dist'));

app.get('/api/debug', (req, res) => {
	let fields = makeFields(fieldDefs);
	let fieldStr = fields.join()
	res.json(fieldStr);
});

app.get('/api/schools', (req, res) => {
  rp({
    uri: baseURI,
    qs: {
      _fields: 'id,school.name',
      api_key: apiKey
    },
    json: true
  })
    .then((data) => {
        console.log(res.statusCode); 
        console.log(data.results);
        return res.status(200).send(data.results);
    })
    .catch((err) => {
      console.log(err)
      res.json("ERROR getting data.")
    })
});

app.get('/api/search/:term', (req, res) => {
  let term = req.params.term;
  rp({
    uri: baseURI + '?school.name=' + term + '&_fields=id,school.name&api_key=' + apiKey,
    json: true
  })
    .then((data) => {
        console.log(res.statusCode); 
        console.log(data.results);
        return res.status(200).send(data.results);
    })
    .catch((err) => {
      console.log(err)
      res.json("ERROR getting data.")
    })
});

app.get('/api/school/:sid', (req, res) => {
  let sid = req.params.sid;
  let fields = makeFields(fieldDefs);
  let fieldStr = fields.join()
  rp({
    uri: baseURI + '?id=' + sid + '&_fields=' + fieldStr + '&api_key=' + apiKey,
    json: true
  })
    .then((data) => {
        console.log(res.statusCode); 
        console.log(data.results);
        let schoolData = data.results[0];
        let school = marshallSchool(schoolData);
        return res.status(200).send(school);
    })
    .catch((err) => {
      console.log(err)
      res.json("ERROR getting data.")
    })

});


// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.json("Path not found!");
});

app.listen(8080, () => console.log('Listening on port 8080!'));

