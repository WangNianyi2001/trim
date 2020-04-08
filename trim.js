{
	'use strict';

	const not = fn => _ => !fn(_);
	const findFirstIndex = fn => arr => arr.findIndex(fn);
	const findLastIndex = fn => arr => {
		for(let i = arr.length - 1; i >= 0; --i)
			if(fn(arr[i]))
				return i;
		return i;
	};

	const whiteSpaces = ' \t';
	const isWhiteLine = line => Array.prototype.every.call(line, ch => whiteSpaces.includes(ch));
	const isNotWhiteLine = not(isWhiteLine);
	const calculatePrefixActualLength = (prefix, tabWidth) => Array.prototype.reduce.call(
		prefix, (sum, ch) => sum + (ch === '\t' ? tabWidth : 1), 0
	);
	const longestPrefixOf = line => line.match(/^\s*/)[0];
	const convertPrefix = (target, tabWidth) => line => {
		const prefix = longestPrefixOf(line), rest = line.slice(prefix.length);
		const actual_length = calculatePrefixActualLength(prefix, tabWidth);
		switch(target) {
			case ' ':
				return ' '.repeat(actual_length) + rest;
			case '\t':
				return '\t'.repeat(Math.floor(actual_length / tabWidth)) +
					' '.repeat(actual_length % tabWidth) +
					rest;
		}
	};
	const longestCommonPrefixOf = (a, b) => {
		let bound = Math.min(a.length, b.length);
		if(bound === 0)
			return '';
		for(let i = bound; i >= 0; --i) {
			if(a[i] !== b[i])
				bound = i;
		}
		return a.slice(0, bound);
	};

	const _trim = (text, {
		trimWhiteLines = true,
		tabWidth = 4,
		forceConvert = false,
		strict = false,
		trimTrailing = true,
	}) => {
		let lines = text.split('\n');
		if(trimWhiteLines) {
			// Trim the all-white lines at the beginning and ending by default
			const firstIndex = findFirstIndex(isNotWhiteLine)(lines);
			if(firstIndex === -1) {
				// Since all lines are white lines, an empty string will be returned
				return '';
			}
			const lastIndex = findLastIndex(isNotWhiteLine)(lines);
			lines = lines.slice(firstIndex, lastIndex + 1);
		}
		if(forceConvert !== false) {
			// Convert prefixes into certain format if required
			lines = lines.map(convertPrefix(forceConvert, tabWidth));
		}
		// We don't care about if they're all-white or not under strict condition
		// 'Cause all whitespace characters will be considered as normal characters in such case
		const white_line_buffer = strict || lines.map(isWhiteLine);
		// The first line is now guaranteed to be not-all-white
		// Reduce manually
		let longest_common_prefix = longestPrefixOf(lines[0]);
		for(let i = 1; i < lines.length; ++i) {
			const line = lines[i];
			// Move the if block outside & write for loops twice for a better performance
			if(!strict && white_line_buffer[i])
				continue;
			longest_common_prefix = longestCommonPrefixOf(longest_common_prefix, line);
		}
		const longest_common_prefix_length = longest_common_prefix.length;
		// Now remove the white prefixes
		for(let i = 0; i < lines.length; ++i) {
			let line;
			if(!strict && white_line_buffer[i]) {
				line = '';
			} else {
				line = lines[i].slice(longest_common_prefix_length);
				if(trimTrailing)
					line = line.trimRight();
			}
			lines[i] = line;
		}
		return lines.join('\n');
	}

	function trim(text, settings) {
		return _trim(text, settings || {});
	}

	String.prototype.trim = function() { return trim(this, ...arguments); };
}