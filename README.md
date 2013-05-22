# chrome-i18n - Chrome/Chromium i18n database builder

[![Dependency Status](https://gemnasium.com/Ragnarokkr/chrome-i18n.png)](https://gemnasium.com/Ragnarokkr/chrome-i18n) [![Flattr this tools](https://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=marcotrulla&url=https://github.com/Ragnarokkr/chrome-i18n&title=Chrome-i18n&description=Chrome/Chromium%20i18n%20database%20builder&language=en_GB&tags=chrome,chromium,cli,tools,programming,i18n&category=software)

* [Introduction](#introduction)
* [How to install](#how-to-install)
* [Usage](#usage)
    * [Defining a project](#defining-a-project)
    * [Example](#example)
* [Philosophy](#philosophy)
* [Contributiung](#contributing)
* [Release History](#release-history)
* [License](#license)


## Introduction

**chrome-i18n** is a command line tool for your Chrome/Chromium apps and extensions.
It aims to help you in easily build a complete database of locales starting from
some project files.


## How to install

It's possible to install chrome-i18n using [Node][] and [npm][]. (Remember to
execute the command as root when install globally.)

```bash
$ npm install -g chrome-i18n
```


## Usage

To show the help, just type 

```bash
$ chrome-i18n --help
```
or
```bash
$ man chrome-i18n
```

To build a project

```bash
$ chrome-i18n [-f|--file <your-dictionary-json>]
```

If `--file` option is omitted, the default project file will be  set to
**./dictionary.json**. The only supported file format is **JSON**. Not 
well-formed JSON files will be ignored.

### Defining a project

Currently are supported three different ways in defining a project:

Mode | Description
---|---
**monolith**|the project file is a unique JSON file. It contains both the `meta` and `database` descriptors. Further informations in [`doc/monolith.md`][monolith].
**category**|the project is divided into a meta descriptor file describing the project structure, and one or more definition files. Further informations in [`doc/category.md`][category].
**language**|the project is divided into a meta descriptor file describing the project structure and database definitions, and as many files as the supported languages. Further informations in [`doc/language.md`][language].


### Example

In this example we want to build a database from an unique file (the `monolith` 
mode). To achieve this, we create a project file:

```javascript
{
    "meta": {
        "format": "monolith",
        "dest": "./_locales/",
        "locales": [ "it", "en" ]
    },
    "database": {
        "helloWorld": {
            "description": "a greetings message",
            "locales": {
                "it": "Salve Mondo!",
                "en": "Hello World!"
            }
        }
    }
}
```

and save giving name **dictionary.json**, then run our CLI tool:

```bash
$ chrome-i18n
```

The program will looks for a file named **dictionary.json** into the current
directory, and builds the classic **_locales** directory structure for all the
languages defined in our project file.


## Philosophy

Internationalization files in Chrome/Chromium are JSON files composed by an 
object with tenths or hundreds (sometimes thousands) keys which describe how
a string has to be translated in a particular language.

People usually code these gigantic files by hand, one for each language they want 
to give support. Each language with its own directory and definition file. Same
structure, same keys, same rules, but the translated message. 

It's a lot of useless redundancy to manage by hand. This sucks and the goal is 
to make it easier to manage.

chrome-i18n is a specific tool which will build a complete database for your
Chrome extensions and web apps starting from some project files, easier to
maintain and manage.


## Contributing

Any contribution to improve the project and/or expand it is welcome.

If you're interested in contributing to this project, take care to maintain the
existing coding style.

The project follows these standard, so please you do it too:

* [SemVer][] for version numbers
* [Vandamme][] for changelog formatting
* [EditorConfig][] for cross-editor configuration

To contribute:

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

Add unit tests for any new or changed functionality. Lint and test
your code using [grunt][].


## Release History

See the [CHANGELOG][] file distributed with the project.


## License

Copyright (c) 2012-2013 Marco Trulla - Licensed under the MIT license.

See the [LICENSE][] file distributed with the project.


[Node]: http://nodejs.org/
[npm]: http://npmjs.org/
[grunt]: http://gruntjs.com/
[SemVer]: http://semver.org/
[Vandamme]: https://github.com/tech-angels/vandamme
[EditorConfig]: http://editorconfig.org/

[monolith]: doc/monolith.md
[category]: doc/category.md
[language]: doc/language.md
[CHANGELOG]: CHANGELOG.md
[LICENSE]: LICENSE-MIT
