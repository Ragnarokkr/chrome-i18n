# LANGUAGE MODE

### Description

The **language** mode is usually used for bigger size projects.

Its characteristics makes it useful for bigger size projects, where the amount
of supported languages is so high to make it really harder to manage them only
by grouping by categories.

### File format

The language format requires that the project is splitted into more than one
component:

- **meta descriptor file**: this file replicates all the fields used in `meta`
  descriptor for the category mode and describe which files will go to compose
  the final project, and the database structure.
- **definitions**: this is a set of smaller files, one for each language supported
  by your application.

### META Descriptor File

The file **must be in valid JSON format**. The following is the structure:

```json
{
  "format": "language",
  "imports": "./db/",
  "dest": "./_locales/",
  "locales": [ "it", "en" ],
  "definitions": {
    "term1": {
      "description": "this is the term number 1"
     },
    "termNo": {
      "description": "this is the term number #",
      "placeholders": {
        "index": {
          "content": "$1",
          "example": "this is the term number 5"
        }
      }
    }
  }
}
```

In language mode, the `meta` descriptor is a single file, similiar to the `meta`
descriptor we found in category mode. It requires only five fields to be defined:

- `format`: this field is a *string* and **must** be set to `language`.
- `imports`: this field can **only** be a *string* and **must** be set to a
  path. No globs are allowed, so things like `./**/*.json` is not permitted.
  This field indicates where to find all the definition files from which retrieve
  the informations. (*)
- `dest`: this field is a *string* and **must** be set to the destination
  directory where the project have to be built. The path **must** end with a
  trailing path separator or the field will be invalid.
- `locales`: this field is an *array* and **must** be set with one item at least.
  Items defined inside this array are the country codes supported by your
  extension/application. They are conforming to the [country codes] [cc-list]
  supported by the Chrome Store
- `definitions`: this field is an *object* and is pretty similiar to the one
  defined for the `database` field in monolith mode, but with a big difference,
  it has not the `locales` field defined.

(*) This field is validated and expanded according to some assumptions:

1. if `format` is equal to `monolith`, then it will be ignored
2. if not a *string*, it will be invalid
3. if a *string* and no trailing path separator, it's invalid
4. if a *string* with a trailing path separator, then it's a directory

In this mode, no other fields are required. However, no restrictions are made to
the amount of informations you can add to this descriptor. Important is that the
informations you add don't conflicts with the supported ones.

For example, you could add some copyright informations:

```json
{
  "name": "Just an example",
  "author": "Me and myself",
  "format": "language",
  "imports": "./db/",
  "dest": "./_locales/",
  "locales": [ "it", "en" ],
  "definitions": {
    "term1": { ... },
    "term2": { ... }
  }
}
```

and this will be perfectly valid.

### DEFINITIONS File Set

The file **must be in valid JSON format**. The following is the structure:

```json
{
  "term1": "this is the term number 1",
  "termNo": "this is the term number $index$",
  ...
}
```

It allows to split translations grouping them by language in smaller and easier
files to manage. Here the structure is kept separated from the pure translation.
All the files **must** be named using the appropriated country-code with `.json`
suffix and reside under the `imports` path (no subdirectories are allowed).

As you can see, the fields used inside this file are reduced to a key that refers
to the respective key defined into the meta descriptor file, and its translation
into the specified language.

## EXAMPLE

This is a variant from the category example.

Here we need to split the project, so we have a meta file named (for
example) `meta.json` with the following structure:

```json
{
  "format": "language",
  "imports": "./langdb/",
  "dest": "./_locales/",
  "locales": [ "it", "en" ],
  "definitions": {
    "appTitle": {
      "description": "the app title"
    },
    "appDescription": {
      "description": "the description for the app store",
      "placeholders": {
        "index": {
          "content": "$1",
          "example": "This is the app number 4 developed by me"
        }
      }
    },
    "menuTitle": {
      "description": "the menu title"
    },
    "menuItem1": {
      "description": "the first menu item"
    },
    "menuItem2": {
      "description": "the second menu item"
    }
  }
}
```

and two definition files named respectively `it.json` and
`en.json`, under the `langdb/` directory.

The **it.json** file:

```json
{
  "appTitle": "La mia prima app tradotta",
  "appDescription": "Questa è la app numero $index$ sviluppata da me",
  "menuTitle": "Menu Principale",
  "menuItem1": "Voce di menu 1",
  "menuItem2": "Voce di menu 2"
}
```

The **en.json** file:

```json
{
  "appTitle": "My First Translated App",
  "appDescription": "This is the app number $index$ developed by me",
  "menuTitle": "Main Menu",
  "menuItem1": "Menu Item 1",
  "menuItem2": "Menu Item 2"
}
```

and a starting directory structure like that:

```
Current Directory
|
+--> langdb/
|    |
|    +--> en.json
|    |
|    +--> it.json
|
+--> meta.json
```

then, to build the project, we have to type one of these forms:

```shell
chrome-i18n -f meta.json
chrome-i18n --file meta.json
```

and once hit the enter key and waited for a while, we should have something like
that:

```
Current Directory
|
+--> _locales/
|    |
|    +--> en/
|    |    |
|    |    +--> messages.json
|    |
|    +--> it/
|         |
|         +--> messages.json
|
+--> langdb/
|    |
|    +--> en.json
|    |
|    +--> it.json
|
+--> meta.json
```

If something goes wrong, when the command exits a list of warnings and errors is
printed on the error console.

[cc-list]:  https://developers.google.com/chrome/web-store/docs/i18n?hl=it#localeTable
