module.exports = {
	useTabs: true,
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 100,
	plugins: ['@trivago/prettier-plugin-sort-imports'],
	importOrder: [
		'<THIRD_PARTY_MODULES>',
		'^~/db/(.*)$',
		'^~/handler/(.*)$',
		'^~/iot/(.*)$',
		'^~/s3/(.*)$',
		'^~/utils/(.*)$',
		'^[~/]',
		'^[./]'
	],
	importOrderSeparation: true,
	importOrderSortSpecifiers: true,
	importOrderParserPlugins: ['typescript', 'decorators-legacy']
};