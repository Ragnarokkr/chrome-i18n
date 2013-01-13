# CATEGORY MODE

### Description

The **category** mode is the usually used format for medium size projects.

Its characteristics makes it useful for medium size projects,
where the amount of terms to translate is big enough to make it difficult to
manage with only one unique (the monolithic) file.

### File format

The category format requires that the project is splitted into more than one
component:

- **meta descriptor file**: this file replicates all the fields used in `meta`
  descriptor for the monolith mode and describe which files will go to compose
  the final project
- **database**: this is not a single file (even if it could) but rather a set of
  small files which will be included into the final project. In this mode, each
  database file **must** replicate the database structure used for the `database`
  field in monolith mode.

### META Descriptor File

The file **must be in valid JSON format**. The following is the structure:

```json
{
  "format": "category",
  "imports": "./db/",
  "dest": "./_locales/",
  "locales": [ "it", "en" ]
}
```

In category mode, the `meta` descriptor is a single file, similiar to the `meta`
descriptor we found in monolith mode, but without the `meta` key. It requires
only four fields to be defined:

- `format`: this field is a *string* and **must** be set to `category`.
- `imports`: this field could be a *string* or an *array* and **must** be set
  to at least one file or path. Globs are allowed, so things like `./**/*.json`
  is permitted. This field indicates where to find all the database files from
  which retrieve the informations. (*)
- `dest`: this field is a *string* and **must** be set to the destination
  directory where the project have to be built. The path **must** end with a
  trailing path separator or the field will be invalid.
- `locales`: this field is an *array* and **must** be set with one item at least.
  Items defined inside this array are the country codes supported by your
  extension/application. They are conforming to the [country codes] [cc-list]
  supported by the Chrome Store

(*) This field is validated and expanded according to some assumptions:

1. if `format` is equal to `monolith`, then it will be ignored
2. if not a *string* or *array*, it will be invalid
3. if a *string* and no trailing path separator, then it's a file
4. if the suffix is missing, `.json` is assumed
5. if a *string* with a trailing path separator, then it's a directory
6. if a directory and no pattern is specified, `*.json` is assumed
7. if an *array*, all the previous assumptions are taken and iterated.

In this mode, no other fields are required. However, no restrictions are made to
the amount of informations you can add to this descriptor.
Important is that the informations you add don't conflicts with the supported ones.

For example, you could add some copyright informations:

```json
{
  "name": "Just an example",
  "author": "Me and myself"
  "format": "category",
  "imports": "./db/",
  "dest": "./_locales/",
  "locales": [ "it", "en" ]
}
```

and this will be perfectly valid.

### DATABASE Descriptor

The file **must be in valid JSON format**. The following is the structure:

```json
{
  "term1": {
    "description": "this is the term number 1",
    "locales": {
      "it": "questo è il termine numero 1",
      "en": "this is the term number 1"
    }
  },
  "termNo": {
    "description": "this is the term number #",
    "placeholders": {
      "index": {
        "content": "$1",
        "example": "this is the term number 5"
      }
    },
    "locales": {
      "it": "questo è il termine numero $index$",
      "en": "this is the term number $index$"
    }
  }
}
```

It allows to split translations grouping them by category in smaller and easier
files to manage.

As you can see, the fields used inside this file are the same used for the
`database` descriptor in monolith mode. It's pratically a splitting of the
monolith file format. (Please, refer to the monolith mode for a description
of these fields).

Please note that no other integrity checks are performed on the data, so you
could **potentially** add every information you want in this descriptor, but
the resulting project will be (almost for sure) invalid in Chrome.

## EXAMPLE

Ok, I'm lazy I know it, so same example from monolith mode.

Here we have to split the project, so we have a meta file named (for
example) `meta.json` with the following structure:

```json
{
  "format": "category",
  "imports": "./_*.json"
  "dest": "./_locales/",
  "locales": [ "it", "en" ]
}
```

and (ok I'm not so lazy) two database files named respectively `_core.json` and
`_menu.json`.

The **_core.json** file:

```json
{
  "appTitle": {
    "description": "the app title",
    "locales": {
      "it": "La mia prima app tradotta",
      "en": "My First Translated App"
    }
  },
  "appDescription": {
    "description": "the description for the app store",
    "placeholders": {
      "index": {
        "content": "$1",
        "example": "This is the app number 4 developed by me"
      }
    },
    "locales": {
      "it": "Questa è la app numero $index$ sviluppata da me",
      "en": "This is the app number $index$ developed by me"
    }
  }
}
```

and the **_menu.json** file:

```json
{
  "menuTitle": {
    "description": "the menu title",
    "locales": {
      "it": "Menu Principale",
      "en": "Main Menu"
    }
  },
  "menuItem1": {
    "description": "the first menu item",
    "locales": {
      "it": "Voce di menu 1",
      "en": "Menu Item 1"
    }
  },
  "menuItem2": {
    "description": "the second menu item",
    "locales": {
      "it": "Voce di menu 2",
      "en": "Menu Item 2"
    }
  }
}
```

and a starting directory structure like that:

```
Current Directory
|
+--> meta.json
+--> _core.json
+--> _menu.json
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
+--> meta.json
+--> _core.json
+--> _menu.json
```

If something goes wrong, when the command exits a list of warnings and errors is
printed on the error console.

[cc-list]:  https://developers.google.com/chrome/web-store/docs/i18n?hl=it#localeTable
