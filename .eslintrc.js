module.exports = {
	extends: 'standard',
	rules: {
		indent: ['error', 'tab'],
		'no-tabs': 0,
		semi: [2, 'always'],
		"space-before-function-paren": ['error', {
			"anonymous": 'ignore',
			"named": 'ignore',
			"asyncArrow": 'always'
		}]
	}
};
