# CHROME-I18N

### Introduction

Chrome-i18n is a tool (a builder) for your apps/extensions' locales. Chrome-i18n
lets you easily build a complete database of locales starting from some project
files.

For example, to build a database from a unique file (the `monolith` mode), you
run:

```shell
chrome-i18n
```

This will load by default the file named `dictionary.json` into the current
directory, and build the classic `_locales` directory with all the locales
defined inside the dictionary file.

### Installing Chrome-i18n

Chrome-i18n is installed using [Node](http://nodejs.org/) and [npm](http://npmjs.org/).

```shell
npm install chrome-i18n -g
```

According to your configuration, you probably should type the command as root to
install it globally.

### Usage

To show the help, just type `chrome-i18n --help`.

To build a project:

```shell
chrome-i18n
chrome-i18n --file dict.json
chrome-i18n --file meta.json
```

As you can see, the only useful parameter you can use is `--file`. When omitted,
this parameter will be set by default to `./dictionary.json`.

The only supported file format is JSON. Files not comforming to this format
will be ignored.

### Defining a project

Currently are supported three different formats to define a project:

- **monolith**: in this mode the project file is a unique JSON file in which are
  defined both the `meta` descriptor and the whole `database`. See the file
  `doc/monolith.md` for further informations about the monolith mode.
- **category**: in this mode the project is divided into a meta descriptor file
  which will describe the project's structure, and one or more definition files.
  See the file `doc/category.md` for further informations about the category mode.
- **language**: in this mode the project is divided into a meta descriptor file
  which will describe the project's structure and the database definitions, and
  as much files as the supported languages which will define only the translations.
  See the file `doc/language.md` for further informations about the language mode.

### Philosophy

Currently, people are managing locales manually. Every language with its own
directory and definition file, all pretty the same but the translated message.
It's a lot of useless redundancy to manage by hand. This sucks, and the goal
is to make it much easier.

Chrome-i18n is a specific tool which will build a complete database for your
Chrome extensions and web apps starting from some project files, easier to
maintain and manage.

### Contributing
In lieu of a formal styleguide, take care to maintain the existing coding
style. Add unit tests for any new or changed functionality. Lint and test
your code using [grunt](http://gruntjs.com/).

### Release History
See the CHANGELOG.md file distributed with the project.

### License
Copyright (c) 2012-2013 Marco Trulla - Licensed under the MIT license.

See the LICENSE-MIT file distributed with the project.
