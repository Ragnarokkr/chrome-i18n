# chrome-i18n

Generates the whole Chrome locales database starting from an unique dictionary.

## Getting Started
Install the module with: `npm install chrome-i18n`. 
If you want to globally install it, then add `-g` to the previous command.

## Documentation
This command line tool allows to generate an entire Chrome locales database 
(tipically used with extensions and applications) starting from an unique single
dictionary in JSON format.

The command is simple. Just indicate dictionary file and destination path (not
mandatory) and the command will do the rest:

```bash
chrome-i18n path/to/dictionary.json [path/to/_locales]
```

**Be careful, as the tool doesn't prevent any eventually already existent file
to be overwritten.**

The dictionary must be in valid JSON format, with the following structure:

```json
{
  "meta": {
    "description": "Test Dictionary",
    "author": "Marco Trulla <marco@marcotrulla.it> http://marcotrulla.it/",
    "version": "0.1.0",
    "locales": [ "it", "en" ]
  },
  "database": {
    "term": {
      "description": "Term to localize",
      "locales": {
        "it": "Localizzato in Italiano",
        "en": "Localized in English"
      },
      "placeholders": {
        "id": {
          "content": "$1",
          "example": "This is an example"
        }
      }
    },
    ...
  }
}
```

`description`, `author`, `version`, and `placeholders` are all optional.

The only required fields are:

* `meta`: this field is used to provide informations about the dictionary.
* `locales`: both the one inside `meta` and the one inside `database` are
  required. They define (the first one) which localizations will be defined and,
  (the second one) the specific translation for each localization.
* `database`: this field defines the whole database for the translations.
* `term`: this defines the ID used into the generated `messages.json` file, and
  must be changed for every field into the database. Two fields cannot have the
  same ID (the last of these will have priority on the other).

## Examples
We want to generate a database at ~/project/_locales using the dictionary at
~/project/src/dict.json:

```bash
chrome-i18n ~/project/src/dict.json ~/project/_locales
```

If the path to _locales is omitted, the current directory is taken as base.
It's easy!

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code 
using [grunt](https://github.com/cowboy/grunt).

## Release History
* 2012.12.06 - 0.1.0 - First release

## License
Copyright (c) 2012 Marco Trulla
Licensed under the MIT license.
